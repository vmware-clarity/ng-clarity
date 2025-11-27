/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrTab, ClrTabLink, ClrTabs, ClrTabsModule } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

import { AppfxA11yModule } from '../a11y.module';
import { ElementResizeService } from '../resize/element-resize.service';
import { resources } from './overflow-clr-tabs.directive';

@Component({
  imports: [AppfxA11yModule, ClrTabsModule, CommonModule],
  template: `
    <div [style.width]="width + 'px'">
      <clr-tabs appfxOverflowTabs>
        <clr-tab>
          <button clrTabLink [clrTabLinkInOverflow]="false" style="width: 50px">Tab 1</button>
          <clr-tab-content></clr-tab-content>
        </clr-tab>

        <clr-tab>
          <button clrTabLink [clrTabLinkInOverflow]="false" style="width: 50px">Tab 2</button>
          <clr-tab-content></clr-tab-content>
        </clr-tab>

        <clr-tab>
          <button clrTabLink [clrTabLinkInOverflow]="false" style="width: 50px">Tab 3</button>
          <clr-tab-content></clr-tab-content>
        </clr-tab>

        <clr-tab *ngIf="tab4Visible">
          <button clrTabLink [clrTabLinkInOverflow]="false" style="width: 50px">Tab 4</button>
          <clr-tab-content></clr-tab-content>
        </clr-tab>
      </clr-tabs>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep ul {
        display: flex;
        list-style-type: none;
        padding-inline-start: 0;
        gap: 0;
      }
    `,
  ],
  standalone: true,
})
export class ClrTabsHostComponent {
  // gap is set to 0 in styles to remove tabs gap and improve calculation of tests
  width = 160;
  tab4Visible = false;

  @ViewChild(ClrTabs) tabs: ClrTabs;

  @ViewChildren(ClrTabLink) tabLinks: QueryList<ClrTabLink>;

  get tabsInOverflow(): boolean[] {
    if (!this.tabLinks) {
      return [];
    }
    return this.tabLinks.map((tabLink: ClrTabLink) => tabLink.inOverflow);
  }
}

@Component({
  imports: [ClrTabsModule],
  template: `
    <clr-tabs>
      <clr-tab>
        <button clrTabLink [clrTabLinkInOverflow]="true">Tab 1</button>
        <clr-tab-content></clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
  standalone: true,
})
export class ComponentWithoutDirective {
  @ViewChild(ClrTabs) tabs: ClrTabs;
}

export class MockElementResizeService {
  resize = new Subject<void>();

  getResizeObservable(): Observable<void> {
    return this.resize.asObservable();
  }
}

interface ThisTest {
  fixture: ComponentFixture<ClrTabsHostComponent>;
  component: ClrTabsHostComponent;
  resizeService: MockElementResizeService;
}

function createComponentWithoutDirective(): ComponentFixture<ComponentWithoutDirective> {
  TestBed.configureTestingModule({
    imports: [ComponentWithoutDirective],
  });
  const fixture = TestBed.createComponent(ComponentWithoutDirective);
  fixture.detectChanges();
  return fixture;
}

function createThisTest(): ThisTest {
  TestBed.configureTestingModule({
    imports: [AppfxA11yModule, ClrTabsHostComponent],
    providers: [
      {
        provide: ElementResizeService,
        useClass: MockElementResizeService,
      },
    ],
  });

  const fixture = TestBed.createComponent(ClrTabsHostComponent);
  fixture.detectChanges();

  return {
    fixture: fixture,
    component: fixture.componentInstance,
    resizeService: <MockElementResizeService>TestBed.inject(ElementResizeService),
  };
}

describe('OverflowClrTabsDirective', () => {
  // OverflowClrTabsDirective uses some private fields of ClrTabs component.
  // This group of tests are added to detect if ClrTabs internals change in future versions.
  describe('Verify ClrTabs private fields used by OverflowClrTabsDirective', () => {
    it('ClrTabs has field tabs:QueryList', () => {
      const fixture = createComponentWithoutDirective();
      const clrTabs: ClrTabs = fixture.componentInstance.tabs;
      const tabs: QueryList<ClrTab> = clrTabs['tabs'];
      expect(tabs).toBeDefined();
      expect(tabs instanceof QueryList).toBeTruthy();
      expect(tabs.length).toEqual(1);
    });

    it('ClrTabs has field _tabOverflowEl: HTMLElement', function (this: ThisTest) {
      const fixture = createComponentWithoutDirective();
      const clrTabs: ClrTabs = fixture.componentInstance.tabs;
      expect(Object.prototype.hasOwnProperty.call(clrTabs, '_tabOverflowEl')).toBeTruthy();
    });

    it('ClrTabs._tabOverflowEl is set when More button is clicked', function (this: ThisTest) {
      const fixture = createComponentWithoutDirective();
      // Open the "More" button.
      const clrTabs: ClrTabs = fixture.componentInstance.tabs;
      clrTabs.toggleOverflowOnClick();
      fixture.detectChanges();

      expect(clrTabs['_tabOverflowEl'] instanceof HTMLElement).toBeTruthy();
      expect(clrTabs['_tabOverflowEl'].localName).toEqual('clr-tab-overflow-content');
    });
  });

  describe('ClrTabs integration tests', () => {
    afterEach(function (this: ThisTest) {
      if (this.fixture) {
        this.fixture.destroy();
      }
    });

    it('WHEN there is enough width THEN all tabs should be visible', function (this: ThisTest) {
      Object.assign(this, createThisTest());
      expect(this.component.tabsInOverflow).toEqual([false, false, false]);
    });

    it('1 tab in overflow', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.width = 140;
      this.fixture.detectChanges();

      this.resizeService.resize.next();
      tick(resources.layoutChangesDebounceDuration);
      expect(this.component.tabsInOverflow).toEqual([false, false, true]);
      tick(resources.initialLoadDelay);
    }));

    it('2 tabs in overflow', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.width = 90;
      this.fixture.detectChanges();

      this.resizeService.resize.next();
      tick(resources.layoutChangesDebounceDuration);

      expect(this.component.tabsInOverflow).toEqual([false, true, true]);
      tick(resources.initialLoadDelay);
    }));

    it('All tabs in overflow', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.width = 41;
      this.fixture.detectChanges();

      this.resizeService.resize.next();
      tick(resources.layoutChangesDebounceDuration);

      expect(this.component.tabsInOverflow).toEqual([true, true, true]);
      tick(resources.initialLoadDelay);
    }));

    it('Adding new tab in overflow', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.tab4Visible = true;
      this.fixture.detectChanges();

      tick(resources.layoutChangesDebounceDuration);
      expect(this.component.tabsInOverflow).toEqual([false, false, false, true]);
      tick(resources.initialLoadDelay);
    }));

    it('Adding new tab without overflow', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.width = 250;
      this.component.tab4Visible = true;
      this.fixture.detectChanges();

      tick(resources.layoutChangesDebounceDuration);
      expect(this.component.tabsInOverflow).toEqual([false, false, false, false]);
      tick(resources.initialLoadDelay);
    }));

    it('add proper classes to the buttons', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      // The first 2 buttons are visible, 3rd is in overflow.
      this.component.width = 140;
      this.fixture.detectChanges();

      this.resizeService.resize.next();
      tick(resources.layoutChangesDebounceDuration);

      let debugElements = this.fixture.debugElement.queryAll(By.css('button[clrTabLink]'));
      expect(debugElements.length).toEqual(2); // only the first 2 are visible

      // Verify the styles of the visible buttons.
      expect(debugElements[0].classes['nav-link']).toEqual(true);
      expect(debugElements[0].classes['btn-link']).toEqual(true);
      expect(debugElements[1].classes['nav-link']).toEqual(true);
      expect(debugElements[1].classes['btn-link']).toEqual(true);

      // Open the "More" button.
      const clrTabs: ClrTabs = this.fixture.componentInstance.tabs;
      clrTabs.toggleOverflowOnClick();
      this.fixture.detectChanges();

      // Now the 3 buttons should be visible
      debugElements = this.fixture.debugElement.queryAll(By.css('button[clrTabLink]'));
      expect(debugElements.length).toEqual(3);

      // Verify styles of the 3rd button (in overflow)
      expect(debugElements[2].classes['nav-link']).toBeUndefined();
      expect(debugElements[2].classes['btn-link']).toBeUndefined();
      tick(resources.initialLoadDelay);
    }));

    it('WHEN initialLoadDelay passes THEN overflow will be updated', fakeAsync(function (this: ThisTest) {
      Object.assign(this, createThisTest());
      this.component.width = 140;
      this.fixture.detectChanges();

      tick(resources.initialLoadDelay + resources.layoutChangesDebounceDuration);
      expect(this.component.tabsInOverflow).toEqual([false, false, true]);
    }));

    it('WHEN all tabs are in overflow THEN the Overflow dropdown has custom styling', fakeAsync(function (
      this: ThisTest
    ) {
      Object.assign(this, createThisTest());
      this.component.width = 41;
      this.fixture.detectChanges();

      this.resizeService.resize.next();
      tick(resources.layoutChangesDebounceDuration);

      // Open the "More" button.
      const clrTabs: ClrTabs = this.fixture.componentInstance.tabs;
      clrTabs.toggleOverflowOnClick();
      this.fixture.detectChanges();

      // Verify that styles are applied to the overflow dropdown element.
      const toggleEl: HTMLElement = clrTabs['_tabOverflowEl'];
      expect(toggleEl).toBeDefined();

      expect(toggleEl.style.left).toEqual('0px');
      expect(toggleEl.style.position).toEqual('fixed');
      expect(toggleEl.style.top).toEqual('auto');

      tick(resources.initialLoadDelay);
    }));
  });
});
