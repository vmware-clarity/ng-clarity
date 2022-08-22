/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnInit,
  Optional,
  Provider,
} from '@angular/core';

import { ClrDatagrid } from './datagrid';
import { SelectionType } from './enums/selection-type';

export const DATAGRID_CTRL_CLICK_ROW_SELECTION = new InjectionToken<boolean>('DATAGRID_CTRL_CLICK_ROW_SELECTION');

export const enableDatagridCtrlClickRowSelectionProvider: Provider = {
  provide: DATAGRID_CTRL_CLICK_ROW_SELECTION,
  useValue: true,
};

@Directive({
  selector: 'clr-datagrid',
})
export class DatagridCtrlClickRowSelectionDirective implements OnInit {
  @Input('clrDgCtrlClickRowSelection') enabledLocally: boolean;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly datagrid: ClrDatagrid,
    @Optional() @Inject(DATAGRID_CTRL_CLICK_ROW_SELECTION) private readonly enabledGlobally
  ) {}

  ngOnInit() {
    if (this.enabledLocally) {
      this.datagrid.selected = [];
      this.datagrid.rowSelectionMode = true;
    }
  }

  @HostListener('click', ['$event'])
  overrideSelection(event: MouseEvent) {
    if (!this.enabled()) {
      return;
    }

    const target = event.target as HTMLElement;

    if (
      !mouseEventIsSpecialKeyClick(event) &&
      !elementHasSelectionCellParent(target, this.elementRef.nativeElement) &&
      elementHasDatagridRowParent(target, this.elementRef.nativeElement)
    ) {
      this.datagrid.selected = [];
    }
  }

  private enabled() {
    if (this.enabledLocally) {
      return true;
    } else if (this.enabledGlobally) {
      const disabledLocally = this.enabledLocally === false;

      const multiRowSelectionEnabled =
        this.datagrid.selection.selectionType === SelectionType.Multi && this.datagrid.selection.rowSelectionMode;

      return !disabledLocally && multiRowSelectionEnabled;
    } else {
      return false;
    }
  }
}

function mouseEventIsSpecialKeyClick(event: MouseEvent) {
  return event.shiftKey || event.ctrlKey || event.metaKey;
}

function elementHasSelectionCellParent(element: HTMLElement | null, maxParent: HTMLElement) {
  return maxParent.contains(element?.closest('.datagrid-select') || null);
}

function elementHasDatagridRowParent(element: HTMLElement | null, maxParent: HTMLElement) {
  return maxParent.contains(element?.closest('clr-dg-row') || null);
}
