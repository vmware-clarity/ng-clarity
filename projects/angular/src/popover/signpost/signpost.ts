/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostTrigger } from './signpost-trigger';

@Component({
  selector: 'clr-signpost',
  template: `
    <ng-container *ngIf="!useCustomTrigger">
      <button type="button" class="signpost-action btn btn-small btn-link" clrSignpostTrigger>
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    </ng-container>

    <ng-content></ng-content>
  `,
  host: { '[class.signpost]': 'true' },
  providers: [SignpostFocusManager, SignpostIdService],
  hostDirectives: [ClrPopoverHostDirective],
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
  constructor(public commonStrings: ClrCommonStringsService) {}

  /**********
   * @property useCustomTrigger
   *
   * @description
   * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
   *
   */
  useCustomTrigger = false;

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
}
