/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClarityModule, ClrPopoverService } from '@clr/angular';

import {
  ClrPopoverType,
  mapPopoverKeyToPosition,
} from '../../../projects/angular/src/popover/common/utils/popover-positions';

@Component({
  selector: 'storybook-popover',
  template: `<ng-container>
    <button class="btn" clrPopoverAnchor clrPopoverOpenCloseButton [attr.aria-owns]="popoverId">Origin</button>
    <div
      [id]="popoverId"
      role="dialog"
      cdkTrapFocus
      *clrPopoverContent="
        open;
        at: contentPosition;
        availablePositions: availablePositions;
        type: type;
        outsideClickToClose: outsideClickToClose;
        scrollToClose: scrollToClose
      "
      style="background-color: var(--cds-alias-object-container-background);
            border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
            border-radius: var(--cds-alias-object-border-radius-100);
            padding: var(--cds-global-space-4);
            box-shadow: var(--cds-alias-object-shadow-300);"
    >
      @if (showCloseButton) {
        <button class="btn btn-sm btn-link-neutral btn-icon" clrPopoverCloseButton>
          The close button
          <cds-icon shape="times"></cds-icon>
        </button>
        <br />
      }
      Overlay/Content <br />
      {{ contentPosition | json }}
    </div>
  </ng-container>`,
  providers: [ClrPopoverService],
  standalone: true,
  imports: [ClarityModule, JsonPipe, CdkTrapFocus],
})
export class StorybookPopoverComponent {
  popoverId = 'hello_world';

  @Input() open = true;
  @Input() outsideClickToClose = true;
  @Input() scrollToClose = false;
  @Input() showCloseButton = true;
  @Input() type = ClrPopoverType.DEFAULT;
  @Input() defaultPosition: string;
  @Input() signpostPosition: string;
  @Input() tooltipPosition: string;
  @Input() dropdownPosition: string;
  @Input() overlayX = '';
  @Input() overlayY = '';
  @Input() originX = '';
  @Input() originY = '';
  @Input() offsetX = 0;
  @Input() offsetY = 0;
  @Input() useConnectedPosition = false;
  @Input('scrollPositions') availablePositionKeys = [];

  get connectedPosition(): ConnectedPosition {
    return {
      overlayY: this.overlayY,
      overlayX: this.overlayX,
      originY: this.originY,
      originX: this.originX,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    } as ConnectedPosition;
  }

  get contentPosition(): string | ConnectedPosition {
    if (this.useConnectedPosition) {
      return this.connectedPosition;
    }

    return this.positionString;
  }

  get positionString(): string {
    return this.defaultPosition || this.dropdownPosition || this.signpostPosition || this.tooltipPosition;
  }

  get availablePositions() {
    const result = [];

    this.availablePositionKeys.forEach(position => {
      result.push(mapPopoverKeyToPosition(position, this.type));
    });

    return result;
  }
}
