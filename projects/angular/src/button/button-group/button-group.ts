/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy/destroy.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrPopoverPositions } from '../../utils/popover/enums/positions.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverEventsService } from '../../utils/popover/providers/popover-events.service';
import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ButtonInGroupService } from '../providers/button-in-group.service';
import { ClrButton } from './button';

@Component({
  selector: 'clr-button-group',
  templateUrl: 'button-group.html',
  providers: [
    ButtonInGroupService,
    ClrPopoverToggleService,
    ClrPopoverEventsService,
    ClrPopoverPositionService,
    ClrDestroyService,
  ],
  host: { '[class.btn-group]': 'true' },
})
export class ClrButtonGroup implements AfterContentInit {
  @ContentChildren(ClrButton) buttons: QueryList<ClrButton>;

  popoverId = uniqueIdFactory();

  constructor(
    public buttonGroupNewService: ButtonInGroupService,
    private toggleService: ClrPopoverToggleService,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService
  ) {}

  popoverPosition: ClrPopoverPosition = ClrPopoverPositions['bottom-left'];

  get open() {
    return this.toggleService.open;
  }

  inlineButtons: ClrButton[] = [];
  menuButtons: ClrButton[] = [];

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

  /**
   * Overflow Menu
   *
   */

  // Indicates the position of the overflow menu
  private _menuPosition: string;

  get menuPosition(): string {
    return this._menuPosition;
  }

  @Input('clrMenuPosition')
  set menuPosition(pos: string) {
    if (pos && (ClrPopoverPositions as Record<string, any>)[pos]) {
      this._menuPosition = pos;
    } else {
      this._menuPosition = 'bottom-left';
    }

    this.popoverPosition = (ClrPopoverPositions as Record<string, any>)[this._menuPosition];
  }
}
