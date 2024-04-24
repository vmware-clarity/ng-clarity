/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Host, HostListener, Input } from '@angular/core';

import { ClrModal } from './modal';

@Directive({
  selector: '[clrSidebar]',
  host: {
    '[class.sidebar]': 'true',
  },
})
export class ClrSidebar {
  constructor(private element: ElementRef, @Host() private modal: ClrModal) {
    this.modal.fadeMove = 'fadeLeft';
  }

  get clrSidebarBackdrop(): boolean {
    return this.modal.backdrop;
  }

  @Input()
  set clrSidebarBackdrop(backdrop: boolean) {
    this.modal.backdrop = backdrop;
  }

  @HostListener('document:pointerup', ['$event'])
  documentClick(event: Event) {
    if (!this.element.nativeElement.contains(event.target) && this.modal._open && !this.modal.backdrop) {
      this.modal.close();
    }
  }
}
