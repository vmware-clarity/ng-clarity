/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
    trigger('fadeMove', [
      transition('* => fadeDown', [
        style({ opacity: 0, transform: 'translate(0, -25%)' }),
        animate('0.2s ease-in-out'),
      ]),
      transition('fadeDown => *', [
        animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(0, -25%)' })),
      ]),
      transition('* => fadeLeft', [style({ opacity: 0, transform: 'translate(25%, 0)' }), animate('0.2s ease-in-out')]),
      transition('fadeLeft => *', [animate('0.2s ease-in-out', style({ opacity: 0, transform: 'translate(25%, 0)' }))]),
    ]),
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate('0.2s ease-in-out', style({ opacity: 0.85 }))]),
      transition('* => void', [animate('0.2s ease-in-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClrModal implements OnChanges, OnDestroy {
  modalId = uniqueIdFactory();

  @Input('clrModalOpen') @HostBinding('class.open') _open = false;
  @Output('clrModalOpenChange') _openChanged = new EventEmitter<boolean>(false);

  @Input('clrModalClosable') closable = true;
  @Input('clrModalCloseButtonAriaLabel') closeButtonAriaLabel = this.commonStrings.keys.close;
  @Input('clrModalSize') size: string;
  @Input('clrModalStaticBackdrop') staticBackdrop = true;
  @Input('clrModalSkipAnimation') skipAnimation = false;

  @Input('clrModalPreventClose') stopClose = false;
  @Output('clrModalAlternateClose') altClose = new EventEmitter<boolean>(false);

  @Input('clrModalLabelledById') labelledBy = this.modalId;

  // For now we only want to expose this as input on the sidebar
  pinnable = false;

  private _fadeMove: string;
  private _pinned = false;

  constructor(
    private _scrollingService: ScrollingService,
    public commonStrings: ClrCommonStringsService,
    private modalStackService: ModalStackService
  ) {}

  get pinned(): boolean {
    return this._pinned;
  }

  set pinned(pinned: boolean) {
    if (this.pinnable) {
      this._pinned = pinned;
      if (pinned) {
        this.displaySideBySide();
      } else {
        this.displayOverlapping();
      }
    }
  }

  get fadeMove(): string {
    return this.skipAnimation ? '' : !this._fadeMove ? 'fadeDown' : this._fadeMove;
  }

  set fadeMove(move: string) {
    this._fadeMove = move;
  }

  // Detect when _open is set to true and set no-scrolling to true
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        !this.pinnable && this._scrollingService.stopScrolling();
        this.modalStackService.trackModalOpen(this);
        if (this.pinned) {
          this.displaySideBySide();
        }
      } else {
        this._scrollingService.resumeScrolling();
        if (this.pinned) {
          this.displayOverlapping();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this._scrollingService.resumeScrolling();
    this.displayOverlapping();
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

  togglePinned() {
    this.pinned = !this.pinned;
  }

  fadeDone(e: AnimationEvent) {
    if (e.toState === 'void') {
      // TODO: Investigate if we can decouple from animation events
      this._openChanged.emit(false);
      this.modalStackService.trackModalClose(this);
    }
  }

  private displaySideBySide() {
    document.body.classList.add('clr-sidebar-pinned-' + this.size);
  }

  private displayOverlapping() {
    document.body.classList.forEach(clazz => {
      if (clazz.startsWith('clr-sidebar-pinned-')) {
        document.body.classList.remove(clazz);
      }
    });
  }
}
