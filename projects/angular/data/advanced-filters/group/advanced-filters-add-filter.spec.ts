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

import { ClrAdvancedFiltersAddFilter } from './advanced-filters-add-filter';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFiltersEditor } from '../editor/advanced-filters-editor';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrNumberFilterValidator } from '../validators/number-filter-validator';

const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};

@Component({
  template: `<clr-advanced-filters-add-filter
    [fields]="fields"
    (add)="added.push($event)"
  ></clr-advanced-filters-add-filter>`,
  standalone: false,
})
class TestHost {
  fields = [BUDGET];
  added: ClrAdvancedFilter[] = [];
}

describe('ClrAdvancedFiltersAddFilter', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  function button(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('.clr-advanced-filters-add-filter')).nativeElement;
  }

  function editor(): ClrAdvancedFiltersEditor | undefined {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersEditor))?.componentInstance;
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, { add: { exports: [ClrAdvancedFiltersAddFilter] } });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('is a button labelled Add filter, closed at first', () => {
    expect(button().textContent.trim()).toBe('Add filter');
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(editor()).toBeUndefined();
  });

  it('opens a dialog with an empty editor of its fields', async () => {
    button().click();
    await settle();
    const dialog = document.getElementById(button().getAttribute('aria-controls'));
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-label')).toBe('Add filter');
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(editor().fields).toEqual([BUDGET]);
    expect(editor().field).toBeNull();
  });

  it('emits a new, complete filter on Apply, closes, and returns the focus to the button', async () => {
    button().click();
    await settle();

    fixture.debugElement.query(By.directive(ClrAdvancedFiltersAddFilter)).componentInstance.apply({
      field: BUDGET,
      operator: Operator.GREATER_THAN,
      value: 60,
    });
    await settle();

    expect(host.added.length).toBe(1);
    expect([host.added[0].field, host.added[0].operator, host.added[0].value]).toEqual([
      BUDGET,
      Operator.GREATER_THAN,
      60,
    ]);
    expect(host.added[0].error).toBeNull();
    expect(editor()).toBeUndefined();
    expect(document.activeElement).toBe(button());
  });

  it('emits nothing on Cancel, and closes', async () => {
    button().click();
    await settle();
    fixture.debugElement.query(By.css('.clr-advanced-filters-editor-actions .btn-outline')).nativeElement.click();
    await settle();
    expect(host.added).toEqual([]);
    expect(editor()).toBeUndefined();
  });
});
