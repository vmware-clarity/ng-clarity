/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  AnimationCallbackEvent,
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
  PLATFORM_ID,
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CdkTrapFocusModule_CdkTrapFocus,
  ClrAnimationsService,
  ClrCommonStringsService,
  ScrollingService,
  uniqueIdFactory,
} from '@clr/angular/utils';

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

  /** Whether the modal is playing its leave animation (see `animateLeave()`). The host stays displayed until it is done. */
  protected closing = false;

  @ViewChild('body') private readonly bodyElementRef: ElementRef<HTMLElement>;
  @ViewChild('dialog') private readonly dialogElementRef: ElementRef<HTMLElement>;
  @ViewChild(CdkTrapFocusModule_CdkTrapFocus) private readonly trapFocus: CdkTrapFocusModule_CdkTrapFocus;

  private destroyed = false;
  /**
   * Where the current opening stands in its closing: `pending` from the close request until `clrModalOpenChange`
   * notified it, `notified` afterwards. `close()` and the `clrModalOpen` input flipping to false through a two-way
   * binding both request the closing; only the first request counts.
   */
  private closeState: 'none' | 'pending' | 'notified' = 'none';
  /** Identifies the latest close request, so that the completion of a superseded one is ignored. */
  private closeId = 0;
  /** Element focused when the modal opened, focused again as soon as the modal starts closing. */
  private focusReturnTarget: HTMLElement | null = null;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
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

  /**
   * Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped or
   * disabled (`animate.enter` itself still runs with `NoopAnimationsModule`).
   */
  protected get dialogEnterClass(): string {
    const animation = FADE_MOVE_ANIMATIONS[this.fadeMove];
    return animation && !this.animations.disabled ? `${animation}-enter` : '';
  }

  /** Class animating the dialog out, added by `animateLeave()`. Empty when animations are skipped or disabled. */
  protected get dialogLeaveClass(): string {
    const animation = FADE_MOVE_ANIMATIONS[this.fadeMove];
    return animation && !this.animations.disabled ? `${animation}-leave` : '';
  }

  /** Class animating the backdrop in, meant for its `animate.enter` binding. Empty when animations are disabled. */
  protected get backdropEnterClass(): string {
    return this.animations.disabled ? '' : 'clr-fade-enter';
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

  /** @deprecated The modal is animated with native CSS and closes itself once its leave animation is done. */
  fadeDone(e: { toState: string }) {
    if (e.toState === 'void') {
      this.modalClosed(this.closeId);
    }
  }

  scrollTop() {
    this.bodyElementRef.nativeElement.scrollTo(0, 0);
  }

  /**
   * `animate.leave` callback of the modal: plays the leave animation of the dialog and the backdrop, then lets Angular
   * remove the modal and notifies about the closing.
   */
  protected animateLeave(event: AnimationCallbackEvent) {
    const closeId = this.closeId;
    const modal = event.target as HTMLElement;
    const dialog = modal.querySelector<HTMLElement>(':scope > .modal-dialog');
    const backdrop = modal.querySelector<HTMLElement>(':scope > .modal-backdrop');
    const leaveClass = this.dialogLeaveClass;

    const done = () => {
      event.animationComplete();
      if (closeId === this.closeId && !this.destroyed) {
        this.closing = false;
        this.cdr.markForCheck();
      }
      this.modalClosed(closeId);
    };

    modal.setAttribute('inert', '');
    if (!dialog || !leaveClass) {
      done();
      return;
    }
    dialog.classList.add(leaveClass);
    backdrop?.classList.add('clr-fade-leave');
    if (!dialog.getAnimations().length) {
      done(); // the leave animation is turned off (customized styles)
      return;
    }
    dialog.addEventListener('animationend', animationEvent => {
      if (animationEvent.target === dialog) {
        done();
      }
    });
  }

  /** Resets the closing state when the modal (re)opens, possibly while it was still animating out. */
  private startOpening() {
    this.closing = false;
    this.closeState = 'none';
    this.closeId++; // ignores the completion of a closing that was in progress

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
   * Requests the closing: gives the focus back right away and lets the next change detection remove the modal, which
   * plays its leave animation (see `animateLeave()`). Nothing to do when the modal is not rendered (it was never
   * opened, was destroyed) or when the closing was already requested.
   */
  private startClosing() {
    if (this.closeState !== 'none' || this.destroyed || !this.dialogElementRef) {
      return;
    }
    this.closeState = 'pending';
    const closeId = ++this.closeId;

    // The leaving dialog is inert (see `animateLeave()`): give the focus back right away, rather than once it has
    // been removed.
    this.focusReturnTarget?.focus();
    this.focusReturnTarget = null;

    if (this.animations.disabled) {
      // No leave animation: the next change detection removes the modal; notify right after it.
      Promise.resolve().then(() => this.modalClosed(closeId));
      return;
    }
    // Keeps the host displayed while the modal animates out.
    this.closing = true;
  }

  private modalClosed(closeId: number) {
    if (closeId !== this.closeId || this.closeState === 'notified' || this._open || this.destroyed) {
      return; // superseded, already notified, opened again or destroyed in the meantime
    }
    this.closeState = 'notified';
    this._openChanged.emit(false);
    this.modalStackService.trackModalClose(this);
  }
}
