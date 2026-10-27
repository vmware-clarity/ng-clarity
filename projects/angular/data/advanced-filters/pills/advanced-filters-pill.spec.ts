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
import { ClrAdvancedFiltersPillEditor } from './advanced-filters-pill-editor';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
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
const BUDGET: ClrAdvancedFilterField = {
  key: 'budget',
  label: 'Budget',
  type: FieldType.NUMBER,
  validator: new ClrNumberFilterValidator(),
};

@Component({
  template: `<clr-advanced-filters-pill
    [pill]="pill"
    (edit)="edits = edits + 1"
    (removed)="removals = removals + 1"
  ></clr-advanced-filters-pill>`,
  standalone: false,
})
class TestHost {
  pill: AdvancedFilterPill;
  edits = 0;
  removals = 0;
}

describe('ClrAdvancedFiltersPill', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let root: ClrAdvancedFilterGroup;
  let rules: AdvancedFilterPills;
  let announce: jasmine.Spy;

  const element = () => fixture.nativeElement as HTMLElement;
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => element().querySelector<T>(selector);

  function pill(): ClrAdvancedFiltersPill {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPill)).componentInstance;
  }

  function editor(): ClrAdvancedFiltersPillEditor | undefined {
    return fixture.debugElement.query(By.directive(ClrAdvancedFiltersPillEditor))?.componentInstance;
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /**
   * Shows the first pill the rules give for the root.
   */
  function show(fields: ClrAdvancedFilterField[] = [NAME, BUDGET], index = 0): void {
    host.pill = rules.build(root, fields)[index];
    fixture.detectChanges();
  }

  function group(logic: Logic, ...filters: ClrAdvancedFilter[]): ClrAdvancedFilterGroup {
    const result = root.addChild(new ClrAdvancedFilterGroup());
    result.logic = logic;
    filters.forEach(filter => result.addChild(filter));
    return result;
  }

  const name = (value: string) => new ClrAdvancedFilter(NAME, Operator.CONTAINS, value);

  beforeEach(() => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, { add: { exports: [ClrAdvancedFiltersPill] } });
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      declarations: [TestHost],
      providers: [AdvancedFilterText, AdvancedFilterPills],
    });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    rules = TestBed.inject(AdvancedFilterPills);
    announce = spyOn(TestBed.inject(LiveAnnouncer), 'announce');
    root = new ClrAdvancedFilterGroup();
  });

  afterEach(() => fixture.destroy());

  describe('a field pill', () => {
    it('shows the field and its condition in an info label, with no badge for a single condition', () => {
      root.addChild(name('Alice'));
      show();
      expect(query('clr-label').classList).toContain('label-info');
      expect(query('.clr-advanced-filters-pill-field').textContent.trim()).toBe('Name');
      expect(query('.clr-advanced-filters-pill-condition').textContent.trim()).toBe('Contains Alice');
      expect(query('clr-badge')).toBeNull();
    });

    it('shows the first condition and a badge with the number of the others', () => {
      group(Logic.OR, name('Alice'), name('Peter'), name('William'));
      show();
      expect(query('.clr-advanced-filters-pill-condition').textContent.trim()).toBe('Contains Alice');
      expect(query('clr-badge').textContent.trim()).toBe('+2');
      expect(query('clr-badge').classList).toContain('badge-info');
    });

    it('labels its buttons with every condition, joined by the logic', () => {
      group(Logic.OR, name('Alice'), name('Peter'));
      show();
      const edit = query('.clr-advanced-filters-pill-edit');
      expect(edit.tagName).toBe('BUTTON');
      expect(edit.getAttribute('aria-label')).toBe('Edit filter Name: contains Alice or Name: contains Peter');
      expect(query('.clr-advanced-filters-pill-remove').getAttribute('aria-label')).toBe(
        'Remove filter Name: contains Alice or Name: contains Peter'
      );
    });

    it('joins the text of a plain filter with nothing', () => {
      root.addChild(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60));
      show();
      expect(pill().expression).toBe('Budget: greater than 60');
    });

    it('shows an error icon when code left a filter incomplete', () => {
      const filter = root.addChild(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60));
      show();
      expect(query('cds-icon[shape="exclamation-circle"]')).toBeNull();
      filter.operator = Operator.BETWEEN;
      fixture.detectChanges();
      expect(query('cds-icon[shape="exclamation-circle"]')).not.toBeNull();
      expect(query('.clr-advanced-filters-pill-condition').textContent.trim()).toBe('Between (missing value)');
    });

    it('opens the pill popover with the pill, and closes it on Apply', async () => {
      const node = group(Logic.AND, name('Alice'));
      show();
      query('.clr-advanced-filters-pill-edit').click();
      await settle();
      expect(editor().pill).toBe(host.pill);
      const dialog = document.getElementById(query('.clr-advanced-filters-pill-edit').getAttribute('aria-controls'));
      expect([dialog.getAttribute('role'), dialog.getAttribute('aria-label')]).toEqual(['dialog', 'Edit filter']);

      const [row] = editor().rows;
      pill().apply({ field: NAME, logic: Logic.OR, rows: [{ ...row, value: 'Ann' }] });
      await settle();

      expect(editor()).toBeUndefined();
      expect([node.logic, (node.children[0] as ClrAdvancedFilter).value]).toEqual([Logic.OR, 'Ann']);
      expect(announce).toHaveBeenCalledWith('Filter applied: Name: contains Ann');
      expect(host.edits).toBe(1);
      expect(document.activeElement).toBe(query('.clr-advanced-filters-pill-edit'));
    });
  });

  describe('a pill that can only be removed', () => {
    it('marks a second pill on the same field as invalid, without a popover', () => {
      root.addChild(name('Alice'));
      root.addChild(name('Peter'));
      show(undefined, 1);
      expect(pill().editable).toBeFalse();
      expect(query('clr-label').classList).toContain('label-danger');
      expect(query('.clr-advanced-filters-pill-edit').tagName).toBe('SPAN');
      expect(query('cds-icon[shape="exclamation-circle"]')).not.toBeNull();
      expect(pill().reason).toBe('Another filter already uses this field');
    });

    it('shows why in a tooltip, also on focus', async () => {
      root.addChild(name('Alice'));
      root.addChild(name('Peter'));
      show(undefined, 1);
      const trigger = query('.clr-advanced-filters-pill-edit');
      expect(trigger.classList).toContain('tooltip-trigger');
      trigger.focus();
      await settle();
      const tooltip = document.getElementById(trigger.getAttribute('aria-describedby'));
      expect(tooltip.textContent.trim()).toBe('Another filter already uses this field');
    });

    it('shows a group the layout cannot edit as the number of its filters', () => {
      group(Logic.AND, name('Alice'), new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60), name('Peter'));
      show();
      expect(query('.clr-advanced-filters-pill-condition').textContent.trim()).toBe('3 filters');
      expect(query('.clr-advanced-filters-pill-field')).toBeNull();
      expect(query('clr-label').classList).not.toContain('label-info');
      expect(pill().reason).toBe('This filter can only be removed here');
      expect(pill().expression).toBe('3 filters');
    });

    it('writes a single filter in the singular', () => {
      const node = group(Logic.AND, name('Alice'));
      node.addChild(new ClrAdvancedFilterGroup());
      show();
      expect(pill().summary).toBe('1 filter');
    });
  });

  describe('removing', () => {
    it('removes the whole pill with ×, and announces it', () => {
      group(Logic.OR, name('Alice'), name('Peter'));
      show();
      query('.clr-advanced-filters-pill-remove').click();
      expect(root.children).toEqual([]);
      expect(announce).toHaveBeenCalledWith('Filter removed: Name: contains Alice or Name: contains Peter');
      expect([host.removals, host.edits]).toEqual([1, 1]);
    });

    it('explains × in a tooltip with the whole pill', async () => {
      root.addChild(name('Alice'));
      show();
      const remove = query('.clr-advanced-filters-pill-remove');
      remove.focus();
      await settle();
      expect(document.getElementById(remove.getAttribute('aria-describedby')).textContent.trim()).toBe(
        'Remove filter Name: contains Alice'
      );
    });
  });

  describe('focus', () => {
    it('focuses the pill, or its × when it can only be removed', () => {
      root.addChild(name('Alice'));
      root.addChild(name('Peter'));
      show();
      pill().focus();
      expect(document.activeElement).toBe(query('.clr-advanced-filters-pill-edit'));

      show(undefined, 1);
      pill().focus();
      expect(document.activeElement).toBe(query('.clr-advanced-filters-pill-remove'));
    });
  });
});
