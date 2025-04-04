/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { NgControlService } from '../providers/ng-control.service';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';

@Directive({
  selector: '[clrIfSuccess]',
})
export class ClrIfSuccess extends AbstractIfState {
  constructor(
    @Optional() ifControlStateService: IfControlStateService,
    @Optional() ngControlService: NgControlService,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    super(ifControlStateService, ngControlService);

    if (!ifControlStateService) {
      throw new Error('ClrIfSuccess can only be used within a form control container element like clr-input-container');
    }
  }

  /**
   * @param state CONTROL_STATE
   */
  protected override handleState(state: CONTROL_STATE) {
    const isValid = CONTROL_STATE.VALID === state;

    if (isValid && !this.displayedContent) {
      this.container.createEmbeddedView(this.template);
    } else if (!isValid && this.container) {
      this.container.clear();
    }
    this.displayedContent = isValid;
  }
}
