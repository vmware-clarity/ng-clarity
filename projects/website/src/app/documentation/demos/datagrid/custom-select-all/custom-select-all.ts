/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';
import { DATAGRID_EXAMPLES } from '@clr/examples/datagrid';

import { SNIPPETS } from './snippets';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-datagrid-custom-select-all-demo',
  templateUrl: 'custom-select-all.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [DocExampleComponent, ClrAlertModule, CodeSnippetComponent],
})
export class DatagridCustomSelectAllDemo {
  readonly examples = DATAGRID_EXAMPLES;
  readonly snippets = SNIPPETS;

  handlerExample = `
  onCustomSelectAll(selectAll: boolean) {
    if (selectAll) {
      // Custom logic. Select all items from your full dataset
      this.selected = [...this.allItems];
    } else {
      this.selected = [];
    }
  }`;

  virtualScrollHandlerExample = `
    onCustomSelectAll(selectAll: boolean) {
      if (selectAll) {
        // In virtual scroll, only a subset of rows are rendered at a time.
        // Use custom select all to select from the full dataset,
        // not just the currently rendered rows.
        const newSelection = [...this.selected];
        this.allItems.forEach(item => {
          if (!this.selected.some(s => this.trackItemById(s) === this.trackItemById(item))) {
            newSelection.push(item);
          }
        });
        this.selected = newSelection;
      } else {
        this.selected = [];
      }
    }
    `;
}
