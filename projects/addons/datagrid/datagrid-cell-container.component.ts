/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ColumnDefinition, ColumnRenderer } from './shared/column/column-definitions';

@Component({
  selector: 'appfx-dg-cell-container',
  standalone: false,
  template: `
    <ng-template [ngIf]="!column.columnRenderer" [ngIfElse]="cellContainer">
      <span [title]="item?.[column.field]">{{ item?.[column.field] }}</span>
    </ng-template>
    <ng-template #cellContainer></ng-template>
  `,
  styles: [':host { width: 100%; }'],
})
export class DatagridCellContainerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('cellContainer', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  @Input() column: ColumnDefinition<any>;

  @Input() item: any;

  private componentRef: ComponentRef<any> | null;
  private instance: ColumnRenderer<any> | null;

  ngOnChanges(): void {
    if (this.instance && typeof this.instance.onChange === 'function') {
      this.instance.onChange(this.item || {}, this.column);
    }
  }

  ngOnInit(): void {
    if (this.column.columnRenderer) {
      this.componentRef = this.container.createComponent(this.column.columnRenderer);
      this.instance = <ColumnRenderer<any>>this.componentRef?.instance;
      this.instance.item = this.item || {};
      this.instance.column = this.column;
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.instance = null;
      this.componentRef = null;
    }
  }
}
