/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';

@Injectable()
export class TooltipMouseService {
  private mouseOverTrigger: boolean;
  private mouseOverContent: boolean;

  constructor(private readonly toggleService: ClrPopoverToggleService) {}

  onMouseEnterTrigger() {
    this.mouseOverTrigger = true;
    this.toggleService.open = true;
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
        this.toggleService.open = false;
      }
    }, 0);
  }
}
