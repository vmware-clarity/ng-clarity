/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[filterPopoverReposition]',
  standalone: false,
})
/**
 * A directive that fixes the position of the clarity popover/signpost, which is opened
 * when adding/editing filters. The popover is positioned bottom middle relative to
 * the corresponding trigger button. The width of the popover is based on the longest
 * property name. This means that some parts of the popover may not be visible, because
 * they will get out of the borders of the parent datagrid component.
 * To prevent this, the directive modifies the `translateX` property for the `transform` style,
 * in order to ensure that the popover is positioned within the boundaries of the datagrid.
 */
export class FilterPopoverRepositionDirective implements AfterViewInit {
  // Minimal `translateX` property of transform style of the popover that
  // ensures the popover is aligned on the left boundaries of the datagrid.
  private readonly menuMinTranslateX = 1;

  // Selector of the datagrid filter container. It has the same width as the datagrid.
  private readonly filterContainerSelector = '.filter-container';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    const computedStyle = getComputedStyle(this.elementRef.nativeElement);
    const matrix = new DOMMatrix(computedStyle.transform);

    const originalTranslateX = matrix.m41;
    const translateY = matrix.m42;

    const parentElement = this.elementRef.nativeElement.closest(this.filterContainerSelector);
    const popoverOriginalEndX = originalTranslateX + this.elementRef.nativeElement.offsetWidth;

    // If the popover is within the datagrid boundaries, do nothing.
    if (originalTranslateX > this.menuMinTranslateX && popoverOriginalEndX < parentElement.offsetWidth) {
      return;
    }

    const newTranslateX = Math.max(
      this.menuMinTranslateX,
      Math.min(originalTranslateX, originalTranslateX - (popoverOriginalEndX - parentElement.offsetWidth))
    );

    // Override default `translateX` property
    this.elementRef.nativeElement.style.transform = `translateX(${newTranslateX}px) translateY(${translateY}px)`;
  }
}
