/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { formatDate, formatNumber } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValue } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterIsoDate } from '../validators/advanced-filter-iso-date';

/**
 * Internal. Writes a filter as text, for example "Budget: greater than 60", from the operator's text template in
 * `ClrCommonStrings` and the value formatted for the field's type and the locale.
 */
@Injectable()
export class AdvancedFilterText {
  private readonly isoDate = new AdvancedFilterIsoDate();

  constructor(
    private commonStrings: ClrCommonStringsService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  /**
   * A missing value, as an operator change can leave one, is written as a placeholder.
   */
  format(
    field: ClrAdvancedFilterField,
    operator: ClrAdvancedFilterOperator,
    value: ClrAdvancedFilterValue | undefined
  ): string {
    const keys = this.commonStrings.keys;
    const textKey = field.validator?.getOperatorTextKey(operator);
    const formattedValue =
      value === undefined ? keys.advancedFilterMissingValue : this.formatValue(field, operator, value);
    if (!textKey) {
      return `${field.label}: ${operator} ${formattedValue}`;
    }
    return this.commonStrings.parse(keys[textKey], { FIELD: field.label, VALUE: formattedValue });
  }

  /**
   * The operator and the value without the field, as a pill shows them: "Contains Alice". IS_EMPTY shows only the
   * operator, and a type with a single operator (enum, boolean) only the value, as its popover hides the operator.
   */
  formatCondition(
    field: ClrAdvancedFilterField,
    operator: ClrAdvancedFilterOperator,
    value: ClrAdvancedFilterValue | undefined
  ): string {
    const keys = this.commonStrings.keys;
    const labelKey = field.validator?.getOperatorLabelKey(operator);
    const label = labelKey ? keys[labelKey] : operator;
    if (operator === ClrAdvancedFilterOperator.IS_EMPTY) {
      return label;
    }
    const formattedValue =
      value === undefined ? keys.advancedFilterMissingValue : this.formatValue(field, operator, value);
    if (field.validator?.getOperators().length === 1) {
      return formattedValue;
    }
    return this.commonStrings.parse(keys.advancedFilterPillCondition, { OPERATOR: label, VALUE: formattedValue });
  }

  /**
   * Texts joined by a group's logic, for example "Name: contains Alice or Name: contains Peter".
   */
  join(texts: readonly string[], logic: ClrAdvancedFilterLogic): string {
    const keys = this.commonStrings.keys;
    const template =
      logic === ClrAdvancedFilterLogic.OR ? keys.advancedFilterExpressionOr : keys.advancedFilterExpressionAnd;
    return texts.reduce((left, right) => this.commonStrings.parse(template, { LEFT: left, RIGHT: right }));
  }

  private formatValue(
    field: ClrAdvancedFilterField,
    operator: ClrAdvancedFilterOperator,
    value: ClrAdvancedFilterValue
  ): string {
    const keys = this.commonStrings.keys;
    if (Array.isArray(value)) {
      const items = value.map(item => this.formatItem(field, item));
      if (operator === ClrAdvancedFilterOperator.BETWEEN) {
        return this.commonStrings.parse(keys.advancedFilterRangeValue, { FROM: items[0], TO: items[1] });
      }
      return items.join(keys.advancedFilterValueSeparator);
    }
    return this.formatItem(field, value as string | number | boolean);
  }

  private formatItem(field: ClrAdvancedFilterField, item: string | number | boolean): string {
    const keys = this.commonStrings.keys;
    if (typeof item === 'boolean') {
      return item ? keys.advancedFilterTrue : keys.advancedFilterFalse;
    }
    switch (field.type) {
      case ClrAdvancedFilterFieldType.NUMBER:
        return typeof item === 'number' ? formatNumber(item, this.locale) : String(item);
      case ClrAdvancedFilterFieldType.DATE: {
        const date = this.isoDate.toDate(item);
        return date ? formatDate(date, 'mediumDate', this.locale) : String(item);
      }
      case ClrAdvancedFilterFieldType.ENUM:
        return field.options?.find(option => option.value === item)?.label ?? String(item);
      default:
        return String(item);
    }
  }
}
