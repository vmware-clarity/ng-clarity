/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ViewContainerRef,
  Injector,
  Self,
  Optional,
  Renderer2,
  ElementRef,
  HostListener,
  AfterContentInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDatalistContainer } from './datalist-container';
import { FocusService } from '../common/providers/focus.service';
import { DatalistIdService } from './providers/datalist-id.service';
import { ClrDestroyService } from '../../utils/destroy';

@Directive({
  selector: '[clrDatalistInput]',
  host: {
    '[class.clr-input]': 'true',
    '[attr.list]': 'listValue',
  },
  providers: [ClrDestroyService],
})
export class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
  constructor(
    @Optional() private focusService: FocusService,
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    private datalistIdService: DatalistIdService,
    private destroy$: ClrDestroyService
  ) {
    super(vcr, ClrDatalistContainer, injector, control, renderer, el, destroy$);

    if (!this.focusService) {
      throw new Error('clrDatalist requires being wrapped in <clr-datalist-container>');
    }
  }

  listValue: string;

  ngAfterContentInit() {
    this.datalistIdService.idChange.pipe(takeUntil(this.destroy$)).subscribe(id => (this.listValue = id));
  }

  @HostListener('focus')
  triggerFocus() {
    if (this.focusService) {
      this.focusService.focused = true;
    }
  }

  @HostListener('blur')
  override triggerValidation() {
    super.triggerValidation();
    if (this.focusService) {
      this.focusService.focused = false;
    }
  }
}
