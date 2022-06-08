/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Attribute, Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { WrappedFormControl } from '../common/wrapped-control';
import { ClrCheckboxWrapper, IS_TOGGLE } from './checkbox-wrapper';

/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
@Directive({
  selector: '[clrCheckbox],[clrToggle]',
})
export class ClrCheckbox extends WrappedFormControl<ClrCheckboxWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Attribute('clrToggle') private toggle: string
  ) {
    super(vcr, ClrCheckboxWrapper, injector, control, renderer, el);
  }

  override ngOnInit() {
    super.ngOnInit();

    const toggleService = this.getProviderFromContainer<BehaviorSubject<boolean>>(IS_TOGGLE, null);

    if (toggleService && this.toggle !== null) {
      toggleService.next(true);
    }
  }
}
