/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/member-ordering */

import { AppfxTranslateService, DateTimeService, InterpolationParams } from '@clr/addons/translate';

import { dateTimeFormat, formatHexString } from '../certificate.util';

/**
 * A translatable value that can be used as part of the certificate field value.
 *
 * This allows for flexible translation on parts of the field value after being parsed.
 */
export class TranslatableValue {
  constructor(
    readonly key: string,
    readonly args?: InterpolationParams
  ) {}

  /**
   * Translate the stored translation key and interpolation arguments.
   */
  translate(translateService: AppfxTranslateService): string {
    if (!this.args) {
      return translateService.translate(this.key);
    }

    const args = Object.fromEntries(
      Object.entries(this.args).map(([key, value]) => [
        key,
        value instanceof TranslatableValue ? value.translate(translateService) : value,
      ])
    );
    return translateService.translate(this.key, args);
  }
}

/**
 * Allowed value types for building the certificate field value.
 */
export type ValueType = undefined | number | string | Date | TranslatableValue;

/**
 * Value wrapper that unifies the nonhomogeneous value types that are part of a single line and handles translation.
 */
export class Value {
  constructor(readonly value: ValueType) {}

  /**
   * Translate the wrapped value.
   */
  translate(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string {
    if (this.value instanceof TranslatableValue) {
      return this.value.translate(translateService);
    }

    if (this.value instanceof Date) {
      return dateTimeService.format(this.value, dateTimeFormat);
    }

    return this.value?.toString() || '';
  }

  /**
   * Create a new Translatable Value from translation key and interpolation arguments.
   *
   * This is a helper constructor to simplify common usage.
   */
  static fromTranslatableKey(key: string, args?: InterpolationParams): Value {
    return new Value(new TranslatableValue(key, args));
  }
}

/**
 * A line in the certificate field value area.
 *
 * Every line is made up of Values which can wrap either raw values or Translatable structures.
 */
export class Line {
  constructor(readonly values: Value[]) {}

  /**
   * Translate and merge the separate values that make up the line.
   */
  translate(translateService: AppfxTranslateService, dateTimeService: DateTimeService): string {
    return this.values.map(value => value.translate(translateService, dateTimeService)).join('');
  }

  /**
   * Create a new Line from a key-value pair with a given separator.
   *
   * This is a helper constructor to simplify common usage.
   */
  static fromPair(key: Value, value: Value, separator: string): Line {
    return new Line([key, new Value(separator), value]);
  }

  /**
   * Create a new Line from an unformatted hex string.
   *
   * Formats the hex string before creating the Line.
   *
   * This is a helper constructor to simplify common usage.
   *
   * @param hex The unformatted hex string that contains an even number of [a-fA-F0-9] characters.
   */
  static fromHex(hex: string): Line {
    return new Line([new Value(formatHexString(hex))]);
  }

  /**
   * Create a new Line from a translatable key and interpolation arguments.
   *
   * This is a helper constructor to simplify common usage.
   * It's meant to be used if the line contains a single Translatable Value.
   */
  static fromTranslatableKey(value: string, args?: InterpolationParams): Line {
    return new Line([Value.fromTranslatableKey(value, args)]);
  }
}
