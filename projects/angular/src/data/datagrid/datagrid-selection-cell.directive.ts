/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener } from '@angular/core';

import { Selection } from './providers/selection';

@Directive({
  selector: '.datagrid-select',
})
export class ClrDatagridSelectionCellDirective {
  constructor(private readonly selection: Selection) {}

  @HostListener('click', ['$event'])
  private onSelectionCellClick(event: MouseEvent & { target: HTMLElement }) {
    // We want to effectively expand the selection click target to the entire selection cell.

    // If row selection is enabled, do nothing because the entire selection cell is already clickable.
    if (this.selection.rowSelectionMode) {
      return;
    }

    // If click was outside the label/input, forward the click to the input.
    if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT') {
      event.target.querySelector('input').click();
    }
  }
}
