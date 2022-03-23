/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ViewContainerRef, Renderer2, ElementRef, Injector, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';
import { ClrSelectContainer } from './select-container';
import { ClrDestroyService } from '../../utils/destroy';

@Directive({
  selector: '[clrSelect]',
  host: { '[class.clr-select]': 'true' },
  providers: [ClrDestroyService],
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
    el: ElementRef,
    destroy$: ClrDestroyService
  ) {
    super(vcr, ClrSelectContainer, injector, control, renderer, el, destroy$);
  }
}
