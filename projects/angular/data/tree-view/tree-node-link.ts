/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '.clr-treenode-link',
  standalone: false,
})
export class ClrTreeNodeLink {
  // The tree node's content container owns the roving tabindex for the whole treeitem, so
  // the link itself must be removed from the natural tab sequence to avoid a double Tab stop.
  // It remains mouse-clickable and can still be activated programmatically via .click().
  @HostBinding('attr.tabindex') tabindex = -1;

  constructor(private el: ElementRef<HTMLElement>) {}

  get active() {
    return this.el.nativeElement.classList.contains('active');
  }

  activate() {
    if (this.el.nativeElement && this.el.nativeElement.click) {
      this.el.nativeElement.click();
    }
  }
}
