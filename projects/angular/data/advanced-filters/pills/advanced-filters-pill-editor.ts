/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPillEdit } from '../interfaces/advanced-filter-pill-edit.interface';
import { AdvancedFilterPillRow } from '../interfaces/advanced-filter-pill-row.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

/**
 * Internal. The body of the pill popover: the field with the AND / OR switch of the pill, then one row per condition,
 * ADD after the last one, and Apply. Between two rows, a disabled button shows the logic. The rows are drafts until
 * Apply, which is enabled only once the field's validator accepts every row.
 *
 * There is always at least one row. The × of a row removes it; on the last row it clears the operator and the value
 * instead, and is disabled while they are cleared.
 */
@Component({
  selector: 'clr-advanced-filters-pill-editor',
  templateUrl: './advanced-filters-pill-editor.html',
  standalone: false,
})
export class ClrAdvancedFiltersPillEditor implements OnInit {
  /**
   * The fields to pick from, for a new pill.
   */
  @Input() fields: ClrAdvancedFilterField[] = [];
  /**
   * The pill to edit, or none to create one. Its field is locked.
   */
  @Input() pill: AdvancedFilterPill | null = null;

  @Output() apply = new EventEmitter<AdvancedFilterPillEdit>();

  field: ClrAdvancedFilterField | null = null;
  logic = ClrAdvancedFilterLogic.AND;
  rows: AdvancedFilterPillRow[] = [];

  readonly logics = ClrAdvancedFilterLogic;
  readonly id = uniqueIdFactory();

  private readonly baseValidator = new ClrAdvancedFilterValidator();
  private lockedOptions: ClrAdvancedFilterField[] = [];

  constructor(
    public commonStrings: ClrCommonStringsService,
    private pills: AdvancedFilterPills
  ) {}

  /**
   * An edited pill keeps its field.
   */
  get locked(): boolean {
    return !!this.pill;
  }

  /**
   * The combobox's options: the fields for a new pill, the locked field of an edited one.
   */
  get options(): ClrAdvancedFilterField[] {
    return this.locked ? this.lockedOptions : this.fields;
  }

  get validator(): ClrAdvancedFilterValidator {
    return this.field?.validator ?? this.baseValidator;
  }

  get operators(): ClrAdvancedFilterOperator[] {
    return this.field ? this.validator.getOperators() : [];
  }

  /**
   * The AND / OR switch and ADD are offered for DATE, NUMBER and STRING fields only.
   */
  get supportsLogic(): boolean {
    return !!this.field && this.pills.supportsLogic(this.field);
  }

  /**
   * The label of the logic, shown between two rows.
   */
  get logicLabel(): string {
    const keys = this.commonStrings.keys;
    return this.logic === ClrAdvancedFilterLogic.OR ? keys.advancedFilterOr : keys.advancedFilterAnd;
  }

  /**
   * Every row passes the field's validator.
   */
  get complete(): boolean {
    return this.rows.length > 0 && this.rows.every(row => this.error(row) === null);
  }

  ngOnInit(): void {
    if (!this.pill?.field) {
      return;
    }
    this.field = this.pill.field;
    this.lockedOptions = [this.field];
    this.logic = this.pill.node instanceof ClrAdvancedFilterGroup ? this.pill.node.logic : ClrAdvancedFilterLogic.AND;
    this.rows = this.pill.filters.map(filter => ({
      id: uniqueIdFactory(),
      filter,
      operator: filter.operator,
      value: filter.value,
    }));
  }

  operatorLabel(operator: ClrAdvancedFilterOperator): string {
    const key = this.validator.getOperatorLabelKey(operator);
    return key ? this.commonStrings.keys[key] : operator;
  }

  /**
   * Starts over with one row: the field's first operator and no value.
   */
  selectField(field: ClrAdvancedFilterField | null): void {
    if (this.locked || field === this.field) {
      return;
    }
    this.field = field ?? null;
    this.logic = ClrAdvancedFilterLogic.AND;
    this.rows = this.field ? [this.newRow()] : [];
  }

  /**
   * One logic per pill, set with the switch next to the field.
   */
  setLogic(logic: ClrAdvancedFilterLogic): void {
    this.logic = logic;
  }

  /**
   * ADD: a new row after the last one.
   */
  addRow(): void {
    if (this.supportsLogic) {
      this.rows = [...this.rows, this.newRow()];
    }
  }

  /**
   * Keeps the value only when it still fits the new operator.
   */
  selectOperator(row: AdvancedFilterPillRow, operator: ClrAdvancedFilterOperator): void {
    row.operator = operator;
    if (this.error(row) !== null) {
      row.value = undefined;
    }
  }

  /**
   * Any row but the last can be removed. The last can be cleared, unless it already has the field's first operator
   * and no value.
   */
  canRemove(row: AdvancedFilterPillRow): boolean {
    return this.rows.length > 1 || row.operator !== this.operators[0] || row.value !== undefined;
  }

  removeLabel(): string {
    const keys = this.commonStrings.keys;
    return this.rows.length > 1 ? keys.advancedFilterRemoveCondition : keys.advancedFilterClearCondition;
  }

  conditionLabel(index: number): string {
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterCondition, { INDEX: String(index + 1) });
  }

  /**
   * Removes the row, or clears the last one.
   */
  removeRow(row: AdvancedFilterPillRow): void {
    if (!this.canRemove(row)) {
      return;
    }
    if (this.rows.length > 1) {
      this.rows = this.rows.filter(candidate => candidate !== row);
    } else {
      row.operator = this.operators[0];
      row.value = undefined;
    }
  }

  /**
   * What the field's validator says about the row.
   */
  error(row: AdvancedFilterPillRow): ClrAdvancedFilterValidationError | null {
    return this.field
      ? this.validator.validate({ field: this.field.key, operator: row.operator, value: row.value })
      : ClrAdvancedFilterValidationError.REQUIRED;
  }

  submit(): void {
    if (this.field && this.complete) {
      this.apply.emit({ field: this.field, logic: this.logic, rows: this.rows });
    }
  }

  private newRow(): AdvancedFilterPillRow {
    return { id: uniqueIdFactory(), filter: null, operator: this.operators[0], value: undefined };
  }
}
