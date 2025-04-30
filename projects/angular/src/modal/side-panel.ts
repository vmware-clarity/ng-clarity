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
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  ViewChild,
} from '@angular/core';

import { ClrCommonStringsService } from '../utils';
import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';

@Component({
  selector: 'clr-side-panel',
  templateUrl: 'side-panel.html',
  host: {
    '[class.side-panel]': 'true',
  },
})
export class ClrSidePanel implements OnInit, OnDestroy, OnChanges {
  @Input('clrSidePanelOpen') _open = false;
  @Output('clrSidePanelOpenChange') openChange = new EventEmitter<boolean>(false);
  @Input('clrSidePanelCloseButtonAriaLabel') closeButtonAriaLabel: string | undefined;
  @Input('clrSidePanelSkipAnimation') skipAnimation = false;
  @Input('clrSidePanelLabelledById') labelledById: string;
  @Input('clrSidePanelStaticBackdrop') staticBackdrop = false;
  @Input('clrSidePanelPreventClose') preventClose = false;
  @Output('clrSidePanelAlternateClose') altClose = new EventEmitter<boolean>(false);

  private _pinnable = false;
  private _pinned = false;
  private originalStopClose: boolean;
  private _position = 'right';
  private _modal: ClrModal;

  private _size = 'md';

  constructor(
    private element: ElementRef<HTMLElement>,
    private configuration: ClrModalConfigurationService,
    public commonStrings: ClrCommonStringsService
  ) {}

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
      if (this.clrSidePanelPinnable && this.pinned) {
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
    if (this.clrSidePanelPinnable) {
      this._pinned = pinned;
      if (this.modal) {
        this.updateModalState();
      }
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

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes && Object.prototype.hasOwnProperty.call(changes, '_open')) {
      if (changes._open.currentValue) {
        if (this.clrSidePanelPinnable && this.pinned) {
          this.displaySideBySide();
        }
      } else {
        if (this.clrSidePanelPinnable && this.pinned) {
          this.displayOverlapping();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.displayOverlapping();
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
    this.displayOverlapping();
    if (this.pinned) {
      this.modal.stopClose = true;
      this.displaySideBySide();
    } else {
      this.modal.stopClose = this.originalStopClose;
    }
  }

  private displaySideBySide() {
    this.hostElement.classList.add(`clr-side-panel-pinned-${this.position}-${this.size}`);
  }

  private displayOverlapping() {
    this.hostElement.classList.forEach(className => {
      if (className.startsWith('clr-side-panel-pinned-')) {
        this.hostElement.classList.remove(className);
      }
    });
  }
}
