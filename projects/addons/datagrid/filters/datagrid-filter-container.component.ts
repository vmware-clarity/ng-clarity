/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ClrDatagridFilter } from '@clr/angular';
import { Subscription } from 'rxjs';

import { ColumnFilter } from '../interfaces/column-filter';

/**
 * A component that acts as a container for custom column filters.
 * It creates an instance of the specified filter component and manages its lifecycle.
 */
@Component({
  selector: 'appfx-dg-filter-container',
  standalone: false,
  template: ` <ng-template #filterContainer></ng-template>`,
})
export class DatagridFilterContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('filterContainer', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  /**
   * The filter component to be created.
   */
  @Input() filterType: Type<any>;

  /**
   * The initial value for the filter.
   */
  @Input() filterValue: any;

  /**
   * Event emitter to notify the hosting view about changes in the filter value.
   */
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter<any>();

  private componentRef: ComponentRef<any> | null;
  private filter: ColumnFilter<any>;
  private filterChangeSub: Subscription | null;

  constructor(private filterContainer: ClrDatagridFilter) {}

  ngAfterViewInit() {
    if (this.filterType) {
      this.componentRef = this.container.createComponent(this.filterType);
      this.filter = <ColumnFilter<any>>this.componentRef.instance;
      this.filter.filterValue = this.filterValue;
      this.filterChangeSub = this.filter.changes.subscribe((value: any) => {
        this.filterValueChange.emit(value);
      });
      this.filterContainer.setFilter(this.filter);
    }
  }

  ngOnDestroy() {
    if (this.filterChangeSub) {
      this.filterChangeSub.unsubscribe();
      this.filterChangeSub = null;
    }

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
