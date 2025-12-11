/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { hasModifierKey } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrPopoverContent, ClrPopoverService } from '../common';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import {
  ClrPopoverPosition,
  ClrPopoverType,
  getConnectedPositions,
  SIGNPOST_POSITIONS,
} from '../common/utils/popover-positions';

@Component({
  selector: 'clr-signpost-content',
  template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: { '[class.signpost-content]': 'true', '[id]': 'signpostContentId' },
  standalone: false,
  hostDirectives: [ClrPopoverContent],
})
export class ClrSignpostContent implements OnDestroy, AfterViewInit {
  @Input('clrSignpostCloseAriaLabel') signpostCloseAriaLabel: string;
  @ViewChild('closeButton', { read: ElementRef }) closeButton: ElementRef<HTMLButtonElement>;

  signpostContentId = uniqueIdFactory();

  private document: Document;
  private _position = ClrPopoverPosition.RIGHT_MIDDLE;

  constructor(
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    private element: ElementRef,
    public commonStrings: ClrCommonStringsService,
    signpostIdService: SignpostIdService,
    private signpostFocusManager: SignpostFocusManager,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) document: any,
    private popoverService: ClrPopoverService
  ) {
    if (!parentHost) {
      throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
    }
    // Defaults
    signpostIdService.setId(this.signpostContentId);

    this.document = document;
    popoverService.panelClass.push('clr-signpost-container');
    popoverService.popoverType = ClrPopoverType.SIGNPOST;

    popoverService.availablePositions = getConnectedPositions(popoverService.popoverType);
  }

  /*********
   *
   * @description
   * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
   * - anchorPoint - where on the trigger to anchor the ClrSignpostContent
   * - popoverPoint - where on the ClrSignpostContent container to align with the anchorPoint
   * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
   * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
   * There are 12 possible positions to place a ClrSignpostContent container:
   * - top-left
   * - top-middle
   * - top-right
   * - right-top
   * - right-middle
   * - right-bottom
   * - bottom-right
   * - bottom-middle
   * - bottom-left
   * - left-bottom
   * - left-middle
   * - left-top
   *
   * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
   * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
   * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
   * linking the SignpostContent to the trigger points down at the horizontal center of the trigger icon.
   *
   * @param newPosition
   */
  @Input('clrPosition')
  get position() {
    return this._position;
  }
  set position(position: string | ClrPopoverPosition) {
    const posIndex = SIGNPOST_POSITIONS.indexOf(position as ClrPopoverPosition);
    this._position = position && posIndex > -1 ? SIGNPOST_POSITIONS[posIndex] : ClrPopoverPosition.RIGHT_MIDDLE;

    this.popoverService.position = this._position;
  }

  /*
   * Fallback to hide when *clrIfOpen is not being used
   */
  @HostBinding('class.is-off-screen')
  get isOffScreen() {
    return !this.popoverService.open;
  }

  /**********
   *
   * @description
   * Close function that uses the signpost instance to toggle the state of the content popover.
   *
   */
  close() {
    this.popoverService.open = false;
  }

  ngAfterViewInit(): void {
    this.popoverService.closeButtonRef = this.closeButton;

    if (!this.popoverService.overlayRef) {
      return;
    }

    this.popoverService.overlayRef.keydownEvents().subscribe(event => {
      if (event && event.key && normalizeKey(event.key) === Keys.Tab) {
        // GO back with Tab+Shift
        if (hasModifierKey(event) && event.shiftKey) {
          // move focus from close button to trigger. Step 3.
          if (event.target === this.popoverService.closeButtonRef.nativeElement) {
            event.preventDefault();
            this.popoverService.setOpenedButtonFocus();
          }

          // Move focus from content to close button. Step 2. Default behaviour (NO changes).
          // Enter Signpost from outside. Step 1
          // Part 1 Remember the event. Part 2 is in signpost trigger.
          else {
            this.popoverService.lastKeydownEvent = event;
          }

          return;
        }

        // GO forward with Tab
        // Enter Signpost from trigger element. Focusing the close button. Step 1
        if (event.target === this.popoverService.anchorElementRef.nativeElement) {
          event.preventDefault();

          this.popoverService.setCloseFocus();
        }
        // move focus from close button to content. Step 2. Default behaviour (NO changes).
        // move focus from content to trigger. Step 3.
        else if (
          event.target ===
          this.popoverService.contentRef.nativeElement.querySelector('.signpost-content-body[tabindex]')
        ) {
          this.popoverService.setOpenedButtonFocus();
        }
      }
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
      this.signpostFocusManager.focusTrigger();
    }
  }
}
