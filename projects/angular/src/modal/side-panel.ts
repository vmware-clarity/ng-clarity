/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/src/utils';

import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';

@Component({
  selector: 'clr-side-panel',
  templateUrl: 'side-panel.html',
  host: {
    '[class.side-panel]': 'true',
  },
  standalone: false,
})
export class ClrSidePanel implements OnInit, OnDestroy {
  @Output('clrSidePanelOpenChange') openChange = new EventEmitter<boolean>(false);
  @Input('clrSidePanelCloseButtonAriaLabel') closeButtonAriaLabel: string | undefined;
  @Input('clrSidePanelSkipAnimation') skipAnimation = false;
  @Input('clrSidePanelLabelledById') labelledById: string;
  @Input('clrSidePanelStaticBackdrop') staticBackdrop = false;
  @Input('clrSidePanelClosable') closable = true;
  @Input('clrSidePanelPreventClose') preventClose = false;
  @Output('clrSidePanelAlternateClose') altClose = new EventEmitter<boolean>(false);

  private _pinnable = false;
  private _pinned = false;
  private originalStopClose: boolean;
  private _position = 'right';
  private _modal: ClrModal;
  private __open = false;

  private _size = 'md';

  constructor(
    private element: ElementRef<HTMLElement>,
    private configuration: ClrModalConfigurationService,
    public commonStrings: ClrCommonStringsService
  ) {}

  @Input('clrSidePanelOpen')
  get _open(): boolean {
    return this.__open;
  }
  set _open(open: boolean) {
    if (open !== this.__open) {
      this.__open = open;
      if (this.pinned) {
        this.updateModalState();
      }
    }
  }

  @Input('clrSidePanelSize')
  get size(): string {
    return this._size;
  }

  set size(value: string) {
    if (!value) {
      value = 'md';
    }
    if (this._size !== value) {
      this._size = value;
      if (this.pinned) {
        this.updateModalState();
      }
    }
  }

  @Input('clrSidePanelPosition')
  get position(): string {
    return this._position;
  }

  set position(position: string) {
    if (position && position !== this._position) {
      this._position = position;
      if (this._position === 'right') {
        this.configuration.fadeMove = 'fadeLeft';
      } else if (this._position === 'bottom') {
        this.configuration.fadeMove = 'fadeUp';
      }
    }
  }

  @Input('clrSidePanelPinned')
  get pinned(): boolean {
    return this._pinned;
  }

  set pinned(pinned: boolean) {
    this._pinned = pinned;
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
    return this._pinnable;
  }

  set clrSidePanelPinnable(pinnable: boolean) {
    this._pinnable = pinnable;
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
      this.updatePinnedClasses();
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
