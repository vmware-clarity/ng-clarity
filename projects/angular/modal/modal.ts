/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CdkTrapFocusModule_CdkTrapFocus,
  ClrCommonStringsService,
  ScrollingService,
  uniqueIdFactory,
} from '@clr/angular/utils';

import { ClrModalConfigurationService } from './modal-configuration.service';
import { ModalStackService } from './modal-stack.service';

/** Directions of the slide matching the supported `fadeMove` values. */
const FADE_MOVE_DIRECTIONS: Record<string, string> = {
  fadeDown: 'down',
  fadeLeft: 'left',
  fadeUp: 'up',
};

/** Leave classes of the modal by direction (see `_modal.clarity.scss`), as constants for the `animate.leave` binding. */
const LEAVE_CLASSES: Record<string, string[]> = Object.fromEntries(
  Object.values(FADE_MOVE_DIRECTIONS).map(direction => [direction, ['clr-modal-leave', `clr-modal-leave-${direction}`]])
);

@Component({
  selector: 'clr-modal',
  viewProviders: [ScrollingService],
  templateUrl: './modal.html',
  styles: [
    `
      :host {
        display: none;
      }
      /* Also while the modal animates out. */
      :host.open,
      :host:has(> .modal) {
        display: inline;
      }
    `,
  ],
  standalone: false,
})
export class ClrModal implements OnChanges, OnDestroy {
  modalId = uniqueIdFactory();
  @ViewChild('title') title: ElementRef<HTMLElement>;

  @Input('clrModalOpen') _open = false;
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
  @ViewChild(CdkTrapFocusModule_CdkTrapFocus) private readonly trapFocus: CdkTrapFocusModule_CdkTrapFocus;

  private destroyed = false;
  /** Identifies the closing of the current opening, once requested. */
  private closeRequest: object | null = null;
  /** Element focused when the modal opened, focused again as soon as the modal starts closing. */
  private focusReturnTarget: HTMLElement | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly injector = inject(Injector);

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

  @HostBinding('class.open')
  protected get visible(): boolean {
    return this._open;
  }

  /** Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped. */
  protected get dialogEnterClass(): string {
    const direction = FADE_MOVE_DIRECTIONS[this.fadeMove];
    return direction ? `clr-fade-slide-${direction}-enter` : '';
  }

  /** Classes animating the modal out, meant for its `animate.leave` binding. Empty when animations are skipped. */
  protected get leaveClasses(): string[] | '' {
    return LEAVE_CLASSES[FADE_MOVE_DIRECTIONS[this.fadeMove]] ?? '';
  }

  // Reacts to the clrModalOpen input: keeps the modal rendered while it animates out when it is closed,
  // and stops / resumes page scrolling.
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        this.startOpening();
      } else {
        this.startClosing();
      }
    }

    if (!this.bypassScrollService && changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        this._scrollingService.stopScrolling();
        this.modalStackService.trackModalOpen(this);
      } else {
        this._scrollingService.resumeScrolling();
      }
    }
  }

  ngOnDestroy(): void {
    if (this._open) {
      // Destroyed while open: give the focus back, like the focus trap used to when it captured the focus.
      this.focusReturnTarget?.focus();
      this.focusReturnTarget = null;
    }
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
    this.startOpening();
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
    this.startClosing();
  }

  /** @deprecated The modal is animated with native CSS: `clrModalOpenChange` is emitted when it starts closing. */
  fadeDone(_e: { toState: string }) {
    // Nothing to do.
  }

  scrollTop() {
    this.bodyElementRef.nativeElement.scrollTo(0, 0);
  }

  /** Resets the closing state when the modal (re)opens, possibly while it was still animating out. */
  private startOpening() {
    this.closeRequest = null;

    if (!this.isBrowser) {
      return;
    }
    // The modal owns the focus: it moves it into the dialog once rendered and gives it back when closing starts.
    // (The focus trap does not capture it, as it would give the focus back a second time when the dialog is removed,
    // after its leave animation.)
    this.focusReturnTarget = document.activeElement as HTMLElement | null;
    afterNextRender(
      () => {
        if (this._open && !this.destroyed) {
          this.trapFocus?.focusTrap?.focusInitialElementWhenReady();
        }
      },
      { injector: this.injector }
    );
  }

  /**
   * Gives the focus back and notifies the closing, while the next change detection removes the modal (Angular keeps
   * it in the DOM during its leave animation). Nothing to do when the modal is not rendered (it was never opened, was
   * destroyed) or when the closing was already requested.
   */
  private startClosing() {
    if (this.closeRequest || this.destroyed || !this.dialogElementRef) {
      return;
    }
    const closeRequest = (this.closeRequest = {});
    this.focusReturnTarget?.focus();
    this.focusReturnTarget = null;
    // Not while the parent is checked, when the closing comes from the clrModalOpen input.
    Promise.resolve().then(() => {
      if (closeRequest === this.closeRequest && !this.destroyed) {
        this._openChanged.emit(false);
        this.modalStackService.trackModalClose(this);
      }
    });
  }
}
