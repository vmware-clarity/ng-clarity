/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-reset-example',
  templateUrl: './reset.example.html',
  imports: [ClrWizardModule, ClrFormsModule, FormsModule],
})
export class WizardResetExample implements OnInit {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  model: any;

  ngOnInit() {
    this.model = {
      forceReset: false,
      favoriteColor: '',
      luckyNumber: '',
      flavorOfIceCream: '',
    };
  }

  doFinish(): void {
    this.doReset();
  }

  doReset(): void {
    if (this.model.forceReset) {
      this.wizard?.reset();
      this.model.forceReset = false;
      this.model.favoriteColor = '';
      this.model.luckyNumber = '';
      this.model.flavorOfIceCream = '';
    }
  }
}
