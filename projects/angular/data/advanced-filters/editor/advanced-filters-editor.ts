/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { AdvancedFilterEdit } from '../interfaces/advanced-filter-edit.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

/**
 * Internal. The body of the filter popover: the field, the operator, the value, Cancel and Apply. The condition lives
 * here until Apply, which is enabled only once the field's validator accepts it, so the tree never gets an
 * incomplete filter from the UI.
 */
@Component({
  selector: 'clr-advanced-filters-editor',
  templateUrl: './advanced-filters-editor.html',
  standalone: false,
})
export class ClrAdvancedFiltersEditor implements OnInit {
  @Input() fields: ClrAdvancedFilterField[] = [];
  /**
   * The filter to edit, or none to create one.
   */
  @Input() filter: ClrAdvancedFilter | null = null;

  @Output() apply = new EventEmitter<AdvancedFilterEdit>();
  @Output() cancel = new EventEmitter<void>();

  field: ClrAdvancedFilterField | null = null;
  operator: ClrAdvancedFilterOperator | null = null;
  value: ClrAdvancedFilterValue | undefined;

  readonly id = uniqueIdFactory();

  private readonly baseValidator = new ClrAdvancedFilterValidator();

  constructor(public commonStrings: ClrCommonStringsService) {}

  get validator(): ClrAdvancedFilterValidator {
    return this.field?.validator ?? this.baseValidator;
  }

  get operators(): ClrAdvancedFilterOperator[] {
    return this.field ? this.validator.getOperators() : [];
  }

  /**
   * What the field's validator says about the condition, or REQUIRED while no field is picked.
   */
  get error(): ClrAdvancedFilterValidationError | null {
    if (!this.field || !this.operator) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    return this.validator.validate({ field: this.field.key, operator: this.operator, value: this.value });
  }

  ngOnInit(): void {
    if (this.filter) {
      this.field = this.fields.find(field => field.key === this.filter.field.key) ?? this.filter.field;
      this.operator = this.filter.operator;
      this.value = this.filter.value;
    }
  }

  operatorLabel(operator: ClrAdvancedFilterOperator): string {
    const key = this.validator.getOperatorLabelKey(operator);
    return key ? this.commonStrings.keys[key] : operator;
  }

  /**
   * Starts over with the field's first operator and no value.
   */
  selectField(field: ClrAdvancedFilterField | null): void {
    if (field === this.field) {
      return;
    }
    this.field = field ?? null;
    this.operator = this.operators[0] ?? null;
    this.value = undefined;
  }

  /**
   * Keeps the value only when it still fits the new operator.
   */
  selectOperator(operator: ClrAdvancedFilterOperator): void {
    this.operator = operator;
    if (this.field && this.validator.validate({ field: this.field.key, operator, value: this.value }) !== null) {
      this.value = undefined;
    }
  }

  submit(): void {
    if (this.field && this.operator && !this.error) {
      this.apply.emit({ field: this.field, operator: this.operator, value: this.value });
    }
  }
}
