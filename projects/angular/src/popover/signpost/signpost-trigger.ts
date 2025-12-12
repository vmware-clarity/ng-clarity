/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import { Directive, DOCUMENT, ElementRef, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';

import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { ClrPopoverService } from '../common/providers/popover.service';

@Directive({
  selector: '[clrSignpostTrigger]',
  host: {
    class: 'signpost-trigger',
    '[attr.aria-expanded]': 'ariaExpanded',
    '[attr.aria-controls]': 'ariaControl',
    '[class.active]': 'isOpen',
  },
  standalone: false,
})

/*********
 *
 * @description
 * A Directive added to the ClrSignpost Trigger button that will call the ClrSignpost.toggle() function to hide/show the
 * ClrSignpostContent.
 *
 */
export class ClrSignpostTrigger implements OnDestroy {
  ariaExpanded = false;
  ariaControl: string;
  isOpen: boolean;

  private document: Document;
  private subscriptions: Subscription[] = [];

  constructor(
    private popoverService: ClrPopoverService,
    private el: ElementRef<HTMLElement>,
    private signpostIdService: SignpostIdService,
    private signpostFocusManager: SignpostFocusManager,
    @Inject(DOCUMENT) document: any,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.document = document;
  }

  ngOnInit() {
    this.popoverService.anchorElementRef = this.el;
    this.signpostFocusManager.triggerEl = this.el.nativeElement;
    this.subscriptions.push(
      this.popoverService.openChange.subscribe((isOpen: boolean) => {
        this.ariaExpanded = isOpen;

        const prevIsOpen = this.isOpen;
        this.isOpen = isOpen;

        // openChange fires false on initialization because signpost starts as closed by default
        // but we shouldn't focus on that initial false value
        // we should focus back only if it's closed after being opened
        if (!this.isOpen && prevIsOpen) {
          this.focusOnClose();
        }
      }),
      this.signpostIdService.id.subscribe(idChange => (this.ariaControl = idChange))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**********
   *
   * @description
   * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
   */
  @HostListener('click', ['$event'])
  onSignpostTriggerClick(event: Event): void {
    this.popoverService.toggleWithEvent(event);
  }

  /**********
   *
   * @description
   * focus handler for the ClrSignpost trigger button used to focus ClrSignpostContent when Shift+Tab.
   */
  @HostListener('focus', ['$event'])
  onSignpostTriggerFocus(event: FocusEvent): void {
    // Step 1. Enter Signpost from outside.
    // Part 2. Use remembered Shift+Tab event to focus the content if visible.
    if (
      this.isOpen &&
      this.isShiftTabEvent(this.popoverService.lastKeydownEvent) &&
      event.relatedTarget === this.popoverService.lastKeydownEvent.target
    ) {
      event.preventDefault();
      this.signpostFocusManager.contentEl.setAttribute('tabindex', '0');
      this.signpostFocusManager.focusContent();

      // Delete the event after use for not to confuse future focuses.
      this.popoverService.lastKeydownEvent = null;
    }
  }

  private focusOnClose() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // we have to set the focus back on the trigger only if the focus is reset back to the body element
    // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
    if (!this.isOpen && this.document.activeElement === this.document.body) {
      this.signpostFocusManager.focusTrigger();
    }
  }

  private isShiftTabEvent(event: KeyboardEvent): boolean {
    return (
      event && event.key && normalizeKey(event.key) === Keys.Tab && hasModifierKey(event, 'shiftKey') && event.shiftKey
    );
  }
}
