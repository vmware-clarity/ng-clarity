/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-signpost-position.enum';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
// import { AbstractPopover } from '../common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
// import { SIGNPOST_POSITIONS } from './signpost-positions';

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
  selector: 'clr-signpost-content',
  template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <button
          type="button"
          [attr.aria-label]="commonStrings.keys.signpostClose"
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
})
export class ClrSignpostContent implements OnDestroy, OnChanges {
  signpostContentId = uniqueIdFactory();

  private document: Document;
  private _position: string;

  constructor(
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef,
    private element: ElementRef,
    public commonStrings: ClrCommonStringsService,
    private signpostIdService: SignpostIdService,
    private signpostFocusManager: SignpostFocusManager,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) document: any,
    private popoverService: ClrPopoverService
  ) {
    // super(injector, parentHost);
    if (!parentHost) {
      throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
    }
    // Defaults
    this.position = 'right-middle';
    this.popoverService.outsideClickClose = true;
    this.signpostIdService.setId(this.signpostContentId);

    this.document = document;
    this.popoverService.contentRef = this.element;
    this.popoverService.panelClass = 'clr-signpost-container';
    this.popoverService.popoverPositions = ClrCDKPopoverPositions;
    this.popoverService.availablePositions = AvailablePopoverPositions;
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
   * Close function that uses the signpost instance to toggle the state of the content popover.
   *
   */
  close() {
    this.popoverService.open = false;
    this.popoverService.setOpenedButtonFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
      this.signpostFocusManager.focusTrigger();
    }
  }
}
