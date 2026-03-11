/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClrCommonFormsModule, ClrInputModule, ClrTabsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  standalone: true,
  imports: [A11yModule, ClrCommonFormsModule, ClrInputModule, ClrTabsModule],
})
export class ExampleComponent {
  protected readonly formGroup = new FormGroup({});
}
