/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[dropdownMenuReposition]',
  standalone: false,
})
/**
 * A directive that fixes position of the clarity dropdown menu opened
 * when actions in appfx-datagrid-action-bar are collapsed and opened in a
 * menu. Since the dropdown trigger button could be center or left aligned -
 * depending on the available horizontal space and length of the action
 * names that are collapsed, sometimes the menu could go out of left
 * boundaries of its parent container. To prevent this the directive ensures
 * the dropdown menu does not get a negative `translateX` property for the
 * `transform` style.
 *
 * The directive requires ongoing maintenance and support as this peers deep in the Clarity tab internals
 */
export class DatagridActionBarDropdownRepositionDirective implements AfterViewInit {
  // minimal `translateX` property of transform style of the dropdown menu
  // that ensures the dropdown menu is not opened out of left boundaries of
  // its parent container
  private readonly menuMinTranslateX = 10;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const computedStyle = getComputedStyle(this.elementRef.nativeElement);
    const matrix = new DOMMatrix(computedStyle.transform);

    const originalTranslateX = matrix.m41;
    const translateY = matrix.m42;

    const newTranslateX = Math.max(this.menuMinTranslateX, originalTranslateX);
    // override default `translateX` property
    this.elementRef.nativeElement.style.transform = `translateX(${newTranslateX}px) translateY(${translateY}px)`;
  }
}
