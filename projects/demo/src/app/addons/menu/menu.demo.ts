/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppfxMenuModule, MenuComponent } from '@clr/addons/menu';
import { ClarityModule } from '@clr/angular';
import { buildingIcon, ClarityIcons, clusterIcon, hostIcon, vmIcon } from '@clr/angular/icon';

export type MenuDemoMode = 'context-area' | 'tree' | 'datagrid' | 'button' | 'icons';

interface Vm {
  name: string;
  state: string;
  status: string;
  provisionedSpace: string;
  usedSpace: string;
}

@Component({
  selector: 'clr-menu-demo',
  templateUrl: './menu.demo.html',
  styleUrls: ['./menu.demo.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxMenuModule],
  encapsulation: ViewEncapsulation.None,
})
export class MenuDemoComponent {
  @ViewChild('actionsMenu', { static: true }) actionsMenu!: MenuComponent;
  @ViewChild('iconsMenu', { static: true }) iconsMenu!: MenuComponent;

  readonly modes: { id: MenuDemoMode; label: string }[] = [
    { id: 'context-area', label: 'Context Area' },
    { id: 'tree', label: 'Tree' },
    { id: 'datagrid', label: 'Datagrid' },
    { id: 'button', label: 'Button' },
    { id: 'icons', label: 'Icons' },
  ];

  activeMode: MenuDemoMode = 'context-area';
  lastAction = '';

  readonly vms: Vm[] = [
    {
      name: 'external-gateway',
      state: 'Powered On',
      status: 'Normal',
      provisionedSpace: '18.84 GB',
      usedSpace: '3.18 GB',
    },
    {
      name: 'ha-proxy',
      state: 'Powered Off',
      status: 'Normal',
      provisionedSpace: '24.08 GB',
      usedSpace: '10.65 GB',
    },
    {
      name: 'vCLS-vm',
      state: 'Powered On',
      status: 'Normal',
      provisionedSpace: '2.2 GB',
      usedSpace: '40.8 GB',
    },
    {
      name: 'Control plane VM',
      state: 'Powered On',
      status: 'Normal',
      provisionedSpace: '21.2 GB',
      usedSpace: '83.8 GB',
    },
  ];

  constructor() {
    ClarityIcons.addIcons(buildingIcon, clusterIcon, hostIcon, vmIcon);
  }

  setMode(mode: MenuDemoMode): void {
    this.activeMode = mode;
    this.lastAction = '';
  }

  onOpenMenu(event: MouseEvent): void {
    this.actionsMenu.close(event);
    this.actionsMenu.show(event, event.clientX, event.clientY);
    event.preventDefault();
  }

  onOpenIconsMenu(event: MouseEvent): void {
    this.iconsMenu.close(event);
    this.iconsMenu.show(event, event.clientX, event.clientY);
    event.preventDefault();
  }

  onOpenButtonMenu(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLButtonElement).getBoundingClientRect();
    this.actionsMenu.close(event);
    this.actionsMenu.show(event, rect.left, rect.top + rect.height);
  }

  handleAction(label: string): void {
    this.lastAction = label;
  }
}
