/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IfActiveService } from '@clr/angular/utils';

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
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
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
