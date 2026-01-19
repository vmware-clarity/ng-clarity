/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { ClrSelectContainer } from './select-container';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({
  selector: '[clrSelect]',
  host: { '[class.clr-select]': 'true' },
  standalone: false,
})
export class ClrSelect extends WrappedFormControl<ClrSelectContainer> {
  protected override index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLSelectElement>,
    @Optional() @Inject(forwardRef(() => ClrSelectContainer)) protected container: ClrSelectContainer
  ) {
    super(vcr, ClrSelectContainer, injector, control, renderer, el);
  }
}
