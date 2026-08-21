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

@Component({
  selector: 'clr-button-menu-demo',
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxMenuModule],
  templateUrl: 'button-menu.html',
})
export class ButtonMenuDemoComponent {
  @ViewChild('demoMenu') demoMenu: MenuComponent;

  onOpenMenu(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
    this.demoMenu.close(event);
    this.demoMenu.show(event, rect.left, rect.top + rect.height);
  }

  handleAction(label: string) {
    console.log('Action:', label);
  }
}
