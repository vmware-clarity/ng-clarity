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
  @ViewChild(ClrModal) private modal: ClrModal;

  private _pinnable = false;
  private _pinned = false;
  private originalStopClose: boolean;

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
        this.displayOverlapping();
        this.displaySideBySide();
      }
    }
  }

  get pinned(): boolean {
    return this._pinned;
  }

  set pinned(pinned: boolean) {
    if (this.clrSidePanelPinnable) {
      this._pinned = pinned;
      if (pinned) {
        this.originalStopClose = this.modal.stopClose;
        this.modal.stopClose = true;
        this.displaySideBySide();
      } else {
        this.modal.stopClose = this.originalStopClose;
        this.displayOverlapping();
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

  private get hostElement(): HTMLElement {
    return (this.element.nativeElement as HTMLElement).closest('.clr-modal-host') || document.body;
  }

  ngOnInit(): void {
    this.configuration.fadeMove = 'fadeLeft';
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

  private displaySideBySide() {
    this.hostElement.classList.add('clr-side-panel-pinned-' + this.size);
  }

  private displayOverlapping() {
    this.hostElement.classList.forEach(className => {
      if (className.startsWith('clr-side-panel-pinned-')) {
        this.hostElement.classList.remove(className);
      }
    });
  }
}
