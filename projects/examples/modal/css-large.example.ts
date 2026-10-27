/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrModalModule } from '@clr/angular';

@Component({
  selector: 'clr-modal-css-large-example',
  templateUrl: './css-large.example.html',
  styleUrl: './css-large.example.scss',
  imports: [ClrIcon, ClrModalModule],
})
export class ModalCssLargeExample {}
