/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function wrapHostContentInsideSpan(hostElement, renderer, wrapperClass?: string) {
  const wrapper = renderer.createElement('span');
  if (wrapperClass) {
    renderer.addClass(wrapper, wrapperClass);
  }

  // Move all existing children into the wrapper
  // We must loop while there are child nodes and re-append them to wrapper.
  while (hostElement.firstChild) {
    const child = hostElement.firstChild;
    renderer.appendChild(wrapper, child);
  }

  renderer.appendChild(hostElement, wrapper);
}
