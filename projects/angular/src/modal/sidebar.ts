/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { uniqueIdFactory } from '../utils/id-generator/id-generator.service';
import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';

@Component({
  selector: 'clr-sidebar',
  templateUrl: 'sidebar.html',
  host: {
    '[class.sidebar]': 'true',
  },
})
export class ClrSidebar implements OnInit {
  sidebarId = uniqueIdFactory();

  @Input('clrSidebarOpen') _open = false;
  @Output('clrSidebarOpenChange') _openChanged = new EventEmitter<boolean>(false);
  @Input('clrSidebarCloseButtonAriaLabel') closeButtonAriaLabel: string | undefined;
  @Input('clrSidebarSize') size: string;
  @Input('clrSidebarSkipAnimation') skipAnimation = 'false';
  @Input('clrSidebarLabelledById') labelledById = this.sidebarId;
  @Input('clrSidebarStaticBackdrop') staticBackdrop = false;
  @Input('clrSidebarPreventClose') preventClose = false;
  @Output('clrSidebarAlternateClose') _altClose = new EventEmitter<boolean>(false);

  @ViewChild(ClrModal) private modal: ClrModal;

  constructor(private element: ElementRef, private configuration: ClrModalConfigurationService) {}

  get clrSidebarBackdrop(): boolean {
    return this.configuration.backdrop;
  }

  @Input()
  set clrSidebarBackdrop(backdrop: boolean) {
    if (backdrop !== undefined) {
      this.configuration.backdrop = backdrop;
    }
  }

  ngOnInit(): void {
    this.configuration.fadeMove = 'fadeLeft';
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  openChange(open: boolean) {
    this._openChanged.emit(open);
  }

  altClose(open: boolean) {
    this._altClose.emit(open);
  }

  @HostListener('document:pointerup', ['$event'])
  documentClick(event: Event) {
    if (!this.element.nativeElement.contains(event.target) && this.modal._open && !this.configuration.backdrop) {
      this.modal.close();
    }
  }
}
