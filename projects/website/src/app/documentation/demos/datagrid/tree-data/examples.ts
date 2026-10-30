/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basicHtml = `
<clr-datagrid [clrDgItemsIdentityFn]="identity">
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Size</clr-dg-column>

  <clr-dg-row *clrDgTreeItems="let item of files; getChildren: getChildren" [clrDgItem]="item">
    <clr-dg-cell>{{ item.name }}</clr-dg-cell>
    <clr-dg-cell>{{ item.size }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
`;

const basicTs = `
export class FilesComponent {
  files: FileItem[] = [];
  identity = (item: FileItem) => item.id;
  getChildren = (item: FileItem) => this.http.get<FileItem[]>(\`/api/folders/\${item.id}/children\`);

  constructor(private http: HttpClient) {}
}
`;

const expandable = `
<clr-dg-row
  *clrDgTreeItems="let item of files; getChildren: getChildren"
  [clrDgItem]="item"
  [clrDgExpandable]="item.type === 'Folder'"
  [(clrDgExpanded)]="item.expanded"
>
  <clr-dg-cell>{{ item.name }}</clr-dg-cell>
  <clr-dg-cell>{{ item.size }}</clr-dg-cell>
</clr-dg-row>
`;

const treeToggle = `
<clr-dg-column>Size</clr-dg-column>
<clr-dg-column clrDgTreeToggle>Name</clr-dg-column>
`;

const cascadeSelection = `
<clr-datagrid [clrDgItemsIdentityFn]="identity" clrDgSelectionType="multi" [(clrDgSelected)]="selected">
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Size</clr-dg-column>

  <clr-dg-row
    *clrDgTreeItems="let item of files; getChildren: getChildren; cascadeSelection: true"
    [clrDgItem]="item"
  >
    <clr-dg-cell>{{ item.name }}</clr-dg-cell>
    <clr-dg-cell>{{ item.size }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
`;

const reload = `
export class FilesComponent {
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid<FileItem>;

  folderChanged(folder: FileItem) {
    this.datagrid.reloadTreeChildren(folder);
  }
}
`;

const expandAll = `
<div class="btn-group btn-sm">
  <button type="button" class="btn btn-outline" (click)="grid.expandAllTreeRows()">Expand all</button>
  <button type="button" class="btn btn-outline" (click)="grid.collapseAllTreeRows()">
    Collapse all
  </button>
</div>

<clr-datagrid #grid [clrDgItemsIdentityFn]="identity">
  <clr-dg-column>Name</clr-dg-column>

  <clr-dg-row *clrDgTreeItems="let item of files; getChildren: getChildren" [clrDgItem]="item">
    <clr-dg-cell>{{ item.name }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
`;

const virtualScroll = `
<clr-datagrid [clrDgItemsIdentityFn]="identity" style="height: 24rem">
  <clr-dg-column>Name</clr-dg-column>
  <clr-dg-column>Size</clr-dg-column>

  <ng-template
    ClrVirtualScroll
    let-item
    [clrVirtualTreeOf]="files"
    [clrVirtualTreeGetChildren]="getChildren"
    [clrVirtualTreeCascadeSelection]="true"
  >
    <clr-dg-row [clrDgItem]="item" [clrDgExpandable]="item.type === 'Folder'">
      <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      <clr-dg-cell>{{ item.size }}</clr-dg-cell>
    </clr-dg-row>
  </ng-template>
</clr-datagrid>
`;

export const EXAMPLES = {
  basicHtml,
  basicTs,
  expandable,
  treeToggle,
  cascadeSelection,
  reload,
  expandAll,
  virtualScroll,
};
