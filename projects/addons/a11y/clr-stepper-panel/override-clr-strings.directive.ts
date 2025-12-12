/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnInit } from '@angular/core';
import { ClrCommonStrings, ClrCommonStringsService, ClrStepperPanel } from '@clr/angular';

/**
 * This directive overrides strings used in ClrStepperPanel. It creates a copy of the strings, returned by
 * ClrCommonStringsService and does not modify the original resources.
 *
 * This directive relies on the following Clarity internals:
 * <code>
 * export class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
 *     public constructor(
 *        public commonStrings: ClrCommonStringsService,
 *        ...
 *     ) {}
 *     ...
 * }
 * </code>
 *
 * common-strings.default.ts:
 * <code>
 *   // Accordion/Stepper
 *   stepComplete: 'Step {STEP} complete',
 *   stepError: 'Error in step {STEP}',
 * </code>
 *
 * Usage:
 * <code>
 *    <clr-stepper-panel formGroupName="step0" [appfxOverrideClrStrings]="stepPanelOverriddenStrings">
 *    ...
 *    </clr-stepper-panel>
 *
 *    const stepPanelOverriddenStrings: Partial<ClrCommonStrings> = {
 *       success: "The step is successfully completed",
 *       danger: "The step is in serious danger",
 *    };
 * </code>
 */
@Directive({
  selector: 'clr-stepper-panel [appfxOverrideClrStrings]',
  standalone: false,
})
export class OverrideClrStringsDirective implements OnInit {
  @Input() appfxOverrideClrStrings: Partial<ClrCommonStrings> = {};

  constructor(
    private clrPanel: ClrStepperPanel,
    private clrCommonStringsService: ClrCommonStringsService
  ) {}

  ngOnInit(): void {
    const copiedStrings: ClrCommonStrings = Object.assign({}, this.clrCommonStringsService.keys);

    // TODO syuleymanovg: Remove this workaround after upgrading to Clarity 18.
    //
    // Clarity versions 16.4.0 and 17.1.0 introduced new `stepComplete` and `stepError` strings
    // to address accessibility (a11y) issues. Unfortunately, this change is a breaking change for AppFx.
    // For more details, see the related pull request: https://github.com/vmware-clarity/ng-clarity/pull/1334
    // If these strings are present, it indicates that the Clarity version is 16.4.0/17.1.0 or newer,
    // and no further string overriding is necessary.
    if (copiedStrings['stepComplete'] && copiedStrings['stepError']) {
      return;
    }

    const keys = Object.assign(copiedStrings, this.appfxOverrideClrStrings);
    this.clrPanel.commonStrings = <ClrCommonStringsService>{
      keys: keys,
    };
  }
}
