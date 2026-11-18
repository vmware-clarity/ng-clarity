/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectionStrategy,
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
  signal,
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ClrCommonStringsService, noopAnimations, ScrollingService, uniqueIdFactory } from '@clr/angular/utils';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrModal implements OnChanges, OnDestroy {
  modalId = uniqueIdFactory();
  @ViewChild('title') title: ElementRef<HTMLElement>;

  @Output('clrModalOpenChange') _openChanged = new EventEmitter<boolean>(false);

  @Input('clrModalPreventClose') stopClose = false;
  @Output('clrModalAlternateClose') altClose = new EventEmitter<boolean>(false);

  // Legacy inline wizards bypass both scrolling and stack participation unless inOverlay is explicit.
  @Input('clrModalOverrideScrollService') bypassScrollService = false;

  /** Whether this modal participates in overlay Escape handling, independently of scroll locking. */
  @Input('clrModalInOverlay') inOverlay: boolean | undefined;

  // Provide raw modal content. This is used by the wizard so that the same template can be rendered with and without a modal.
  @ContentChild('clrInternalModalContentTemplate') protected readonly modalContentTemplate: TemplateRef<any>;

  @ViewChild('body') private readonly bodyElementRef: ElementRef<HTMLElement>;
  @ViewChild('dialog') private readonly dialogElementRef: ElementRef<HTMLElement>;

  private readonly injector = inject(Injector);
  private readonly noopAnimations = noopAnimations();

  // The state the template reads. Signals, so that a write from code (open(), close() or a direct assignment) renders
  // the OnPush view without a change detection call.
  private readonly isOpen = signal(false);
  private readonly closableState = signal(true);
  private readonly closeButtonAriaLabelState = signal(this.commonStrings.keys.close);
  private readonly sizeState = signal('md');
  private readonly staticBackdropState = signal(true);
  private readonly skipAnimationState = signal(false);
  private readonly labelledByState = signal<string>(undefined);

  private destroyed = false;
  /** Set when the modal closes, until it opens again: identifies the closing to notify. */
  private closeRequest: object | null = null;

  constructor(
    private _scrollingService: ScrollingService,
    public commonStrings: ClrCommonStringsService,
    private modalStackService: ModalStackService,
    private configuration: ClrModalConfigurationService
  ) {}

  @Input('clrModalOpen')
  @HostBinding('class.open')
  get _open(): boolean {
    return this.isOpen();
  }
  set _open(open: boolean) {
    this.isOpen.set(open);
  }

  @Input('clrModalClosable')
  get closable(): boolean {
    return this.closableState();
  }
  set closable(closable: boolean) {
    this.closableState.set(closable);
  }

  @Input('clrModalCloseButtonAriaLabel')
  get closeButtonAriaLabel(): string {
    return this.closeButtonAriaLabelState();
  }
  set closeButtonAriaLabel(label: string) {
    this.closeButtonAriaLabelState.set(label);
  }

  @Input('clrModalSize')
  get size(): string {
    return this.sizeState();
  }
  set size(size: string) {
    this.sizeState.set(size);
  }

  @Input('clrModalStaticBackdrop')
  get staticBackdrop(): boolean {
    return this.staticBackdropState();
  }
  set staticBackdrop(staticBackdrop: boolean) {
    this.staticBackdropState.set(staticBackdrop);
  }

  @Input('clrModalSkipAnimation')
  get skipAnimation(): boolean {
    return this.skipAnimationState();
  }
  set skipAnimation(skipAnimation: boolean) {
    this.skipAnimationState.set(skipAnimation);
  }

  @Input('clrModalLabelledById')
  get labelledBy(): string {
    return this.labelledByState();
  }
  set labelledBy(labelledBy: string) {
    this.labelledByState.set(labelledBy);
  }

  get fadeMove(): string {
    return this.skipAnimation ? '' : this.configuration.fadeMove;
  }
  set fadeMove(move: string) {
    this.configuration.fadeMove = move;
  }

  get backdrop(): boolean {
    return this.configuration.backdrop;
  }

  /** Class animating the dialog in, meant for its `animate.enter` binding. Empty when animations are skipped or off. */
  protected get dialogEnterClass(): string {
    return this.noopAnimations ? '' : (FADE_MOVE_ENTER_CLASSES[this.fadeMove] ?? '');
  }

  /** Class animating the backdrop in, meant for its `animate.enter` binding. Empty when animations are off. */
  protected get backdropEnterClass(): string {
    return this.noopAnimations ? '' : 'clr-fade-enter';
  }

  // Track the opening and closing driven by the clrModalOpen input: page scrolling, the modal stack and the
  // clrModalOpenChange(false) notification (emitted on an input-driven close too, as before).
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (this._open) {
        this.closeRequest = null;
      } else {
        this.notifyClosing();
      }
    }
    this.updateOverlayState();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this._scrollingService.resumeScrolling();
    // A modal destroyed while open must not keep handling the Escape key.
    this.modalStackService.trackModalClose(this);
  }

  open(): void {
    if (this.destroyed || this._open) {
      return;
    }
    this._open = true;
    this.closeRequest = null;
    this.updateOverlayState();
    this._openChanged.emit(true);
  }

  backdropClick(): void {
    if (this.staticBackdrop) {
      return;
    }

    this.close();
  }

  close(): void {
    if (this.destroyed) {
      return;
    }
    if (this.stopClose) {
      this.altClose.emit(false);
      return;
    }
    if (!this.closable || !this._open) {
      return;
    }
    this._open = false;
    this._scrollingService.resumeScrolling();
    this.notifyClosing();
  }

  /** @deprecated No longer called: `clrModalOpenChange` is emitted when the modal closes. To be removed in a future major version. */
  fadeDone(_e: { toState: string }) {
    // Nothing to do.
  }

  scrollTop() {
    this.bodyElementRef.nativeElement.scrollTo(0, 0);
  }

  private updateOverlayState(): void {
    if (this._open && !this.bypassScrollService) {
      this._scrollingService.stopScrolling();
    } else {
      this._scrollingService.resumeScrolling();
    }
    if (this._open && (this.inOverlay ?? !this.bypassScrollService)) {
      this.modalStackService.trackModalOpen(this);
    } else {
      this.modalStackService.trackModalClose(this);
    }
  }

  /**
   * Emits `clrModalOpenChange(false)` after the closing render, once the dialog is removed and the focus trap has given
   * the focus back, so that a handler can move the focus elsewhere.
   * Once per closing, and not when the modal was not rendered, opens again in between, or is destroyed.
   */
  private notifyClosing() {
    if (!this.dialogElementRef) {
      this.modalStackService.trackModalClose(this);
      return;
    }
    if (this.closeRequest) {
      return;
    }
    const closeRequest = (this.closeRequest = {});
    afterNextRender(
      () => {
        if (closeRequest === this.closeRequest && !this.destroyed) {
          this._openChanged.emit(false);
          this.modalStackService.trackModalClose(this);
        }
      },
      { injector: this.injector }
    );
  }
}
