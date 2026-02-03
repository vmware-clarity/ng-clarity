/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const BUTTON_TYPES = ['primary', 'success', 'warning', 'danger', 'neutral'];
export const BUTTON_STYLES = ['outline', 'solid', 'flat'];

export function getButtonClass({
  buttonType,
  buttonStyle,
  btnSmallSize,
}: {
  buttonType: string;
  buttonStyle: string;
  btnSmallSize: boolean;
}) {
  const buttonClasses = {
    solid: `btn-${buttonType} ${btnSmallSize ? 'btn-sm' : ''}`,
    outline: `btn-${buttonType}-outline ${btnSmallSize ? 'btn-sm' : ''}`,
    flat: `btn-link-${buttonType} ${btnSmallSize ? 'btn-sm' : ''}`,
  };
  return buttonClasses[buttonStyle];
}
