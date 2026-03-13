/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrDropdown } from '@clr/angular';

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  modified: Date;
  owner: string;
}

@Component({
  selector: 'clr-datagrid-context-menu-demo',
  standalone: true,
  imports: [ClarityModule, DatePipe],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Datagrid Context Menu (Point-based Positioning)</h4>
    <p>
      Right-click any row to open a context menu with actions. The datagrid has a fixed height to test scroll
      repositioning.
    </p>

    <clr-datagrid style="height: 350px" [(clrDgSelected)]="selected">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Type</clr-dg-column>
      <clr-dg-column>Size</clr-dg-column>
      <clr-dg-column>Modified</clr-dg-column>
      <clr-dg-column>Owner</clr-dg-column>

      @for (file of files; track file.id) {
        <clr-dg-row [clrDgItem]="file" (contextmenu)="onRowContextMenu($event, file)">
          <clr-dg-cell>{{ file.name }}</clr-dg-cell>
          <clr-dg-cell>{{ file.type }}</clr-dg-cell>
          <clr-dg-cell>{{ file.size }}</clr-dg-cell>
          <clr-dg-cell>{{ file.modified | date: 'short' }}</clr-dg-cell>
          <clr-dg-cell>{{ file.owner }}</clr-dg-cell>
        </clr-dg-row>
      }

      <clr-dg-footer>
        <clr-dg-pagination #pagination [clrDgPageSize]="50">
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} files
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
    <clr-dropdown #gridContextMenu>
      <clr-dropdown-menu>
        <div class="dropdown-header" style="font-weight: 600">{{ contextFile?.name }}</div>
        <div class="dropdown-divider" role="separator"></div>
        <button type="button" clrDropdownItem (click)="doAction('Open', contextFile)">Open</button>
        <button type="button" clrDropdownItem (click)="doAction('Rename', contextFile)">Rename</button>
        <button type="button" clrDropdownItem (click)="doAction('Duplicate', contextFile)">Duplicate</button>
        <div class="dropdown-divider" role="separator"></div>
        <clr-dropdown>
          <button type="button" clrDropdownTrigger>Move to</button>
          <clr-dropdown-menu>
            <button type="button" clrDropdownItem (click)="doAction('Move to Archive', contextFile)">Archive</button>
            <button type="button" clrDropdownItem (click)="doAction('Move to Shared', contextFile)">Shared</button>
            <button type="button" clrDropdownItem (click)="doAction('Move to Backup', contextFile)">Backup</button>
          </clr-dropdown-menu>
        </clr-dropdown>
        <div class="dropdown-divider" role="separator"></div>
        <button type="button" clrDropdownItem (click)="doAction('Delete', contextFile)">
          <cds-icon shape="trash" style="margin-right: 4px"></cds-icon> Delete
        </button>
      </clr-dropdown-menu>
    </clr-dropdown>

    @if (actionLog.length) {
      <div class="action-log">
        <strong>Actions:</strong><br />
        @for (entry of actionLog; track $index) {
          <div>{{ entry }}</div>
        }
      </div>
    }
  `,
})
export class DatagridContextMenuDemo {
  @ViewChild('gridContextMenu', { static: true }) dropdown: ClrDropdown;

  files: FileItem[] = [];
  selected: FileItem[] = [];
  contextFile: FileItem | null = null;
  actionLog: string[] = [];

  private readonly types = ['Document', 'Spreadsheet', 'Image', 'Video', 'Archive', 'Config', 'Log', 'Script'];
  private readonly owners = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  private readonly datePipe = new DatePipe('en-US');

  constructor() {
    this.files = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `file-${String(i + 1).padStart(3, '0')}.${this.randomExt()}`,
      type: this.types[i % this.types.length],
      size: `${(Math.random() * 500 + 1).toFixed(1)} KB`,
      modified: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      owner: this.owners[i % this.owners.length],
    }));
  }

  onRowContextMenu(event: MouseEvent, file: FileItem) {
    event.preventDefault();
    this.contextFile = file;
    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY });
  }

  doAction(action: string, file: FileItem) {
    const timestamp = this.datePipe.transform(new Date(), 'mediumTime');
    this.actionLog.unshift(`[${timestamp}] ${action}: ${file.name}`);
  }

  private randomExt(): string {
    const exts = ['txt', 'csv', 'png', 'mp4', 'zip', 'yaml', 'log', 'sh'];
    return exts[Math.floor(Math.random() * exts.length)];
  }
}
