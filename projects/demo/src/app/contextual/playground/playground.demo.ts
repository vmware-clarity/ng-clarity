/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrContextModule } from '@clr/angular/ai';

import { ContextPlaygroundComponent } from '../context-playground.component';
import { ContextInventoryComponent } from '../inventory/inventory.component';

@Component({
  selector: 'clr-contextual-playground-demo',
  standalone: true,
  imports: [ClrContextModule, ContextInventoryComponent, ContextPlaygroundComponent],
  templateUrl: './playground.demo.html',
})
export class ContextualPlaygroundDemo {}
