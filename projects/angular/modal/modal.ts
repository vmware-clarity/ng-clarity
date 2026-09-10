/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectorRef,
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
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ClrAnimationsService, ClrCommonStringsService, ScrollingService, uniqueIdFactory } from '@clr/angular/utils';

import { ClrModalConfigurationService } from './modal-configuration.service';
import { ModalStackService } from './modal-stack.service';

/** CSS animation classes (without their `-enter` / `-leave` suffix) matching the supported `fadeMove` values. */
const FADE_MOVE_ANIMATIONS: Record<string, string> = {
  fadeDown: 'clr-fade-slide-down',
  fadeLeft: 'clr-fade-slide-left',
  fadeUp: 'clr-fade-slide-up',
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

  /** Whether the modal is playing its leave animation. It stays rendered until the animation is done. */
  protected closing = false;

  @ViewChild('body') private readonly bodyElementRef: ElementRef<HTMLElement>;
  @ViewChild('dialog') private readonly dialogElementRef: ElementRef<HTMLElement>;

  private destroyed = false;
  private readonly injector = inject(Injector);
  private readonly animations = inject(ClrAnimationsService);
  private readonly cdr = inject(ChangeDetectorRef);

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
    return this._open || this.closing;
  }

  /** Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped. */
  protected get dialogEnterClass(): string {
    const animation = FADE_MOVE_ANIMATIONS[this.fadeMove];
    return animation ? `${animation}-enter` : '';
  }

  /** Class animating the dialog out, applied while the modal is closing. Empty when animations are skipped. */
  protected get dialogLeaveClass(): string {
    const animation = FADE_MOVE_ANIMATIONS[this.fadeMove];
    return animation ? `${animation}-leave` : '';
  }

  // Detect when _open is set to true and set no-scrolling to true
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        this.closing = false;
      } else {
        this.closeAfterLeaveAnimation();
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
    this.destroyed = true;
    this._scrollingService.resumeScrolling();
  }

  open(): void {
    if (this._open) {
      return;
    }
    this._open = true;
    this.closing = false;
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
    this.closeAfterLeaveAnimation();
  }

  /** @deprecated The modal is animated with native CSS and closes itself once its leave animation is done. */
  fadeDone(e: { toState: string }) {
    if (e.toState === 'void') {
      this.modalClosed();
    }
  }

  scrollTop() {
    this.bodyElementRef.nativeElement.scrollTo(0, 0);
  }

  /**
   * Keeps the modal rendered while the dialog animates out, then removes it and notifies about the closing.
   * Nothing to do when the modal is not rendered (it was never opened, is already closing or was destroyed).
   */
  private closeAfterLeaveAnimation() {
    if (this.closing || this.destroyed || !this.dialogElementRef) {
      return;
    }

    if (this.animations.disabled) {
      // The next change detection removes the modal; notify right after it, like a completed animation would.
      Promise.resolve().then(() => this.modalClosed());
      return;
    }

    this.closing = true;

    // The leave animation starts once the dialog has been rendered with its leave class.
    afterNextRender(
      () => {
        const dialog = this.dialogElementRef?.nativeElement;
        const done = dialog ? this.animations.whenComplete(dialog) : Promise.resolve();

        done.then(() => {
          if (!this.closing) {
            return; // the modal was opened again in the meantime
          }
          this.closing = false;
          if (!this.destroyed) {
            // Remove the modal right away rather than on the next change detection, which is what the
            // clrModalOpenChange event and the tests of applications using the modal expect.
            this.cdr.detectChanges();
          }
          this.modalClosed();
        });
      },
      { injector: this.injector }
    );
  }

  private modalClosed() {
    if (this._open || this.destroyed) {
      return; // the modal was opened again or destroyed in the meantime
    }
    this._openChanged.emit(false);
    this.modalStackService.trackModalClose(this);
  }
}
