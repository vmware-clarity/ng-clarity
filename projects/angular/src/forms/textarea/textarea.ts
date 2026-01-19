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

import { ClrTextareaContainer } from './textarea-container';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({
  selector: '[clrTextarea]',
  host: { '[class.clr-textarea]': 'true' },
  standalone: false,
})
export class ClrTextarea extends WrappedFormControl<ClrTextareaContainer> {
  protected override index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLTextAreaElement>,
    @Optional() @Inject(forwardRef(() => ClrTextareaContainer)) protected container: ClrTextareaContainer
  ) {
    super(vcr, ClrTextareaContainer, injector, control, renderer, el);
  }
}
