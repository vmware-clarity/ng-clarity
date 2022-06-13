/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { KeyNavigationCode } from '@cds/core/internal';

export interface KeyListConfig {
  code: KeyNavigationCode;
  loop?: boolean;
  layout?: 'horizontal' | 'vertical' | 'both';
  dir: string | null | undefined;
}

export function getNextKeyListItem(item: HTMLElement, items: HTMLElement[], config: KeyListConfig) {
  const { code, layout, loop, dir } = config;
  let i = items.indexOf(item);
  const previous = i;
  const inlineStart = dir === 'rtl' ? KeyNavigationCode.ArrowRight : KeyNavigationCode.ArrowLeft;
  const inlineEnd = dir === 'rtl' ? KeyNavigationCode.ArrowLeft : KeyNavigationCode.ArrowRight;
  const numOfItems = items.length - 1;

  if (layout !== 'horizontal' && code === KeyNavigationCode.ArrowUp && i !== 0) {
    i = i - 1;
  } else if (layout !== 'horizontal' && code === KeyNavigationCode.ArrowUp && i === 0 && loop) {
    i = numOfItems;
  } else if (layout !== 'horizontal' && code === KeyNavigationCode.ArrowDown && i < numOfItems) {
    i = i + 1;
  } else if (layout !== 'horizontal' && code === KeyNavigationCode.ArrowDown && i === numOfItems && loop) {
    i = 0;
  } else if (layout !== 'vertical' && code === inlineStart && i !== 0) {
    i = i - 1;
  } else if (layout !== 'vertical' && code === inlineEnd && i < numOfItems) {
    i = i + 1;
  } else if (code === KeyNavigationCode.End) {
    i = numOfItems;
  } else if (code === KeyNavigationCode.Home) {
    i = 0;
  } else if (code === KeyNavigationCode.PageUp) {
    i = i - 4 > 0 ? i - 4 : 0;
  } else if (code === KeyNavigationCode.PageDown) {
    i = i + 4 < numOfItems ? i + 4 : numOfItems;
  }

  return { next: i, previous };
}
