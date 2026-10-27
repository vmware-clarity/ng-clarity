/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFiltersPill } from './advanced-filters-pill';
import { ClrAdvancedFiltersPillAdd } from './advanced-filters-pill-add';
import { ClrAdvancedFiltersPills } from './advanced-filters-pills';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const NAME: ClrAdvancedFilterField = {
  key: 'name',
  label: 'Name',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const CITY: ClrAdvancedFilterField = {
  key: 'city',
  label: 'City',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};
const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};

@Component({
  template: `<clr-advanced-filters-pills
    [root]="root"
    [fields]="fields"
    (edit)="edits = edits + 1"
  ></clr-advanced-filters-pills>`,
  standalone: false,
})
class TestHost {
  root = new ClrAdvancedFilterGroup();
  fields = [NAME, CITY, BUDGET];
  edits = 0;
}

describe('ClrAdvancedFiltersPills', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let announce: jasmine.Spy;

  const element = () => fixture.nativeElement as HTMLElement;

  function pills(): ClrAdvancedFiltersPills {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPills)).componentInstance;
  }

  function texts(): string[] {
    return fixture.debugElement.queryAll(By.directive(ClrAdvancedFiltersPill)).map(debug => {
      const pill = debug.nativeElement as HTMLElement;
      return Array.from(pill.querySelectorAll('.clr-advanced-filters-pill-field, .clr-advanced-filters-pill-condition'))
        .map(part => part.textContent.trim())
        .join(' | ');
    });
  }

  function editButtons(): HTMLElement[] {
    return Array.from(element().querySelectorAll<HTMLElement>('.clr-advanced-filters-pill-edit'));
  }

  function add(): ClrAdvancedFiltersPillAdd {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPillAdd)).componentInstance;
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, { add: { exports: [ClrAdvancedFiltersPills] } });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText, AdvancedFilterPills],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    announce = spyOn(TestBed.inject(LiveAnnouncer), 'announce');
    host.root.addChild(new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'Alice'));
    host.root.addChild(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60));
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('shows one pill per child of the root, then Add filter and Clear all', () => {
    expect(texts()).toEqual(['Name | Contains Alice', 'Budget | Greater than 60']);
    const container = element().querySelector('.clr-advanced-filters-pills');
    expect([container.getAttribute('role'), container.getAttribute('aria-label')]).toEqual(['group', 'Filters']);
    const clearAll = element().querySelector('.clr-advanced-filters-clear-all');
    expect(clearAll.getAttribute('aria-label')).toBe('Clear all');
    expect(container.lastElementChild.contains(clearAll)).toBeTrue();
  });

  it('explains Clear all in a tooltip', async () => {
    const clearAll = element().querySelector<HTMLElement>('.clr-advanced-filters-clear-all');
    clearAll.focus();
    await settle();
    expect(document.getElementById(clearAll.getAttribute('aria-describedby')).textContent.trim()).toBe('Clear all');
  });

  it('offers only the fields without a pill to Add filter', () => {
    expect(add().fields).toEqual([CITY]);
  });

  it('updates when the tree is changed in code', () => {
    host.root.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris'));
    fixture.detectChanges();
    expect(texts().length).toBe(3);
    expect(add().fields).toEqual([]);
  });

  it('follows a new root, and stops following the old one', () => {
    const old = host.root;
    host.root = new ClrAdvancedFilterGroup();
    fixture.detectChanges();
    expect(texts()).toEqual([]);
    old.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris'));
    fixture.detectChanges();
    expect(texts()).toEqual([]);
  });

  it('shows nothing without a root', () => {
    host.root = null;
    fixture.detectChanges();
    expect(pills().pills).toEqual([]);
    expect(add().fields).toEqual([NAME, CITY, BUDGET]);
  });

  it('does not count the fields of a SUMMARY pill as used', () => {
    const mixed = host.root.addChild(new ClrAdvancedFilterGroup());
    mixed.addChild(new ClrAdvancedFilter(CITY, Operator.CONTAINS, 'Paris'));
    mixed.addChild(new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'Peter'));
    fixture.detectChanges();
    expect(add().fields).toEqual([CITY]);
  });

  it('clears all with ×, and announces it', () => {
    host.root.logic = Logic.OR;
    element().querySelector<HTMLButtonElement>('.clr-advanced-filters-clear-all').click();
    fixture.detectChanges();
    expect(host.root.children.length).toBe(0);
    expect(host.root.logic as Logic).toBe(Logic.AND);
    expect(texts()).toEqual([]);
    expect(announce).toHaveBeenCalledWith('All filters cleared');
    expect(host.edits).toBe(1);
  });

  it('passes on the changes of its pills', () => {
    element().querySelector<HTMLButtonElement>('.clr-advanced-filters-pill-remove').click();
    expect(host.edits).toBe(1);
  });

  describe('focus after a removal', () => {
    function remove(index: number): void {
      element().querySelectorAll<HTMLButtonElement>('.clr-advanced-filters-pill-remove')[index].click();
    }

    it('moves to the next pill', async () => {
      remove(0);
      await settle();
      expect(document.activeElement).toBe(editButtons()[0]);
      expect(texts()).toEqual(['Budget | Greater than 60']);
    });

    it('moves to the previous pill after removing the last one', async () => {
      remove(1);
      await settle();
      expect(document.activeElement).toBe(editButtons()[0]);
      expect(texts()).toEqual(['Name | Contains Alice']);
    });

    it('moves to Add filter after removing the only pill', async () => {
      remove(1);
      await settle();
      remove(0);
      await settle();
      expect(document.activeElement).toBe(element().querySelector('.clr-advanced-filters-add-filter'));
    });
  });
});
