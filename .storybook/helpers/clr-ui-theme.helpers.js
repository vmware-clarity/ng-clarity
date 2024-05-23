/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const clrUiAppBackgroundColorCache = {};

export function getClrUiAppBackgroundColor(themeKey) {
  return (
    clrUiAppBackgroundColorCache[themeKey] ||
    (clrUiAppBackgroundColorCache[themeKey] = computeClrUiAppBackgroundColor())
  );

  function computeClrUiAppBackgroundColor() {
    const mainContainerElement = document.createElement('div');
    mainContainerElement.classList.add('main-container');
    document.body.appendChild(mainContainerElement);

    const appBackgroundColor = getComputedStyle(mainContainerElement).getPropertyValue('background-color');

    mainContainerElement.remove();

    return appBackgroundColor;
  }
}
