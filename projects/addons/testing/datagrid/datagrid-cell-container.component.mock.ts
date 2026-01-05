/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

/**
 * Component for unit testing purposes to provide a template for rendering datagrid cell content.
 */
@Component({
  selector: 'appfx-dg-cell-container',
  standalone: false,
  template: `
    <ng-template [ngIf]="!column.columnRenderer" [ngIfElse]="cellContainer">{{ item?.[column.field] }}</ng-template>
    <ng-template #cellContainer></ng-template>
  `,
})
export class MockDatagridCellContainerComponent implements OnInit {
  @Input() column: any;

  @Input() item: any;

  @ViewChild('cellContainer', { read: ViewContainerRef, static: true }) protected container: ViewContainerRef;
  private componentRef: ComponentRef<any> | null;
  private instance: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    if (this.column.columnRenderer) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(this.column.columnRenderer);
      this.componentRef = this.container.createComponent(factory);
      this.instance = <any>this.componentRef?.instance;
      this.instance.item = this.item;
      this.instance.column = this.column;
    }
  }
}
