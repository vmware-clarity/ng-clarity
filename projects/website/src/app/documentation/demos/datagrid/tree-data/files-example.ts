/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

interface FileItem {
  id: string;
  name: string;
  type: 'Folder' | 'File';
  /** In KB; for a folder, everything in it. */
  size: number;
  modified: Date;
  children?: FileItem[];
}

const file = (id: string, name: string, size: number, modified: string): FileItem => ({
  id,
  name,
  type: 'File',
  size,
  modified: new Date(modified),
});

const folder = (id: string, name: string, modified: string, children: FileItem[]): FileItem => ({
  id,
  name,
  type: 'Folder',
  size: children.reduce((total, child) => total + child.size, 0),
  modified: new Date(modified),
  children,
});

const FILES: FileItem[] = [
  folder('documents', 'Documents', '2026-09-30', [
    folder('reports', 'Reports', '2026-09-30', [
      file('q1', 'Q1 report.pdf', 1240, '2026-04-02'),
      file('q2', 'Q2 report.pdf', 1385, '2026-07-01'),
      file('q3', 'Q3 report.pdf', 1102, '2026-09-30'),
    ]),
    folder('invoices', 'Invoices', '2026-08-14', [
      file('invoice-1', 'Invoice 1042.pdf', 86, '2026-06-11'),
      file('invoice-2', 'Invoice 1043.pdf', 91, '2026-08-14'),
    ]),
    file('budget', 'Budget.xlsx', 312, '2026-09-12'),
  ]),
  folder('photos', 'Photos', '2026-10-03', [
    folder('summer', 'Summer', '2026-08-21', [
      file('beach', 'Beach.jpg', 4210, '2026-08-02'),
      file('mountains', 'Mountains.jpg', 5034, '2026-08-21'),
    ]),
    file('portrait', 'Portrait.png', 2875, '2026-10-03'),
  ]),
  folder('music', 'Music', '2026-05-20', []),
  folder('projects', 'Projects', '2026-10-20', [
    folder('website', 'Website', '2026-10-20', [
      file('index', 'index.html', 4, '2026-10-20'),
      file('styles', 'styles.css', 12, '2026-10-18'),
    ]),
    file('readme', 'README.md', 3, '2026-10-01'),
  ]),
  file('notes', 'Notes.txt', 2, '2026-10-21'),
  file('todo', 'To do.md', 1, '2026-10-24'),
  file('resume', 'Resume.docx', 64, '2026-03-09'),
];

function compare<V>(a: V, b: V) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Responds after a short delay, like a server. */
function fromServer<T>(value: T): Observable<T> {
  return of(value).pipe(delay(500));
}

@Component({
  selector: 'clr-datagrid-tree-files-example',
  templateUrl: './files-example.html',
  imports: [ClrDatagridModule, DatePipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridTreeFilesExample implements OnDestroy {
  files: FileItem[] = [];
  total = 0;
  loading = true;
  selected: FileItem[] = [];

  private request: Subscription | undefined;

  // Unique across the whole tree, so rows stay expanded and selected when the page is refreshed.
  identity = (item: FileItem) => item.id;

  // Called the first time a folder is expanded: an array, a Promise or an Observable.
  getChildren = (item: FileItem) => fromServer(item.children || []);

  // The server sorts and pages the top-level items; the datagrid sorts the children it loaded.
  refresh(state: ClrDatagridStateInterface<FileItem>) {
    const by = state.sort?.by as 'name' | 'type' | 'size' | 'modified' | undefined;
    const direction = state.sort?.reverse ? -1 : 1;
    const sorted = by ? [...FILES].sort((a, b) => direction * compare(a[by], b[by])) : FILES;
    const size = state.page?.size || 5;
    const from = ((state.page?.current || 1) - 1) * size;

    this.loading = true;
    this.request?.unsubscribe();
    this.request = fromServer(sorted.slice(from, from + size)).subscribe(files => {
      this.files = files;
      this.total = FILES.length;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.request?.unsubscribe();
  }
}
