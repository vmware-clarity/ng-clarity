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
  Injector,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  SkipSelf,
} from '@angular/core';

import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { ClrPopoverService } from '../common';
import { ClrCDKPopoverPositions } from '../common/enums/cdk-dropdown-position.enum';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';

const AvailablePopoverPositions = [
  ClrCDKPopoverPositions.bottom,
  ClrCDKPopoverPositions['bottom-left'],
  ClrCDKPopoverPositions['bottom-middle'],
  ClrCDKPopoverPositions['bottom-right'],
  ClrCDKPopoverPositions.left,
  ClrCDKPopoverPositions['left-bottom'],
  ClrCDKPopoverPositions['left-middle'],
  ClrCDKPopoverPositions['left-top'],
  ClrCDKPopoverPositions['middle-bottom'],
  ClrCDKPopoverPositions['middle-left'],
  ClrCDKPopoverPositions['middle-right'],
  ClrCDKPopoverPositions.right,
  ClrCDKPopoverPositions['right-bottom'],
  ClrCDKPopoverPositions['right-middle'],
  ClrCDKPopoverPositions['right-top'],
  ClrCDKPopoverPositions.top,
  ClrCDKPopoverPositions['top-left'],
  ClrCDKPopoverPositions['top-middle'],
  ClrCDKPopoverPositions['top-right'],
];

@Component({
  selector: 'clr-dropdown-menu',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.dropdown-menu]': 'true',
    '[attr.role]': '"menu"',
  },
  standalone: false,
})
export class ClrDropdownMenu implements AfterContentInit, OnDestroy {
  @ContentChildren(FocusableItem) items: QueryList<FocusableItem>;

  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    @Optional()
    @SkipSelf()
    nested: ClrDropdownMenu,
    private focusHandler: DropdownFocusHandler,
    private elementRef: ElementRef,
    private popoverService: ClrPopoverService
  ) {
    if (!parentHost) {
      throw new Error('clr-dropdown-menu should only be used inside of a clr-dropdown');
    }

    popoverService.contentRef = elementRef;
    popoverService.scrollToClose = true;
    popoverService.availablePositions = AvailablePopoverPositions;
    popoverService.popoverPositions = ClrCDKPopoverPositions;

    popoverService.position = nested ? 'right-top' : 'bottom-left';

    popoverService.panelClass.push('clr-dropdown-container');
  }

  @Input('clrPosition')
  set position(position: string) {
    this.popoverService.availablePositions = AvailablePopoverPositions;
    this.popoverService.popoverPositions = ClrCDKPopoverPositions;
    // set the popover values based on menu position
    this.popoverService.position = position || this.popoverService.defaultPosition;
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
