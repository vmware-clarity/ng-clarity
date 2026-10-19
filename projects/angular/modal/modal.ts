/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ClrCommonStringsService, ScrollingService, uniqueIdFactory } from '@clr/angular/utils';

import { ClrModalConfigurationService } from './modal-configuration.service';
import { ModalStackService } from './modal-stack.service';

/** Enter animation of the dialog for each supported `fadeMove` value. */
const FADE_MOVE_ENTER_CLASSES: Record<string, string> = {
  fadeDown: 'clr-fade-slide-down-enter',
  fadeLeft: 'clr-fade-slide-left-enter',
  fadeUp: 'clr-fade-slide-up-enter',
};

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
  standalone: false,
})
export class ClrModal implements OnChanges, OnDestroy {
  modalId = uniqueIdFactory();
  @ViewChild('title') title: ElementRef<HTMLElement>;

  @Input('clrModalOpen') @HostBinding('class.open') _open = false;
  @Output('clrModalOpenChange') _openChanged = new EventEmitter<boolean>(false);

  @Input('clrModalClosable') closable = true;
  @Input('clrModalCloseButtonAriaLabel') closeButtonAriaLabel = this.commonStrings.keys.close;
  @Input('clrModalSize') size = 'md';
  @Input('clrModalStaticBackdrop') staticBackdrop = true;
  @Input('clrModalSkipAnimation') skipAnimation = false;

  @Input('clrModalPreventClose') stopClose = false;
  @Output('clrModalAlternateClose') altClose = new EventEmitter<boolean>(false);

  @Input('clrModalLabelledById') labelledBy: string;

  // presently this is only used by inline wizards
  @Input('clrModalOverrideScrollService') bypassScrollService = false;

  // Provide raw modal content. This is used by the wizard so that the same template can be rendered with and without a modal.
  @ContentChild('clrInternalModalContentTemplate') protected readonly modalContentTemplate: TemplateRef<any>;

  @ViewChild('body') private readonly bodyElementRef: ElementRef<HTMLElement>;
  @ViewChild('dialog') private readonly dialogElementRef: ElementRef<HTMLElement>;

  private destroyed = false;
  /** Set when the modal closes, until it opens again: identifies the closing to notify. */
  private closeRequest: object | null = null;

  constructor(
    private _scrollingService: ScrollingService,
    public commonStrings: ClrCommonStringsService,
    private modalStackService: ModalStackService,
    private configuration: ClrModalConfigurationService
  ) {}

  get fadeMove(): string {
    return this.skipAnimation ? '' : this.configuration.fadeMove;
  }
  set fadeMove(move: string) {
    this.configuration.fadeMove = move;
  }

  get backdrop(): boolean {
    return this.configuration.backdrop;
  }

  /** Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped. */
  protected get dialogEnterClass(): string {
    return FADE_MOVE_ENTER_CLASSES[this.fadeMove] ?? '';
  }

  // Detect when _open is set to true and set no-scrolling to true
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        this.closeRequest = null;
        if (!this.bypassScrollService) {
          this._scrollingService.stopScrolling();
          this.modalStackService.trackModalOpen(this);
        }
      } else {
        this.notifyClosing();
        if (!this.bypassScrollService) {
          this._scrollingService.resumeScrolling();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this._scrollingService.resumeScrolling();
    // A modal destroyed while open must not keep handling the Escape key.
    this.modalStackService.trackModalClose(this);
  }

  open(): void {
    if (this._open) {
      return;
    }
    this._open = true;
    this.closeRequest = null;
    this._openChanged.emit(true);
    this.modalStackService.trackModalOpen(this);
  }

  backdropClick(): void {
    if (this.staticBackdrop) {
      return;
    }

    this.close();
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
    this.notifyClosing();
  }

  /** @deprecated No longer called: `clrModalOpenChange` is emitted when the modal closes. To be removed in a future major version. */
  fadeDone(_e: { toState: string }) {
    // Nothing to do.
  }

  scrollTop() {
    this.bodyElementRef.nativeElement.scrollTo(0, 0);
  }

  /**
   * Emits `clrModalOpenChange(false)` once the closing change is checked (the modal may be closed while its parent is).
   * Once per closing, and not when the modal was not rendered, opens again in between, or is destroyed.
   */
  private notifyClosing() {
    if (this.closeRequest || !this.dialogElementRef) {
      return;
    }
    const closeRequest = (this.closeRequest = {});
    Promise.resolve().then(() => {
      if (closeRequest === this.closeRequest && !this.destroyed) {
        this._openChanged.emit(false);
        this.modalStackService.trackModalClose(this);
      }
    });
  }
}
