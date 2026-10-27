/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxA11yModule } from '@clr/addons/a11y';
import { ClrTabsModule } from '@clr/angular';

@Component({
  selector: 'clr-a11y-tabs-overflow-example',
  templateUrl: './tabs-overflow.example.html',
  imports: [AppfxA11yModule, ClrTabsModule],
})
export class A11yTabsOverflowExample {}
