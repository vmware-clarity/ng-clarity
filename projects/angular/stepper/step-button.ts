/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { StepperService } from './providers/stepper.service';
import { ClrStepperPanel } from './stepper-panel';

export enum ClrStepButtonType {
  Next = 'next',
  Previous = 'previous',
  Submit = 'submit',
}

@Directive({
  selector: '[clrStepButton]',
  host: {
    '[class.clr-step-button]': 'true',
    '[class.btn]': 'true',
    '[attr.type]': "'button'",
  },
  standalone: false,
})
export class ClrStepButton implements OnInit {
  @Input('clrStepButton') type: ClrStepButtonType | string = ClrStepButtonType.Next;
  @HostBinding('class.btn-success') submitButton = false;
  @HostBinding('class.btn-link') previousButton = false;

  constructor(
    private clrStep: ClrStepperPanel,
    private stepperService: StepperService
  ) {}

  ngOnInit() {
    this.submitButton = this.type === ClrStepButtonType.Submit;
    this.previousButton = this.type === ClrStepButtonType.Previous;
  }

  @HostListener('click', ['$event'])
  navigateToNextPanel(event: Event) {
    event.preventDefault();
    if (this.type === ClrStepButtonType.Previous) {
      this.stepperService.navigateToPreviousPanel(this.clrStep.id);
    } else if (this.type === ClrStepButtonType.Next || this.type === ClrStepButtonType.Submit) {
      this.stepperService.navigateToNextPanel(this.clrStep.id, this.clrStep.formGroup.valid);
    }
  }
}
