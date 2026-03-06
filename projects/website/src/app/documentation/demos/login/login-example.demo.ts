/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDropdownModule,
  ClrIcon,
  ClrIconModule,
  ClrInputModule,
  ClrPasswordModule,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrSelectModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

@Component({
  selector: 'clr-login-example-demo',
  templateUrl: './login-example.demo.html',
  imports: [
    FormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIcon,
    ClrIconModule,
    ClrPopoverContent,
    ClrSelectModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrPasswordModule,
    ClrCheckboxModule,
  ],
})
export class LoginExampleDemo {
  form = {
    type: 'local',
    username: '',
    password: '',
    rememberMe: false,
  };
}
