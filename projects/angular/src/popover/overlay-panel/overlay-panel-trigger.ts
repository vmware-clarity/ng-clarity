/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { OverlayPanelFocusManager } from './providers/overlay-panel-focus-manager.service';
import { OverlayPanelIdService } from './providers/overlay-panel-id.service';

@Directive({
  selector: '[clrOverlayPanelTrigger]',
  host: {
    class: 'overlay-panel-trigger',
    '[attr.aria-expanded]': 'ariaExpanded',
    '[attr.aria-controls]': 'ariaControl',
    '[class.active]': 'isOpen',
  },
})

/*********
 *
 * @description
 * A Directive added to the ClrOverlayPanel Trigger button that will call the ClrOverlayPanel.toggle() function to hide/show the
 * ClrOverlayPanelContent.
 *
 */
export class ClrOverlayPanelTrigger implements OnDestroy {
  ariaExpanded = false;
  ariaControl: string;
  isOpen: boolean;

  private document: Document;
  private subscriptions: Subscription[] = [];

  constructor(
    private popoverService: ClrPopoverService,
    private el: ElementRef,
    private overlayPanelIdService: OverlayPanelIdService,
    private overlayPanelFocusManager: OverlayPanelFocusManager,
    @Inject(DOCUMENT) document: any,
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone
  ) {
    this.document = document;
  }

  ngOnInit() {
    this.popoverService.anchorElementRef = this.el;
    this.overlayPanelFocusManager.triggerEl = this.el.nativeElement;
    this.subscriptions.push(
      this.popoverService.openChange.subscribe((isOpen: boolean) => {
        this.ariaExpanded = isOpen;

        const prevIsOpen = this.isOpen;
        this.isOpen = isOpen;

        // openChange fires false on initialization because overlayPanel starts as closed by default
        // but we shouldn't focus on that initial false value
        // we should focus back only if it's closed after being opened
        if (!this.isOpen && prevIsOpen) {
          this.focusOnClose();
        }
      }),
      this.overlayPanelIdService.id.subscribe(idChange => (this.ariaControl = idChange))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**********
   *
   * @description
   * click handler for the ClrOverlayPanel trigger button used to hide/show ClrOverlayPanelContent.
   */
  @HostListener('click', ['$event'])
  onOverlayPanelTriggerClick(event: Event): void {
    this.popoverService.toggleWithEvent(event);
  }

  private focusOnClose() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // we have to set the focus back on the trigger only if the focus is reset back to the body element
    // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
    if (!this.isOpen && this.document.activeElement === this.document.body) {
      this.overlayPanelFocusManager.focusTrigger();
    }
  }
}
