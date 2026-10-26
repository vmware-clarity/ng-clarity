/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DateIOService, LocaleHelperService } from '@clr/angular/forms/datepicker';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { AdvancedFilterValueEditor } from '../enums/advanced-filter-value-editor.enum';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterOption } from '../interfaces/advanced-filter-option.interface';
import { AdvancedFilterIsoDate } from '../validators/advanced-filter-iso-date';

const ERROR_KEYS = {
  [ClrAdvancedFilterValidationError.REQUIRED]: 'advancedFilterErrorRequired',
  [ClrAdvancedFilterValidationError.UNSUPPORTED_OPERATOR]: 'advancedFilterErrorUnsupportedOperator',
  [ClrAdvancedFilterValidationError.INVALID_NUMBER]: 'advancedFilterErrorInvalidNumber',
  [ClrAdvancedFilterValidationError.INVALID_DATE]: 'advancedFilterErrorInvalidDate',
  [ClrAdvancedFilterValidationError.INVALID_RANGE]: 'advancedFilterErrorInvalidRange',
  [ClrAdvancedFilterValidationError.DUPLICATE_VALUE]: 'advancedFilterErrorDuplicateValue',
} as const;

/**
 * Internal. Edits the value of a condition with the Clarity control for the field type and the operator's kind of
 * value. Dates are emitted as ISO dates without a time of day ("2026-10-20"); the date inputs show them in the locale's
 * format.
 */
@Component({
  selector: 'clr-advanced-filters-value',
  templateUrl: './advanced-filters-value.html',
  // Own instances: they format and parse dates with the same locale rule as the date inputs.
  providers: [LocaleHelperService, DateIOService],
  standalone: false,
})
export class ClrAdvancedFiltersValue implements OnChanges {
  @Input() field: ClrAdvancedFilterField;
  @Input() operator: ClrAdvancedFilterOperator;
  @Input() value: ClrAdvancedFilterValue | undefined;
  /**
   * The code the field's validator returned for the whole condition, shown on the controls once touched.
   */
  @Input() error: ClrAdvancedFilterValidationError | null = null;

  @Output() valueChange = new EventEmitter<ClrAdvancedFilterValue | undefined>();

  readonly editors = AdvancedFilterValueEditor;
  readonly id = uniqueIdFactory();
  /**
   * The date inputs' text in the locale's display format, the only form their `ngModel` reads.
   */
  dateText = '';
  rangeText: [string, string] = ['', ''];

  /**
   * The bounds of a range, kept here and updated at once: a date range picker reports both bounds one right after the
   * other, before `value` comes back through the input.
   */
  private range: (string | number | undefined)[] = [undefined, undefined];
  /**
   * The last value emitted. When it comes back through `value`, the date texts stay as typed: text the user is still
   * typing is no date yet, and would be wiped.
   */
  private emitted: ClrAdvancedFilterValue | undefined;
  private readonly isoDate = new AdvancedFilterIsoDate();

  constructor(
    public commonStrings: ClrCommonStringsService,
    private dateIO: DateIOService
  ) {}

  get editor(): AdvancedFilterValueEditor {
    if (this.operator === ClrAdvancedFilterOperator.IS_EMPTY) {
      return AdvancedFilterValueEditor.NONE;
    }
    const range = this.operator === ClrAdvancedFilterOperator.BETWEEN;
    switch (this.field.type) {
      case ClrAdvancedFilterFieldType.NUMBER:
        return range ? AdvancedFilterValueEditor.NUMBER_RANGE : AdvancedFilterValueEditor.NUMBER;
      case ClrAdvancedFilterFieldType.BOOLEAN:
        return AdvancedFilterValueEditor.BOOLEAN;
      case ClrAdvancedFilterFieldType.DATE:
        return range ? AdvancedFilterValueEditor.DATE_RANGE : AdvancedFilterValueEditor.DATE;
      case ClrAdvancedFilterFieldType.ENUM:
        return AdvancedFilterValueEditor.SET;
      default:
        return AdvancedFilterValueEditor.TEXT;
    }
  }

  get errorMessage(): string {
    return this.error ? this.commonStrings.keys[ERROR_KEYS[this.error]] : '';
  }

  ngOnChanges(): void {
    this.range = [this.bound(0), this.bound(1)];
    if (this.value !== this.emitted) {
      this.dateText = this.toText(Array.isArray(this.value) ? undefined : this.value);
      this.rangeText = [this.toText(this.bound(0)), this.toText(this.bound(1))];
    }
  }

  /**
   * The bound at `index` of a range value.
   */
  bound(index: number): string | number | undefined {
    return Array.isArray(this.value) ? this.value[index] : undefined;
  }

  change(value: ClrAdvancedFilterValue | null | undefined): void {
    this.emit(value === null || value === '' ? undefined : value);
  }

  changeBound(index: number, bound: string | number | null | undefined): void {
    this.range[index] = bound === null || bound === '' ? undefined : bound;
    this.emit([...this.range] as (string | number)[]);
  }

  /**
   * Typing and calendar picks both arrive here, as text in the locale's format. Text that is no date yet gives no value.
   */
  changeDateText(text: string): void {
    this.dateText = text;
    this.change(this.toIsoDate(text));
  }

  changeRangeText(index: 0 | 1, text: string): void {
    this.rangeText[index] = text;
    this.changeBound(index, this.toIsoDate(text));
  }

  isSelected(option: ClrAdvancedFilterOption): boolean {
    return Array.isArray(this.value) && this.value.includes(option.value);
  }

  /**
   * Keeps the picked values in the order of the options.
   */
  toggle(option: ClrAdvancedFilterOption, selected: boolean): void {
    const values = (this.field.options ?? [])
      .filter(candidate => (candidate === option ? selected : this.isSelected(candidate)))
      .map(candidate => candidate.value);
    this.change(values.length ? values : undefined);
  }

  private emit(value: ClrAdvancedFilterValue | undefined): void {
    this.emitted = value;
    this.valueChange.emit(value);
  }

  /**
   * An ISO date in the locale's display format, the text the date inputs show.
   */
  private toText(value: unknown): string {
    const date = this.isoDate.toDate(value);
    return date ? this.dateIO.toLocaleDisplayFormatString(date) : '';
  }

  private toIsoDate(text: string): string | undefined {
    const date = this.dateIO.getDateValueFromDateString(text);
    return date ? this.isoDate.fromDate(date) : undefined;
  }
}
