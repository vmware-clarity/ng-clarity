/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ClrContext } from '@clr/angular/ai';

import { DEMO_HOSTS, DemoHost } from '../hosts';

/** An alert, a selectable datagrid, actions and a modal, annotated with what only the app knows. */
@Component({
  selector: 'clr-context-inventory',
  standalone: true,
  imports: [FormsModule, ClarityModule, ClrContext],
  templateUrl: './inventory.component.html',
})
export class ContextInventoryComponent {
  hosts: DemoHost[] = DEMO_HOSTS;
  selectedHosts: DemoHost[] = [];
  alertVisible = true;
  addHostOpen = false;
  newHostName = '';
}
