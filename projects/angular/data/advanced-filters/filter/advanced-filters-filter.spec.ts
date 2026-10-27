/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrTreeViewModule } from '@clr/angular/data/tree-view';

import { AdvancedFilterText } from './advanced-filter-text';
import { ClrAdvancedFiltersFilter } from './advanced-filters-filter';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';

const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [{ value: 'eu', label: 'EU Central' }],
};

@Component({
  template: `
    <clr-tree>
      <clr-advanced-filters-filter
        ngProjectAs="clr-tree-node"
        [filter]="filter"
        [fields]="fields"
        (edit)="edits = edits + 1"
        (removed)="removals = removals + 1"
        (replaced)="replacement = $event"
      ></clr-advanced-filters-filter>
    </clr-tree>
  `,
  standalone: false,
})
class TestHost {
  root = new ClrAdvancedFilterGroup();
  filter: ClrAdvancedFilter;
  fields = [BUDGET, REGION];
  edits = 0;
  removals = 0;
  replacement: ClrAdvancedFilter | undefined;
}

describe('ClrAdvancedFiltersFilter', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  function node(): ClrAdvancedFiltersFilter {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersFilter)).componentInstance;
  }

  function textButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.clr-advanced-filters-filter-text')).nativeElement;
  }

  beforeEach(() => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, {
      add: { exports: [ClrAdvancedFiltersFilter, ClrTreeViewModule] },
    });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    host.filter = host.root.addChild(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60));
    host.root.addChild(new ClrAdvancedFilter(REGION, Operator.IN, ['eu']));
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  describe('text', () => {
    it('shows the filter as text, in the link of its tree node', () => {
      expect(textButton().textContent.trim()).toBe('Budget: greater than 60');
      expect(textButton().classList).toContain('clr-treenode-link');
    });

    it('labels the edit and remove buttons with the filter text', () => {
      expect(textButton().getAttribute('aria-label')).toBe('Edit filter Budget: greater than 60');
      const remove = fixture.debugElement.query(By.css('.clr-advanced-filters-remove')).nativeElement;
      expect(remove.getAttribute('aria-label')).toBe('Remove filter Budget: greater than 60');
    });

    it('uses the definition among its fields, which carries the validator of the type', () => {
      const plain = new ClrAdvancedFilter(
        { key: 'budget', label: 'Old label', type: FieldType.NUMBER },
        Operator.LESS_THAN,
        3
      );
      host.filter = plain;
      fixture.detectChanges();
      expect(node().field).toBe(BUDGET);
      expect(textButton().textContent.trim()).toBe('Budget: less than 3');
    });

    it('updates when the filter is changed in code', () => {
      host.filter.value = 70;
      fixture.detectChanges();
      expect(textButton().textContent.trim()).toBe('Budget: greater than 70');
    });

    it('shows a filter that code left incomplete with a placeholder and an error icon', () => {
      host.filter.operator = Operator.BETWEEN;
      fixture.detectChanges();
      expect(textButton().textContent.trim()).toBe('Budget: between (missing value)');
      expect(textButton().classList).toContain('clr-advanced-filters-incomplete');
      expect(
        fixture.debugElement.query(By.css('.clr-advanced-filters-incomplete-icon cds-icon[status="danger"]'))
      ).not.toBeNull();
    });

    it('explains the error icon in a tooltip, outside the link that opens the popover', async () => {
      host.filter.operator = Operator.BETWEEN;
      fixture.detectChanges();
      const icon: HTMLElement = fixture.debugElement.query(
        By.css('.clr-advanced-filters-incomplete-icon cds-icon')
      ).nativeElement;
      expect(textButton().contains(icon)).toBeFalse();
      expect(icon.getAttribute('aria-label')).toBe('Incomplete filter');
      icon.focus();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(document.getElementById(icon.getAttribute('aria-describedby')).textContent.trim()).toBe(
        'Incomplete filter'
      );
    });

    it('explains the remove button in a tooltip with the filter text', async () => {
      const remove: HTMLElement = fixture.debugElement.query(By.css('.clr-advanced-filters-remove')).nativeElement;
      expect(remove.hasAttribute('title')).toBeFalse();
      remove.focus();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(document.getElementById(remove.getAttribute('aria-describedby')).textContent.trim()).toBe(
        'Remove filter Budget: greater than 60'
      );
    });
  });

  describe('remove', () => {
    it('removes the filter from its group, and emits', () => {
      fixture.debugElement.query(By.css('.clr-advanced-filters-remove')).nativeElement.click();
      expect(host.filter.parent).toBeNull();
      expect(host.root.children.length).toBe(1);
      expect([host.removals, host.edits]).toEqual([1, 1]);
    });

    it('keeps the keys of the remove button away from the tree', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      spyOn(event, 'stopPropagation').and.callThrough();
      fixture.debugElement.query(By.css('.clr-advanced-filters-remove')).nativeElement.dispatchEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('apply', () => {
    it('edits the filter itself when the field stays the same', () => {
      const filter = host.filter;
      node().apply({ field: BUDGET, operator: Operator.BETWEEN, value: [10, 60] });
      expect(host.root.children[0]).toBe(filter);
      expect([filter.operator, filter.value]).toEqual([Operator.BETWEEN, [10, 60]]);
      expect(host.replacement).toBeUndefined();
      expect(host.edits).toBe(1);
    });

    it('replaces the filter at the same position when the field changes, and reports the new one', () => {
      const old = host.filter;
      node().apply({ field: REGION, operator: Operator.IN, value: ['eu'] });
      expect(old.parent).toBeNull();
      expect(host.root.children.length).toBe(2);
      expect(host.root.children[0]).toBe(host.replacement);
      expect([host.replacement.field, host.replacement.value]).toEqual([REGION, ['eu']]);
      expect(host.edits).toBe(1);
    });
  });

  it('gives the focus to its tree node', () => {
    node().focus();
    expect(document.activeElement.getAttribute('role')).toBe('treeitem');
    expect(document.activeElement.textContent).toContain('Budget: greater than 60');
  });
});
