/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRangeContainer } from './range-container';

@Directive({
  selector: '[clrRange]',
  host: { '[class.clr-range]': 'true' },
})
export class ClrRange extends WrappedFormControl<ClrRangeContainer> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLInputElement>
  ) {
    super(vcr, ClrRangeContainer, injector, control, renderer, el);
  }

  // Notes: We need an output here EventEmitter for the value
  // Does this implementation also need a display for the value?
}
