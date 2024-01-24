/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Injectable } from '@angular/core';

// https://github.com/angular/angular/issues/20351#issuecomment-344009887
/** @dynamic */
@Injectable()
export class ClrPopoverEventsService {
  outsideClickClose = true;
  scrollToClose = true;
  anchorButtonRef: ElementRef;
  closeButtonRef: ElementRef;
  contentRef: ElementRef;

  setCloseFocus(): void {
    this.closeButtonRef.nativeElement.focus();
  }

  setAnchorFocus(): void {
    this.anchorButtonRef.nativeElement.focus();
  }
}
