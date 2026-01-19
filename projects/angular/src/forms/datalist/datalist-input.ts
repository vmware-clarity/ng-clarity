/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
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

import { ClrDatalistContainer } from './datalist-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { DatalistIdService } from './providers/datalist-id.service';

@Directive({
  selector: '[clrDatalistInput]',
  host: {
    '[class.clr-input]': 'true',
    '[attr.list]': 'listValue',
  },
  standalone: false,
})
export class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
  listValue: string;

  constructor(
    @Optional() private focusService: FocusService,
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLInputElement>,
    private datalistIdService: DatalistIdService,
    @Optional() @Inject(forwardRef(() => ClrDatalistContainer)) protected override container: ClrDatalistContainer
  ) {
    super(vcr, ClrDatalistContainer, injector, control, renderer, el);

    if (!focusService) {
      throw new Error('clrDatalist requires being wrapped in <clr-datalist-container>');
    }
  }

  ngAfterContentInit() {
    // Subscriptions is inherited from WrappedFormControl, unsubscribe is handled there
    this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.listValue = id)));
  }

  @HostListener('focus')
  triggerFocus() {
    if (this.focusService) {
      this.focusService.focused = true;
    }
  }

  override triggerValidation() {
    super.triggerValidation();
    if (this.focusService) {
      this.focusService.focused = false;
    }
  }
}
