/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Renderer2 } from '@angular/core';

import { ClrPopoverToggleService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { ArrowKeyDirection } from '../../utils/focus/arrow-key-direction.enum';
import { Linkers } from '../../utils/focus/focusable-item/linkers';
import { ButtonGroupNavigationItem } from './button-group-navigation-item';
import { InitialItem } from './button-group-navigation.enum';

@Injectable()
export class ButtonGroupNavigationHandler {
  private initialItem: InitialItem = InitialItem.FIRST;
  private _unlistenFuncs: (() => void)[] = [];
  private _menuOpened: boolean;
  private _current: ButtonGroupNavigationItem | null = null;
  private buttons: ButtonGroupNavigationItem[];
  menuToggle: HTMLElement;
  menu: HTMLElement;

  get current(): ButtonGroupNavigationItem | null {
    return this._current;
  }

  get menuOpened(): boolean {
    return this._menuOpened;
  }

  set menuOpened(value: boolean) {
    this._menuOpened = value;
    if (this._menuOpened) {
      this.initialize();
    } else {
      this.detachListeners();
    }
  }

  constructor(private renderer: Renderer2, private toggleService: ClrPopoverToggleService) {}

  setInitialItem(initialItem: InitialItem) {
    this.initialItem = initialItem;
  }

  setCurrentItem(current: ButtonGroupNavigationItem) {
    this._current = current;
    this.buttons.forEach(button => {
      if (button.id === this.current.id) {
        button.element.classList.add('clr-focus');
      } else {
        button.element.classList.remove('clr-focus');
      }
    });
  }

  focusMenuToggle() {
    this.menuToggle.focus();
  }

  initialize() {
    this.listenToKeys(this.menuToggle);
    this.buttons = this.linkButtons();
    switch (this.initialItem) {
      case InitialItem.LAST:
        this.selectLastItem();
        break;
      default:
        this.selectFirstItem();
        break;
    }
  }

  isCurrent(id: string) {
    return this.current?.id === id;
  }

  private listenToKeys(el: HTMLElement) {
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.tab', е => this.closeOnTab(е)));
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.shift.tab', е => this.closeOnTab(е)));
    // The following listeners return false when there was an action to take for the key pressed,
    // in order to prevent the default behavior of that key.
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.enter', () => !this.trigger(Keys.Enter)));
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.space', () => !this.trigger(Keys.Space)));
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowup', () => !this.move(ArrowKeyDirection.UP)));
    this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowdown', () => !this.move(ArrowKeyDirection.DOWN)));
  }

  private closeOnTab(event: KeyboardEvent) {
    if (this.toggleService.open) {
      this.toggleService.toggleWithEvent(event);
    }
  }

  private trigger(key: Keys) {
    if (this.menuOpened && [Keys.Enter, Keys.Space].includes(key)) {
      this.current.click();
      return true;
    }
    return false;
  }

  private handleButtonHover(index) {
    this.setCurrentItem(this.buttons[index]);
  }

  private move(direction: ArrowKeyDirection): boolean {
    let moved = false;
    switch (direction) {
      case ArrowKeyDirection.UP:
        if (this.current[direction]) {
          this.setCurrentItem(this.current[direction] as ButtonGroupNavigationItem);
        } else {
          this.selectLastItem();
        }
        moved = true;
        break;
      case ArrowKeyDirection.DOWN:
        if (this.current[direction]) {
          this.setCurrentItem(this.current[direction] as ButtonGroupNavigationItem);
        } else {
          this.selectFirstItem();
        }
        moved = true;
        break;
    }
    return moved;
  }

  private linkButtons() {
    const buttonElements = Array.from(this.menu.children) as HTMLElement[];
    const buttons = buttonElements.map<ButtonGroupNavigationItem>((buttonElement, index) => {
      this._unlistenFuncs.push(this.renderer.listen(buttonElement, 'click', this.focusMenuToggle.bind(this)));
      this._unlistenFuncs.push(
        this.renderer.listen(buttonElement, 'mouseenter', this.handleButtonHover.bind(this, index))
      );
      return {
        id: buttonElement.id,
        element: buttonElement,
        focus: () => buttonElement.focus(),
        blur: () => buttonElement.blur(),
        click: () => buttonElement.click(),
      };
    });

    Linkers.linkVertical(buttons, false);

    return buttons;
  }

  private selectFirstItem(): void {
    if (this.buttons.length) {
      this.setCurrentItem(this.buttons[0]);
    }
    this.setInitialItem(InitialItem.FIRST);
  }

  private selectLastItem(): void {
    if (this.buttons.length) {
      this.setCurrentItem(this.buttons[this.buttons.length - 1]);
    }
    this.setInitialItem(InitialItem.FIRST);
  }

  private detachListeners() {
    this._unlistenFuncs.forEach(unlisten => unlisten());
  }
}

export const BUTTON_GROUP_NAVIGATION_HANDLER_PROVIDER = {
  provide: ButtonGroupNavigationHandler,
};
