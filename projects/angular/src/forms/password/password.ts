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
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { ClrPasswordContainer, TOGGLE_SERVICE } from './password-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({
  selector: '[clrPassword]',
  host: { '[class.clr-input]': 'true' },
  standalone: false,
})
export class ClrPassword extends WrappedFormControl<ClrPasswordContainer> implements OnInit, OnDestroy {
  protected override index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef<HTMLInputElement>,
    @Optional() private focusService: FocusService,
    @Optional()
    @Inject(TOGGLE_SERVICE)
    toggleService: BehaviorSubject<boolean>
  ) {
    super(vcr, ClrPasswordContainer, injector, control, renderer, el);

    if (!focusService) {
      throw new Error('clrPassword requires being wrapped in <clr-password-container>');
    }

    this.subscriptions.push(
      toggleService.subscribe(toggle => {
        renderer.setProperty(el.nativeElement, 'type', toggle ? 'text' : 'password');
      })
    );
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
