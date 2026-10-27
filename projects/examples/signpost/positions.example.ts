/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrSelectModule, ClrSignpostModule } from '@clr/angular';

@Component({
  selector: 'clr-signpost-positions-example',
  templateUrl: './positions.example.html',
  styleUrl: './positions.example.scss',
  imports: [FormsModule, ClrSelectModule, ClrSignpostModule],
})
export class SignpostPositionsExample {
  positions: string[] = [
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'left-top',
    'left-middle',
    'left-bottom',
  ];
  position = 'right-middle';
}
