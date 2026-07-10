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

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';

const BasicMenuHtml = require('!raw-loader!./ng/basic-menu.html').default;
const BasicMenuTs = require('!raw-loader!./ng/basic-menu.ts').default;
const ButtonMenuHtml = require('!raw-loader!./ng/button-menu.html').default;
const ButtonMenuTs = require('!raw-loader!./ng/button-menu.ts').default;
const DatagridMenuHtml = require('!raw-loader!./ng/datagrid-menu.html').default;
const DatagridMenuTs = require('!raw-loader!./ng/datagrid-menu.ts').default;
const IconsMenuHtml = require('!raw-loader!./ng/icons-menu.html').default;
const IconsMenuScss = require('!raw-loader!./ng/icons-menu.scss').default;
const IconsMenuTs = require('!raw-loader!./ng/icons-menu.ts').default;
const TreeMenuHtml = require('!raw-loader!./ng/tree-menu.html').default;
const TreeMenuTs = require('!raw-loader!./ng/tree-menu.ts').default;

export type MenuDemoMode = 'context-area' | 'tree' | 'datagrid' | 'button' | 'icons';

interface StackblitzExample {
  name: string;
  html: string;
  ts: string;
  styles?: string;
}

interface Vm {
  name: string;
  state: string;
  status: string;
  provisionedSpace: string;
  usedSpace: string;
}

@Component({
  selector: 'app-menu-demo',
  templateUrl: './menu.demo.html',
  styleUrls: ['./menu.demo.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ClarityModule,
    AppfxMenuModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MenuDemoComponent extends ClarityDocComponent {
  @ViewChild('actionsMenu', { static: true }) actionsMenu!: MenuComponent;
  @ViewChild('iconsMenu', { static: true }) iconsMenu!: MenuComponent;

  readonly stackblitzExamples: Record<MenuDemoMode, StackblitzExample> = {
    'context-area': { name: 'menu-context-area', html: BasicMenuHtml, ts: BasicMenuTs },
    tree: { name: 'menu-tree', html: TreeMenuHtml, ts: TreeMenuTs },
    datagrid: { name: 'menu-datagrid', html: DatagridMenuHtml, ts: DatagridMenuTs },
    button: { name: 'menu-button', html: ButtonMenuHtml, ts: ButtonMenuTs },
    icons: { name: 'menu-icons', html: IconsMenuHtml, ts: IconsMenuTs, styles: IconsMenuScss },
  };

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
    super('menu');
    ClarityIcons.addIcons(buildingIcon, clusterIcon, hostIcon, vmIcon);
  }

  get activeStackblitzExample(): StackblitzExample {
    return this.stackblitzExamples[this.activeMode];
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
