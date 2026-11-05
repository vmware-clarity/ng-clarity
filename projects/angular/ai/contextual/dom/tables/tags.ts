/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const SKIPPED_TAGS: ReadonlySet<string> = new Set([
  'script',
  'style',
  'template',
  'link',
  'meta',
  'noscript',
  'head',
]);

/** Elements whose text names something else and is never reported as text. */
export const NAMING_TAGS: ReadonlySet<string> = new Set([
  'label',
  'legend',
  'caption',
  'figcaption',
  'option',
  'optgroup',
  'datalist',
  'title',
]);

/** Inline elements whose text runs on with the text around them. */
export const PHRASING_TAGS: ReadonlySet<string> = new Set([
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'ins',
  'kbd',
  'mark',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
]);

/** Elements a `<label>` can name. */
export const LABELABLE_TAGS: ReadonlySet<string> = new Set([
  'button',
  'input',
  'meter',
  'output',
  'progress',
  'select',
  'textarea',
]);
