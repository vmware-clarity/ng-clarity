/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Input types the browser only accepts in one format, with that format. */
export const TYPED_INPUTS: Readonly<Record<string, string>> = {
  date: 'YYYY-MM-DD',
  time: 'HH:MM',
  month: 'YYYY-MM',
  week: 'YYYY-W##',
  'datetime-local': 'YYYY-MM-DDTHH:MM',
  color: '#rrggbb',
};

/** Controls whose tag says what they hold; a custom one is judged by its role. */
export const NATIVE_CONTROLS: ReadonlySet<string> = new Set(['input', 'select', 'textarea']);

/** Words a description may add without naming anything else: "the email field" names "Email". */
export const FILLER_WORDS: ReadonlySet<string> = new Set([
  'the',
  'a',
  'an',
  'field',
  'input',
  'box',
  'control',
  'value',
  'option',
  'dropdown',
  'select',
  'textbox',
  'checkbox',
  'toggle',
  'of',
  'for',
  'in',
  'on',
  'my',
  'this',
  'that',
]);

/** Words that tell a field from its pair, such as "Email" and "Confirm email"; a description must repeat them. */
export const DISTINGUISHING_WORDS: ReadonlySet<string> = new Set([
  'confirm',
  'confirmation',
  'repeat',
  'retype',
  'new',
  'old',
  'current',
  'previous',
  'first',
  'middle',
  'last',
  'billing',
  'shipping',
  'primary',
  'secondary',
  'home',
  'work',
  'mobile',
  'start',
  'end',
  'from',
  'to',
  'min',
  'max',
  'minimum',
  'maximum',
]);

/** A description using one the label lacks is about something else. */
export const NEGATING_WORDS: ReadonlySet<string> = new Set([
  'not',
  'no',
  'wrong',
  'other',
  'except',
  'instead',
  'never',
]);
