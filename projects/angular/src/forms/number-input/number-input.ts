/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrNumberInputContainer } from './number-input-container';

@Directive({
  selector: 'input[type="number"][clrNumberInput]',
  host: { '[class.clr-input]': 'true', '[class.clr-number-input]': 'true' },
})
export class ClrNumberInput extends WrappedFormControl<ClrNumberInputContainer> {
  protected override index = 1;

  constructor(
    @Optional() private focusService: FocusService,
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    private control: NgControl,
    renderer: Renderer2,
    protected override el: ElementRef<HTMLInputElement>
  ) {
    super(vcr, ClrNumberInputContainer, injector, control, renderer, el);

    if (!focusService) {
      throw new Error('clrNumberInput requires being wrapped in <clr-number-input-container>');
    }
  }

  get readonly() {
    return this.el.nativeElement.getAttribute('readonly') !== null;
  }

  @HostListener('focus')
  triggerFocus() {
    if (!this.readonly && this.focusService) {
      this.focusService.focused = true;
    }
  }

  @HostListener('blur')
  override triggerValidation() {
    if (!this.readonly) {
      super.triggerValidation();
      if (this.focusService) {
        this.focusService.focused = false;
      }
    }
  }

  stepUp(): void {
    this.el.nativeElement.stepUp();
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    this.control.control.markAllAsTouched();
  }

  stepDown(): void {
    this.el.nativeElement.stepDown();
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    this.control.control.markAllAsTouched();
  }
}
