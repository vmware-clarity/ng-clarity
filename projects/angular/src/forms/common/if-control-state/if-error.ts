/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EmbeddedViewRef, Input, Optional, TemplateRef, ViewContainerRef } from '@angular/core';

import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import { NgControlService } from '../providers/ng-control.service';

@Directive({
  selector: '[clrIfError]',
  standalone: false,
})
export class ClrIfError extends AbstractIfState {
  @Input('clrIfError') error: string;

  private embeddedViewRef: EmbeddedViewRef<any>;

  constructor(
    @Optional() ifControlStateService: IfControlStateService,
    @Optional() ngControlService: NgControlService,
    private template: TemplateRef<any>,
    private container: ViewContainerRef
  ) {
    super(ifControlStateService, ngControlService);

    if (!this.ifControlStateService) {
      throw new Error('clrIfError can only be used within a form control container element like clr-input-container');
    }
  }
  /**
   * @param state CONTROL_STATE
   */
  protected override handleState(state: CONTROL_STATE) {
    if (this.error && this.control && this.control.invalid) {
      this.displayError(this.control.hasError(this.error));
    } else if (this.error && !!this.additionalControls?.length) {
      const invalidControl = this.additionalControls?.filter(control => control.hasError(this.error))[0];
      this.displayError(!!invalidControl, invalidControl);
    } else {
      this.displayError(CONTROL_STATE.INVALID === state);
    }
  }

  private displayError(invalid: boolean, control = this.control) {
    /* if no container do nothing */
    if (!this.container) {
      return;
    }
    if (invalid) {
      if (this.displayedContent === false) {
        this.embeddedViewRef = this.container.createEmbeddedView(this.template, {
          error: control.getError(this.error),
        });
        this.displayedContent = true;
      } else if (this.embeddedViewRef && this.embeddedViewRef.context) {
        // if view is already rendered, update the error object to keep it in sync
        this.embeddedViewRef.context.error = control.getError(this.error);
      }
    } else {
      this.container.clear();
      this.displayedContent = false;
    }
  }
}
