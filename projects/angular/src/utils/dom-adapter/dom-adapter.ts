/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * If we someday want to be able to render the datagrid in a webworker,
 * this is where we would test if we're in headless mode. Right now it's not testing anything, but any access
 * to native DOM elements' methods and properties in the Datagrid happens here.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class DomAdapter {
  /* 
    We clone the element and take its measurements from outside the grid
    so we don't trigger reflow for the whole datagrid.
  */
  userDefinedWidth(element: HTMLElement): number {
    const clonedElement = element.cloneNode(true) as HTMLElement;
    if (clonedElement.id) {
      clonedElement.id = clonedElement.id + '-clone';
    }
    clonedElement.classList.add('datagrid-cell-width-zero');
    document.body.appendChild(clonedElement);
    const userDefinedWidth = this.clientRect(clonedElement).width;
    clonedElement.remove();
    return userDefinedWidth;
  }

  scrollBarWidth(element: any) {
    return element.offsetWidth - element.clientWidth;
  }

  scrollWidth(element: any) {
    return element.scrollWidth || 0;
  }

  computedHeight(element: any): number {
    return parseInt(getComputedStyle(element).getPropertyValue('height'), 10);
  }

  clientRect(element: any): DOMRect {
    const elementClientRect = element.getBoundingClientRect();
    return {
      top: parseInt(elementClientRect.top, 10),
      bottom: parseInt(elementClientRect.bottom, 10),
      left: parseInt(elementClientRect.left, 10),
      right: parseInt(elementClientRect.right, 10),
      width: parseInt(elementClientRect.width, 10),
      height: parseInt(elementClientRect.height, 10),
    } as DOMRect;
  }

  minWidth(element: any): number {
    return parseInt(getComputedStyle(element).getPropertyValue('min-width'), 10);
  }

  focus(element: any): void {
    element.focus();
  }
}
