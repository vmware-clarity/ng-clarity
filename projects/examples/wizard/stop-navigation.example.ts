/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-stop-navigation-example',
  templateUrl: './stop-navigation.example.html',
  imports: [ClrWizardModule, ClrFormsModule, FormsModule],
})
export class WizardStopNavigationExample {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  untouched = true;
  loading = false;
  errorFlag = false;
  progress = 0;
  open = false;

  model = {
    won: '',
    too: '',
    tree: '',
  };

  get readyToFinish(): boolean {
    return !this.untouched && !this.loading;
  }

  doCancel(): void {
    this.wizard?.close();
    this.resetWizard();
  }

  resetWizard(): void {
    this.wizard?.reset();
    this.model.won = '';
    this.model.too = '';
    this.model.tree = '';
    this.progress = 0;
  }

  onCommit(): void {
    if (this.untouched) {
      this.untouched = false;
      this.loading = true;
      const timer = setInterval(() => {
        this.progress = this.progress + 14;

        if (this.progress > 99) {
          this.progress = 100;
          this.loading = false;
          clearInterval(timer);
        }
      }, 1000);
    } else {
      this.wizard?.forceFinish();
      this.resetWizard();
    }
  }
}
