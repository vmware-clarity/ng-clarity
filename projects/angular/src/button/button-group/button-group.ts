/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrButton } from './button';
import { ClrPopoverHostDirective, ClrPopoverService } from '../../popover';
import {
  ClrPopoverType,
  DROPDOWN_POSITIONS,
  mapPopoverKeyToPosition,
} from '../../popover/common/utils/popover-positions';
import { ClrDestroyService } from '../../utils/destroy/destroy.service';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import {
  BUTTON_GROUP_FOCUS_HANDLER_PROVIDER,
  ButtonGroupFocusHandler,
} from '../providers/button-group-focus-handler.service';
import { InitialFocus } from '../providers/button-group-focus.enum';
import { ButtonInGroupService } from '../providers/button-in-group.service';

@Component({
  selector: 'clr-button-group',
  templateUrl: 'button-group.html',
  providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER],
  hostDirectives: [ClrPopoverHostDirective],
  host: { '[class.btn-group]': 'true' },
  standalone: false,
})
export class ClrButtonGroup implements AfterContentInit, AfterViewInit {
  @Input('clrToggleButtonAriaLabel') clrToggleButtonAriaLabel: string = this.commonStrings.keys.rowActions;

  @ViewChild('menuToggle') menuToggle: ElementRef<HTMLElement>;
  @ViewChild('menu') menu: ElementRef<HTMLElement>;

  @ContentChildren(ClrButton) buttons: QueryList<ClrButton>;

  popoverId = uniqueIdFactory();
  InitialFocus = InitialFocus;

  inlineButtons: ClrButton[] = [];
  menuButtons: ClrButton[] = [];
  private _menuPosition = 'bottom-left';

  constructor(
    public buttonGroupNewService: ButtonInGroupService,
    private popoverService: ClrPopoverService,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService,
    private focusHandler: ButtonGroupFocusHandler
  ) {
    popoverService.defaultPosition = this._menuPosition;

    popoverService.popoverType = ClrPopoverType.DROPDOWN;
    DROPDOWN_POSITIONS.forEach(position => {
      popoverService.availablePositions.push(mapPopoverKeyToPosition(position, popoverService.popoverType));
    });
  }

  @Input('clrMenuPosition')
  get menuPosition(): string {
    return this._menuPosition;
  }
  set menuPosition(pos: string) {
    this._menuPosition = pos || this.popoverService.defaultPosition;
  }

  get open() {
    return this.popoverService.open;
  }

  /**
   * 1. Initializes the initial Button Group View
   * 2. Subscribes to changes on the ContentChildren
   *    in case the user content projection changes
   */
  ngAfterContentInit() {
    this.initializeButtons();
    this.buttonGroupNewService.changes.pipe(takeUntil(this.destroy$)).subscribe(button => this.rearrangeButton(button));
    this.buttons.changes.subscribe(() => {
      this.initializeButtons();
    });
  }

  ngAfterViewInit() {
    this.handleFocusOnMenuOpen();
  }

  /**
   * Moves the button into the other ViewContainer
   * when an update is received.
   *
   * @param button
   */
  rearrangeButton(button: ClrButton): void {
    let fromView: ClrButton[];
    let toView: ClrButton[];
    if (button.inMenu) {
      fromView = this.inlineButtons;
      toView = this.menuButtons;
    } else {
      fromView = this.menuButtons;
      toView = this.inlineButtons;
    }
    const index: number = fromView.indexOf(button);
    if (index > -1) {
      fromView.splice(index, 1);
      const moveIndex = this.getMoveIndex(button);
      if (moveIndex <= toView.length) {
        toView.splice(moveIndex, 0, button);
      }
    }
  }

  openMenu(event: Event, initialFocus: InitialFocus) {
    this.focusHandler.initialFocus = initialFocus;
    if (!this.popoverService.open) {
      this.popoverService.toggleWithEvent(event);
    }
  }

  /**
   * Author: Eudes
   *
   * Finds the order of a button w.r.t other buttons
   *
   * @param buttonToMove
   * @returns
   */
  getMoveIndex(buttonToMove: ClrButton): number {
    const tempArr: ClrButton[] = this.buttons.filter(button => button.inMenu === buttonToMove.inMenu);
    return tempArr.indexOf(buttonToMove);
  }

  initializeButtons(): void {
    const tempInlineButtons: ClrButton[] = [];
    const tempInMenuButtons: ClrButton[] = [];
    this.buttons.forEach(button => {
      if (button.inMenu) {
        tempInMenuButtons.push(button);
      } else {
        tempInlineButtons.push(button);
      }
    });
    this.inlineButtons = tempInlineButtons;
    this.menuButtons = tempInMenuButtons;
  }

  private handleFocusOnMenuOpen() {
    this.popoverService.popoverVisible.pipe(takeUntil(this.destroy$)).subscribe(visible => {
      if (visible) {
        this.focusHandler.initialize({
          menu: this.menu.nativeElement,
          menuToggle: this.menuToggle.nativeElement,
        });
      }
    });
  }
}
