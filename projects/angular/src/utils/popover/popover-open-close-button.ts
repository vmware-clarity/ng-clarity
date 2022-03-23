/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../destroy';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

@Directive({
  selector: '[clrPopoverOpenCloseButton]',
  host: {
    '[class.clr-smart-open-close]': 'true',
  },
  providers: [ClrDestroyService],
})
export class ClrPopoverOpenCloseButton {
  constructor(private smartOpenService: ClrPopoverToggleService, destroy$: ClrDestroyService) {
    this.smartOpenService.openChange.pipe(takeUntil(destroy$)).subscribe(change => {
      this.openCloseChange.next(change);
    });
  }

  @Output('clrPopoverOpenCloseChange') openCloseChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.smartOpenService.toggleWithEvent(event);
  }
}
