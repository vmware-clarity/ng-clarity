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

export type MenuDemoMode = 'context-area' | 'tree' | 'datagrid' | 'button' | 'icons';

export interface FileEntry {
  name: string;
  type: string;
  size: string;
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
  expanded?: boolean;
}

@Component({
  selector: 'clr-menu-demo',
  templateUrl: './menu.demo.html',
  styleUrls: ['./menu.demo.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, AppfxMenuModule],
})
export class MenuDemoComponent {
  @ViewChild('contextMenu') contextMenu?: MenuComponent;
  @ViewChild('treeMenu') treeMenu?: MenuComponent;
  @ViewChild('datagridMenu') datagridMenu?: MenuComponent;
  @ViewChild('buttonMenu') buttonMenu?: MenuComponent;
  @ViewChild('iconsMenu') iconsMenu?: MenuComponent;

  activeMode: MenuDemoMode = 'context-area';
  lastAction = '';
  selectedFile: FileEntry | null = null;
  selectedNode: TreeNode | null = null;

  readonly modes: { id: MenuDemoMode; label: string }[] = [
    { id: 'context-area', label: 'Context Area' },
    { id: 'tree', label: 'Tree' },
    { id: 'datagrid', label: 'Datagrid' },
    { id: 'button', label: 'Button' },
    { id: 'icons', label: 'Icons' },
  ];

  readonly files: FileEntry[] = [
    { name: 'annual-report.pdf', type: 'PDF', size: '2.4 MB' },
    { name: 'budget-2026.xlsx', type: 'Excel', size: '1.1 MB' },
    { name: 'meeting-notes.txt', type: 'Text', size: '12 KB' },
    { name: 'presentation.pptx', type: 'PowerPoint', size: '5.7 MB' },
    { name: 'backup.zip', type: 'Archive', size: '48.3 MB' },
  ];

  readonly treeNodes: TreeNode[] = [
    {
      label: 'Documents',
      expanded: true,
      children: [
        { label: 'Reports', children: [{ label: 'Q1 Report' }, { label: 'Q2 Report' }] },
        { label: 'Presentations' },
      ],
    },
    { label: 'Downloads', children: [{ label: 'Installers' }, { label: 'Media' }] },
    { label: 'Pictures', children: [{ label: 'Vacation' }, { label: 'Work' }] },
  ];

  setMode(mode: MenuDemoMode): void {
    this.activeMode = mode;
    this.lastAction = '';
    this.selectedFile = null;
    this.selectedNode = null;
  }

  handleAction(label: string): void {
    this.lastAction = label;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu?.show(event, event.clientX, event.clientY);
  }

  onTreeNodeContextMenu(event: MouseEvent, node: TreeNode): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedNode = node;
    this.treeMenu?.show(event, event.clientX, event.clientY);
  }

  onRowMenuClick(event: MouseEvent, file: FileEntry): void {
    event.stopPropagation();
    this.selectedFile = file;
    this.datagridMenu?.show(event, event.clientX, event.clientY);
  }

  onButtonMenuClick(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.buttonMenu?.show(event, rect.left, rect.bottom + 4, btn);
  }

  onIconMenuClick(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    this.iconsMenu?.show(event, rect.left, rect.bottom + 4, btn);
  }
}
