/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, EventEmitter, Output, HostListener, AfterViewInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../destroy';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';

@Directive({
  selector: '[clrPopoverCloseButton]',
  host: {
    '[class.clr-smart-close-button]': 'true',
  },
  providers: [ClrDestroyService],
})
export class ClrPopoverCloseButton implements AfterViewInit {
  constructor(
    private elementRef: ElementRef,
    private smartEventsService: ClrPopoverEventsService,
    private smartOpenService: ClrPopoverToggleService,
    destroy$: ClrDestroyService
  ) {
    smartOpenService.openChange
      .pipe(
        filter(value => !value),
        takeUntil(destroy$)
      )
      .subscribe(() => {
        this.closeChange.next();
      });
  }

  @Output('clrPopoverOnCloseChange') closeChange: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.smartOpenService.toggleWithEvent(event);
    this.smartEventsService.setAnchorFocus();
  }

  ngAfterViewInit() {
    this.smartEventsService.closeButtonRef = this.elementRef;
    this.smartEventsService.setCloseFocus();
  }
}
