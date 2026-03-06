/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { ClrCommonFormsModule, ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

@Component({
  selector: 'clr-layout-large-screen-nav',
  templateUrl: './large-screen-nav.html',
  imports: [ClrIcon, ClrIconModule, ClrCommonFormsModule, ClrVerticalNavModule, RouterLinkActive],
})
export class LargeScreenNavDemo {}
