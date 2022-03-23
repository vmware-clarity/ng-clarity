/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, Input, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { DetailService } from './providers/detail.service';

@Directive({
  selector: '[clrIfDetail]',
  providers: [ClrDestroyService],
})
export class ClrIfDetail implements OnInit {
  private skip = false; // This keeps us from resetting the input and calling the toggle twice

  @Input('clrIfDetail')
  set state(model: any) {
    if (!this.skip) {
      this.detailService.toggle(model);
    }
    this.skip = false;
  }

  @Output('clrIfDetailChange') public stateChange = new EventEmitter<any>(null);

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private detailService: DetailService,
    private destroy$: ClrDestroyService
  ) {
    this.detailService.enabled = true;
  }

  ngOnInit() {
    this.detailService.stateChange.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state === true) {
        this.togglePanel(true);
      } else {
        this.togglePanel(false);
      }
    });
  }

  private togglePanel(showPanel: boolean) {
    let stateChangeParams = null;
    this.viewContainer.clear();
    if (showPanel === true) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: this.detailService.state });
      this.skip = true;
      stateChangeParams = this.detailService.state;
    }

    this.stateChange.emit(stateChangeParams);
  }
}
