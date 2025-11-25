/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChildren, Injector, OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { ClrSignpost } from '@clr/angular/src/popover/signpost';
import { HostWrapper } from '@clr/angular/src/utils';

import { WrappedCell } from './wrapped-cell';

@Component({
  selector: 'clr-dg-cell',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.datagrid-cell]': 'true',
    '[class.datagrid-signpost-trigger]': 'signpost.length > 0',
    role: 'gridcell',
  },
  standalone: false,
})
export class ClrDatagridCell implements OnInit {
  /*********
   * @property signpost
   *
   * @description
   * @ContentChild is used to detect the presence of a Signpost in the projected content.
   * On the host, we set the .datagrid-signpost-trigger class on the cell when signpost.length is greater than 0.
   *
   */
  @ContentChildren(ClrSignpost) signpost: QueryList<ClrSignpost>;

  private wrappedInjector: Injector;

  constructor(private vcr: ViewContainerRef) {}

  get _view() {
    return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
  }
}
