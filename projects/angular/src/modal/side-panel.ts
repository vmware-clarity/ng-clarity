/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';

@Component({
  selector: 'clr-side-panel',
  templateUrl: 'side-panel.html',
  host: {
    '[class.side-panel]': 'true',
  },
})
export class ClrSidePanel implements OnInit, AfterViewInit {
  @Input('clrSidePanelOpen') _open = false;
  @Output('clrSidePanelOpenChange') openChange = new EventEmitter<boolean>(false);
  @Input('clrSidePanelCloseButtonAriaLabel') closeButtonAriaLabel: string | undefined;
  @Input('clrSidePanelSize') size: string;
  @Input('clrSidePanelSkipAnimation') skipAnimation = 'false';
  @Input('clrSidePanelLabelledById') labelledById: string;
  @Input('clrSidePanelStaticBackdrop') staticBackdrop = false;
  @Input('clrSidePanelPreventClose') preventClose = false;
  @Output('clrSidePanelAlternateClose') altClose = new EventEmitter<boolean>(false);

  @ViewChild(ClrModal) private modal: ClrModal;

  private _pinnable = false;

  constructor(private element: ElementRef<HTMLElement>, private configuration: ClrModalConfigurationService) {}

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
    if (this.modal) {
      this.modal.pinnable = pinnable;
    }
  }

  ngOnInit(): void {
    this.configuration.fadeMove = 'fadeLeft';
  }

  ngAfterViewInit() {
    this.modal.pinnable = this._pinnable;
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
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
}
