/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnInit } from '@angular/core';

import { ClrFormLayout, LayoutService } from './providers/layout.service';

@Directive({
  selector: '[clrForm][clrLayout]',
  standalone: false,
})
export class ClrLayout implements OnInit {
  @Input('clrLayout') layout: ClrFormLayout | string;

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    // Only set the layout if it is a valid option
    if (this.layout && this.layoutService.isValid(this.layout)) {
      this.layoutService.layout = this.layout;
    }
  }
}
