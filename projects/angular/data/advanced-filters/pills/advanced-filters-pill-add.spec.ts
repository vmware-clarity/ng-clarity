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
import { ClrAdvancedFiltersPillAdd } from './advanced-filters-pill-add';
import { ClrAdvancedFiltersPillEditor } from './advanced-filters-pill-editor';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrStringFilterValidator } from '../validators/string-filter-validator';

const NAME: ClrAdvancedFilterField = {
  key: 'name',
  label: 'Name',
  type: FieldType.STRING,
  validator: new ClrStringFilterValidator(),
};

@Component({
  template: `<clr-advanced-filters-pill-add
    [root]="root"
    [fields]="fields"
    (edit)="edits = edits + 1"
  ></clr-advanced-filters-pill-add>`,
  standalone: false,
})
class TestHost {
  root = new ClrAdvancedFilterGroup();
  fields = [NAME];
  edits = 0;
}

describe('ClrAdvancedFiltersPillAdd', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let announce: jasmine.Spy;

  function button(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.clr-advanced-filters-add-filter')).nativeElement;
  }

  function add(): ClrAdvancedFiltersPillAdd {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPillAdd)).componentInstance;
  }

  function editor(): ClrAdvancedFiltersPillEditor | undefined {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPillEditor))?.componentInstance;
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, { add: { exports: [ClrAdvancedFiltersPillAdd] } });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText, AdvancedFilterPills],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    announce = spyOn(TestBed.inject(LiveAnnouncer), 'announce');
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('is a button labelled Add filter, closed at first', () => {
    expect(button().textContent.trim()).toBe('Add filter');
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(editor()).toBeUndefined();
  });

  it('is disabled when every field already has a pill', () => {
    host.fields = [];
    fixture.detectChanges();
    expect(button().disabled).toBeTrue();
  });

  it('opens a dialog with an empty pill popover of its fields', async () => {
    button().click();
    await settle();
    const dialog = document.getElementById(button().getAttribute('aria-controls'));
    expect([dialog.getAttribute('role'), dialog.getAttribute('aria-label')]).toEqual(['dialog', 'Add filter']);
    expect(editor().fields).toEqual([NAME]);
    expect([editor().pill, editor().field]).toEqual([null, null]);
  });

  it('adds the edit to the root on Apply, announces it, closes, and returns the focus to the button', async () => {
    button().click();
    await settle();
    add().apply({
      field: NAME,
      logic: Logic.OR,
      rows: [
        { id: 'a', filter: null, operator: Operator.CONTAINS, value: 'Alice' },
        { id: 'b', filter: null, operator: Operator.CONTAINS, value: 'Peter' },
      ],
    });
    await settle();

    const [added] = host.root.children as ClrAdvancedFilterGroup[];
    expect(added.logic).toBe(Logic.OR);
    expect(added.children.map(child => (child as ClrAdvancedFilter).value)).toEqual(['Alice', 'Peter']);
    expect(announce).toHaveBeenCalledWith('Filter applied: Name: contains Alice or Name: contains Peter');
    expect(host.edits).toBe(1);
    expect(editor()).toBeUndefined();
    expect(document.activeElement).toBe(button());
  });

  it('focuses its button', () => {
    add().focus();
    expect(document.activeElement).toBe(button());
  });
});
