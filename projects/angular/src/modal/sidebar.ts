/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Host, HostBinding, HostListener, Input } from '@angular/core';

import { ClrModal } from './modal';

@Directive({
  selector: '[clrSidebar]',
  host: {
    '[class.sidebar]': 'true',
  },
})
export class ClrSidebar {
  @Input() clrSidebarBackdrop = true;

  constructor(private element: ElementRef, @Host() private modal: ClrModal) {
    this.modal.fadeMove = 'fadeLeft';
  }

  @Input()
  set clrSidebarPinnable(pinnable: boolean) {
    this.modal.pinnable = pinnable;
  }

  get clrSideBarPinnable(): boolean {
    return this.modal.pinnable;
  }

  @HostBinding('class.no-backdrop')
  get hideBackdrop() {
    return !this.clrSidebarBackdrop || this.modal.pinnable;
  }

  @HostListener('document:pointerup', ['$event'])
  documentClick(event: Event) {
    if (!this.element.nativeElement.contains(event.target) && this.modal._open && !this.modal.pinned) {
      this.modal.close();
    }
  }
}
