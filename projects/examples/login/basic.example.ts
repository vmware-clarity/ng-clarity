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
  ClrDropdownModule,
  ClrIcon,
  ClrInputModule,
  ClrPasswordModule,
  ClrSelectModule,
} from '@clr/angular';

@Component({
  selector: 'clr-login-basic-example',
  templateUrl: './basic.example.html',
  imports: [
    ClrCheckboxModule,
    ClrDropdownModule,
    ClrIcon,
    ClrInputModule,
    ClrPasswordModule,
    ClrSelectModule,
    FormsModule,
  ],
})
export class LoginBasicExample {
  form = {
    type: 'local',
    username: '',
    password: '',
    rememberMe: false,
  };
}
