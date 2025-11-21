/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const enum SizeUpdateStrategies {
  BadSizeValue = 'bad-value',
  ValidSizeString = 'value-is-string',
  ValidNumericString = 'value-is-numeric',
  NilSizeValue = 'value-is-nil',
}

export function getUpdateSizeStrategy(size: string) {
  switch (true) {
    case isNilOrEmpty(size):
      return SizeUpdateStrategies.NilSizeValue;
    case isTshirtSize(size):
      return SizeUpdateStrategies.ValidSizeString;
    case isNumericString(size):
      return SizeUpdateStrategies.ValidNumericString;
    default:
      return SizeUpdateStrategies.BadSizeValue;
  }
}

export function getSizeValue(size: string) {
  return !size || (size && !size.length) ? '' : replaceWord(size, 'fit');
}

export function getIconSizeStylesToUpdate(size: string, sizeValueInRem: string): [string, string][] {
  const isFitSized = isNil(size) ? false : size.indexOf('fit') > -1;
  if (isFitSized) {
    return [
      ['width', 'auto'],
      ['height', 'auto'],
      ['min-width', sizeValueInRem],
      ['min-height', sizeValueInRem],
    ];
  } else {
    return [
      ['width', sizeValueInRem],
      ['height', sizeValueInRem],
      ['min-width', sizeValueInRem],
      ['min-height', sizeValueInRem],
    ];
  }
}

export function updateIconSizeStyle(el: HTMLElement, size: string) {
  const updateStrategy = getUpdateSizeStrategy(getSizeValue(size));
  let val = '';

  switch (updateStrategy) {
    case SizeUpdateStrategies.ValidNumericString:
      val = pxToRem(parseInt(size)); // set val in block to run expensive call only when needed
      updateElementStyles(el, ...getIconSizeStylesToUpdate(size, val));
      return;
    case SizeUpdateStrategies.ValidSizeString:
      unsetElementStyles(el, 'width', 'height', 'min-width', 'min-height');
      return;
    case SizeUpdateStrategies.NilSizeValue: // nil values empty out all sizing
      unsetElementStyles(el, 'width', 'height', 'min-width', 'min-height');
      return;
    case SizeUpdateStrategies.BadSizeValue:
      // bad-value is ignored
      return;
    default:
      return;
  }
}

export function updateElementStyles(el: HTMLElement, ...styleTuples: [string, string][]): HTMLElement {
  styleTuples.forEach(([styleKey, value]) => {
    (el.style as { [key: string]: any })[styleKey] = value;
  });
  return el;
}

export function unsetElementStyles(el: HTMLElement, ...styleProperties: string[]): HTMLElement {
  styleProperties.forEach(prop => {
    (el.style as { [key: string]: any })[prop] = '';
  });
  return el;
}

export function pxToRem(pxValue: number) {
  return `calc((${pxValue} / var(--cds-global-base)) * 1rem)`;
}

export function replaceWord(str: string, wordToReplace: string, replaceWith = '') {
  const words = str.split(' ');
  const returnWords =
    replaceWith === ''
      ? words.filter(w => w !== wordToReplace)
      : words.map(w => (w === wordToReplace ? replaceWith : w));
  return returnWords.length > 0 ? returnWords.join(' ') : '';
}

export function isTshirtSize(size: string) {
  return ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'].indexOf(size) > -1;
}

export function isNumericString(val: string): boolean {
  return typeof val === 'string' && val.trim().length > 0 && +val === +val;
}

export function isNil(val: any): boolean {
  return val === null || val === undefined;
}

export function isNilOrEmpty(val: any): boolean {
  return isNil(val) || (typeof val === 'string' && !val.length);
}
