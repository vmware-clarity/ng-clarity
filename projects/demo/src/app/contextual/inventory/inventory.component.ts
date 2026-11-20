/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ClrContext } from '@clr/angular/ai';

import { DEMO_HOSTS, DemoHost } from '../hosts';

/** An alert, a selectable datagrid, actions and a modal, annotated with what only the app knows. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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

  readonly inventoryContext = () => ({
    label: 'Host inventory for the selected datacenter',
    type: 'section',
    state: {
      datacenter: 'eu-west',
      selectedHosts: this.selectedHosts.length,
      purpose: 'Review the hosts of a datacenter and add new ones',
      tasks: ['Find disconnected hosts', 'Put hosts into maintenance', 'Add a host'],
    },
  });

  /** What the grid cannot show; merged into the grid's `state`. */
  readonly gridContext = {
    state: { owner: 'Infrastructure team', statusValues: ['Connected', 'Maintenance', 'Disconnected'] },
  };
}
