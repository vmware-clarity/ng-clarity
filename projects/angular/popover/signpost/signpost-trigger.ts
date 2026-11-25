/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Directive, DOCUMENT, ElementRef, HostListener, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';

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
  private document: Document;
  private subscription: Subscription;

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

  get isOpen(): boolean {
    return this.popoverService.open;
  }

  get ariaExpanded(): boolean {
    return this.isOpen;
  }

  /**
   * The id of the signpost content, which the trigger controls.
   */
  get ariaControl(): string | undefined {
    return this.signpostIdService.id();
  }

  ngOnInit() {
    this.popoverService.origin = this.el;
    this.signpostFocusManager.triggerEl = this.el.nativeElement;
    // openChange only emits false when an open signpost closes.
    this.subscription = this.popoverService.openChange.pipe(filter(open => !open)).subscribe(() => this.focusOnClose());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
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

  private focusOnClose() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // we have to set the focus back on the trigger only if the focus is reset back to the body element
    // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
    if (this.document.activeElement === this.document.body) {
      this.signpostFocusManager.focusTrigger();
    }
  }
}
