/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

import { commonStringsDefault } from './common-strings.default';
import { ClrCommonStrings } from './common-strings.interface';

@Injectable({
  providedIn: 'root',
})
export class ClrCommonStringsService {
  private readonly _strings = signal<ClrCommonStrings>(commonStringsDefault);

  /**
   * Access to all of the keys as strings.
   * Reading it in a template or a computed tracks `localize()` calls.
   */
  get keys(): Readonly<ClrCommonStrings> {
    return this._strings();
  }

  /**
   * Allows you to pass in new overrides for localization
   */
  localize(overrides: Partial<ClrCommonStrings>) {
    this._strings.update(strings => ({ ...strings, ...overrides }));
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
