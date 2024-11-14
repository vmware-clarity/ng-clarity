/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

export function getSelectors(argType: CheckboxType) {
  const containerSelector = argType === CheckboxType.Checkbox ? 'clr-checkbox-container' : 'clr-toggle-container';
  const wrapperSelector = argType === CheckboxType.Checkbox ? 'clr-checkbox-wrapper' : 'clr-toggle-wrapper';
  const directive = argType === CheckboxType.Checkbox ? 'clrCheckbox' : 'clrToggle';

  return { containerSelector, wrapperSelector, directive };
}
