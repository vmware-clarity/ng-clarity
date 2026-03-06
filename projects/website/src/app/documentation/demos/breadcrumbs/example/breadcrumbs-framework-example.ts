/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-breadcrumb-framework-example',
  template: ` <router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
export class BreadcrumbFrameworkExample {}
