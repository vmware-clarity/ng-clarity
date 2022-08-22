/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

import { ClrDatagrid } from './datagrid';

@Directive({
  selector: 'clr-datagrid[clrDgCtrlClickRowSelection]',
})
export class DatagridCtrlClickRowSelectionDirective implements OnInit {
  constructor(private readonly elementRef: ElementRef, private readonly datagrid: ClrDatagrid) {}

  ngOnInit() {
    this.datagrid.selected = [];
    this.datagrid.rowSelectionMode = true;
  }

  @HostListener('click', ['$event'])
  overrideSelection(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      !mouseEventIsSpecialKeyClick(event) &&
      !elementHasSelectionCellParent(target, this.elementRef.nativeElement) &&
      elementHasDatagridRowParent(target, this.elementRef.nativeElement)
    ) {
      this.datagrid.selected = [];
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
