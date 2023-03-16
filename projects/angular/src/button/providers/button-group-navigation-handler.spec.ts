/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrPopoverToggleService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { ClrButtonGroupModule } from '../button-group';
import { ClrButtonGroup } from '../button-group/button-group';
import {
  BUTTON_GROUP_NAVIGATION_HANDLER_PROVIDER,
  ButtonGroupNavigationHandler,
} from './button-group-navigation-handler.service';
import { InitialItem } from './button-group-navigation.enum';

@Component({
  template: `
    <clr-button-group>
      <clr-button>Button 1</clr-button>
      <clr-button>Button 2</clr-button>
      <clr-button [clrInMenu]="true">Button 3</clr-button>
      <clr-button [clrInMenu]="true">Button 4</clr-button>
      <clr-button [clrInMenu]="true">Button 5</clr-button>
    </clr-button-group>
  `,
  providers: [BUTTON_GROUP_NAVIGATION_HANDLER_PROVIDER, ClrPopoverToggleService],
})
class BtnGroupViewContainer {
  @ViewChild(ClrButtonGroup) btnGroup: ClrButtonGroup;
}

interface TestContext {
  fixture: ComponentFixture<BtnGroupViewContainer>;
  compiled: any;
  navigationHandler: ButtonGroupNavigationHandler;
  outside: HTMLElement;
  menu: HTMLElement;
  menuToggle: HTMLElement;
  testBtnGroup: ClrButtonGroup;
}

export default function (): void {
  describe('ButtonGroupNavigationHandler', function () {
    describe('Default Button Group', function () {
      beforeEach(function (this: TestContext) {
        TestBed.configureTestingModule({ imports: [ClrButtonGroupModule], declarations: [BtnGroupViewContainer] });
        this.fixture = TestBed.createComponent(BtnGroupViewContainer);
        this.navigationHandler = this.fixture.debugElement.injector.get(ButtonGroupNavigationHandler);

        this.fixture.detectChanges();
        this.compiled = this.fixture.nativeElement;
        this.testBtnGroup = this.fixture.componentInstance.btnGroup;

        this.menuToggle = this.testBtnGroup.menuToggle.nativeElement;
        this.menuToggle.click();
        this.fixture.detectChanges();

        this.menu = this.testBtnGroup.menu.nativeElement;
        this.outside = document.createElement('button');

        this.navigationHandler.menu = this.menu;
        this.navigationHandler.menuToggle = this.menuToggle;

        // We need this element in the DOM to be able to focus it
        document.body.append(this.outside);
      });

      afterEach(function (this: TestContext) {
        document.body.removeChild(this.outside);
        this.fixture.destroy();
      });

      it('declares a ButtonGroupNavigationHandler provider', function (this: TestContext) {
        expect(this.navigationHandler).not.toBeNull();
      });

      it('initializes the buttons correctly', function (this: TestContext) {
        expect(this.testBtnGroup.inlineButtons.length).toBe(2);
        expect(this.testBtnGroup.menuButtons.length).toBe(3);
      });

      it('button group menu is opened', function (this: TestContext) {
        expect(this.testBtnGroup.open).toBeTruthy();
      });

      it('first child is with clr-focus class after open', function (this: TestContext) {
        this.navigationHandler.menuOpened = true;
        const firstChild = this.menu.children[0];
        expect(firstChild.classList.contains('clr-focus')).toBe(true);
      });
      it('last child is with clr-focus class after open', function (this: TestContext) {
        this.navigationHandler.setInitialItem(InitialItem.LAST);
        this.navigationHandler.menuOpened = true;
        const lastChild = this.menu.children[this.menu.children.length - 1];
        expect(lastChild.classList.contains('clr-focus')).toBe(true);
      });

      it('last button in the menu is with clr-focus on key down events', function (this: TestContext) {
        this.navigationHandler.menuOpened = true;
        this.menuToggle.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        this.menuToggle.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        const lastChild = this.menu.children[this.menu.children.length - 1];
        expect(lastChild.classList.contains('clr-focus')).toBe(true);
      });

      it('does not prevent moving focus to a different part of the page', function (this: TestContext) {
        this.navigationHandler.menuOpened = true;
        this.outside.focus();
        expect(document.activeElement).toBe(this.outside);
      });
    });
  });
}
