/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { LOGIN_EXAMPLES } from '@clr/examples/login';

/** Renders the login example without its code, for the overview tab. */
@Component({
  selector: 'clr-login-example-demo',
  templateUrl: './login-example.demo.html',
  imports: [NgComponentOutlet],
})
export class LoginExampleDemo {
  readonly examples = LOGIN_EXAMPLES;
}
