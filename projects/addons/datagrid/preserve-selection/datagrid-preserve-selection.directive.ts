/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Host,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectionType } from '../interfaces/selection-type';

export interface PreselectableComponent {
  trackByGridItemProperty: string;
  trackByFunction: TrackByFunction<any>;
  selectionType: SelectionType;
  selectedItems: any[];
  serverDrivenDatagrid: boolean;
  gridItemsChange: EventEmitter<any[]>;
  /**
   * Handles datagrid selected items changes.
   */
  onSelectedItemsChange: (selectedItems: any[]) => void;
}

/**
 * The problem we want to solve with the common interface and the token below:
 * We don't want this directive to enumerate all its host components by type
 * because we don't want to import and thus depend on components which might
 * use the directive. To reverse the dependency, we use the token. Each
 * component which might host this directive should provide itself as the token.
 */
export const appfxPreselectableComponentToken = new InjectionToken<PreselectableComponent>(
  'PRESELECTABLE_COMPONENT_TOKEN'
);

/**
 * Preserves selection of datagrid and datagrid-detail by tracking whether some
 * grid item should be selected on the base of the a set "trackByGridItemProperty"
 * input of the datagrid or with the help of the "trackByFunction" function
 * input of the datagrid.
 *
 * After global refresh the data grid receives new items and the selection is lost
 * because the grid doesn't know how to recognize which of the new items are the old one
 * selected before global refresh. This directive tracks the selected items by property and
 * when the grid receives new data update the selected items array with the items from the
 * the new grid data.
 *
 * The server-side driven data grid doesn't receive all data. The directive in this case will
 * update only the items which can be found among the new grid items and leave
 * the old ones which it can't find in the selected grid items array. In this case, the component
 * which host the appfx datagrid has responsibility to remove the old selected items which are
 * not applicable for selection after grid data has been updated.
 *
 * How to use it
 *
 *  <appfx-datagrid [appfxPreserveSelection] ="'hostObjectId'" [gridItems]="gridItems" ....>
 *
 *  <appfx-datagrid appfxPreserveSelection [trackByGridItemProperty]="'hostObjectId'" [gridItems]="gridItems" ....>
 *
 *  <appfx-datagrid appfxPreserveSelection [trackByFunction]="<function>" [gridItems]="gridItems" ....>
 *
 * Where function receives as an argument datagrid item and returns unique identifier for it.
 */
@Directive({
  selector: '[appfxPreserveSelection]',
  standalone: false,
})
export class DatagridPreserveSelectionDirective implements AfterViewInit, OnDestroy {
  /**
   * preserveSelection - needed mainly because of list-view component and
   * indicates whether grid should preserve the selection based on 'trackByFunction' or
   * 'trackByGridItemProperty'.
   */
  @Input() preserveExistingSelection = true;

  @Output() selectedItemsUpdated = new EventEmitter<any[]>();

  private component: PreselectableComponent;

  private selectBy: string | TrackByFunction<any>;

  private gridItemChangeSub: Subscription;

  constructor(
    @Inject(appfxPreselectableComponentToken)
    @Host()
    public preselectableComponent: PreselectableComponent
  ) {
    this.component = preselectableComponent;
  }

  ngAfterViewInit(): void {
    if (this.preserveExistingSelection) {
      this.selectBy = this.component.trackByGridItemProperty || this.component.trackByFunction;
      if (!this.selectBy) {
        throw Error(
          'The "preserveSelection" directive is not initialized correctly. Provide "trackByFunction" or ' +
            ' "trackByGridItemProperty" of the appfx datagrid.'
        );
      }
      this.gridItemChangeSub = this.component.gridItemsChange.subscribe((items: any[]) => {
        if (this.component.selectionType !== SelectionType.None && this.component.selectedItems?.length > 0) {
          this.updateSelectedItems(items);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.gridItemChangeSub) {
      this.gridItemChangeSub.unsubscribe();
    }
  }

  updateSelectedItems(items: any[]): void {
    let selectedItems;
    if (this.component.serverDrivenDatagrid) {
      // TODO: Delete this when  https://github.com/vmware/clarity/issues/4903 is resolved.
      selectedItems = this.findAndUpdateSelectedItems(items);
    } else {
      // TODO: When  https://github.com/vmware/clarity/issues/4786 is resolved
      // check if selection works without this directive for client side
      // datagrid and delete this.
      selectedItems = this.findSelectedItems(items);
    }

    if (this.selectedItemsUpdated.observers.length > 0) {
      this.selectedItemsUpdated.emit(selectedItems);
    } else {
      this.component.selectedItems = selectedItems;
    }
  }

  private findSelectedItems(items: any[]): any[] {
    const selectedItemsDic = this.createSelectedItemsDictionary();
    return items.filter((item: any) => {
      const itemPropertyValue = this.getItemUniquePropertyValue(item);
      return selectedItemsDic.has(itemPropertyValue);
    });
  }

  private findAndUpdateSelectedItems(items: any[]): any[] {
    // We need to preserve the order of selected items due to strange implementation
    // of selection in the clarity datagrid
    const selectedItems: any[] = [];
    const selectedItemIndexByRef = new Map<string, any>();
    const selectedItemsDic = this.createSelectedItemsDictionary(selectedItems, selectedItemIndexByRef);

    items.forEach((item: any) => {
      const itemPropertyValue = this.getItemUniquePropertyValue(item);
      if (selectedItemsDic.has(itemPropertyValue)) {
        const index = selectedItemIndexByRef.get(itemPropertyValue);
        selectedItems[index] = item;
      }
    });
    return selectedItems;
  }

  private createSelectedItemsDictionary(
    selectedItems?: any[],
    selectedItemIndexByRef?: Map<string, any>
  ): Map<string, any> {
    const selectedItemsDic = new Map<string, any>();
    const storeItemsAndIndexes = selectedItems && selectedItemIndexByRef;
    this.component.selectedItems.forEach((item: any, index: number) => {
      const itemPropertyValue = this.getItemUniquePropertyValue(item);
      selectedItemsDic.set(itemPropertyValue, item);
      if (storeItemsAndIndexes) {
        selectedItems?.push(item);
        selectedItemIndexByRef?.set(itemPropertyValue, index);
      }
    });
    return selectedItemsDic;
  }

  private getItemUniquePropertyValue(item: any): string {
    if (typeof this.selectBy === 'function') {
      return (<any>this.selectBy)(0, item || {});
    }
    return item ? item[<any>this.selectBy] : '';
  }
}
