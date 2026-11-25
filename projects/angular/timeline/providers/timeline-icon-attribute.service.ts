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

@Injectable()
export class TimelineIconAttributeService {
  private attributeMap: Record<ClrTimelineStepState, IconAttributes>;

  constructor(commonStrings: ClrCommonStringsService) {
    this.attributeMap = {
      [ClrTimelineStepState.NOT_STARTED]: {
        iconShape: 'circle',
        iconStatus: null,
        ariaLabel: commonStrings.keys.timelineStepNotStarted,
      },
      [ClrTimelineStepState.CURRENT]: {
        iconShape: 'dot-circle',
        iconStatus: null,
        ariaLabel: commonStrings.keys.timelineStepCurrent,
      },
      [ClrTimelineStepState.PROCESSING]: {
        iconShape: undefined,
        iconStatus: null,
        ariaLabel: commonStrings.keys.timelineStepProcessing,
      },
      [ClrTimelineStepState.SUCCESS]: {
        iconShape: 'success-standard',
        iconStatus: 'success',
        ariaLabel: commonStrings.keys.timelineStepSuccess,
      },
      [ClrTimelineStepState.ERROR]: {
        iconShape: 'error-standard',
        iconStatus: 'danger',
        ariaLabel: commonStrings.keys.timelineStepError,
      },
    };
  }

  getAriaLabel(step: ClrTimelineStepState): string {
    return this.attributeMap[step].ariaLabel;
  }

  getIconShape(step: ClrTimelineStepState): string | undefined {
    return this.attributeMap[step].iconShape;
  }

  getIconStatus(step: ClrTimelineStepState): string | null {
    return this.attributeMap[step].iconStatus;
  }
}
