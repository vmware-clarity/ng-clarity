/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostBinding, Inject, Input, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-overlay-panel-position.enum';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
// import { AbstractPopover } from '../common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { OverlayPanelFocusManager } from './providers/overlay-panel-focus-manager.service';
import { OverlayPanelIdService } from './providers/overlay-panel-id.service';
// import { OVERLAY_PANEL_POSITIONS } from './overlay-panel-positions';

// aka where the arrow / pointer is at in relation to the anchor
const POSITIONS: string[] = [
  'top-left',
  'top-middle',
  'top-right',
  'right-top',
  'right-middle', // default
  'right-bottom',
  'bottom-right',
  'bottom-middle',
  'bottom-left',
  'left-bottom',
  'left-middle',
  'left-top',
];

const AvailablePopoverPositions = [
  ClrCDKPopoverPositions.bottom,
  ClrCDKPopoverPositions['bottom-left'],
  ClrCDKPopoverPositions['bottom-middle'],
  ClrCDKPopoverPositions['bottom-right'],
  ClrCDKPopoverPositions.left,
  ClrCDKPopoverPositions['left-bottom'],
  ClrCDKPopoverPositions['left-middle'],
  ClrCDKPopoverPositions['left-top'],
  ClrCDKPopoverPositions['middle-bottom'],
  ClrCDKPopoverPositions['middle-left'],
  ClrCDKPopoverPositions['middle-right'],
  ClrCDKPopoverPositions.right,
  ClrCDKPopoverPositions['right-bottom'],
  ClrCDKPopoverPositions['right-middle'],
  ClrCDKPopoverPositions['right-top'],
  ClrCDKPopoverPositions.top,
  ClrCDKPopoverPositions['top-left'],
  ClrCDKPopoverPositions['top-middle'],
  ClrCDKPopoverPositions['top-right'],
];

@Component({
  selector: 'clr-overlay-panel-content',
  template: `
    <div
      class="overlay-panel-wrap"
      [style.min-width]="minWidth"
      [style.min-height]="minHeight"
      [style.max-width]="maxWidth"
      [style.max-height]="maxHeight"
    >
      <div class="popover-pointer"></div>
      <div class="overlay-panel-content-header">
        <button
          type="button"
          [attr.aria-label]="commonStrings.keys.overlayPanelClose"
          class="overlay-panel-action close"
          (click)="close()"
          [attr.aria-controls]="overlayPanelContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="overlay-panel-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  host: { '[class.overlay-panel-content]': 'true', '[id]': 'overlayPanelContentId' },
})
export class ClrOverlayPanelContent implements OnDestroy {
  overlayPanelContentId = uniqueIdFactory();

  @Input('minWidth') minWidth: string;
  @Input('minHeight') minHeight: string;
  @Input('maxWidth') maxWidth: string;
  @Input('maxHeight') maxHeight: string;

  private document: Document;
  private _position: string;

  constructor(
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef,
    private element: ElementRef,
    public commonStrings: ClrCommonStringsService,
    private overlayPanelIdService: OverlayPanelIdService,
    private overlayPanelFocusManager: OverlayPanelFocusManager,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) document: any,
    private popoverService: ClrPopoverService
  ) {
    // super(injector, parentHost);
    if (!parentHost) {
      throw new Error('clr-overlayPanel-content should only be used inside of a clr-overlayPanel');
    }
    // Defaults
    this.position = 'right-middle';
    this.popoverService.outsideClickClose = true;
    this.overlayPanelIdService.setId(this.overlayPanelContentId);

    this.document = document;
    this.popoverService.contentRef = this.element;
    this.popoverService.panelClass = 'clr-overlay-panel-container';
    this.popoverService.popoverPositions = ClrCDKPopoverPositions;
    this.popoverService.availablePositions = AvailablePopoverPositions;
  }

  /*********
   *
   * @description
   * A setter for the position of the ClrOverlayPanelContent popover. This is a combination of the following:
   * - anchorPoint - where on the trigger to anchor the ClrOverlayPanelContent
   * - popoverPoint - where on the ClrOverlayPanelContent container to align with the anchorPoint
   * - offsetY - where on the Y axis to align the ClrOverlayPanelContent so it meets specs
   * - offsetX - where on the X axis to align the ClrOverlayPanelContent so it meets specs
   * There are 12 possible positions to place a ClrOverlayPanelContent container:
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
   * meaning the top of the trigger icon (above the icon that hides/shows) the ClrOverlayPanelContent. And, SIDE_POSITION
   * is 'left' meaning two things: 1) the ClrOverlayPanelContent container extends to the left and 2) the 'arrow/pointer'
   * linking the SingpostContent to the trigger points down at the horizontal center of the trigger icon.
   *
   * @param newPosition
   */
  @Input('clrPosition')
  get position() {
    return this._position || 'right-middle';
  }
  set position(position: string) {
    this._position = position && POSITIONS.indexOf(position) > -1 ? position : 'right-middle';
    this.popoverService.position = this._position;
  }

  /*
   * Fallback to hide when *clrIfOpen is not being used
   */
  @HostBinding('class.is-off-screen')
  get isOffScreen() {
    return this.popoverService.open ? false : true;
  }

  /**********
   *
   * @description
   * Close function that uses the overlayPanel instance to toggle the state of the content popover.
   *
   */
  close() {
    this.popoverService.open = false;
    this.popoverService.setOpenedButtonFocus();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
      this.overlayPanelFocusManager.focusTrigger();
    }
  }
}
