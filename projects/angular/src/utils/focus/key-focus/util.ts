/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IEKeys, Keys } from '../../enums/keys.enum';

export function normalizeKey(key: string) {
  if (key === Keys.ArrowUp || key === IEKeys.ArrowUp) {
    return Keys.ArrowUp;
  } else if (key === Keys.ArrowDown || key === IEKeys.ArrowDown) {
    return Keys.ArrowDown;
  } else if (key === Keys.ArrowRight || key === IEKeys.ArrowRight) {
    return Keys.ArrowRight;
  } else if (key === Keys.ArrowLeft || key === IEKeys.ArrowLeft) {
    return Keys.ArrowLeft;
  } else if (key === Keys.Space || key === IEKeys.Space) {
    return Keys.Space;
  } else if (key === Keys.Escape || key === IEKeys.Escape) {
    return Keys.Escape;
  } else {
    return key;
  }
}

export function preventArrowKeyScroll(event: KeyboardEvent) {
  const key = normalizeKey(event.key);

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
