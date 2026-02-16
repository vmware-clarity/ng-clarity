/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTabsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  standalone: true,
  imports: [A11yModule, ClrTabsModule, CommonModule],
})
export class ExampleComponent {}
