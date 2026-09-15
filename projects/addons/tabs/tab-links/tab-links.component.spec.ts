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

import { TabLinksComponent } from './tab-links.component';

interface ThisTest {
  fixture: ComponentFixture<TabLinksComponent>;
  component: TabLinksComponent;
  title: string;
}

describe('TabLinks', () => {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [ClrIcon],
      declarations: [TabLinksComponent],
      providers: [WorkflowStrings],
    });
  });

  beforeEach(function (this: ThisTest) {
    this.fixture = TestBed.createComponent(TabLinksComponent);
    this.component = this.fixture.componentInstance;
    this.title = 'Step Title';
    this.component.title = this.title;

    spyOn(this.component.openedChange, 'emit').and.callThrough();
    this.fixture.detectChanges();
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('showTabLinks is false by default', function (this: ThisTest) {
    expect(this.component.opened).toBeFalsy();
  });

  it('`Show tabs` burger icon is visible by default', function (this: ThisTest) {
    const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
    const isVisible = getComputedStyle(showTabsIcon.nativeElement)['display'] !== 'none';
    expect(isVisible).toBeTruthy();
  });

  it('tab name is visible in the header', function (this: ThisTest) {
    const activeTabTitle = this.fixture.debugElement.query(By.css(`.nav-step-title`)).nativeElement.innerText;
    expect(activeTabTitle).toEqual(this.title);
  });

  describe('when `Show tabs` burger icon is clicked', () => {
    beforeEach(function (this: ThisTest) {
      const showTabsIcon = this.fixture.debugElement.query(By.css(`.btn-show-tabs`));
      showTabsIcon.nativeElement.click();
      this.fixture.detectChanges();
    });

    it('showTabLinks should emit true', function (this: ThisTest) {
      expect(this.component.opened).toBeTruthy();
      expect(this.component.openedChange.emit).toHaveBeenCalledWith(true);
    });

    describe('when `Close tabs` icon is clicked', () => {
      beforeEach(function (this: ThisTest) {
        const closeTabsIcon = this.fixture.debugElement.query(By.css(`.btn-close-tabs`));
        closeTabsIcon.nativeElement.click();
        this.fixture.detectChanges();
      });

      it('showTabLinks should emit false', function (this: ThisTest) {
        expect(this.component.opened).toBeFalsy();
        expect(this.component.openedChange.emit).toHaveBeenCalledWith(false);
      });
    });
  });
});
