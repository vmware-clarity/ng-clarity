/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { FocusService } from '../../utils/focus/focus.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { Linkers } from '../../utils/focus/focusable-item/linkers';
import { InitialFocus } from './button-group-focus.enum';

@Injectable()
export class ButtonGroupFocusHandler {
  private initialFocus: InitialFocus = InitialFocus.FIRST_ITEM;
  private _menuOpened: boolean;
  menuToggle: HTMLElement;
  buttonsContainer: HTMLElement;

  get menuOpened(): boolean {
    return this._menuOpened;
  }

  set menuOpened(value: boolean) {
    this._menuOpened = value;
    if (this._menuOpened) {
      this.initialize();
    } else {
      this.menuToggle.focus();
    }
  }

  constructor(private focusService: FocusService) {}

  setInitialFocus(initialFocus: InitialFocus) {
    this.initialFocus = initialFocus;
  }

  initialize() {
    this.focusService.registerContainer(this.buttonsContainer);
    const buttons = this.linkButtons();
    switch (this.initialFocus) {
      case InitialFocus.LAST_ITEM:
        this.focusLastItem(buttons);
        break;
      default:
        this.focusFirstItem(buttons);
        break;
    }
  }

  private linkButtons() {
    const buttonElements = Array.from(this.buttonsContainer.children) as HTMLElement[];
    const buttons = buttonElements.map<FocusableItem>(buttonElement => ({
      id: buttonElement.id,
      value: buttonElement,
      focus: () => buttonElement.focus(),
      blur: () => buttonElement.blur(),
    }));

    Linkers.linkVertical(buttons, false);

    return buttons;
  }

  private focusFirstItem(buttons: FocusableItem[]): void {
    if (buttons.length) {
      this.focusService.moveTo(buttons[0]);
    }
    this.setInitialFocus(InitialFocus.FIRST_ITEM);
  }

  private focusLastItem(buttons: FocusableItem[]): void {
    if (buttons.length) {
      this.focusService.moveTo(buttons[buttons.length - 1]);
    }
    this.setInitialFocus(InitialFocus.FIRST_ITEM);
  }
}

export const BUTTON_GROUP_FOCUS_HANDLER_PROVIDER = {
  provide: ButtonGroupFocusHandler,
};
