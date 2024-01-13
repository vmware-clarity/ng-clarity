/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
// WIP class on a more straightforward/external custom dropdown API for users.
@Component({
  selector: 'clr-custom-popover',
  template: ` <ng-template
    cdkConnectedOverlay
    [cdkConnectedOverlayOrigin]="anchorElement"
    [cdkConnectedOverlayOpen]="open"
    [cdkConnectedOverlayHasBackdrop]="hasBackdrop"
    [cdkConnectedOverlayBackdropClass]="hasBackdrop ? 'cdk-overlay-dark-backdrop' : 'cdk-overlay-transparent-backdrop'"
    (backdropClick)="backdropClick()"
    (detach)="detach()"
  >
    <div class="clr-custom-popover">
      <ng-content></ng-content>
    </div>
  </ng-template>`,
})
export class ClrCustomPopover {
  @Input() anchorElement: ElementRef = undefined;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Input() hasBackdrop = true;
  @Input() closeOnOutsideClick = true;

  backdropClick() {
    if (this.open && this.closeOnOutsideClick) {
      this.open = false;
      this.openChange.emit(this.open);
    }
  }

  detach() {
    if (this.open) {
      this.open = false;
      this.openChange.emit(this.open);
    }
  }
}
