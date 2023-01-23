/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, Output, SimpleChange } from '@angular/core';

import { ClrCommonStringsService } from '../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ScrollingService } from '../utils/scrolling/scrolling-service';
import { ModalStackService } from './modal-stack.service';

@Component({
  selector: 'clr-modal',
  viewProviders: [ScrollingService],
  templateUrl: './modal.html',
  styles: [
    `
      :host {
        display: none;
      }
      :host.open {
        display: inline;
      }
    `,
  ],
  animations: [
    trigger('fadeDown', [
      transition('* => false', [style({ opacity: 0, transform: 'translate(0, -25%)' }), animate('0.2s ease-in-out')]),
      transition('false => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, -25%)' }))]),
    ]),
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate('0.2s ease-in-out', style({ opacity: 0.85 }))]),
      transition('* => void', [animate('0.2s ease-in-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClrModal implements OnChanges, OnDestroy {
  modalId = uniqueIdFactory();

  @HostBinding('class.open')
  @Input('clrModalOpen')
  _open = false;
  @Output('clrModalOpenChange') _openChanged: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input('clrModalClosable') closable = true;
  @Input('clrModalCloseButtonAriaLabel') closeButtonAriaLabel = this.commonStrings.keys.close;
  @Input('clrModalSize') size: string;
  @Input('clrModalStaticBackdrop') staticBackdrop = true;
  @Input('clrModalSkipAnimation') skipAnimation = 'false';

  @Input('clrModalPreventClose') stopClose = false;
  @Output('clrModalAlternateClose') altClose: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input('clrModalLabelledById') labelledBy = this.modalId;

  constructor(
    private _scrollingService: ScrollingService,
    public commonStrings: ClrCommonStringsService,
    private modalStackService: ModalStackService
  ) {}

  // Detect when _open is set to true and set no-scrolling to true
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        this._scrollingService.stopScrolling();
        this.modalStackService.trackModalOpen(this);
      } else {
        this._scrollingService.resumeScrolling();
      }
    }
  }

  ngOnDestroy(): void {
    this._scrollingService.resumeScrolling();
  }

  open(): void {
    if (this._open) {
      return;
    }
    this._open = true;
    this._openChanged.emit(true);
    this.modalStackService.trackModalOpen(this);
  }

  close(): void {
    if (this.stopClose) {
      this.altClose.emit(false);
      return;
    }
    if (!this.closable || !this._open) {
      return;
    }
    this._open = false;
  }

  fadeDone(e: AnimationEvent) {
    if (e.toState === 'void') {
      // TODO: Investigate if we can decouple from animation events
      this._openChanged.emit(false);
      this.modalStackService.trackModalClose(this);
    }
  }
}
