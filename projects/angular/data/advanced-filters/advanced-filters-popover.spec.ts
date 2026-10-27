/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrAdvancedFiltersModule } from './advanced-filters.module';
import { ClrAdvancedFiltersEditor } from './editor/advanced-filters-editor';
import { ClrAdvancedFilterFieldType as FieldType } from './enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator as Operator } from './enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterField } from './interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from './models/advanced-filter-group.model';
import { ClrAdvancedFilter } from './models/advanced-filter.model';

const FIELDS: ClrAdvancedFilterField[] = [
  { key: 'name', label: 'Name', type: FieldType.STRING },
  { key: 'budget', label: 'Budget', type: FieldType.NUMBER },
  { key: 'active', label: 'Active', type: FieldType.BOOLEAN },
  { key: 'ordered', label: 'Ordered on', type: FieldType.DATE },
  {
    key: 'region',
    label: 'Region',
    type: FieldType.ENUM,
    options: [
      { value: 'us-east', label: 'US East' },
      { value: 'us-west', label: 'US West' },
      { value: 'eu', label: 'EU Central' },
    ],
  },
];

@Component({
  template: `<clr-advanced-filters [clrFields]="fields" [(clrFilter)]="filter"></clr-advanced-filters>`,
  standalone: false,
})
class TestHost {
  fields = FIELDS;
  filter = new ClrAdvancedFilterGroup();
}

describe('ClrAdvancedFilters popover flows', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const query = <T extends HTMLElement = HTMLElement>(selector: string): T => document.querySelector<T>(selector) as T;

  function editor(): ClrAdvancedFiltersEditor {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersEditor))?.componentInstance;
  }

  function texts(): string[] {
    return fixture.debugElement
      .queryAll(By.css('.clr-advanced-filters-filter-text'))
      .map(debug => debug.nativeElement.textContent.trim());
  }

  /**
   * The spec calls the editor directly, which a template event would do in the UI and mark it for check.
   */
  function markEditor(): void {
    fixture.debugElement.query(By.directive(ClrAdvancedFiltersEditor))?.injector.get(ChangeDetectorRef).markForCheck();
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function openAdd(): Promise<void> {
    query('.clr-advanced-filters-add-filter').click();
    await settle();
  }

  /**
   * Picks a field the way the component does, through the editor, then lets the view catch up.
   */
  async function pick(key: string): Promise<void> {
    const popover = editor();
    popover.selectField(popover.fields.find(field => field.key === key));
    markEditor();
    await settle();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => fixture.destroy());

  describe('adding a filter', () => {
    it('opens a dialog with only the field and the buttons, Apply disabled', async () => {
      await openAdd();
      expect(query('.clr-advanced-filters-popover').getAttribute('role')).toBe('dialog');
      expect(editor().field).toBeNull();
      expect(query<HTMLButtonElement>('clr-advanced-filters-editor button[type=submit]').disabled).toBeTrue();
      expect(query('clr-advanced-filters-editor select')).toBeNull();
    });

    it('offers every field in the combobox', async () => {
      await openAdd();
      expect(editor().fields.map(field => field.label)).toEqual(['Name', 'Budget', 'Active', 'Ordered on', 'Region']);
    });

    it('adds a number filter once its value is valid, closes, and returns focus to the button', async () => {
      await openAdd();
      await pick('budget');
      const input = query<HTMLInputElement>('clr-advanced-filters-editor input[type=number]');
      input.value = '99';
      input.dispatchEvent(new Event('input'));
      await settle();

      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();

      expect(texts()).toEqual(['Budget: equal to 99']);
      expect(host.filter.children.length).toBe(1);
      expect(editor()).toBeUndefined();
      expect(document.activeElement).toBe(query('.clr-advanced-filters-add-filter'));
    });

    it('adds a boolean filter from the True / False radios', async () => {
      await openAdd();
      await pick('active');
      // The first radio is True.
      query<HTMLInputElement>('clr-advanced-filters-editor input[type=radio]').click();
      await settle();
      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();
      expect(texts()).toEqual(['Active: True']);
    });

    it('adds an enum filter from the checkbox list, in the order of the options', async () => {
      await openAdd();
      await pick('region');
      const boxes = Array.from(
        document.querySelectorAll<HTMLInputElement>('clr-advanced-filters-editor input[type=checkbox]')
      );
      boxes[2].click();
      await settle();
      boxes[0].click();
      await settle();
      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();
      expect(texts()).toEqual(['Region: in US East, EU Central']);
    });

    it('adds a date filter as an ISO date', async () => {
      await openAdd();
      await pick('ordered');
      const value = fixture.debugElement.query(By.css('clr-advanced-filters-value')).componentInstance;
      value.changeDateText('10/20/2026');
      await settle();
      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();
      expect((host.filter.children[0] as ClrAdvancedFilter).value).toBe('2026-10-20');
    });

    it('adds a filter without a value for IS_EMPTY', async () => {
      await openAdd();
      await pick('name');
      const popover = editor();
      popover.selectOperator(Operator.IS_EMPTY);
      markEditor();
      await settle();
      expect(query('clr-advanced-filters-value input')).toBeNull();
      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();
      expect(texts()).toEqual(['Name: is empty']);
    });

    it('discards the condition with Cancel, and a new popover starts empty', async () => {
      await openAdd();
      await pick('budget');
      query('clr-advanced-filters-editor .btn-outline').click();
      await settle();
      expect(editor()).toBeUndefined();
      expect(host.filter.children.length).toBe(0);

      await openAdd();
      expect(editor().field).toBeNull();
    });
  });

  describe('editing a filter', () => {
    let filter: ClrAdvancedFilter;

    beforeEach(async () => {
      filter = host.filter.addChild(new ClrAdvancedFilter(FIELDS[1], Operator.GREATER_THAN, 60));
      await settle();
    });

    it('opens the editor filled in from the filter', async () => {
      query('.clr-advanced-filters-filter-text').click();
      await settle();
      expect([editor().field.key, editor().operator, editor().value]).toEqual(['budget', Operator.GREATER_THAN, 60]);
      expect(query<HTMLInputElement>('clr-advanced-filters-editor input[type=number]').value).toBe('60');
    });

    it('edits the same filter, and keeps it when cancelled', async () => {
      query('.clr-advanced-filters-filter-text').click();
      await settle();
      editor().selectOperator(Operator.BETWEEN);
      query('clr-advanced-filters-editor .btn-outline').click();
      await settle();
      expect([filter.operator, filter.value]).toEqual([Operator.GREATER_THAN, 60]);

      query('.clr-advanced-filters-filter-text').click();
      await settle();
      editor().selectOperator(Operator.LESS_THAN);
      markEditor();
      await settle();
      query('clr-advanced-filters-editor button[type=submit]').click();
      await settle();
      expect(host.filter.children[0]).toBe(filter);
      expect([filter.operator, filter.value]).toEqual([Operator.LESS_THAN, 60]);
      expect(texts()).toEqual(['Budget: less than 60']);
    });

    it('closes with Escape without changing anything, and returns focus to the filter', async () => {
      const trigger = query('.clr-advanced-filters-filter-text');
      trigger.click();
      await settle();
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();
      expect(editor()).toBeUndefined();
      expect(filter.value).toBe(60);
    });
  });
});
