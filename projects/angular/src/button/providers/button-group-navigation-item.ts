/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';

export abstract class ButtonGroupNavigationItem extends FocusableItem {
  abstract click?(): void;

  element: HTMLElement;
}
