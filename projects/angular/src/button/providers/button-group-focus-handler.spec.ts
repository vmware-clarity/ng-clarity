/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrPopoverToggleService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { FocusService } from '../../utils/focus/focus.service';
import { ClrButtonGroupModule } from '../button-group';
import { ClrButtonGroup } from '../button-group/button-group';
import { BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, ButtonGroupFocusHandler } from './button-group-focus-handler.service';
import { InitialFocus } from './button-group-focus.enum';

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
  providers: [BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FocusService, ClrPopoverToggleService],
})
class BtnGroupViewContainer {
  @ViewChild(ClrButtonGroup) btnGroup: ClrButtonGroup;
}

interface TestContext {
  fixture: ComponentFixture<BtnGroupViewContainer>;
  compiled: any;
  focusService: FocusService;
  focusHandler: ButtonGroupFocusHandler;
  outside: HTMLElement;
  menu: HTMLElement;
  menuToggle: HTMLElement;
  testBtnGroup: ClrButtonGroup;
}

export default function (): void {
  describe('ButtonGroupFocusHandler', function () {
    describe('Default Button Group', function () {
      beforeEach(function (this: TestContext) {
        TestBed.configureTestingModule({ imports: [ClrButtonGroupModule], declarations: [BtnGroupViewContainer] });
        this.fixture = TestBed.createComponent(BtnGroupViewContainer);

        this.focusService = this.fixture.debugElement.injector.get(FocusService);
        this.focusHandler = this.fixture.debugElement.injector.get(ButtonGroupFocusHandler);

        this.fixture.detectChanges();
        this.compiled = this.fixture.nativeElement;
        this.testBtnGroup = this.fixture.componentInstance.btnGroup;

        this.menuToggle = this.testBtnGroup.menuToggle.nativeElement;
        this.menuToggle.click();
        this.fixture.detectChanges();

        this.menu = this.testBtnGroup.menu.nativeElement;
        this.outside = document.createElement('button');

        // We need this element in the DOM to be able to focus it
        document.body.append(this.outside);
      });

      afterEach(function (this: TestContext) {
        document.body.removeChild(this.outside);
        this.fixture.destroy();
      });

      it('declares a ButtonGroupFocusHandler provider', function (this: TestContext) {
        expect(this.focusHandler).not.toBeNull();
      });

      it('registers the container to the FocusService', function (this: TestContext) {
        const spy = spyOn(this.focusService, 'registerContainer');
        this.focusHandler.initialize({ menu: this.menu, menuToggle: this.menuToggle });
        expect(spy).toHaveBeenCalled();
      });

      it('initializes the buttons correctly', function (this: TestContext) {
        expect(this.testBtnGroup.inlineButtons.length).toBe(2);
        expect(this.testBtnGroup.menuButtons.length).toBe(3);
      });

      it('button group menu is opened', function (this: TestContext) {
        expect(this.testBtnGroup.open).toBeTruthy();
      });

      it('first child is focused after open', function (this: TestContext) {
        this.focusHandler.initialize({ menu: this.menu, menuToggle: this.menuToggle });
        const firstChild = this.menu.children[0];
        expect(document.activeElement).toBe(firstChild);
      });

      it('last child is focused after open', function (this: TestContext) {
        this.focusHandler.initialFocus = InitialFocus.LAST_ITEM;
        this.focusHandler.initialize({ menu: this.menu, menuToggle: this.menuToggle });
        const lastChild = this.menu.children[this.menu.children.length - 1];
        expect(document.activeElement).toEqual(lastChild);
      });

      it('focus last button in the menu on key down events', function (this: TestContext) {
        this.focusHandler.initialize({ menu: this.menu, menuToggle: this.menuToggle });
        this.menu.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        this.menu.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        const lastChild = this.menu.children[this.menu.children.length - 1];
        expect(document.activeElement).toEqual(lastChild);
      });

      it('does not prevent moving focus to a different part of the page', function (this: TestContext) {
        this.focusHandler.initialize({ menu: this.menu, menuToggle: this.menuToggle });
        this.outside.focus();
        expect(document.activeElement).toBe(this.outside);
      });
    });
  });
}
