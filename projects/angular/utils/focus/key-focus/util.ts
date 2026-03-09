/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Keys } from '../../enums/keys.enum';

export function preventArrowKeyScroll(event: KeyboardEvent) {
  const key = event.key;

  if (key === Keys.ArrowUp || key === Keys.ArrowDown || key === Keys.ArrowLeft || key === Keys.ArrowRight) {
    // prevent element container scroll
    // MDN references this is really the only way to prevent native browser interactions
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
    event.preventDefault();
  }
}

export function isKeyEitherLetterOrNumber(event: KeyboardEvent) {
  const char = event.key;
  // Only letter characters differ when they switch between lowercase and uppercase, whether it's an English or non-English letter.
  return char.toLowerCase() !== char.toUpperCase() || (char >= '0' && char <= '9');
}
