/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const BUTTON_TYPES = ['primary', 'success', 'warning', 'danger', 'neutral'];
export const BUTTON_STYLES = ['outline', 'solid', 'flat'];

export const buttonClassLoader = (buttonType, buttonStyle) => {
  const buttonClasses = {
    solid: `btn-${buttonType}`,
    outline: `btn-${buttonType}-outline`,
    flat: `btn-link-${buttonType}`,
  };
  return buttonClasses[buttonStyle];
};
