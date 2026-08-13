/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppfxMenuModule, MenuComponent } from '@clr/addons/menu';

@Component({
  selector: 'clr-basic-menu-demo',
  standalone: true,
  imports: [CommonModule, AppfxMenuModule],
  templateUrl: 'basic-menu.html',
})
export class BasicMenuDemoComponent {
  @ViewChild('demoMenu') demoMenu: MenuComponent;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.demoMenu.close(event);
    this.demoMenu.show(event, event.clientX, event.clientY);
  }

  handleAction(label: string) {
    console.log('Action:', label);
  }
}
