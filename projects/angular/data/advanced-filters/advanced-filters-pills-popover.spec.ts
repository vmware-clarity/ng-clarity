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
import { ClrAdvancedFilterFieldType as FieldType } from './enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLayout } from './enums/advanced-filter-layout.enum';
import { ClrAdvancedFilterLogic as Logic } from './enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from './enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterField } from './interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from './models/advanced-filter-group.model';
import { ClrAdvancedFilter } from './models/advanced-filter.model';
import { ClrAdvancedFiltersPillEditor } from './pills/advanced-filters-pill-editor';

const FIELDS: ClrAdvancedFilterField[] = [
  { key: 'name', label: 'Name', type: FieldType.STRING },
  { key: 'budget', label: 'Budget', type: FieldType.NUMBER },
  {
    key: 'region',
    label: 'Region',
    type: FieldType.ENUM,
    options: [
      { value: 'us-west', label: 'US West' },
      { value: 'eu', label: 'EU Central' },
    ],
  },
];

@Component({
  template: `<clr-advanced-filters
    [clrFields]="fields"
    [(clrFilter)]="filter"
    [clrLayout]="layout"
    (clrFilterChange)="changes = changes + 1"
  ></clr-advanced-filters>`,
  standalone: false,
})
class TestHost {
  fields = FIELDS;
  filter = new ClrAdvancedFilterGroup();
  layout = ClrAdvancedFilterLayout.PILLS;
  changes = 0;
}

describe('ClrAdvancedFilters pills flows', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const query = <T extends HTMLElement = HTMLElement>(selector: string): T => document.querySelector<T>(selector) as T;
  const queryAll = <T extends HTMLElement = HTMLElement>(selector: string): T[] =>
    Array.from(document.querySelectorAll<T>(selector));

  function editor(): ClrAdvancedFiltersPillEditor | undefined {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPillEditor))?.componentInstance;
  }

  function texts(): string[] {
    return queryAll('clr-advanced-filters-pill').map(pill =>
      Array.from(
        pill.querySelectorAll('.clr-advanced-filters-pill-field, .clr-advanced-filters-pill-condition, clr-badge')
      )
        .map(part => part.textContent.trim())
        .join(' | ')
    );
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /**
   * Picks a field the way the combobox does, through the editor, then lets the view catch up.
   */
  async function pick(key: string): Promise<void> {
    const popover = editor();
    popover.selectField(popover.fields.find(field => field.key === key));
    fixture.debugElement
      .query(By.directive(ClrAdvancedFiltersPillEditor))
      .injector.get(ChangeDetectorRef)
      .markForCheck();
    await settle();
  }

  async function type(index: number, text: string): Promise<void> {
    const input = queryAll<HTMLInputElement>('.clr-advanced-filters-pill-row input')[index];
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await settle();
  }

  async function click(selector: string, index = 0): Promise<void> {
    queryAll(selector)[index].click();
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

  it('adds a string field as a group, with AND / OR between its conditions', async () => {
    await click('.clr-advanced-filters-add-filter');
    await pick('name');
    expect(query<HTMLButtonElement>('clr-advanced-filters-pill-editor button[type=submit]').disabled).toBeTrue();
    await type(0, 'Alice');
    await click('.clr-advanced-filters-logic input[id$="-or"]');
    await click('.clr-advanced-filters-add-condition');
    await type(1, 'Peter');
    await click('clr-advanced-filters-pill-editor button[type=submit]');

    expect(editor()).toBeUndefined();
    const [group] = host.filter.children as ClrAdvancedFilterGroup[];
    expect(group).toEqual(jasmine.any(ClrAdvancedFilterGroup));
    expect(group.logic).toBe(Logic.OR);
    expect(group.children.map(child => (child as ClrAdvancedFilter).value)).toEqual(['Alice', 'Peter']);
    expect(texts()).toEqual(['Name | Contains Alice | +1']);
    expect(host.changes).toBe(1);
  });

  it('adds a single condition of a string field as a group too', async () => {
    await click('.clr-advanced-filters-add-filter');
    await pick('name');
    await type(0, 'Alice');
    await click('clr-advanced-filters-pill-editor button[type=submit]');
    expect(host.filter.children[0]).toEqual(jasmine.any(ClrAdvancedFilterGroup));
    expect(texts()).toEqual(['Name | Contains Alice']);
  });

  it('adds an enum field as a filter', async () => {
    await click('.clr-advanced-filters-add-filter');
    await pick('region');
    await click('clr-advanced-filters-pill-editor input[type=checkbox]', 1);
    await click('clr-advanced-filters-pill-editor button[type=submit]');
    const [filter] = host.filter.children as ClrAdvancedFilter[];
    expect(filter).toEqual(jasmine.any(ClrAdvancedFilter));
    expect(filter.value).toEqual(['eu']);
    expect(texts()).toEqual(['Region | EU Central']);
  });

  it('no longer offers a field that has a pill', async () => {
    host.filter.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Alice'));
    await settle();
    await click('.clr-advanced-filters-add-filter');
    expect(editor().fields.map(field => field.key)).toEqual(['budget', 'region']);
  });

  it('edits a pill in place: its rows keep their filters and ids', async () => {
    const group = host.filter.addChild(new ClrAdvancedFilterGroup());
    const alice = group.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Alice'));
    const peter = group.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Peter'));
    await settle();

    await click('.clr-advanced-filters-pill-edit');
    expect(editor().locked).toBeTrue();
    await type(0, 'Ann');
    await click('.clr-advanced-filters-pill-row-remove', 1);
    await click('clr-advanced-filters-pill-editor button[type=submit]');

    expect(host.filter.children).toEqual([group]);
    expect(group.children).toEqual([alice]);
    expect(alice.value).toBe('Ann');
    expect(peter.parent).toBeNull();
    expect(texts()).toEqual(['Name | Contains Ann']);
    expect(host.changes).toBe(1);
  });

  it('moves a plain filter into a group at its place when a condition is added', async () => {
    const budget = host.filter.addChild(new ClrAdvancedFilter(FIELDS[1], Operator.GREATER_THAN, 60));
    await settle();

    await click('.clr-advanced-filters-pill-edit');
    await click('.clr-advanced-filters-logic input[id$="-or"]');
    await click('.clr-advanced-filters-add-condition');
    await type(1, '10');
    const selects = queryAll<HTMLSelectElement>('.clr-advanced-filters-pill-row select');
    selects[1].value = selects[1].options[2].value;
    selects[1].dispatchEvent(new Event('change'));
    await settle();
    await click('clr-advanced-filters-pill-editor button[type=submit]');

    const [group] = host.filter.children as ClrAdvancedFilterGroup[];
    expect(group).toEqual(jasmine.any(ClrAdvancedFilterGroup));
    expect(group.logic).toBe(Logic.OR);
    expect(group.children[0]).toBe(budget);
    expect((group.children[1] as ClrAdvancedFilter).operator).toBe(Operator.LESS_THAN);
    expect(texts()).toEqual(['Budget | Greater than 60 | +1']);
  });

  it('discards the edit on Escape', async () => {
    const group = host.filter.addChild(new ClrAdvancedFilterGroup());
    group.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Alice'));
    await settle();

    await click('.clr-advanced-filters-pill-edit');
    await type(0, 'Ann');
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();

    expect(editor()).toBeUndefined();
    expect((group.children[0] as ClrAdvancedFilter).value).toBe('Alice');
    expect(host.changes).toBe(0);
  });

  it('shows a second pill on the same field as invalid, and removes it with ×', async () => {
    host.filter.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Alice'));
    host.filter.addChild(new ClrAdvancedFilter(FIELDS[0], Operator.CONTAINS, 'Peter'));
    await settle();

    const pills = queryAll('clr-advanced-filters-pill clr-label');
    expect(pills.map(pill => pill.classList.contains('label-danger'))).toEqual([false, true]);
    await click('.clr-advanced-filters-pill-remove', 1);
    expect(texts()).toEqual(['Name | Contains Alice']);
    expect(host.changes).toBe(1);
  });
});
