/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ClrPopoverHostDirective } from '../../../../angular/src/utils/popover/popover-host.directive';
import { ClrPopoverService } from '../../../../angular/src/utils/popover/providers/popover.service';

@Component({
  selector: 'clr-dummy-anchor',
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <input
      #ignore
      type="text"
      *ngIf="openOnFocus"
      placeholder="Open Menu on Focus"
      (focus)="onFocus($event)"
      (click)="onInputClick($event)"
      (focusout)="onFocusOut($event)"
      class="clr-input"
    />
    <button class="btn" *ngIf="!openOnFocus" (click)="onClick($event)">Click Trigger</button>
    <ng-content></ng-content>
  `,
  hostDirectives: [ClrPopoverHostDirective],
})
export class DummyAnchor {
  @Input() openOnFocus = false;

  @ViewChild('ignore') ignore: ElementRef;

  constructor(private stateService: ClrPopoverService) {}

  onFocus(event: FocusEvent) {
    this.stateService.toggleWithEvent(event);
  }

  // This needs to be added to handle the case where:
  // 1. The user focuses on the input and the menu opens,
  // 2. user hits on escape but is still focused on the menu,
  // 3. and then clicks on the Input again.
  // Without this, the last step of clicking on the Input while it is focused
  // to open the menu wouldn't work.
  onInputClick(event: MouseEvent) {
    if (this.stateService.open === false) {
      this.stateService.toggleWithEvent(event);
    }
  }

  onFocusOut() {
    this.stateService.open = false;
  }

  onClick(event: MouseEvent) {
    this.stateService.toggleWithEvent(event);
  }
}
