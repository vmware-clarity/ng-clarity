/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ContentChild, Directive, OnDestroy, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ClrControlError } from './error';
import { ClrControlHelper } from './helper';
import { CONTROL_STATE } from './if-control-state/control-state.enum';
import { ClrControlLabel } from './label';
import { ControlClassService } from './providers/control-class.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';
import { ClrControlSuccess } from './success';

@Directive()
export abstract class ClrAbstractContainer implements OnDestroy {
  @ContentChild(ClrControlLabel, { static: false }) label: ClrControlLabel;
  @ContentChild(ClrControlSuccess) controlSuccessComponent: ClrControlSuccess;
  @ContentChild(ClrControlError) controlErrorComponent: ClrControlError;
  @ContentChild(ClrControlHelper) controlHelperComponent: ClrControlHelper;

  control: NgControl;
  additionalControls: NgControl[] = [];

  protected subscriptions: Subscription[] = [];

  constructor(
    @Optional() protected layoutService: LayoutService,
    protected controlClassService: ControlClassService,
    protected ngControlService: NgControlService
  ) {
    this.subscriptions.push(
      ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      }),
      ngControlService.additionalControlsChanges.subscribe(controls => {
        this.additionalControls = controls;
      })
    );

    ngControlService.container = this;
  }

  /**
   * @NOTE
   * Helper control is a bit different than the others, it must be always visible:
   *   -  Labels and instructions must always accompany forms and are persistent.
   *   -  The recommendation here is to always have helper text or anything instructions visible.
   *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
   */
  get showHelper(): boolean {
    /**
     * @NOTE
     * Saving the previous version in case something is changed. We'll return always true so we can be flexible
     * and keep the condition per components.
     *
     * return (
     * Helper Component exist and the state of the form is NONE (not touched)
     * (!!this.controlHelperComponent && (!this.touched || this.state === CONTROL_STATE.NONE)) ||
     * or there is no success component but the state of the form is VALID - show helper information
     * (!!this.controlSuccessComponent === false && this.state === CONTROL_STATE.VALID) ||
     * or there is no error component but the state of the form is INVALID - show helper information
     * (!!this.controlErrorComponent === false && this.state === CONTROL_STATE.INVALID)
     * );
     */
    return Boolean(this.controlHelperComponent);
  }

  /**
   * We gonna set the helper control state, after all or most of the components
   * are ready - also this will trigger some initial flows into wrappers and controls,
   * like locating IDs  and setting  attributes.
   */
  get helpers() {
    return {
      show: this.showInvalid || this.showHelper || this.showValid,
      showInvalid: this.showInvalid,
      showHelper: this.showHelper,
      showValid: this.showValid,
    };
  }

  get showValid(): boolean {
    return this.touched && this.state === CONTROL_STATE.VALID && this.successMessagePresent;
  }

  get showInvalid(): boolean {
    return this.touched && this.state === CONTROL_STATE.INVALID && this.errorMessagePresent;
  }

  protected get successMessagePresent() {
    return !!this.controlSuccessComponent;
  }

  protected get errorMessagePresent() {
    return !!this.controlErrorComponent;
  }

  private get touched() {
    return !!(this.control?.touched || this.additionalControls?.some(control => control.touched));
  }

  private get state() {
    const controlStatuses = [this.control, ...this.additionalControls].map((control: NgControl) => {
      return control.status;
    });

    // These status values are mutually exclusive, so a control
    // cannot be both valid AND invalid or invalid AND disabled.
    // if else order is important!
    if (controlStatuses.includes(CONTROL_STATE.INVALID)) {
      return CONTROL_STATE.INVALID;
    } else if (controlStatuses.includes(CONTROL_STATE.VALID)) {
      return CONTROL_STATE.VALID;
    } else {
      return CONTROL_STATE.INVALID;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  controlClass() {
    /**
     * Decide what subtext to display:
     *   - container is valid but no success component is implemented - use helper class
     *   - container is valid and success component is implemented - use success class
     *   - Pass form control state and return string of classes to be applied to the container.
     */
    const currentState = this.touched ? this.state : null;

    return this.controlClassService.controlClass(currentState, this.addGrid());
  }

  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }
}
