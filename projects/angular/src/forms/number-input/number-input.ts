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
  HostListener,
  Inject,
  Injector,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { ClrNumberInputContainer } from './number-input-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({
  selector: 'input[type="number"][clrNumberInput]',
  host: { '[class.clr-input]': 'true', '[class.clr-number-input]': 'true' },
  standalone: false,
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
    protected override el: ElementRef<HTMLInputElement>,
    @Optional() @Inject(forwardRef(() => ClrNumberInputContainer)) protected container: ClrNumberInputContainer
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
    this.dispatchStepChangeEvents();
    this.control.control.markAllAsTouched();
  }

  stepDown(): void {
    this.el.nativeElement.stepDown();
    this.dispatchStepChangeEvents();
    this.control.control.markAllAsTouched();
  }

  dispatchBlur() {
    this.el.nativeElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
  }

  private dispatchStepChangeEvents() {
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }
}
