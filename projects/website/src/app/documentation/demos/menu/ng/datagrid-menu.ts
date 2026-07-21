/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppfxMenuModule, MenuComponent } from '@clr/addons/menu';
import { ClarityModule } from '@clr/angular';
import { ClarityIcons, vmIcon } from '@clr/angular/icon';

@Component({
  selector: 'clr-datagrid-menu-demo',
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxMenuModule],
  templateUrl: 'datagrid-menu.html',
})
export class DatagridMenuDemoComponent {
  @ViewChild('demoMenu') demoMenu: MenuComponent;

  readonly vms = [
    { name: 'external-gateway', state: 'Powered On' },
    { name: 'ha-proxy', state: 'Powered Off' },
  ];

  constructor() {
    ClarityIcons.addIcons(vmIcon);
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.demoMenu.close(event);
    this.demoMenu.show(event, event.clientX, event.clientY);
  }

  handleAction(label: string) {
    console.log('Action:', label);
  }
}
