/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DetailService } from './providers/detail.service';

@Directive({
  selector: '[clrIfDetail]',
  standalone: false,
})
export class ClrIfDetail implements OnInit, OnDestroy {
  @Output('clrIfDetailChange') stateChange = new EventEmitter<any>(null);

  private subscriptions: Subscription[] = [];
  private skip = false; // This keeps us from resetting the input and calling the toggle twice
  private embeddedViewRef: EmbeddedViewRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private detailService: DetailService
  ) {
    detailService.enabled = true;
  }

  @Input('clrIfDetail')
  set state(model: any) {
    if (!this.skip) {
      this.detailService.toggle(model);
    }
    this.skip = false;
  }

  get viewContext() {
    return { $implicit: this.detailService.state };
  }

  ngOnInit() {
    this.subscriptions.push(
      this.detailService.stateChange.subscribe(state => {
        if (state === true) {
          this.togglePanel(true);
        } else {
          this.togglePanel(false);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private togglePanel(showPanel: boolean) {
    let stateChangeParams = null;

    if (showPanel === true) {
      if (!this.embeddedViewRef) {
        // Create a context forward `Proxy` that will always bind to the user-specified context,
        // without having to re-assign it whenever changes.
        const viewContext = this._createContextForwardProxy();
        this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, viewContext);
      }

      this.skip = true;
      stateChangeParams = this.detailService.state;
    } else {
      this.viewContainer.clear();
      this.embeddedViewRef = null;
    }

    this.stateChange.emit(stateChangeParams);
  }

  /**
   * For a given outlet instance, we create a proxy object that delegates
   * to the user-specified context. This allows changing, or swapping out
   * the context object completely without having to destroy/re-create the view.
   */
  private _createContextForwardProxy() {
    return new Proxy(
      {},
      {
        set: (_target, prop, newValue) => {
          if (!this.viewContext) {
            return false;
          }
          return Reflect.set(this.viewContext, prop, newValue);
        },
        get: (_target, prop, receiver) => {
          if (!this.viewContext) {
            return undefined;
          }
          return Reflect.get(this.viewContext, prop, receiver);
        },
      }
    );
  }
}
