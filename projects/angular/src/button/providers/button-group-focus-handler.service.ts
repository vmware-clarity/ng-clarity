/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Renderer2 } from '@angular/core';

import { ClrPopoverToggleService } from '../../utils';
import { FocusService } from '../../utils/focus/focus.service';
import { FocusableItem } from '../../utils/focus/focusable-item/focusable-item';
import { Linkers } from '../../utils/focus/focusable-item/linkers';
import { InitialFocus } from './button-group-focus.enum';

@Injectable()
export class ButtonGroupFocusHandler {
  private initialFocus: InitialFocus = InitialFocus.FIRST_ITEM;
  private _unlistenFuncs: (() => void)[] = [];
  private _menuOpened: boolean;
  private buttons: FocusableItem[];
  menuToggle: HTMLElement;
  menu: HTMLElement;

  get menuOpened(): boolean {
    return this._menuOpened;
  }

  set menuOpened(value: boolean) {
    this._menuOpened = value;
    if (this._menuOpened) {
      this.initialize();
    }
  }

  constructor(
    private focusService: FocusService,
    private toggleService: ClrPopoverToggleService,
    private renderer: Renderer2
  ) {}

  setInitialFocus(initialFocus: InitialFocus) {
    this.initialFocus = initialFocus;
  }

  initialize() {
    this.focusService.registerContainer(this.menu, '-1');
    this.listenToKeys();
    this.linkButtons();
    switch (this.initialFocus) {
      case InitialFocus.LAST_ITEM:
        this.focusLastItem();
        break;
      default:
        this.focusFirstItem();
        break;
    }
  }

  resetButtonsFocus() {
    this.buttons.forEach(button => {
      button.blur();
    });
  }

  private listenToKeys() {
    this._unlistenFuncs.push(
      this.renderer.listen(this.menu, 'keydown.shift.tab', event => this.closeMenu(event, false))
    );
    this._unlistenFuncs.push(this.renderer.listen(this.menu, 'keydown.tab', event => this.closeMenu(event, true)));
  }

  private closeMenu(event: KeyboardEvent, focusBackOnToggle: boolean) {
    this.toggleService.toggleWithEvent(event);
    if (focusBackOnToggle) {
      this.menuToggle.focus();
    }
    this.resetButtonsFocus();
  }

  private linkButtons() {
    const buttonElements = Array.from(this.menu.children) as HTMLElement[];
    this.buttons = buttonElements.map<FocusableItem>(buttonElement => {
      this._unlistenFuncs.push(this.renderer.listen(buttonElement, 'click', event => this.closeMenu(event, true)));
      return {
        id: buttonElement.id,
        value: buttonElement,
        focus: () => {
          buttonElement.setAttribute('tabindex', '0');
          buttonElement.focus();
        },
        blur: () => {
          buttonElement.setAttribute('tabindex', '-1');
          buttonElement.blur();
        },
      };
    });
    this.resetButtonsFocus();
    Linkers.linkVertical(this.buttons);
  }

  private focusFirstItem(): void {
    if (this.buttons.length) {
      this.focusService.moveTo(this.buttons[0]);
    }
    this.setInitialFocus(InitialFocus.FIRST_ITEM);
  }

  private focusLastItem(): void {
    if (this.buttons.length) {
      this.focusService.moveTo(this.buttons[this.buttons.length - 1]);
    }
    this.setInitialFocus(InitialFocus.FIRST_ITEM);
  }

  ngOnDestroy() {
    this._unlistenFuncs.forEach((unlisten: () => void) => unlisten());
    this.focusService.detachListeners();
  }
}

export const BUTTON_GROUP_FOCUS_HANDLER_PROVIDER = {
  provide: ButtonGroupFocusHandler,
};
