/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ClrLoading } from '@clr/angular';

import { User } from '../inventory/user';

@Component({
  selector: 'clr-datagrid-expandable-row',
  template: `
    <div cds-layout="m:sm">{{ user | json }}</div>
  `,
  providers: [ClrLoading],
  imports: [JsonPipe],
})
export class ExpandableRow implements OnInit {
  @Input() user: User | undefined;

  constructor(private loading: ClrLoading) {}

  ngOnInit() {
    // Mimic a server call that loads the details of the row once it is expanded.
    this.loading.loadingState = true;
    setTimeout(() => {
      this.loading.loadingState = false;
    }, 1000);
  }
}
