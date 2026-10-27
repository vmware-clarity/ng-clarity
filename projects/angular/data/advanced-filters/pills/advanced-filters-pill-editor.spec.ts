/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFiltersPillEditor } from './advanced-filters-pill-editor';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic as Logic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterPillKind as Kind } from '../enums/advanced-filter-pill-kind.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrEnumFilterValidator } from '../validators/enum-filter-validator';
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
const REGION: ClrAdvancedFilterField = {
  key: 'region',
  label: 'Region',
  type: FieldType.ENUM,
  validator: new ClrEnumFilterValidator(),
  options: [{ value: 'eu', label: 'EU Central' }],
};

describe('ClrAdvancedFiltersPillEditor', () => {
  let fixture: ComponentFixture<ClrAdvancedFiltersPillEditor>;
  let editor: ClrAdvancedFiltersPillEditor;

  const element = () => fixture.nativeElement as HTMLElement;
  const all = (selector: string) => Array.from(element().querySelectorAll<HTMLElement>(selector));

  function fieldPill(
    node: ClrAdvancedFilter | ClrAdvancedFilterGroup,
    field: ClrAdvancedFilterField
  ): AdvancedFilterPill {
    const filters = node instanceof ClrAdvancedFilterGroup ? (node.children as ClrAdvancedFilter[]) : [node];
    return { node, kind: Kind.FIELD, field, filters, duplicate: false };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrAdvancedFiltersModule, NoopAnimationsModule],
      providers: [AdvancedFilterPills],
    });
    fixture = TestBed.createComponent(ClrAdvancedFiltersPillEditor);
    editor = fixture.componentInstance;
    editor.fields = [NAME, BUDGET, REGION];
  });

  afterEach(() => fixture.destroy());

  describe('a new pill', () => {
    it('offers the fields, and cannot be applied before a field is picked', () => {
      fixture.detectChanges();
      expect(editor.locked).toBeFalse();
      expect(editor.options).toEqual([NAME, BUDGET, REGION]);
      expect([editor.field, editor.rows, editor.complete, editor.operators]).toEqual([null, [], false, []]);
      expect(editor.error({ id: 'a', filter: null, operator: Operator.CONTAINS, value: 'x' })).toBe(Code.REQUIRED);
      const apply = spyOn(editor.apply, 'emit');
      editor.submit();
      expect(apply).not.toHaveBeenCalled();
    });

    it("starts a picked field with one row: the field's first operator and no value", () => {
      fixture.detectChanges();
      editor.selectField(BUDGET);
      expect(editor.rows.length).toBe(1);
      expect(editor.rows[0]).toEqual(jasmine.objectContaining({ filter: null, operator: Operator.EQUALS }));
      expect(editor.rows[0].value).toBeUndefined();
      expect(editor.logic).toBe(Logic.AND);
      expect(editor.error(editor.rows[0])).toBe(Code.REQUIRED);
    });

    it('starts over when another field is picked, and keeps the rows for the same field', () => {
      fixture.detectChanges();
      editor.selectField(NAME);
      editor.setLogic(Logic.OR);
      editor.addRow();
      editor.selectField(NAME);
      expect(editor.rows.length).toBe(2);

      editor.selectField(BUDGET);
      expect([editor.rows.length, editor.logic]).toEqual([1, Logic.AND]);
      editor.selectField(null);
      expect([editor.field, editor.rows]).toEqual([null, []]);
    });

    it('applies the field, the logic and the rows once every row is complete', () => {
      fixture.detectChanges();
      const apply = spyOn(editor.apply, 'emit');
      editor.selectField(NAME);
      editor.rows[0].value = 'Alice';
      editor.setLogic(Logic.OR);
      editor.addRow();
      expect(editor.complete).toBeFalse();
      editor.submit();
      expect(apply).not.toHaveBeenCalled();

      editor.rows[1].value = 'Peter';
      expect(editor.complete).toBeTrue();
      editor.submit();
      expect(apply).toHaveBeenCalledWith({ field: NAME, logic: Logic.OR, rows: editor.rows });
    });
  });

  describe('rows', () => {
    beforeEach(() => {
      fixture.detectChanges();
      editor.selectField(NAME);
    });

    it('adds rows with ADD, which keeps the logic of the pill', () => {
      editor.addRow();
      expect([editor.rows.length, editor.logic]).toEqual([2, Logic.AND]);
      editor.setLogic(Logic.OR);
      editor.addRow();
      expect([editor.rows.length, editor.logic]).toEqual([3, Logic.OR]);
      expect(editor.rows[2]).toEqual(jasmine.objectContaining({ filter: null, operator: Operator.CONTAINS }));
    });

    it('adds no rows for a field without AND / OR', () => {
      editor.selectField(REGION);
      expect(editor.supportsLogic).toBeFalse();
      editor.addRow();
      expect(editor.rows.length).toBe(1);
    });

    it('keeps a value that fits a new operator, and clears it otherwise', () => {
      const [row] = editor.rows;
      row.value = 'Alice';
      editor.selectOperator(row, Operator.STARTS_WITH);
      expect([row.operator, row.value]).toEqual([Operator.STARTS_WITH, 'Alice']);
      editor.selectOperator(row, Operator.IS_EMPTY);
      expect([row.operator, row.value]).toEqual([Operator.IS_EMPTY, undefined]);
    });

    it('removes any row but the last', () => {
      editor.addRow();
      const [first, second] = editor.rows;
      expect([editor.canRemove(first), editor.canRemove(second)]).toEqual([true, true]);
      expect(editor.removeLabel()).toBe('Remove condition');
      editor.removeRow(first);
      expect(editor.rows).toEqual([second]);
    });

    it('clears the last row instead, which is disabled while it is empty', () => {
      const [row] = editor.rows;
      expect(editor.canRemove(row)).toBeFalse();
      expect(editor.removeLabel()).toBe('Clear condition');
      editor.removeRow(row);
      expect(editor.rows).toEqual([row]);

      row.value = 'Alice';
      expect(editor.canRemove(row)).toBeTrue();
      editor.removeRow(row);
      expect([row.operator, row.value]).toEqual([Operator.CONTAINS, undefined]);

      row.operator = Operator.IS_EMPTY;
      expect(editor.canRemove(row)).toBeTrue();
      editor.removeRow(row);
      expect(row.operator as Operator).toBe(Operator.CONTAINS);
      expect(editor.canRemove(row)).toBeFalse();
    });

    it('labels each row with its position', () => {
      expect(editor.conditionLabel(1)).toBe('Condition 2');
    });

    it('labels the operators with the labels of the type, and a field without a validator with the operator', () => {
      expect(editor.operatorLabel(Operator.CONTAINS)).toBe('Contains');
      editor.selectField({ key: 'plain', label: 'Plain', type: FieldType.STRING });
      expect(editor.operatorLabel(Operator.CONTAINS)).toBe('contains');
      expect(editor.error(editor.rows[0])).toBe(Code.REQUIRED);
    });
  });

  describe('an edited pill', () => {
    it("locks the field and starts with the pill's filters and logic", () => {
      const alice = new ClrAdvancedFilter(NAME, Operator.CONTAINS, 'Alice');
      const peter = new ClrAdvancedFilter(NAME, Operator.STARTS_WITH, 'Pe');
      const group = new ClrAdvancedFilterGroup();
      group.logic = Logic.OR;
      group.addChild(alice);
      group.addChild(peter);
      editor.pill = fieldPill(group, NAME);
      fixture.detectChanges();

      expect(editor.locked).toBeTrue();
      expect(editor.options).toEqual([NAME]);
      expect([editor.field, editor.logic]).toEqual([NAME, Logic.OR]);
      expect(editor.rows.map(row => [row.filter, row.operator, row.value])).toEqual([
        [alice, Operator.CONTAINS, 'Alice'],
        [peter, Operator.STARTS_WITH, 'Pe'],
      ]);

      editor.selectField(BUDGET);
      expect(editor.field).toBe(NAME);
    });

    it('starts a plain filter with AND', () => {
      editor.pill = fieldPill(new ClrAdvancedFilter(BUDGET, Operator.GREATER_THAN, 60), BUDGET);
      fixture.detectChanges();
      expect([editor.logic, editor.rows.length, editor.complete]).toEqual([Logic.AND, 1, true]);
    });

    it('ignores a pill without a field', () => {
      editor.pill = {
        node: new ClrAdvancedFilterGroup(),
        kind: Kind.SUMMARY,
        field: null,
        filters: [],
        duplicate: false,
      };
      fixture.detectChanges();
      expect([editor.field, editor.rows]).toEqual([null, []]);
    });
  });

  describe('view', () => {
    function show(field: ClrAdvancedFilterField, rows = 1): void {
      fixture.detectChanges();
      editor.selectField(field);
      editor.setLogic(Logic.OR);
      for (let i = 1; i < rows; i++) {
        editor.addRow();
      }
      fixture.detectChanges();
    }

    it('separates the field and its AND / OR switch from the rest of the popover', () => {
      show(NAME);
      const section = element().querySelector('.clr-advanced-filters-field-section');
      expect(section.classList).toContain('clr-advanced-filters-pill-field-row');
      expect(section.querySelector('clr-combobox')).not.toBeNull();
      expect(section.querySelector('.clr-advanced-filters-logic')).not.toBeNull();
      expect(section.querySelector('.clr-advanced-filters-pill-row')).toBeNull();
    });

    it('shows no AND / OR switch and no separator before a field is picked', () => {
      fixture.detectChanges();
      expect(all('.clr-advanced-filters-field-section').length).toBe(0);
      expect(all('.clr-advanced-filters-logic').length).toBe(0);
      expect(all('.clr-advanced-filters-pill-row').length).toBe(0);
    });

    it('shows the AND / OR switch next to the field, a row, and ADD after it, without a label of the field', () => {
      show(NAME);
      const fieldRow = element().querySelector('.clr-advanced-filters-pill-field-row');
      expect(fieldRow.querySelector('clr-combobox')).not.toBeNull();
      expect(fieldRow.querySelectorAll('.clr-advanced-filters-logic').length).toBe(1);
      expect(all('.clr-advanced-filters-logic').length).toBe(1);
      expect(all('.clr-advanced-filters-pill-row').length).toBe(1);
      expect(all('.clr-advanced-filters-pill-row select').length).toBe(1);
      expect(all('.clr-advanced-filters-pill-row clr-advanced-filters-value').length).toBe(1);
      const add = element().querySelector<HTMLButtonElement>('.clr-advanced-filters-add-condition');
      expect([add.textContent.trim(), add.getAttribute('aria-label')]).toEqual(['Add', 'Add a condition']);
      expect(add.previousElementSibling.classList).toContain('clr-advanced-filters-pill-row');
      expect(all('.clr-advanced-filters-logic-label').length).toBe(0);
    });

    it('adds a row with ADD, after which a disabled button shows the logic of the pill', () => {
      show(BUDGET);
      element().querySelector<HTMLButtonElement>('.clr-advanced-filters-add-condition').click();
      fixture.detectChanges();
      expect(all('.clr-advanced-filters-pill-row').length).toBe(2);
      const labels = all('.clr-advanced-filters-logic-label') as HTMLButtonElement[];
      expect(labels.map(label => [label.textContent.trim(), label.disabled])).toEqual([['Or', true]]);
      expect(all('.clr-advanced-filters-add-condition').length).toBe(1);
      expect(element().querySelector('.clr-advanced-filters-add-condition').previousElementSibling).toBe(
        all('.clr-advanced-filters-pill-row')[1]
      );
    });

    it('sets the logic with the switch, and shows it between every two rows', () => {
      show(NAME, 3);
      const switcher = element().querySelector('.clr-advanced-filters-logic');
      expect(switcher.querySelector<HTMLInputElement>('input:checked').id.endsWith('-or')).toBeTrue();
      const labels = () => all('.clr-advanced-filters-logic-label').map(label => label.textContent.trim());
      expect(labels()).toEqual(['Or', 'Or']);

      switcher.querySelector<HTMLInputElement>('input[id$="-and"]').click();
      fixture.detectChanges();
      expect(editor.logic).toBe(Logic.AND);
      expect(labels()).toEqual(['And', 'And']);
    });

    it('hides the operator, the AND / OR switch and ADD for a field with a single operator', () => {
      show(REGION);
      expect(all('.clr-advanced-filters-pill-row select').length).toBe(0);
      expect(all('.clr-advanced-filters-logic').length).toBe(0);
      expect(all('.clr-advanced-filters-add-condition, .clr-advanced-filters-logic-label').length).toBe(0);
    });

    it('disables × on an empty last row, and Apply until every row is complete', () => {
      show(NAME);
      const remove = element().querySelector<HTMLButtonElement>('.clr-advanced-filters-pill-row-remove');
      const apply = element().querySelector<HTMLButtonElement>('button[type=submit]');
      expect([remove.disabled, remove.getAttribute('aria-label'), apply.disabled]).toEqual([
        true,
        'Clear condition',
        true,
      ]);

      editor.rows[0].value = 'Alice';
      fixture.detectChanges();
      expect([remove.disabled, apply.disabled]).toEqual([false, false]);
      remove.click();
      fixture.detectChanges();
      expect([editor.rows[0].value, remove.disabled, apply.disabled]).toEqual([undefined, true, true]);
    });

    it('explains the × of a row in a tooltip', async () => {
      show(NAME, 2);
      const remove = element().querySelector<HTMLButtonElement>('.clr-advanced-filters-pill-row-remove');
      remove.focus();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(document.getElementById(remove.getAttribute('aria-describedby')).textContent.trim()).toBe(
        'Remove condition'
      );
    });

    it('changes the operator of a row through its select', async () => {
      show(NAME);
      await fixture.whenStable();
      const select = element().querySelector<HTMLSelectElement>('.clr-advanced-filters-pill-row select');
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));
      expect(editor.rows[0].operator).toBe(Operator.NOT_CONTAINS);
    });

    it('labels each row group with its position', () => {
      show(NAME, 2);
      expect(all('.clr-advanced-filters-pill-row').map(row => row.getAttribute('aria-label'))).toEqual([
        'Condition 1',
        'Condition 2',
      ]);
    });
  });
});
