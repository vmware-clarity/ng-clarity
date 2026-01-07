/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrPopoverContent, ClrPopoverService } from '../common';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrPopoverPosition, ClrPopoverType, SIGNPOST_POSITIONS } from '../common/utils/popover-positions';

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
  host: {
    '[class.signpost-content]': 'true',
    '[id]': 'signpostContentId',
    role: 'dialog',
  },
  standalone: false,
  hostDirectives: [ClrPopoverContent],
})
export class ClrSignpostContent implements OnDestroy, AfterViewInit {
  @Input('clrSignpostCloseAriaLabel') signpostCloseAriaLabel: string;
  @ViewChild('closeButton', { read: ElementRef }) closeButton: ElementRef<HTMLButtonElement>;

  signpostContentId = uniqueIdFactory();

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
    @Inject(DOCUMENT) private document: Document,
    private popoverService: ClrPopoverService,
    private popoverContent: ClrPopoverContent
  ) {
    if (!parentHost) {
      throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
    }
    // Defaults
    signpostIdService.setId(this.signpostContentId);

    popoverService.panelClass.push('clr-signpost-container');
    popoverContent.contentType = ClrPopoverType.SIGNPOST;
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

    this.popoverContent.contentAt = this._position;
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
    this.closeButton.nativeElement.focus();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      const focusableElements = this.getFocusableElements(this.element.nativeElement);

      // take the first element when SHIFT+TAB or last when only TAB
      const focusableElementIndex = event.shiftKey ? 0 : focusableElements.length - 1;

      if (document.activeElement === focusableElements[focusableElementIndex]) {
        event.preventDefault();
        this.popoverService.open = false;
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
      this.signpostFocusManager.focusTrigger();
    }
  }

  private getFocusableElements(element: HTMLElement): HTMLElement[] {
    return Array.from(
      element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ) as HTMLElement[];
  }
}
