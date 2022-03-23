/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Undocumented experimental feature: inline editing.
 */

import { Directive, EventEmitter } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrStackView } from './stack-view';
import { ClrDestroyService } from '../../utils/destroy';

@Directive()
export class StackControl {
  model: any;
  modelChange: EventEmitter<any> = new EventEmitter<any>(false);

  constructor(protected stackView: ClrStackView, destroy$: ClrDestroyService) {
    // Make the ClrStackView editable, since it contains a StackControl
    this.stackView.editable = true;

    this.stackView.editingChange.pipe(takeUntil(destroy$)).subscribe((editing: boolean) => {
      // Edit mode was closed
      if (!editing) {
        this.modelChange.emit(this.model);
      }
    });
  }
}
