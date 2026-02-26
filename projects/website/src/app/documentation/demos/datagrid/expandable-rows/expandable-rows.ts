/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrDatagridModule,
  ClrDatagridStringFilterInterface,
  ClrIcon,
  ClrIconModule,
  ClrIfExpanded,
  ClrPopoverHostDirective,
  ClrRadioModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { EXAMPLES } from './examples';
import { CodeSnippetComponent } from '../../../../shared/code-snippet/code-snippet.component';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { CommonFiles } from '../utils/stackblitz-common-data';

class DateFilter implements ClrDatagridStringFilterInterface<User> {
  accepts(user: User, search: string): boolean {
    const date = (user.creation as Date).toDateString();
    return date === search || date.toLowerCase().indexOf(search) >= 0;
  }
}

@Component({
  selector: 'clr-datagrid-expandable-rows-demo',
  providers: [Inventory],
  templateUrl: 'expandable-rows.html',
  styleUrl: '../datagrid.demo.scss',
  imports: [
    CodeSnippetComponent,
    FormsModule,
    ClrCommonFormsModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrIfExpanded,
    StackblitzExampleComponent,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    DatePipe,
  ],
})
export class DatagridExpandableRowsDemo {
  examples = EXAMPLES;
  users: User[];
  commonFiles = CommonFiles;
  expandableRowComponentAddFiles = {
    ...CommonFiles.additionalFiles,
    'expandableRowComponent.ts': EXAMPLES.lazyLoadingDetailComponent,
  };

  detail = 'default';
  replace = false;

  dateFilter = new DateFilter();

  constructor(inventory: Inventory) {
    inventory.size = 10;
    inventory.reset();
    this.users = inventory.all;
  }
}
