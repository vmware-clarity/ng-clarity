/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'clr-wizard-in-page',
  templateUrl: './wizard-in-page.demo.html',
})
export class WizardInPageDemo {
  router = inject(Router);

  protected cancel() {
    this.router.navigateByUrl('/wizard');
  }

  protected submit() {
    this.router.navigateByUrl('/wizard');
  }
}
