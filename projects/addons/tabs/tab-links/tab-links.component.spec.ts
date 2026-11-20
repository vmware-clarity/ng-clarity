/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrIcon } from '@clr/angular/icon';
import { renderFixture } from '@clr/angular/utils/testing';

import { TabLinksComponent } from './tab-links.component';

interface ThisTest {
  fixture: ComponentFixture<TabLinksComponent>;
  component: TabLinksComponent;
  title: string;
}

describe('TabLinks', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrIcon],
      declarations: [TabLinksComponent],
      providers: [WorkflowStrings],
    });
  });

  beforeEach(() => {
    testContext.fixture = TestBed.createComponent(TabLinksComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.title = 'Step Title';
    testContext.fixture.componentRef.setInput('title', testContext.title);

    vi.spyOn(testContext.component.openedChange, 'emit');
    renderFixture(testContext.fixture);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('showTabLinks is false by default', () => {
    expect(testContext.component.opened).toBeFalsy();
  });

  it('`Show tabs` burger icon is visible by default', () => {
    const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
    const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
    expect(isVisible).toBeTruthy();
  });

  it('tab name is visible in the header', () => {
    const activeTabTitle = testContext.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement.innerText;
    expect(activeTabTitle).toEqual(testContext.title);
  });

  describe('when `Show tabs` burger icon is clicked', () => {
    beforeEach(() => {
      const showTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-show-tabs`));
      showTabsIcon.nativeElement.click();
      renderFixture(testContext.fixture);
    });

    it('showTabLinks should emit true', () => {
      expect(testContext.component.opened).toBeTruthy();
      expect(testContext.component.openedChange.emit).toHaveBeenCalledWith(true);
    });

    describe('when `Close tabs` icon is clicked', () => {
      beforeEach(() => {
        const closeTabsIcon = testContext.fixture.debugElement.query(By.css(`.btn-close-tabs`));
        closeTabsIcon.nativeElement.click();
        renderFixture(testContext.fixture);
      });

      it('showTabLinks should emit false', () => {
        expect(testContext.component.opened).toBeFalsy();
        expect(testContext.component.openedChange.emit).toHaveBeenCalledWith(false);
      });
    });
  });
});
