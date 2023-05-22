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
import { CONTROL_STATE, IfControlStateService } from './if-control-state/if-control-state.service';
import { ClrLabel } from './label';
import { ControlClassService } from './providers/control-class.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';
import { ClrControlSuccess } from './success';

@Directive()
export abstract class ClrAbstractContainer implements DynamicWrapper, OnDestroy, AfterContentInit {
  @ContentChild(ClrLabel, { static: false }) label: ClrLabel;
  @ContentChild(ClrControlSuccess) controlSuccessComponent: ClrControlSuccess;
  @ContentChild(ClrControlError) controlErrorComponent: ClrControlError;
  @ContentChild(ClrControlHelper) controlHelperComponent: ClrControlHelper;

  control: NgControl;
  _dynamic = false;

  protected subscriptions: Subscription[] = [];

  private state: CONTROL_STATE;

  constructor(
    protected ifControlStateService: IfControlStateService,
    @Optional() protected layoutService: LayoutService,
    protected controlClassService: ControlClassService,
    protected ngControlService: NgControlService
  ) {
    this.subscriptions.push(
      this.ifControlStateService.statusChanges.subscribe((state: CONTROL_STATE) => {
        this.state = state;
        this.updateHelpers();
      })
    );

    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  /**
   * @NOTE
   * Helper control is a bit different than the others, it must be visible most of the time:
   *   - Helper must NOT be visible when CONTROL_STATE is not NONE and Success or Error components are \
   * defined.
   *
   * For example user implement only Error control then if CONTROL_STATE is VALID then helper
   * control must be visible.
   */
  get showHelper(): boolean {
    // without existence of helper component there is no need of additional checks.
    if (!!this.controlHelperComponent === false) {
      return false;
    }

    return (
      /* Helper Component exist and the state of the form is NONE (not touched) */
      (!!this.controlHelperComponent && (!this.touched || this.state === CONTROL_STATE.NONE)) ||
      /* or there is no success component but the state of the form is VALID - show helper information */
      (!!this.controlSuccessComponent === false && this.state === CONTROL_STATE.VALID) ||
      /* or there is no error component but the state of the form is INVALID - show helper information */
      (!!this.controlErrorComponent === false && this.state === CONTROL_STATE.INVALID)
    );
  }

  get showValid(): boolean {
    return this.touched && this.state === CONTROL_STATE.VALID && !!this.controlSuccessComponent;
  }

  get showInvalid(): boolean {
    return this.touched && this.state === CONTROL_STATE.INVALID && !!this.controlErrorComponent;
  }

  private get touched() {
    return this.control?.touched;
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
    if (this.ngControlService) {
      this.ngControlService.setHelpers({
        show: this.showInvalid || this.showHelper || this.showValid,
        showInvalid: this.showInvalid,
        showHelper: this.showHelper,
        showValid: this.showValid,
      });
    }
  }
}
