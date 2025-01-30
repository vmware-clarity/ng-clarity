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
import { ClrCDKPopoverPositions } from '../../utils/popover/enums/cdk-dropdown-position.enum';
import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
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
})
export class ClrDropdownMenu implements AfterContentInit, OnDestroy {
  @ContentChildren(FocusableItem) items: QueryList<FocusableItem>;

  private focusHandler: DropdownFocusHandler;

  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    @Optional()
    @SkipSelf()
    nested: ClrDropdownMenu,
    focusHandler: DropdownFocusHandler,
    private elementRef: ElementRef,
    private popoverService: ClrPopoverService
  ) {
    if (!parentHost) {
      throw new Error('clr-dropdown-menu should only be used inside of a clr-dropdown');
    }
    // super(injector, parentHost);
    // if (!nested) {
    //   // Default positioning for normal dropdown is bottom-left
    //   this.anchorPoint = Point.BOTTOM_LEFT;
    //   this.popoverPoint = Point.LEFT_TOP;
    // } else {
    //   // Default positioning for nested dropdown is right-top
    //   this.anchorPoint = Point.RIGHT_TOP;
    //   this.popoverPoint = Point.LEFT_TOP;
    // }
    // this.popoverOptions.allowMultipleOpen = true;
    // this.popoverOptions.ignoreGlobalESCListener = true;
    // this.closeOnOutsideClick = true;
    this.focusHandler = focusHandler;

    popoverService.contentRef = elementRef;

    if (!nested) {
      popoverService.defaultPosition = 'bottom-left';
    } else {
      popoverService.defaultPosition = 'right-top';
    }
    popoverService.panelClass = 'clr-dropdown-container';
    popoverService.availablePositions = AvailablePopoverPositions;
    popoverService.popoverPositions = ClrCDKPopoverPositions;
  }

  @Input('clrPosition')
  set position(position: string) {
    // set the popover values based on menu position
    this.popoverService.position = position || this.popoverService.defaultPosition;

    // switch (position) {
    //   case 'top-right':
    //     this.anchorPoint = Point.TOP_RIGHT;
    //     this.popoverPoint = Point.RIGHT_BOTTOM;
    //     break;
    //   case 'top-left':
    //     this.anchorPoint = Point.TOP_LEFT;
    //     this.popoverPoint = Point.LEFT_BOTTOM;
    //     break;
    //   case 'bottom-right':
    //     this.anchorPoint = Point.BOTTOM_RIGHT;
    //     this.popoverPoint = Point.RIGHT_TOP;
    //     break;
    //   case 'bottom-left':
    //     this.anchorPoint = Point.BOTTOM_LEFT;
    //     this.popoverPoint = Point.LEFT_TOP;
    //     break;
    //   case 'right-top':
    //     this.anchorPoint = Point.RIGHT_TOP;
    //     this.popoverPoint = Point.LEFT_TOP;
    //     break;
    //   case 'right-bottom':
    //     this.anchorPoint = Point.RIGHT_BOTTOM;
    //     this.popoverPoint = Point.LEFT_BOTTOM;
    //     break;
    //   case 'left-top':
    //     this.anchorPoint = Point.LEFT_TOP;
    //     this.popoverPoint = Point.RIGHT_TOP;
    //     break;
    //   case 'left-bottom':
    //     this.anchorPoint = Point.LEFT_BOTTOM;
    //     this.popoverPoint = Point.RIGHT_BOTTOM;
    //     break;
    //   default:
    //     this.anchorPoint = Point.BOTTOM_LEFT;
    //     this.popoverPoint = Point.LEFT_TOP;
    //     break;
    // }
  }

  ngAfterContentInit() {
    this.focusHandler.container = this.elementRef.nativeElement;
    this.items.changes.subscribe(() => this.focusHandler.addChildren(this.items.toArray()));
    // I saw this on GitHub as a solution to avoid code duplication because of missed QueryList changes
    this.items.notifyOnChanges();
  }

  ngOnDestroy() {
    // super.ngOnDestroy();
    this.focusHandler.resetChildren();
  }
}
