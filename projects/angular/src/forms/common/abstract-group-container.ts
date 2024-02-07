/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, ContentChild, Directive, OnDestroy, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { ClrControlError } from './error';
import { ClrControlHelper } from './helper';
import { IfControlGroupStateService } from './if-control-state/if-control-group-state.service';
import { CONTROL_STATE } from './if-control-state/if-control-state.service';
import { ClrLabel } from './label';
import { ControlClassService } from './providers/control-class.service';
import { LayoutService } from './providers/layout.service';
import { NgControlGroupService } from './providers/ng-control-group.service';
import { ClrControlSuccess } from './success';

@Directive()
export abstract class ClrAbstractGroupContainer implements DynamicWrapper, OnDestroy, AfterContentInit {
  @ContentChild(ClrLabel, { static: false }) label: ClrLabel;
  @ContentChild(ClrControlSuccess) controlSuccessComponent: ClrControlSuccess;
  @ContentChild(ClrControlError) controlErrorComponent: ClrControlError;
  @ContentChild(ClrControlHelper) controlHelperComponent: ClrControlHelper;

  controls: NgControl[] = [];
  _dynamic = false;

  protected subscriptions: Subscription[] = [];

  private state: CONTROL_STATE;

  constructor(
    protected ifControlGroupStateService: IfControlGroupStateService,
    @Optional() protected layoutService: LayoutService,
    protected controlClassService: ControlClassService,
    protected ngControlGroupService: NgControlGroupService
  ) {
    this.subscriptions.push(
      this.ifControlGroupStateService.statusChanges.subscribe((state: CONTROL_STATE) => {
        this.state = state;
        this.updateHelpers();
      })
    );

    this.subscriptions.push(
      this.ngControlGroupService.controlChanges.subscribe(controls => {
        // TODO: Check for special cases
        this.controls = controls;
      })
    );
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

  get showValid(): boolean {
    return this.state === CONTROL_STATE.VALID && !!this.controlSuccessComponent;
    // return this.touched && this.state === CONTROL_STATE.VALID && !!this.controlSuccessComponent;
  }

  get showInvalid(): boolean {
    return this.state === CONTROL_STATE.INVALID && !!this.controlErrorComponent;
    // return this.touched && this.state === CONTROL_STATE.INVALID && !!this.controlErrorComponent;
  }

  private get touched() {
    const touchedControl = this.controls.find(control => {
      return control.control.touched || control.touched;
    });

    return !!touchedControl;
  }

  ngAfterContentInit() {
    /**
     * We gonna set the helper control state, after all or most of the components
     * are ready - also this will trigger some initial flows into wrappers and controls,
     * like locating IDs  and setting  attributes.
     */
    this.updateHelpers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  controlClass() {
    /**
     * Decide what subtext to display:
     *   - container is valid but no success component is implemented - use helper class
     *   - container is valid and success component is implemented - use success class
     */
    if ((!this.controlSuccessComponent && this.state === CONTROL_STATE.VALID) || !this.touched) {
      return this.controlClassService.controlClass(CONTROL_STATE.NONE, this.addGrid());
    }
    /**
     * Pass form control state and return string of classes to be applied to the container.
     */
    return this.controlClassService.controlClass(this.state, this.addGrid());
  }

  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }

  private updateHelpers() {
    // console.log('update helpers')
    if (this.ngControlGroupService) {
      this.ngControlGroupService.setHelpers({
        show: this.showInvalid || this.showHelper || this.showValid,
        showInvalid: this.showInvalid,
        showHelper: this.showHelper,
        showValid: this.showValid,
      });
    }
  }
}
