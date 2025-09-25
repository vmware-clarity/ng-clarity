/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

class BasicTemplateDrivenDemo {
  model = {
    basic: '',
    container: '',
    required: '',
  };

  submit() {
    console.log(this);
  }
}

@Component({
  templateUrl: './template-driven.html',
  standalone: false,
})
export class FormsTemplateDrivenDemo extends BasicTemplateDrivenDemo {}

@Component({
  templateUrl: './template-driven.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FormsTemplateDrivenOnPushDemo extends BasicTemplateDrivenDemo {}
