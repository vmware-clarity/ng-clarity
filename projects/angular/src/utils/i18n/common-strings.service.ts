/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { commonStringsDefault } from '../../utils/i18n/common-strings.default';
import { ClrCommonStrings } from '../../utils/i18n/common-strings.interface';

@Injectable({
  providedIn: 'root',
})
export class ClrCommonStringsService {
  private _strings = commonStringsDefault;

  /**
   * Access to all of the keys as strings
   */
  get keys(): Readonly<ClrCommonStrings> {
    return this._strings;
  }

  /**
   * Allows you to pass in new overrides for localization
   */
  localize(overrides: Partial<ClrCommonStrings>) {
    this._strings = { ...this._strings, ...overrides };
  }

  /**
   * Parse a string with a set of tokens to replace
   */
  parse(source: string, tokens: { [key: string]: string } = {}) {
    const names = Object.keys(tokens);
    let output = source;
    if (names.length) {
      names.forEach(name => {
        output = output.replace(`{${name}}`, tokens[name]);
      });
    }
    return output;
  }
}
