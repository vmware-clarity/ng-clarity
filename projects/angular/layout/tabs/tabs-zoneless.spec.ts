/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrCommonStringsService, IfActiveService } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { TabsService } from './providers/tabs.service';
import { ClrTab } from './tab';
import { ClrTabLink } from './tab-link.directive';
import { ClrTabs } from './tabs';
import { ClrTabsModule } from './tabs.module';

/**
 * OnPush component that renders the active state of the tab it is placed in.
 * It never calls `markForCheck()`: it is only refreshed because `ClrTab.active` is derived from a signal.
 */
@Component({
  selector: 'active-probe',
  template: `<span class="probe">{{ tab.active ? 'active' : 'inactive' }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ActiveProbe {
  constructor(public tab: ClrTab) {}
}

@Component({
  template: `
    <clr-tabs>
      <clr-tab>
        <button clrTabLink>Static 1</button>
        <clr-tab-content><active-probe></active-probe></clr-tab-content>
      </clr-tab>
      <clr-tab>
        <button clrTabLink>Static 2</button>
        <clr-tab-content><active-probe></active-probe></clr-tab-content>
      </clr-tab>
      @for (tab of lateTabs(); track tab) {
        <clr-tab>
          <button clrTabLink>{{ tab }}</button>
          <clr-tab-content *clrIfActive="selected() === tab">
            <span class="late-content">{{ tab }} content</span>
            <active-probe></active-probe>
          </clr-tab-content>
        </clr-tab>
      }
    </clr-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ZonelessTabsHost {
  readonly lateTabs = signal<string[]>([]);
  readonly selected = signal('');
}

describe('ClrTabs (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ZonelessTabsHost>;

  function tabLinks(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[clrTabLink]'));
  }

  function linkStates(): string[] {
    return tabLinks().map(
      link =>
        `${link.classList.contains('active')}/${link.getAttribute('aria-selected')}/${link.getAttribute('tabindex')}`
    );
  }

  function visibleContents(): boolean[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('section.tab-content')).map(
      section => !section.hidden && section.getAttribute('aria-hidden') === 'false'
    );
  }

  function probeTexts(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.probe')).map(probe =>
      probe.textContent.trim()
    );
  }

  function ifActiveService(): IfActiveService {
    return fixture.debugElement.query(By.directive(ClrTabs)).injector.get(IfActiveService);
  }

  function tabIds(): number[] {
    return fixture.debugElement.queryAll(By.directive(ClrTabLink)).map(link => link.injector.get(ClrTabLink).id);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ZonelessTabsHost, ActiveProbe],
      imports: [ClrTabsModule],
    });

    fixture = TestBed.createComponent(ZonelessTabsHost);
    await fixture.whenStable();
  });

  it('activates the first tab initially', () => {
    expect(linkStates()).toEqual(['true/true/0', 'false/false/-1']);
    expect(visibleContents()).toEqual([true, false]);
    expect(probeTexts()).toEqual(['active', 'inactive']);
  });

  it('updates links, transplanted contents and OnPush probes when a tab link is clicked', async () => {
    tabLinks()[1].click();
    await fixture.whenStable();

    expect(linkStates()).toEqual(['false/false/-1', 'true/true/0']);
    expect(visibleContents()).toEqual([false, true]);
    expect(probeTexts()).toEqual(['inactive', 'active']);

    tabLinks()[0].click();
    await fixture.whenStable();

    expect(linkStates()).toEqual(['true/true/0', 'false/false/-1']);
    expect(visibleContents()).toEqual([true, false]);
    expect(probeTexts()).toEqual(['active', 'inactive']);
  });

  it('updates the tabs when the active tab is changed programmatically', async () => {
    // Late change, outside of any template event and without markForCheck(): only the signals refresh the views.
    ifActiveService().current = tabIds()[1];
    await fixture.whenStable();

    expect(linkStates()).toEqual(['false/false/-1', 'true/true/0']);
    expect(visibleContents()).toEqual([false, true]);
    expect(probeTexts()).toEqual(['inactive', 'active']);
  });

  it('renders and activates a tab added late through @for', async () => {
    fixture.componentInstance.lateTabs.set(['Late']);
    await fixture.whenStable();

    expect(tabLinks().map(link => link.textContent.trim())).toEqual(['Static 1', 'Static 2', 'Late']);
    expect(linkStates()).toEqual(['true/true/0', 'false/false/-1', 'false/false/-1']);
    expect(fixture.nativeElement.querySelector('.late-content')).toBeNull();

    fixture.componentInstance.selected.set('Late');
    await fixture.whenStable();

    expect(linkStates()).toEqual(['false/false/-1', 'false/false/-1', 'true/true/0']);
    expect(visibleContents()).toEqual([false, false, true]);
    expect(fixture.nativeElement.querySelector('.late-content').textContent).toContain('Late content');
    expect(probeTexts()).toEqual(['inactive', 'inactive', 'active']);

    tabLinks()[0].click();
    await fixture.whenStable();

    // The late content is rendered with *clrIfActive, so it is removed once its tab is no longer active.
    expect(linkStates()).toEqual(['true/true/0', 'false/false/-1', 'false/false/-1']);
    expect(visibleContents()).toEqual([true, false]);
    expect(fixture.nativeElement.querySelector('.late-content')).toBeNull();
    expect(probeTexts()).toEqual(['active', 'inactive']);
  });

  it('activates a late tab by clicking its link', async () => {
    fixture.componentInstance.lateTabs.set(['Late 1', 'Late 2']);
    await fixture.whenStable();

    tabLinks()[3].click();
    await fixture.whenStable();

    expect(linkStates()).toEqual(['false/false/-1', 'false/false/-1', 'false/false/-1', 'true/true/0']);
    expect(fixture.nativeElement.querySelector('.late-content').textContent).toContain('Late 2 content');
    expect(probeTexts()).toEqual(['inactive', 'inactive', 'active']);
  });
});

@Component({
  template: `
    <clr-tabs [clrLayout]="layout()">
      <clr-tab>
        <button clrTabLink [id]="firstLinkId()">First</button>
        <clr-tab-content [id]="firstContentId()">First content</clr-tab-content>
      </clr-tab>
      @if (middleTab()) {
        <clr-tab>
          <button clrTabLink>Middle</button>
          <clr-tab-content>Middle content</clr-tab-content>
        </clr-tab>
      }
      <clr-tab>
        <button clrTabLink [clrTabLinkInOverflow]="lastInOverflow()">Last</button>
        <clr-tab-content>Last content</clr-tab-content>
      </clr-tab>
      @if (actions()) {
        <clr-tabs-actions>
          <button class="btn" clrTabAction>Action</button>
        </clr-tabs-actions>
      }
    </clr-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushTabsHost {
  readonly layout = signal('horizontal');
  readonly firstLinkId = signal('first-link');
  readonly firstContentId = signal('first-content');
  readonly middleTab = signal(false);
  readonly lastInOverflow = signal(false);
  readonly actions = signal(false);

  @ViewChild(ClrTabs) tabs: ClrTabs;
  @ViewChildren(ClrTabLink) tabLinks: QueryList<ClrTabLink>;
}

describe('ClrTabs (zoneless, OnPush host): overflow, layout and late children', () => {
  let fixture: ComponentFixture<OnPushTabsHost>;
  let host: OnPushTabsHost;
  let element: HTMLElement;

  function texts(selector: string): string[] {
    return Array.from<HTMLElement>(element.querySelectorAll(selector)).map(item => item.textContent.trim());
  }

  function link(text: string): HTMLElement {
    return Array.from<HTMLElement>(element.querySelectorAll('[clrTabLink]')).find(
      item => item.textContent.trim() === text
    );
  }

  function overflowTrigger(): HTMLElement {
    return element.querySelector('.tabs-overflow .dropdown-toggle');
  }

  function sections(): HTMLElement[] {
    return Array.from(element.querySelectorAll('section.tab-content'));
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [OnPushTabsHost],
      imports: [ClrTabsModule],
    });

    fixture = TestBed.createComponent(OnPushTabsHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('moves a link into and out of the overflow when its input signal changes', async () => {
    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First', 'Last']);
    expect(overflowTrigger()).toBeNull();

    host.lastInOverflow.set(true);
    await fixture.whenStable();

    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First']);
    expect(overflowTrigger()).not.toBeNull();
    // Links in the closed overflow menu are not attached to the document.
    expect(host.tabLinks.last.el.nativeElement.classList).not.toContain('nav-link');

    overflowTrigger().click();
    await fixture.whenStable();

    expect(texts('clr-tab-overflow-content [clrTabLink]')).toEqual(['Last']);

    link('Last').click();
    await fixture.whenStable();

    expect(overflowTrigger().classList).toContain('active');
    expect(sections().map(section => section.hidden)).toEqual([true, false]);

    host.lastInOverflow.set(false);
    await fixture.whenStable();

    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First', 'Last']);
    expect(overflowTrigger()).toBeNull();
    expect(link('Last').classList).toContain('nav-link');
    expect(link('Last').classList).toContain('active');
  });

  it('moves a link into the overflow when inOverflow is set directly', async () => {
    // Set outside of any template binding or event, without markForCheck(), the way a directive measuring the
    // available width does (see the addons overflow directive).
    host.tabLinks.last.inOverflow = true;
    await fixture.whenStable();

    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First']);
    expect(overflowTrigger()).not.toBeNull();
    // Links in the closed overflow menu are not attached to the document.
    expect(host.tabLinks.last.el.nativeElement.classList).not.toContain('nav-link');

    host.tabLinks.last.inOverflow = false;
    await fixture.whenStable();

    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First', 'Last']);
    expect(overflowTrigger()).toBeNull();
  });

  it('has no overflow in the vertical layout', async () => {
    host.lastInOverflow.set(true);
    await fixture.whenStable();
    expect(overflowTrigger()).not.toBeNull();

    host.layout.set('vertical');
    await fixture.whenStable();

    expect(element.querySelector('clr-tabs').classList).toContain('tabs-vertical');
    expect(overflowTrigger()).toBeNull();
    expect(texts('ul.nav > li.nav-item [clrTabLink]')).toEqual(['First', 'Last']);
    expect(link('Last').classList).toContain('nav-link');

    host.layout.set('horizontal');
    await fixture.whenStable();

    expect(element.querySelector('clr-tabs').classList).not.toContain('tabs-vertical');
    expect(overflowTrigger()).not.toBeNull();
  });

  it('refreshes the layout when it is set from code', async () => {
    const tabsService = fixture.debugElement.query(By.directive(ClrTabs)).injector.get(TabsService);
    host.lastInOverflow.set(true);
    await fixture.whenStable();
    expect(overflowTrigger()).not.toBeNull();

    tabsService.layout = 'vertical';
    await fixture.whenStable();

    expect(overflowTrigger()).toBeNull();
    expect(link('Last').classList).toContain('nav-link');

    tabsService.layout = 'horizontal';
    await fixture.whenStable();

    expect(overflowTrigger()).not.toBeNull();
  });

  it('keeps tabLinkElements assignable', () => {
    const elements = [document.createElement('button')];
    host.tabs.tabLinkElements = elements;

    expect(host.tabs.tabLinkElements).toBe(elements);
  });

  it('renders a late tab in its place, keeps keyboard order and cleans it up when removed', async () => {
    const tabsService = fixture.debugElement.query(By.directive(ClrTabs)).injector.get(TabsService);

    host.middleTab.set(true);
    await fixture.whenStable();

    expect(texts('ul.nav [clrTabLink]')).toEqual(['First', 'Middle', 'Last']);
    expect(host.tabs.tabLinkElements.map(item => item.textContent.trim())).toEqual(['First', 'Middle', 'Last']);
    expect(tabsService.children.length).toBe(3);
    expect(sections().length).toBe(3);

    link('First').focus();
    link('First').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(link('Middle'));

    link('Middle').click();
    await fixture.whenStable();
    expect(link('Middle').getAttribute('aria-selected')).toBe('true');

    host.middleTab.set(false);
    await fixture.whenStable();

    expect(texts('ul.nav [clrTabLink]')).toEqual(['First', 'Last']);
    expect(host.tabs.tabLinkElements.map(item => item.textContent.trim())).toEqual(['First', 'Last']);
    expect(tabsService.children.length).toBe(2);
    expect(sections().length).toBe(2);
    expect(element.textContent).not.toContain('Middle content');
  });

  it('adds late tab actions to the keyboard order', async () => {
    host.actions.set(true);
    await fixture.whenStable();

    const action: HTMLElement = element.querySelector('[clrTabAction]');
    expect(host.tabs.tabLinkElements).toEqual([link('First'), link('Last'), action]);

    link('Last').focus();
    link('Last').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(action);

    host.actions.set(false);
    await fixture.whenStable();

    expect(host.tabs.tabLinkElements).toEqual([link('First'), link('Last')]);
  });

  it('translates the overflow button when the strings are localized after the first render', async () => {
    host.lastInOverflow.set(true);
    await fixture.whenStable();
    expect(overflowTrigger().getAttribute('title')).toBe('More');

    TestBed.inject(ClrCommonStringsService).localize({ more: 'Mehr' });
    await fixture.whenStable();

    expect(overflowTrigger().getAttribute('title')).toBe('Mehr');
    expect(overflowTrigger().querySelector('cds-icon').getAttribute('title')).toBe('Mehr');
  });

  it('keeps the link and content ARIA references in sync when their ids change', async () => {
    expect(link('First').id).toBe('first-link');
    expect(link('First').getAttribute('aria-controls')).toBe('first-content');
    expect(sections()[0].id).toBe('first-content');
    expect(sections()[0].getAttribute('aria-labelledby')).toBe('first-link');

    // Each id on its own: the other side reads it from a different view.
    host.firstLinkId.set('renamed-link');
    await fixture.whenStable();

    expect(link('First').id).toBe('renamed-link');
    expect(sections()[0].getAttribute('aria-labelledby')).toBe('renamed-link');

    host.firstContentId.set('renamed-content');
    await fixture.whenStable();

    expect(sections()[0].id).toBe('renamed-content');
    expect(link('First').getAttribute('aria-controls')).toBe('renamed-content');
    expect(sections()[0].getAttribute('aria-labelledby')).toBe('renamed-link');
  });
});

/** Eager consumer component with a plain field, the way a Zone app writes it. */
@Component({
  selector: 'eager-content',
  template: `<span class="eager-content">{{ status }}</span>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class EagerContent {
  status = 'loading';
}

@Component({
  template: `
    <clr-tabs [clrLayout]="layout">
      <clr-tab>
        <button clrTabLink>{{ firstTitle }}</button>
        <clr-tab-content><eager-content></eager-content></clr-tab-content>
      </clr-tab>
      <clr-tab>
        <button clrTabLink [clrTabLinkInOverflow]="inOverflow">Second</button>
        <clr-tab-content>{{ secondText }}</clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class EagerTabsHost {
  layout = 'horizontal';
  firstTitle = 'First';
  secondText = 'Second content';
  inOverflow = false;

  @ViewChild(EagerContent) content: EagerContent;
}

describe('ClrTabs (Eager host with plain fields, refreshed by a full tick)', () => {
  let fixture: ComponentFixture<EagerTabsHost>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [EagerTabsHost, EagerContent],
      imports: [ClrTabsModule],
    });

    fixture = TestBed.createComponent(EagerTabsHost);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('refreshes projected links and contents, and consumer components inside them', () => {
    // Plain field writes, as after an HTTP response or a timer in a Zone app, then the tick that Zone.js triggers:
    // renderFixture() refreshes the root and every Eager view below it, and OnPush views only when they are dirty.
    fixture.componentInstance.firstTitle = 'Renamed';
    fixture.componentInstance.secondText = 'Loaded content';
    fixture.componentInstance.content.status = 'ready';
    renderFixture(fixture);

    expect(element.querySelector('ul.nav [clrTabLink]').textContent.trim()).toBe('Renamed');
    expect(element.querySelector('.eager-content').textContent).toBe('ready');
    expect(element.querySelectorAll('section.tab-content')[1].textContent.trim()).toBe('Loaded content');
  });

  it('refreshes the overflow and the layout from plain input bindings', () => {
    fixture.componentInstance.inOverflow = true;
    renderFixture(fixture);

    expect(element.querySelector('.tabs-overflow')).not.toBeNull();

    fixture.componentInstance.layout = 'vertical';
    renderFixture(fixture);

    expect(element.querySelector('clr-tabs').classList).toContain('tabs-vertical');
    expect(element.querySelector('.tabs-overflow')).toBeNull();
  });
});

@Component({
  template: `
    <clr-tabs>
      @for (tab of tabs(); track tab) {
        <clr-tab>
          <button clrTabLink [id]="'link-' + tab">{{ tab }}</button>
          <clr-tab-content [id]="'content-' + tab">{{ tab }} content</clr-tab-content>
        </clr-tab>
      }
    </clr-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ReorderTabsHost {
  readonly tabs = signal(['a', 'b', 'c']);
}

describe('ClrTabs (zoneless, OnPush host): swapped and replaced tabs', () => {
  let fixture: ComponentFixture<ReorderTabsHost>;
  let element: HTMLElement;

  function aria(): string[] {
    return Array.from<HTMLElement>(element.querySelectorAll('section.tab-content')).map(
      section => section.id + ':' + section.getAttribute('aria-labelledby')
    );
  }

  function controls(): string[] {
    return Array.from<HTMLElement>(element.querySelectorAll('[clrTabLink]')).map(
      item => item.id + ':' + item.getAttribute('aria-controls')
    );
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ReorderTabsHost],
      imports: [ClrTabsModule],
    });

    fixture = TestBed.createComponent(ReorderTabsHost);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('keeps aria-labelledby and aria-controls correct when tabs are reordered', async () => {
    expect(controls()).toEqual(['link-a:content-a', 'link-b:content-b', 'link-c:content-c']);

    fixture.componentInstance.tabs.set(['c', 'b', 'a']);
    await fixture.whenStable();

    expect(controls()).toEqual(['link-c:content-c', 'link-b:content-b', 'link-a:content-a']);
    expect(aria().sort()).toEqual(['content-a:link-a', 'content-b:link-b', 'content-c:link-c']);
  });

  it('keeps aria-labelledby and aria-controls correct when a tab is replaced', async () => {
    fixture.componentInstance.tabs.set(['a', 'd', 'c']);
    await fixture.whenStable();

    expect(controls()).toEqual(['link-a:content-a', 'link-d:content-d', 'link-c:content-c']);
    expect(aria().sort()).toEqual(['content-a:link-a', 'content-c:link-c', 'content-d:link-d']);
  });
});
