/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Undocumented experimental feature: inline editing.
 */

import { Directive, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrStackView } from './stack-view';

@Directive()
export class StackControl implements OnDestroy {
  model: any;
  modelChange: EventEmitter<any> = new EventEmitter<any>(false);

  private subscription: Subscription;

  constructor(protected stackView: ClrStackView) {
    // Make the ClrStackView editable, since it contains a StackControl
    this.stackView.editable = true;
    this.subscription = this.stackView.editingChange.subscribe((editing: boolean) => {
      // Edit mode was closed
      if (!editing) {
        this.modelChange.emit(this.model);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
