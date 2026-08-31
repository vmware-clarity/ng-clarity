/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsHelper } from '@clr/addons/testing';
import { ClrTabsModule } from '@clr/angular/layout/tabs';

import { AppfxTabsModule } from '../tabs.module';

describe('Directive: IfTabActive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let tabHelper: TabsHelper;

  @Component({
    imports: [AppfxTabsModule, ClrTabsModule],
    template: `<clr-tabs>
      <clr-tab id="tab1" appfxIfTabActive [activateTab]="activate === 'first'" [activeClass]="'activeTab'">
        <button clrTabLink>Tab1</button>
        <clr-tab-content *clrIfActive> tab1 content </clr-tab-content>
      </clr-tab>
      <clr-tab
        id="tab2"
        appfxIfTabActive
        [activateTab]="activate === 'second'"
        [activeClass]="'activeTab'"
        (appfxIfTabActiveChange)="onTabActiveChange($event)"
      >
        <button clrTabLink>Tab2</button>
        <clr-tab-content *clrIfActive> tab2 content </clr-tab-content>
      </clr-tab>
    </clr-tabs>`,
  })
  class TestComponent {
    @Input() activate: string;
    onTabActiveChange: (isActive: boolean) => void = () => {
      // no action
    };
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tabHelper = new TabsHelper(fixture.debugElement);
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('When active tab changes', () => {
    it('sets specified class to active tab', () => {
      const tab1 = tabHelper.getLinkList()[0];
      const tab2 = tabHelper.getLinkList()[1];
      const toggleClass = 'activeTab';

      expect(tab1.nativeElement.className).toContain(toggleClass);
      expect(tab2.nativeElement.className).not.toContain(toggleClass);

      tabHelper.clickLink(1);
      fixture.detectChanges();

      expect(tab1.nativeElement.className).not.toContain(toggleClass);
      expect(tab2.nativeElement.className).toContain(toggleClass);
    });

    it('notifies subscribers for active tab change', () => {
      spyOn(component, 'onTabActiveChange').and.callThrough();
      tabHelper.clickLink(1);
      fixture.detectChanges();
      expect(component.onTabActiveChange).toHaveBeenCalledWith(true);
      tabHelper.clickLink(0);
      fixture.detectChanges();
      expect(component.onTabActiveChange).toHaveBeenCalledWith(false);
    });
  });

  it('can activate tab from parent component by set activateTab to true', () => {
    spyOn(component, 'onTabActiveChange').and.callThrough();
    const tab1 = tabHelper.getLinkList()[0];
    const tab2 = tabHelper.getLinkList()[1];
    const toggleClass = 'activeTab';

    component.activate = 'second';
    fixture.detectChanges();
    expect(component.onTabActiveChange).toHaveBeenCalledWith(true);
    expect(tab1.nativeElement.className).not.toContain(toggleClass);
    expect(tab2.nativeElement.className).toContain(toggleClass);

    component.activate = 'first';
    fixture.detectChanges();
    expect(tab1.nativeElement.className).toContain(toggleClass);
    expect(tab2.nativeElement.className).not.toContain(toggleClass);
  });
});
