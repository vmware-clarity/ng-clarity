/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { expectActiveElementToBe } from '@clr/angular/testing';
import { FocusService, Keys } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, ButtonGroupFocusHandler } from './button-group-focus-handler.service';
import { InitialFocus } from './button-group-focus.enum';
import { ClrButtonGroupModule } from '../button-group';
import { ClrButtonGroup } from '../button-group/button-group';

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
  providers: [BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FocusService, ClrPopoverService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
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

describe('Button Group Directives', () => {
  describe('ButtonGroupFocusHandler', () => {
    let testContext: TestContext;
    beforeEach(() => {
      testContext = {} as TestContext;
    });

    describe('Default Button Group', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ClrButtonGroupModule], declarations: [BtnGroupViewContainer] });
        testContext.fixture = TestBed.createComponent(BtnGroupViewContainer);

        testContext.focusService = testContext.fixture.debugElement.injector.get(FocusService);
        testContext.focusHandler = testContext.fixture.debugElement.injector.get(ButtonGroupFocusHandler);

        renderFixture(testContext.fixture);
        testContext.compiled = testContext.fixture.nativeElement;
        testContext.testBtnGroup = testContext.fixture.componentInstance.btnGroup;

        testContext.menuToggle = testContext.testBtnGroup.menuToggle.nativeElement;
        testContext.menuToggle.click();
        renderFixture(testContext.fixture);

        testContext.menu = testContext.testBtnGroup.menu.nativeElement;
        testContext.outside = document.createElement('button');

        // We need this element in the DOM to be able to focus it
        document.body.append(testContext.outside);
      });

      afterEach(() => {
        document.body.removeChild(testContext.outside);
        testContext.fixture.destroy();
      });

      it('declares a ButtonGroupFocusHandler provider', () => {
        expect(testContext.focusHandler).not.toBeNull();
      });

      it('registers the container to the FocusService', () => {
        const spy = vi.spyOn(testContext.focusService, 'registerContainer').mockImplementation(() => undefined);
        testContext.focusHandler.initialize({ menu: testContext.menu, menuToggle: testContext.menuToggle });
        expect(spy).toHaveBeenCalled();
      });

      it('initializes the buttons correctly', () => {
        expect(testContext.testBtnGroup.inlineButtons.length).toBe(2);
        expect(testContext.testBtnGroup.menuButtons.length).toBe(3);
      });

      it('button group menu is opened', () => {
        expect(testContext.testBtnGroup.open).toBeTruthy();
      });

      it('first child is focused after open', () => {
        testContext.focusHandler.initialize({ menu: testContext.menu, menuToggle: testContext.menuToggle });
        const firstChild = testContext.menu.children[0];
        expectActiveElementToBe(firstChild);
      });

      it('last child is focused after open', () => {
        testContext.focusHandler.initialFocus = InitialFocus.LAST_ITEM;
        testContext.focusHandler.initialize({ menu: testContext.menu, menuToggle: testContext.menuToggle });
        const lastChild = testContext.menu.children[testContext.menu.children.length - 1];
        expectActiveElementToBe(lastChild);
      });

      it('focus last button in the menu on key down events', () => {
        testContext.focusHandler.initialize({ menu: testContext.menu, menuToggle: testContext.menuToggle });
        testContext.menu.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        testContext.menu.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowDown }));
        const lastChild = testContext.menu.children[testContext.menu.children.length - 1];
        expectActiveElementToBe(lastChild);
      });

      it('does not prevent moving focus to a different part of the page', () => {
        testContext.focusHandler.initialize({ menu: testContext.menu, menuToggle: testContext.menuToggle });
        testContext.outside.focus();
        expectActiveElementToBe(testContext.outside);
      });
    });
  });
});
