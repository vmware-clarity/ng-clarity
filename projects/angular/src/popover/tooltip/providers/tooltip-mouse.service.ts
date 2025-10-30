/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrPopoverService } from '../../../utils';

@Injectable()
export class TooltipMouseService {
  hideIfMouseOutTimerInMS = 100;
  private mouseOverTrigger: boolean;
  private mouseOverContent: boolean;

  constructor(private readonly popoverService: ClrPopoverService) {}

  onMouseEnterTrigger() {
    this.mouseOverTrigger = true;
    this.popoverService.open = true;
  }

  onMouseLeaveTrigger() {
    this.mouseOverTrigger = false;
    this.hideIfMouseOut();
  }

  onMouseEnterContent() {
    this.mouseOverContent = true;
  }

  onMouseLeaveContent() {
    this.mouseOverContent = false;
    this.hideIfMouseOut();
  }

  private hideIfMouseOut() {
    // A zero timeout is used so that the code has a chance to update
    // the `mouseOverContent` property after the user moves the mouse from the trigger to the content.
    setTimeout(() => {
      if (!this.mouseOverTrigger && !this.mouseOverContent) {
        this.popoverService.open = false;
      }
    }, this.hideIfMouseOutTimerInMS);
  }
}
