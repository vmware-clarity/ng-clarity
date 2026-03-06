/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ExampleComponent } from './example.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [ExampleComponent],
})
export class AppComponent {}
