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
import { buildingIcon, ClarityIcons, clusterIcon, hostIcon } from '@clr/angular/icon';

@Component({
  selector: 'clr-tree-menu-demo',
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxMenuModule],
  templateUrl: 'tree-menu.html',
})
export class TreeMenuDemoComponent {
  @ViewChild('demoMenu') demoMenu: MenuComponent;

  constructor() {
    ClarityIcons.addIcons(buildingIcon, clusterIcon, hostIcon);
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
