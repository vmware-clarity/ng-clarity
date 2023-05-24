/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgForOf, NgForOfContext } from '@angular/common';
import {
  Directive,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Items } from './providers/items';

@Directive({
  selector: '[clrDgItems][clrDgItemsOf]',
})
export class ClrDatagridItems<T> implements DoCheck, OnDestroy {
  private iterableProxy: NgForOf<T>;
  private _rawItems: T[];
  private differ: IterableDiffer<T> | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    public template: TemplateRef<NgForOfContext<T>>,
    private differs: IterableDiffers,
    private items: Items,
    private vcr: ViewContainerRef
  ) {
    items.smartenUp();
    this.iterableProxy = new NgForOf<T>(this.vcr, this.template, this.differs);
    this.subscriptions.push(
      items.change.subscribe(newItems => {
        this.iterableProxy.ngForOf = newItems;
        this.iterableProxy.ngDoCheck();
      })
    );
  }

  @Input('clrDgItemsOf')
  set rawItems(items: T[]) {
    this._rawItems = items ? items : []; // local copy for ngOnChange diffing
  }

  @Input('clrDgItemsTrackBy')
  set trackBy(value: TrackByFunction<T>) {
    this.items.iteratorTrackBy = value;
    this.iterableProxy.ngForTrackBy = value;
  }

  /**
   * Asserts the correct type of the template context that the directive will render.
   * See https://angular.io/guide/structural-directives#typing-the-directives-context
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T>(_dir: ClrDatagridItems<T>, _ctx: unknown): _ctx is NgForOfContext<T> {
    return true;
  }

  ngDoCheck() {
    if (!this.differ) {
      this.differ = this.differs.find(this._rawItems).create(this.iterableProxy.ngForTrackBy);
    }
    if (this.differ) {
      const changes = this.differ.diff(this._rawItems);
      if (changes) {
        // TODO: not very efficient right now,
        // but premature optimization is the root of all evil.
        this.items.all = this._rawItems;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
