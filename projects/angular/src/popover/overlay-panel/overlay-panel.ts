/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrOverlayPanelTrigger } from './overlay-panel-trigger';
import { OverlayPanelFocusManager } from './providers/overlay-panel-focus-manager.service';
import { OverlayPanelIdService } from './providers/overlay-panel-id.service';

@Component({
  selector: 'clr-overlay-panel',
  template: `
    <ng-container *ngIf="!useCustomTrigger">
      <button
        type="button"
        class="overlay-panel-action btn btn-sm btn-icon btn-link"
        clrOverlayPanelTrigger
        [attr.aria-label]="commonStrings.keys.overlayPanelToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    </ng-container>

    <ng-content></ng-content>
  `,
  host: { '[class.overlay-panel]': 'true' },
  providers: [OverlayPanelFocusManager, OverlayPanelIdService],
  hostDirectives: [ClrPopoverHostDirective],
})

/*********
 *
 * @class ClrOverlayPanel
 *
 * @description
 * Class used to configure and control the state of a ClrOverlayPanel and its associated ClrOverlayPanelContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
export class ClrOverlayPanel {
  /**********
   * @property useCustomTrigger
   *
   * @description
   * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
   *
   */
  useCustomTrigger = false;

  constructor(public commonStrings: ClrCommonStringsService) {}

  /**********
   * @property overlayPanelTrigger
   *
   * @description
   * Uses ContentChild to check for a user supplied element with the ClrOverlayPanelTrigger on it.
   *
   */
  @ContentChild(ClrOverlayPanelTrigger)
  set customTrigger(trigger: ClrOverlayPanelTrigger) {
    this.useCustomTrigger = !!trigger;
  }
}
