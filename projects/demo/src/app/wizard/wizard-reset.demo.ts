/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';

@Component({
  selector: 'clr-wizard-reset',
  templateUrl: './wizard-reset.demo.html',
  standalone: false,
})
export class WizardResetDemo implements OnInit {
  @ViewChild('wizard') wizard: ClrWizard;

  open = false;

  model: any;

  ngOnInit() {
    this.model = { forceReset: false, favoriteColor: '', luckyNumber: '', flavorOfIceCream: '' };
  }

  doFinish(): void {
    this.doReset();
  }

  doReset(): void {
    if (this.model.forceReset) {
      this.model.forceReset = false;
      this.model.favoriteColor = '';
      this.model.luckyNumber = '';
      this.model.flavorOfIceCream = '';
      this.wizard.reset();
    }
  }
}
