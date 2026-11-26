/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed, contentChild, Directive, OnDestroy, Optional, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ControlState, NO_CONTROL_STATE } from './control-state';
import { ClrControlError } from './control-subtexts/error';
import { ClrControlHelper } from './control-subtexts/helper';
import { ClrControlSuccess } from './control-subtexts/success';
import { CONTROL_STATE } from './if-control-state/control-state.enum';
import { ClrControlLabel } from './label';
import { ControlClassService } from './providers/control-class.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Directive()
export abstract class ClrAbstractContainer implements OnDestroy {
  controls: NgControl[] = [];

  protected subscriptions: Subscription[] = [];

  /**
   * The state of the first control, for templates. Updates on every control event.
   */
  protected readonly controlState = computed<ControlState>(() => this.ngControlService.states()[0] ?? NO_CONTROL_STATE);

  // Consumers could always assign these members. An assigned value wins over the query result.
  private readonly assignedLabel = signal<ClrControlLabel | undefined>(undefined);
  private readonly assignedSuccess = signal<ClrControlSuccess | undefined>(undefined);
  private readonly assignedError = signal<ClrControlError | undefined>(undefined);
  private readonly assignedHelper = signal<ClrControlHelper | undefined>(undefined);

  private readonly labelQuery = contentChild(ClrControlLabel);
  private readonly successQuery = contentChild(ClrControlSuccess);
  private readonly errorQuery = contentChild(ClrControlError);
  private readonly helperQuery = contentChild(ClrControlHelper);

  private readonly touched = computed(() => this.ngControlService.states().some(state => state.touched));

  private readonly state = computed(() => {
    const statuses = this.ngControlService.states().map(state => state.status);

    // These status values are mutually exclusive, so a control
    // cannot be both valid AND invalid or invalid AND disabled.
    // if else order is important!
    if (statuses.includes(CONTROL_STATE.INVALID)) {
      return CONTROL_STATE.INVALID;
    } else if (statuses.includes(CONTROL_STATE.VALID)) {
      return CONTROL_STATE.VALID;
    } else {
      return null;
    }
  });

  constructor(
    @Optional() protected layoutService: LayoutService,
    protected controlClassService: ControlClassService,
    protected ngControlService: NgControlService
  ) {
    this.subscriptions.push(
      ngControlService.controlsChanges.subscribe(controls => {
        this.controls = controls;
      })
    );

    ngControlService.container = this;
  }

  get label(): ClrControlLabel {
    return (this.assignedLabel() ?? this.labelQuery()) as ClrControlLabel;
  }
  set label(value: ClrControlLabel) {
    this.assignedLabel.set(value);
  }

  get controlSuccessComponent(): ClrControlSuccess {
    return (this.assignedSuccess() ?? this.successQuery()) as ClrControlSuccess;
  }
  set controlSuccessComponent(value: ClrControlSuccess) {
    this.assignedSuccess.set(value);
  }

  get controlErrorComponent(): ClrControlError {
    return (this.assignedError() ?? this.errorQuery()) as ClrControlError;
  }
  set controlErrorComponent(value: ClrControlError) {
    this.assignedError.set(value);
  }

  get controlHelperComponent(): ClrControlHelper {
    return (this.assignedHelper() ?? this.helperQuery()) as ClrControlHelper;
  }
  set controlHelperComponent(value: ClrControlHelper) {
    this.assignedHelper.set(value);
  }

  get control() {
    return this.controls[0];
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
    return this.touched() && this.state() === CONTROL_STATE.VALID && this.successMessagePresent;
  }

  get showInvalid(): boolean {
    return this.touched() && this.state() === CONTROL_STATE.INVALID && this.errorMessagePresent;
  }

  protected get successMessagePresent() {
    return !!this.controlSuccessComponent;
  }

  protected get errorMessagePresent() {
    return !!this.controlErrorComponent;
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
    const currentState = this.touched() ? this.state() : null;

    return this.controlClassService.controlClass(currentState, this.addGrid());
  }

  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }
}
