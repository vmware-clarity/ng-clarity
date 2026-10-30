/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { AppfxDatagridModule } from '@clr/addons/datagrid';
import { ThemeBuilderComponent } from '@clr/addons/theme-builder';
import { ClarityModule, ClrDatagridColumn, ClrTreeNode } from '@clr/angular';
import { Observable } from 'rxjs';

interface Node {
  name: string;
  children?: Node[];
}

@Component({
  selector: 'runtime-acceptance',
  imports: [ClarityModule, AppfxDatagridModule, ThemeBuilderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled) {
      <section id="runtime-acceptance">
        <clr-modal class="runtime-action-modal" [clrModalOpen]="actionModal()" [clrModalSkipAnimation]="false">
          <h2 class="modal-title">Runtime modal actions</h2>
          <div class="modal-body">
            @if (actionModal()) {
              <clr-datagrid>
                <clr-dg-column>Action item</clr-dg-column>
                <clr-dg-row>
                  <clr-dg-action-overflow [clrDgActionOverflowOpen]="true">
                    <button class="action-item">Runtime edit</button>
                    <button class="action-item">Runtime delete</button>
                  </clr-dg-action-overflow>
                  <clr-dg-cell>Item</clr-dg-cell>
                </clr-dg-row>
              </clr-datagrid>
            }
          </div>
        </clr-modal>
        <clr-datagrid class="runtime-columns">
          @for (column of columns(); track column.id) {
            <clr-dg-column [clrDgPinnable]="true" [clrDgPinned]="column.pinned">
              <span>{{ column.title }}</span>
              <clr-dg-column-actions />
            </clr-dg-column>
          }
          <clr-dg-row *clrDgItems="let item of items">
            @for (column of columns(); track column.id) {
              <clr-dg-cell>{{ column.title }}</clr-dg-cell>
            }
          </clr-dg-row>
        </clr-datagrid>
        @if (addonMounted()) {
          <appfx-datagrid
            [gridItems]="items"
            [columns]="addonColumns"
            [layoutModel]="{ stretchToParentHeight: false }"
          />
        }
        @if (themeMounted()) {
          <clr-theme-builder (generatedCSS)="css.set($event)" />
        }
        <output data-testid="theme-css">{{ css() }}</output>
        @if (treeMounted()) {
          <clr-tree [clrLazy]="true">
            <clr-tree-node
              *clrRecursiveFor="let node of roots; getChildren: getChildren"
              [clrExpandable]="!!node.children"
            >
              {{ node.name }}
            </clr-tree-node>
          </clr-tree>
        }
      </section>
    }
  `,
})
export class RuntimeAcceptance {
  readonly enabled = new URLSearchParams(location.search).get('suite') === 'runtime';
  readonly columns = signal([
    { id: 'first', title: 'First runtime', pinned: false },
    { id: 'second', title: 'Second runtime', pinned: false },
    { id: 'third', title: 'Third runtime', pinned: false },
  ]);
  readonly items = [{ name: 'Runtime item', state: 'Ready' }];
  readonly addonColumns = [
    { uid: 'name', field: 'name', displayName: 'Runtime name' },
    { uid: 'state', field: 'state', displayName: 'Runtime state' },
  ];
  readonly actionModal = signal(false);
  readonly addonMounted = signal(true);
  readonly themeMounted = signal(true);
  readonly treeMounted = signal(true);
  readonly css = signal('');
  readonly roots: Node[] = [{ name: 'Runtime root', children: [{ name: 'Runtime child' }] }];
  kind: 'observable' | 'promise' = 'observable';
  completeRequest: () => void;
  cancellations = 0;
  retainedTreeModel: ClrTreeNode<Node>['_model'];
  loadingEmissions = 0;
  @ViewChild(ClrTreeNode) private treeNode: ClrTreeNode<Node>;
  @ViewChild(ThemeBuilderComponent) private themeBuilder: ThemeBuilderComponent;
  @ViewChildren(ClrDatagridColumn) private gridColumns: QueryList<ClrDatagridColumn>;

  constructor() {
    Object.assign(window, { runtimeAcceptance: this });
  }

  ngAfterViewInit() {
    if (this.enabled && new URLSearchParams(location.search).get('restoreTheme') === 'preset') {
      this.themeBuilder.applyPreset(this.themeBuilder.presets[1]);
    }
  }

  readonly getChildren = (node: Node): Observable<Node[]> | Promise<Node[]> => {
    if (this.kind === 'promise') {
      return new Promise(resolve => (this.completeRequest = () => resolve(node.children || [])));
    }
    return new Observable(subscriber => {
      this.completeRequest = () => subscriber.next(node.children || []);
      return () => this.cancellations++;
    });
  };
  destroyTreeRetainingModel() {
    this.retainedTreeModel = this.treeNode._model;
    this.retainedTreeModel.loading$.subscribe(() => this.loadingEmissions++);
    this.treeMounted.set(false);
  }
  rename(title: string) {
    this.columns.update(columns => columns.map((column, index) => (index === 0 ? { ...column, title } : column)));
  }
  pinThirdDirect(pinned: boolean) {
    this.gridColumns.last.pinned = pinned;
  }

  pinThird(pinned: boolean) {
    this.columns.update(columns => columns.map((column, index) => (index === 2 ? { ...column, pinned } : column)));
  }
}
