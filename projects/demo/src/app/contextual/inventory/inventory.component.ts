/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ClrContextModule } from '@clr/angular/ai';

import { DEMO_HOSTS, DemoHost } from '../hosts';

/**
 * A page section with the kinds of UI an agent reads: an alert, a datagrid with
 * selection, actions, and a modal — annotated with what only the application knows.
 */
@Component({
  selector: 'clr-context-inventory',
  standalone: true,
  imports: [FormsModule, ClarityModule, ClrContextModule],
  templateUrl: './inventory.component.html',
})
export class ContextInventoryComponent {
  hosts: DemoHost[] = DEMO_HOSTS;
  selectedHosts: DemoHost[] = [];
  alertVisible = true;
  addHostOpen = false;
  newHostName = '';
}
