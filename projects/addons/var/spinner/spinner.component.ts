/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'appfx-spinner',
  standalone: false,
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss'],
})
export class SpinnerComponent {
  /**
   * String that should be announced
   */
  @Input() message: string;

  /**
   * Politeness when announcing, This could be 'polite', 'assertive' or 'off'
   * @default 'assertive'
   */
  @Input() politeness: 'assertive' | 'polite' | 'off' = 'assertive';

  /**
   * Modal content has its own container (the modal), so that overlay spinner is already within its scope.
   * Specify "false" for non-modal cases to contain the overlay spinner within desired scope and not whole page.
   * @default 'true'
   */
  @Input() isModal = true;

  /**
   * Optional message to be shown below the spinner. It can be used to
   * report progress details.
   */
  @Input() progressDetails: string;

  /**
   * Optional flag, when set to true an Action button will be rendered below the spinner and
   * the progress details text. For example, this can be used to render a "cancel" button
   * below the spinner.
   */
  @Input() showActionButton: boolean;

  /**
   * The label of the action button. Applicable only when showActionButton is set to True.
   */
  @Input() actionButtonLabel: string;

  /**
   * Emits when the action button is clicked.
   */
  @Output() actionClick: EventEmitter<void> = new EventEmitter();

  invokeAction(): void {
    this.actionClick.next();
  }
}
