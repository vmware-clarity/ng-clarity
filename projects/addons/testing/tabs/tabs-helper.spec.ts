/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrIcon } from '@clr/angular/icon';
import { ClrTabsModule } from '@clr/angular/layout/tabs';

import { TabsHelper } from './tabs-helper';

@Component({
  selector: 'appfx-mock-tabs',
  imports: [ClrIcon, ClrTabsModule],
  template: `
    <clr-tabs>
      <clr-tab>
        <button clrTabLink>
          Tab 1
          <cds-icon shape="link"></cds-icon>
        </button>
        <clr-tab-content *clrIfActive="true">
          <div>tab 1 content</div>
        </clr-tab-content>
      </clr-tab>

      <clr-tab>
        <button clrTabLink>Tab 2</button>
        <clr-tab-content>
          <div>tab 2 content</div>
        </clr-tab-content>
      </clr-tab>

      <clr-tab>
        <button clrTabLink>Tab 3</button>
        <clr-tab-content></clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
})
class TestClarityTabsComponent {}

@Component({
  selector: 'appfx-mock-multiple-tabs',
  imports: [ClrTabsModule],
  template: `
    <clr-tabs></clr-tabs>
    <clr-tabs></clr-tabs>
  `,
})
class TestClarityMultipleTabsComponent {}

describe('TabsHelper', () => {
  let tabsHelper: TabsHelper;
  let fixture: ComponentFixture<TestClarityTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTabsModule, TestClarityMultipleTabsComponent, TestClarityTabsComponent],
    });

    fixture = TestBed.createComponent(TestClarityTabsComponent);
    fixture.detectChanges();
    tabsHelper = new TabsHelper(fixture.debugElement);
  });

  it('should throw an error if no tabs are found', () => {
    const emptyDebugElement = new DebugElement(document.createElement('div'));

    expect(() => new TabsHelper(emptyDebugElement)).toThrowError('No tabs found under passed context element');
  });

  it('should throw an error if multiple tabs are found', () => {
    const multipleTabsComponent = TestBed.createComponent(TestClarityMultipleTabsComponent);
    multipleTabsComponent.detectChanges();

    expect(() => new TabsHelper(multipleTabsComponent.debugElement)).toThrowError(
      'Unable to isolate targeted instance of tabs widget'
    );
  });

  it('should get the active tab index', () => {
    const activeTabIndex = tabsHelper.getActiveTabIndex();
    expect(activeTabIndex).toBe(0);
  });

  it('should get the active tab', () => {
    const activeTab = tabsHelper.getActiveTab();
    expect(activeTab).toBeDefined();
  });

  it('should find link text by index', () => {
    const foundLinkText = tabsHelper.findLinkText(1);
    expect(foundLinkText).toBe('Tab 2');

    const notFoundLinkText = tabsHelper.findLinkText(-1);
    expect(notFoundLinkText).toBeUndefined();
  });

  it('should find link icon by index', () => {
    const foundIcon = tabsHelper.findLinkIcon(0);
    const actualIcon = fixture.debugElement.query(By.css('cds-icon'));

    expect(foundIcon).toBe(actualIcon);
  });

  it('should find content view', () => {
    const foundContentView = tabsHelper.findContentView();
    const actualContentView = fixture.debugElement.query(By.css('section.active'));
    expect(foundContentView).toBe(actualContentView);
  });

  it('should throw error when clicking invalid tab index', () => {
    expect(() => tabsHelper.clickLink(-1)).toThrowError('No tab link found at index -1');
  });

  it('should check if tabs are visible', () => {
    const areTabsVisible = tabsHelper.areTabsVisible();
    expect(areTabsVisible).toBe(true);
  });
});
