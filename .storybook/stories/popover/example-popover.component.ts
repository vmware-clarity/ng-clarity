/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ClrAlignment, ClrAxis, ClrPopoverEventsService, ClrPopoverToggleService, ClrSide } from '@clr/angular';

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
      Anchor
    </button>
    <div
      [id]="popoverId"
      role="dialog"
      cdkTrapFocus
      *clrPopoverContent="_openState; at: _contentPosition; outsideClickToClose: true; scrollToClose: false"
      style="background-color: white; border: 1px solid black; border-radius: 4px; padding: 5px"
    >
      Popover content {{ _positionKey }}
    </div>
  </ng-container>`,
  providers: [ClrPopoverEventsService, ClrPopoverToggleService],
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
