/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ClrAlignment, ClrAxis, ClrPopoverService, ClrSide } from '@clr/angular';

import { ClrPopoverPositions } from '../../../projects/angular/src/utils/popover/enums/positions.enum';

@Component({
  selector: 'example-popover',
  template: ` <ng-container>
    <button
      class="btn"
      clrPopoverOpenCloseButton
      role="button"
      type="button"
      [attr.aria-owns]="popoverId"
      clrPopoverAnchor
    >
      Anchor ({{ _positionKey }})
    </button>
    <div
      [id]="popoverId"
      role="dialog"
      cdkTrapFocus
      *clrPopoverContent="_openState; at: _contentPosition; outsideClickToClose: true; scrollToClose: false"
      style="background-color: var(--cds-alias-object-container-background);
            border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
            border-radius: var(--cds-alias-object-border-radius-100);
            padding: var(--cds-global-space-4);
            margin: var(--cds-global-space-3);
            box-shadow: var(--cds-alias-object-shadow-300);"
    >
      Popover content {{ _positionKey }}
    </div>
  </ng-container>`,
  providers: [ClrPopoverService],
  standalone: true,
})
export class ExamplePopoverComponent {
  popoverId = 'hello_world';

  _openState = true;

  _contentPosition = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.CENTER,
    content: ClrAlignment.END,
  };
  _positionKey = 'top-left';

  @Input('open')
  set openState(open: boolean) {
    this._openState = open;
  }

  @Input('popoverPosition')
  set contentPosition(pos: string) {
    this._positionKey = pos;
    this._contentPosition = ClrPopoverPositions[pos];
  }
}
