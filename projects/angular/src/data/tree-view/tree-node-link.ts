/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '.clr-treenode-link',
  standalone: false,
})
export class ClrTreeNodeLink {
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
