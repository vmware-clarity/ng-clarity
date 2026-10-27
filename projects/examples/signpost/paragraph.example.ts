/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSignpostModule } from '@clr/angular';

@Component({
  selector: 'clr-signpost-paragraph-example',
  templateUrl: './paragraph.example.html',
  imports: [ClrSignpostModule],
})
export class SignpostParagraphExample {
  // Use *clrIfOpen directive to manage hide/show with the openState property.
  openState = false;
}
