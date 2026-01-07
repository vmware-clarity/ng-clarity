/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
} from '@angular/core';

import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrPopoverContent, ClrPopoverService } from '../common';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { ClrPopoverPosition, ClrPopoverType, DROPDOWN_POSITIONS } from '../common/utils/popover-positions';

@Component({
  selector: 'clr-dropdown-menu',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.dropdown-menu]': 'true',
    '[attr.role]': '"menu"',
  },
  standalone: false,
  hostDirectives: [ClrPopoverContent],
})
export class ClrDropdownMenu implements AfterContentInit, OnDestroy {
  @ContentChildren(FocusableItem) items: QueryList<FocusableItem>;

  constructor(
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    @Optional()
    @SkipSelf()
    nested: ClrDropdownMenu,
    private focusHandler: DropdownFocusHandler,
    private elementRef: ElementRef,
    popoverService: ClrPopoverService,
    private popoverContent: ClrPopoverContent
  ) {
    if (!parentHost) {
      throw new Error('clr-dropdown-menu should only be used inside of a clr-dropdown');
    }

    popoverContent.scrollToClose = true;

    popoverContent.contentType = ClrPopoverType.DROPDOWN;

    popoverContent.contentAt = nested ? ClrPopoverPosition.RIGHT_TOP : ClrPopoverPosition.BOTTOM_LEFT;

    popoverService.panelClass.push('clr-dropdown-container');
  }

  @Input('clrPosition')
  set position(position: string | ClrPopoverPosition) {
    if (!position) {
      return;
    }

    const posIndex = DROPDOWN_POSITIONS.indexOf(position as ClrPopoverPosition);

    if (posIndex === -1) {
      return;
    }

    // set the popover values based on menu position
    this.popoverContent.contentAt = DROPDOWN_POSITIONS[posIndex];
  }

  ngAfterContentInit() {
    this.focusHandler.container = this.elementRef.nativeElement;
    this.items.changes.subscribe(() => this.focusHandler.addChildren(this.items.toArray()));
    // I saw this on GitHub as a solution to avoid code duplication because of missed QueryList changes
    this.items.notifyOnChanges();
  }

  ngOnDestroy() {
    this.focusHandler.resetChildren();
  }
}
