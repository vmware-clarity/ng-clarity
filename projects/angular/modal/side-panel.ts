/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';

@Component({
  selector: 'clr-side-panel',
  templateUrl: 'side-panel.html',
  host: {
    '[class.side-panel]': 'true',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrSidePanel implements OnInit, OnDestroy {
  @Output('clrSidePanelOpenChange') openChange = new EventEmitter<boolean>(false);
  @Output('clrSidePanelAlternateClose') altClose = new EventEmitter<boolean>(false);

  // The state the template reads. Signals, so that a write from code (togglePinned() or a direct assignment) renders
  // the OnPush view without a change detection call.
  private readonly isOpen = signal(false);
  private readonly closeButtonAriaLabelState = signal<string | undefined>(undefined);
  private readonly skipAnimationState = signal(false);
  private readonly labelledByIdState = signal<string>(undefined);
  private readonly staticBackdropState = signal(false);
  private readonly closableState = signal(true);
  private readonly preventCloseState = signal(false);
  private readonly sizeState = signal('md');
  private readonly positionState = signal('right');
  private readonly pinnedState = signal(false);
  private readonly pinnableState = signal(false);

  private originalStopClose: boolean;
  private _modal: ClrModal;

  constructor(
    private element: ElementRef<HTMLElement>,
    private configuration: ClrModalConfigurationService,
    public commonStrings: ClrCommonStringsService
  ) {}

  @Input('clrSidePanelOpen')
  get _open(): boolean {
    return this.isOpen();
  }
  set _open(open: boolean) {
    if (open !== this.isOpen()) {
      this.isOpen.set(open);
      if (this.pinned) {
        this.updateModalState();
      }
    }
  }

  @Input('clrSidePanelCloseButtonAriaLabel')
  get closeButtonAriaLabel(): string | undefined {
    return this.closeButtonAriaLabelState();
  }
  set closeButtonAriaLabel(label: string | undefined) {
    this.closeButtonAriaLabelState.set(label);
  }

  @Input('clrSidePanelSkipAnimation')
  get skipAnimation(): boolean {
    return this.skipAnimationState();
  }
  set skipAnimation(skipAnimation: boolean) {
    this.skipAnimationState.set(skipAnimation);
  }

  @Input('clrSidePanelLabelledById')
  get labelledById(): string {
    return this.labelledByIdState();
  }
  set labelledById(labelledById: string) {
    this.labelledByIdState.set(labelledById);
  }

  @Input('clrSidePanelStaticBackdrop')
  get staticBackdrop(): boolean {
    return this.staticBackdropState();
  }
  set staticBackdrop(staticBackdrop: boolean) {
    this.staticBackdropState.set(staticBackdrop);
  }

  @Input('clrSidePanelClosable')
  get closable(): boolean {
    return this.closableState();
  }
  set closable(closable: boolean) {
    this.closableState.set(closable);
  }

  @Input('clrSidePanelPreventClose')
  get preventClose(): boolean {
    return this.preventCloseState();
  }
  set preventClose(preventClose: boolean) {
    this.preventCloseState.set(preventClose);
  }

  @Input('clrSidePanelSize')
  get size(): string {
    return this.sizeState();
  }

  set size(value: string) {
    if (!value) {
      value = 'md';
    }
    if (this.size !== value) {
      this.sizeState.set(value);
      if (this.pinned) {
        this.updateModalState();
      }
    }
  }

  @Input('clrSidePanelPosition')
  get position(): string {
    return this.positionState();
  }

  set position(position: string) {
    if (position && position !== this.position) {
      this.positionState.set(position);
      if (position === 'right') {
        this.configuration.fadeMove = 'fadeLeft';
      } else if (position === 'bottom') {
        this.configuration.fadeMove = 'fadeUp';
      }
    }
  }

  @Input('clrSidePanelPinned')
  get pinned(): boolean {
    return this.pinnedState();
  }

  set pinned(pinned: boolean) {
    this.pinnedState.set(pinned);
    if (this.modal) {
      this.updateModalState();
    }
  }

  @Input()
  get clrSidePanelBackdrop(): boolean {
    return this.configuration.backdrop;
  }

  set clrSidePanelBackdrop(backdrop: boolean) {
    if (backdrop !== undefined) {
      this.configuration.backdrop = backdrop;
    }
  }

  @Input()
  get clrSidePanelPinnable(): boolean {
    return this.pinnableState();
  }

  set clrSidePanelPinnable(pinnable: boolean) {
    this.pinnableState.set(pinnable);
  }

  @ViewChild(ClrModal)
  private get modal(): ClrModal {
    return this._modal;
  }

  private set modal(modal: ClrModal) {
    this._modal = modal;
    this.originalStopClose = this.modal.stopClose;
    this.updateModalState();
  }

  private get hostElement(): HTMLElement {
    return (this.element.nativeElement as HTMLElement).closest('.clr-modal-host') || document.body;
  }

  @HostBinding('class.side-panel-bottom')
  private get bottomPositionCssClass() {
    return this.position === 'bottom';
  }

  ngOnInit(): void {
    this.configuration.fadeMove = 'fadeLeft';
    if (this.position === 'bottom') {
      this.configuration.fadeMove = 'fadeUp';
    }
  }

  ngOnDestroy(): void {
    this.cleanupPinnedClasses();
  }

  handleModalOpen(open: boolean) {
    if (open) {
      this.updateModalState();
    } else {
      this.cleanupPinnedClasses();
    }
    this.openChange.emit(open);
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  togglePinned() {
    this.pinned = !this.pinned;
  }

  @HostListener('document:pointerup', ['$event'])
  private documentClick(event: Event) {
    if (
      !this.element.nativeElement.contains(event.target as Node) &&
      this.modal._open &&
      !this.configuration.backdrop
    ) {
      this.modal.close();
    }
  }

  private updateModalState() {
    if (!this.modal) {
      return;
    }
    if (this.pinned) {
      this.modal.stopClose = true;
      if (this.isOpen()) {
        this.updatePinnedClasses();
      }
    } else {
      this.modal.stopClose = this.originalStopClose;
      this.cleanupPinnedClasses();
    }
  }

  private cleanupPinnedClasses() {
    [this.hostElement, document.body].forEach(host => {
      host.classList.forEach(className => {
        if (className.startsWith('clr-side-panel-pinned-')) {
          host.classList.remove(className);
        }
      });
    });
  }

  private updatePinnedClasses() {
    this.cleanupPinnedClasses();
    this.hostElement.classList.add(`clr-side-panel-pinned-${this.position}-${this.size}`);
  }
}
