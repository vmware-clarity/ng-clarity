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
