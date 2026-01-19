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

import { ClrControlContainer } from './control-container';
import { WrappedFormControl } from './wrapped-control';

@Directive({
  selector: '[clrControl]',
  host: { '[class.clr-input]': 'true' },
  standalone: false,
})
export class ClrControl extends WrappedFormControl<ClrControlContainer> {
  protected override index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLElement>,
    @Optional() @Inject(forwardRef(() => ClrControlContainer)) protected override container: ClrControlContainer
  ) {
    super(vcr, ClrControlContainer, injector, control, renderer, el);
  }
}
