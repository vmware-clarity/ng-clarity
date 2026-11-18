/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrTimelineStepState } from '../enums/timeline-step-state.enum';
import { IconAttributes } from '../interface/icon-attribute.interface';

const STEP_ICONS: Record<ClrTimelineStepState, IconAttributes> = {
  [ClrTimelineStepState.NOT_STARTED]: { iconShape: 'circle', iconStatus: null, ariaLabelKey: 'timelineStepNotStarted' },
  [ClrTimelineStepState.CURRENT]: { iconShape: 'dot-circle', iconStatus: null, ariaLabelKey: 'timelineStepCurrent' },
  [ClrTimelineStepState.PROCESSING]: { iconShape: undefined, iconStatus: null, ariaLabelKey: 'timelineStepProcessing' },
  [ClrTimelineStepState.SUCCESS]: {
    iconShape: 'success-standard',
    iconStatus: 'success',
    ariaLabelKey: 'timelineStepSuccess',
  },
  [ClrTimelineStepState.ERROR]: {
    iconShape: 'error-standard',
    iconStatus: 'danger',
    ariaLabelKey: 'timelineStepError',
  },
};

@Injectable()
export class TimelineIconAttributeService {
  constructor(private commonStrings: ClrCommonStringsService) {}

  // Read the label on each call, so strings changed with `localize()` after the first render are used.
  getAriaLabel(step: ClrTimelineStepState): string {
    return this.commonStrings.keys[STEP_ICONS[step].ariaLabelKey];
  }

  getIconShape(step: ClrTimelineStepState): string {
    return STEP_ICONS[step].iconShape;
  }

  getIconStatus(step: ClrTimelineStepState): string {
    return STEP_ICONS[step].iconStatus;
  }
}
