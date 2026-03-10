/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Input } from '@angular/core';
import { ClrPopoverHostDirective, ClrPopoverPoint, ClrPopoverService } from '@clr/angular/popover/common';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostTrigger } from './signpost-trigger';

@Component({
  selector: 'clr-signpost',
  template: `
    @if (showDefaultTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `,
  host: { '[class.signpost]': 'true' },
  providers: [SignpostFocusManager, SignpostIdService],
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})

/*********
 *
 * @class ClrSignpost
 *
 * @description
 * Class used to configure and control the state of a ClrSignpost and its associated ClrSignpostContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
export class ClrSignpost {
  /**********
   * @property useCustomTrigger
   *
   * @description
   * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
   *
   */
  useCustomTrigger = false;

  @Input('clrSignpostTriggerAriaLabel') signpostTriggerAriaLabel: string;
  /**
   * Hides the default trigger button. Use when the signpost is opened
   * programmatically via `openAtPoint()` and no trigger icon is needed.
   */
  @Input('clrSignpostHideTrigger') hideTrigger = false;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService
  ) {}
  /**********
   * @property signPostTrigger
   *
   * @description
   * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
   *
   */
  @ContentChild(ClrSignpostTrigger)
  set customTrigger(trigger: ClrSignpostTrigger) {
    this.useCustomTrigger = !!trigger;
  }

  get showDefaultTrigger(): boolean {
    return !this.useCustomTrigger && !this.hideTrigger;
  }

  openAtPoint(point: ClrPopoverPoint, event?: Event) {
    this.popoverService.openAtPoint(point, event);
  }
}
