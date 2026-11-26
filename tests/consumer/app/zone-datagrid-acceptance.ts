/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';

interface Server {
  name: string;
}

interface Folder {
  name: string;
  hasChildren: boolean;
}

class NameFilter implements ClrDatagridFilterInterface<Server> {
  readonly changes = new Subject<void>();
  query = '';

  isActive() {
    return !!this.query;
  }

  accepts(server: Server) {
    return server.name.includes(this.query);
  }

  search(query: string) {
    this.query = query;
    this.changes.next();
  }
}

const later = (change: () => void) => setTimeout(change, 25);

/**
 * A component of a Zone.js application, the way most are written: Eager, with its state in plain fields that change
 * in timers, as with HTTP requests. Zone.js checks it after each timer; the OnPush views of the datagrid have to
 * follow without being told.
 */
@Component({
  selector: 'zone-datagrid-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section id="zone-datagrid">
      <button class="btn" (click)="loadServers()">Load servers later</button>
      <button class="btn" (click)="selectLater()">Select later</button>
      <button class="btn" (click)="nextPageLater()">Next page later</button>
      <button class="btn" (click)="filterLater()">Filter later</button>
      <button class="btn" (click)="openDetailLater()">Open detail later</button>
      <clr-datagrid
        class="zone-servers"
        [clrDgLoading]="loading"
        [(clrDgSelected)]="selected"
        clrDgSelectionType="multi"
      >
        <clr-dg-column>
          Server
          <clr-dg-filter [clrDgFilter]="filter">Filter servers</clr-dg-filter>
        </clr-dg-column>
        <clr-dg-row *clrDgItems="let server of servers" [clrDgItem]="server">
          <clr-dg-cell>{{ server.name }}</clr-dg-cell>
        </clr-dg-row>
        <ng-template [(clrIfDetail)]="detail" let-detail>
          <clr-dg-detail>
            <clr-dg-detail-header>{{ detail.name }} details</clr-dg-detail-header>
            <clr-dg-detail-body>Detail body of {{ detail.name }}</clr-dg-detail-body>
          </clr-dg-detail>
        </ng-template>
        <clr-dg-placeholder>No servers yet</clr-dg-placeholder>
        <clr-dg-footer>
          <clr-dg-pagination [clrDgPageSize]="2" [(clrDgPage)]="page"></clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>

      <clr-datagrid class="zone-tree">
        <clr-dg-column>Folder</clr-dg-column>
        <clr-dg-row
          *clrDgTreeItems="let folder of folders; getChildren: getChildren"
          [clrDgItem]="folder"
          [clrDgTreeExpandable]="folder.hasChildren"
        >
          <clr-dg-cell>{{ folder.name }}</clr-dg-cell>
        </clr-dg-row>
      </clr-datagrid>
    </section>
  `,
})
export class ZoneDatagridAcceptance {
  servers: Server[] = [];
  loading = false;
  selected: Server[] = [];
  page = 1;
  detail: Server | null = null;
  readonly filter = new NameFilter();
  readonly folders: Folder[] = [{ name: 'Documents', hasChildren: true }];

  readonly getChildren = (folder: Folder) =>
    new Promise<Folder[]>(resolve => later(() => resolve([{ name: `${folder.name} child`, hasChildren: false }])));

  loadServers() {
    this.loading = true;
    later(() => {
      this.servers = [{ name: 'alpha' }, { name: 'beta' }, { name: 'gamma' }];
      this.loading = false;
    });
  }

  selectLater() {
    // In place, which the datagrid supports.
    later(() => this.selected.push(this.servers[1]));
  }

  nextPageLater() {
    later(() => (this.page = 2));
  }

  filterLater() {
    later(() => this.filter.search('gam'));
  }

  openDetailLater() {
    later(() => (this.detail = this.servers[0]));
  }
}
