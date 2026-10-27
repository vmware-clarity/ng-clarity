/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrAlertModule, ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-alt-next-example',
  templateUrl: './alt-next.example.html',
  styles: ['.stress { color: var(--cds-alias-status-danger); }'],
  imports: [ClrWizardModule, ClrAlertModule, ClrFormsModule, FormsModule],
})
export class WizardAltNextExample implements OnInit {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  showCancelConfirm = false;

  model: any;
  stressText = false;
  errorFlag = false;

  ngOnInit() {
    this.model = {
      allowNext: false,
      sequenceOne: '',
      sequenceTwo: '',
      sequenceThree: '',
    };
  }

  pageCustomNext(): void {
    if (confirm('Are you sure you got it right?')) {
      this.errorFlag = false;
      this.wizard?.forceNext();
    }
  }

  doFinish() {
    const sequenceOneIsCorrect = this.model.sequenceOne === 3;
    const sequenceTwoIsCorrect = this.model.sequenceTwo === 5;
    const sequenceThreeIsCorrect = this.model.sequenceThree === 8;
    const allAreCorrect = sequenceOneIsCorrect && sequenceTwoIsCorrect && sequenceThreeIsCorrect;

    if (allAreCorrect) {
      this.wizard?.forceFinish();
      // resetting for another pass through
      this.model.allowNext = false;
      this.model.sequenceOne = '';
      this.model.sequenceTwo = '';
      this.model.sequenceThree = '';
      this.wizard?.reset();
      this.errorFlag = false;
    } else {
      this.errorFlag = true;
    }
  }

  doNext() {
    if (this.model.allowNext) {
      this.wizard?.forceNext();
      this.stressText = false;
    } else {
      this.stressText = true;
    }
  }
}
