/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from '@clr/angular/forms/common';

import { ClrRadioWrapper } from './radio-wrapper';

@Directive({
  selector: '[clrRadio]',
  standalone: false,
})
export class ClrRadio extends WrappedFormControl<ClrRadioWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLInputElement>
  ) {
    super(vcr, ClrRadioWrapper, injector, control, renderer, el);
  }

  /**
   * Suppressed on the radio: every radio in a group shares one control, so the group's
   * validity and requirement would be announced once per radio. ARIA puts both on the
   * `radiogroup`, which is where `ClrRadioContainer` reports them.
   */
  protected override get ariaInvalid(): true | null {
    return null;
  }

  protected override get ariaRequired(): true | null {
    return null;
  }
}
