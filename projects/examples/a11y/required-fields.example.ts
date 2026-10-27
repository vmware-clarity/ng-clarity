/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxA11yModule } from '@clr/addons/a11y';
import { ClrCommonFormsModule, ClrInputModule } from '@clr/angular';

@Component({
  selector: 'clr-a11y-required-fields-example',
  templateUrl: './required-fields.example.html',
  imports: [AppfxA11yModule, ClrCommonFormsModule, ClrInputModule],
})
export class A11yRequiredFieldsExample {}
