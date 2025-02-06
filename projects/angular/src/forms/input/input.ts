/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';
import { ClrInputContainer } from './input-container';

@Directive({
  selector: '[clrInput]',
  host: { '[class.clr-input]': 'true' },
})
export class ClrInput extends WrappedFormControl<ClrInputContainer> {
  protected override index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLInputElement>
  ) {
    super(vcr, ClrInputContainer, injector, control, renderer, el);
    if (this.el.nativeElement.getAttribute('type') === 'number') {
      console.warn(`Warning: Inputs of type "number" should utilize the number-input component for proper handling.\n
  Example usage:
  <clr-number-input-container>
    <label>Number Input</label>
    <input clrNumberInput type="number"/>
  </clr-number-input-container>
      `);
    }
  }
}
