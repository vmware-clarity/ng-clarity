/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, loadCoreIconSet, loadEssentialIconSet } from '@clr/angular/icon';

@Component({
  selector: 'clr-icon-builtin-aliases-example',
  templateUrl: './builtin-aliases.example.html',
  imports: [ClrIcon],
})
export class IconBuiltinAliasesExample {
  constructor() {
    loadCoreIconSet();
    loadEssentialIconSet();
  }
}
