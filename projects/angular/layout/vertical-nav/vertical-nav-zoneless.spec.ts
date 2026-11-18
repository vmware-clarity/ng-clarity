/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, viewChild, viewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrIcon } from '@clr/angular/icon';
import { delay } from '@clr/angular/testing';
import { ClrCommonStringsService, commonStringsDefault } from '@clr/angular/utils';

import { ClrVerticalNav } from './vertical-nav';
import { ClrVerticalNavGroup } from './vertical-nav-group';
import { ClrVerticalNavModule } from './vertical-nav.module';

/**
 * OnPush host that drives the nav only through signals and template events. Nothing here calls `markForCheck()`
 * or `detectChanges()`: the views are refreshed only because the nav state is held in signals.
 */
@Component({
  template: `
    <clr-vertical-nav [clrVerticalNavCollapsible]="collapsible()" [(clrVerticalNavCollapsed)]="collapsed">
      <a clrVerticalNavLink href="#" (click)="$event.preventDefault()">
        @if (icons()) {
          <cds-icon shape="home" clrVerticalNavIcon></cds-icon>
        }
        <span class="link-label">{{ label() }}</span>
      </a>
      @if (groups()) {
        <clr-vertical-nav-group [(clrVerticalNavGroupExpanded)]="groupExpanded">
          <a clrVerticalNavLink href="#" class="group-link" (click)="$event.preventDefault()">Group link</a>
          @if (icons()) {
            <cds-icon shape="folder" clrVerticalNavIcon></cds-icon>
          }
          Group
          <clr-vertical-nav-group-children *clrIfExpanded>
            <a clrVerticalNavLink href="#" class="child-link">{{ label() }} child</a>
          </clr-vertical-nav-group-children>
        </clr-vertical-nav-group>
        <clr-vertical-nav-group>
          Second group
          <clr-vertical-nav-group-children *clrIfExpanded>
            <a clrVerticalNavLink href="#" class="second-child-link">Second child</a>
          </clr-vertical-nav-group-children>
        </clr-vertical-nav-group>
      }
    </clr-vertical-nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushVerticalNavHost {
  readonly collapsible = signal(true);
  readonly collapsed = signal(false);
  readonly groupExpanded = signal(false);
  readonly icons = signal(false);
  readonly groups = signal(false);
  readonly label = signal('Home');

  readonly nav = viewChild.required(ClrVerticalNav);
  readonly navGroups = viewChildren(ClrVerticalNavGroup);
}

/**
 * OnPush host with no output bindings, so that no output can refresh it: a change made through the component API is
 * rendered only if the state it writes is a signal.
 */
@Component({
  template: `
    <clr-vertical-nav [clrVerticalNavCollapsible]="true">
      <a clrVerticalNavLink href="#">Home</a>
      <clr-vertical-nav-group>
        Group
        <clr-vertical-nav-group-children *clrIfExpanded>
          <a clrVerticalNavLink href="#">Child</a>
        </clr-vertical-nav-group-children>
      </clr-vertical-nav-group>
    </clr-vertical-nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushVerticalNavApiHost {
  readonly nav = viewChild.required(ClrVerticalNav);
  readonly navGroup = viewChild.required(ClrVerticalNavGroup);
}

describe('ClrVerticalNav (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<unknown>;
  let host: OnPushVerticalNavHost;

  function nav(): HTMLElement {
    return fixture.nativeElement.querySelector('clr-vertical-nav');
  }

  function navClasses(): string[] {
    return ['is-collapsed', 'has-nav-groups', 'has-icons'].filter(name => nav().classList.contains(name));
  }

  function trigger(): HTMLButtonElement {
    return nav().querySelector('.nav-trigger');
  }

  function groups(): HTMLElement[] {
    return Array.from(nav().querySelectorAll('clr-vertical-nav-group'));
  }

  function groupStates(): string[] {
    return groups().map(
      group =>
        `${group.classList.contains('is-expanded')}/` +
        `${group.querySelector('.nav-group-trigger').getAttribute('aria-expanded')}/` +
        `${!!group.querySelector('clr-vertical-nav-group-children')}`
    );
  }

  function clickGroupTrigger(index: number) {
    groups()[index].querySelector<HTMLButtonElement>('.nav-group-trigger').click();
  }

  async function create() {
    TestBed.configureTestingModule({
      imports: [ClrVerticalNavModule, ClrIcon],
      declarations: [OnPushVerticalNavHost],
    });
    const hostFixture = TestBed.createComponent(OnPushVerticalNavHost);
    fixture = hostFixture;
    host = hostFixture.componentInstance;
    await fixture.whenStable();
  }

  afterEach(() => {
    fixture.destroy();
  });

  describe('collapse', () => {
    beforeEach(create);

    it('renders the expanded collapsible nav', () => {
      expect(navClasses()).toEqual([]);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(nav().querySelector('.nav-btn')).toBeNull();
    });

    it('collapses and expands through the toggle button, updating the host binding', async () => {
      trigger().click();
      await fixture.whenStable();

      expect(host.collapsed()).toBe(true);
      expect(navClasses()).toEqual(['is-collapsed']);
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(trigger().classList).toContain('on-collapse');
      expect(nav().querySelector('.nav-btn')).not.toBeNull();

      nav().querySelector<HTMLButtonElement>('.nav-btn').click();
      await fixture.whenStable();

      expect(host.collapsed()).toBe(false);
      expect(navClasses()).toEqual([]);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(nav().querySelector('.nav-btn')).toBeNull();
    });

    it('follows the collapsed and collapsible inputs', async () => {
      host.collapsed.set(true);
      await fixture.whenStable();

      expect(navClasses()).toEqual(['is-collapsed']);
      expect(trigger().getAttribute('aria-expanded')).toBe('false');

      host.collapsible.set(false);
      await fixture.whenStable();

      expect(navClasses()).toEqual([]);
      expect(trigger()).toBeNull();
      expect(nav().querySelector('.nav-btn')).toBeNull();
    });

    it('follows the strings localized after the first render', async () => {
      const commonStrings = TestBed.inject(ClrCommonStringsService);
      host.collapsed.set(true);
      await fixture.whenStable();

      commonStrings.localize({ verticalNavToggle: 'Navigation umschalten' });
      await fixture.whenStable();

      expect(trigger().getAttribute('aria-label')).toBe('Navigation umschalten');
      expect(nav().querySelector('.nav-btn').getAttribute('aria-label')).toBe('Navigation umschalten');
      commonStrings.localize(commonStringsDefault);
    });

    it('keeps refreshing projected content', async () => {
      host.label.set('Dashboard');
      await fixture.whenStable();

      expect(nav().querySelector('.link-label').textContent).toBe('Dashboard');
    });
  });

  describe('late children', () => {
    beforeEach(create);

    it('adds and removes the icon and group classes as icons and groups come and go', async () => {
      host.icons.set(true);
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-icons']);

      host.groups.set(true);
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-nav-groups', 'has-icons']);
      expect(groupStates()).toEqual(['false/false/false', 'false/false/false']);

      host.icons.set(false);
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-nav-groups']);

      host.groups.set(false);
      await fixture.whenStable();

      expect(navClasses()).toEqual([]);
      expect(groups()).toEqual([]);
    });
  });

  describe('groups', () => {
    beforeEach(async () => {
      await create();
      host.groups.set(true);
      await fixture.whenStable();
    });

    it('expands and collapses a group through its trigger, updating the two-way binding', async () => {
      clickGroupTrigger(0);
      await fixture.whenStable();

      expect(groupStates()).toEqual(['true/true/true', 'false/false/false']);
      expect(host.groupExpanded()).toBe(true);
      expect(nav().querySelector('.child-link').textContent).toBe('Home child');

      host.label.set('Dashboard');
      await fixture.whenStable();

      expect(nav().querySelector('.child-link').textContent).toBe('Dashboard child');

      clickGroupTrigger(0);
      await fixture.whenStable();

      expect(groupStates()).toEqual(['false/false/false', 'false/false/false']);
      expect(host.groupExpanded()).toBe(false);
    });

    it('follows the expanded input', async () => {
      host.groupExpanded.set(true);
      await fixture.whenStable();

      expect(groupStates()).toEqual(['true/true/true', 'false/false/false']);

      host.groupExpanded.set(false);
      await fixture.whenStable();

      expect(groupStates()).toEqual(['false/false/false', 'false/false/false']);
    });

    it('expands a group when one of its links is clicked', async () => {
      nav().querySelector<HTMLElement>('.group-link').click();
      await fixture.whenStable();

      expect(groupStates()).toEqual(['true/true/true', 'false/false/false']);
      expect(host.groupExpanded()).toBe(true);
    });

    it('closes the open groups while collapsed and reopens them when the nav expands', async () => {
      clickGroupTrigger(0);
      await fixture.whenStable();

      trigger().click();
      await fixture.whenStable();

      expect(navClasses()).toEqual(['is-collapsed', 'has-nav-groups']);
      expect(groupStates()).toEqual(['false/false/false', 'false/false/false']);
      expect(host.groupExpanded()).toBe(false);

      trigger().click();
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-nav-groups']);
      expect(groupStates()).toEqual(['true/true/true', 'false/false/false']);
      expect(host.groupExpanded()).toBe(true);
    });

    it('expands the collapsed nav when a group is opened', async () => {
      host.collapsed.set(true);
      await fixture.whenStable();

      clickGroupTrigger(1);
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-nav-groups']);
      expect(host.collapsed()).toBe(false);
      expect(groupStates()).toEqual(['false/false/false', 'true/true/true']);
    });

    it('leaves the nav working once its groups are removed', async () => {
      clickGroupTrigger(0);
      await fixture.whenStable();
      host.groups.set(false);
      await fixture.whenStable();

      expect(navClasses()).toEqual([]);

      // The removed groups no longer follow the nav collapse.
      trigger().click();
      await fixture.whenStable();
      trigger().click();
      await fixture.whenStable();

      expect(navClasses()).toEqual([]);
      expect(groups()).toEqual([]);
      expect(host.groupExpanded()).toBe(true);
    });
  });

  describe('component API, outside of any template event', () => {
    let api: OnPushVerticalNavApiHost;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [ClrVerticalNavModule],
        declarations: [OnPushVerticalNavApiHost],
      });
      const apiFixture = TestBed.createComponent(OnPushVerticalNavApiHost);
      fixture = apiFixture;
      api = apiFixture.componentInstance;
      await fixture.whenStable();
    });

    it('renders a collapse and an expand of the nav', async () => {
      api.nav().collapsed = true;
      await fixture.whenStable();

      expect(navClasses()).toEqual(['is-collapsed', 'has-nav-groups']);
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(nav().querySelector('.nav-btn')).not.toBeNull();

      api.nav().toggleByButton();
      await fixture.whenStable();

      expect(navClasses()).toEqual(['has-nav-groups']);
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(nav().querySelector('.nav-btn')).toBeNull();
    });

    it('renders a group expanded and collapsed, and the nav collapse closing it', async () => {
      const { nav: navComponent, navGroup } = api;
      navGroup().expandGroup();
      await fixture.whenStable();

      expect(groupStates()).toEqual(['true/true/true']);

      navComponent().collapsed = true;
      await fixture.whenStable();

      expect(navClasses()).toEqual(['is-collapsed', 'has-nav-groups']);
      expect(groupStates()).toEqual(['false/false/false']);

      navGroup().toggleExpand();
      await fixture.whenStable();

      // Opening a group expands the nav first.
      expect(navClasses()).toEqual(['has-nav-groups']);
      expect(groupStates()).toEqual(['true/true/true']);

      navGroup().collapseGroup();
      await fixture.whenStable();

      expect(groupStates()).toEqual(['false/false/false']);
    });
  });

  describe('with animations', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [ClrVerticalNavModule, ClrIcon],
        declarations: [OnPushVerticalNavHost],
        animationsEnabled: true,
      });
      const hostFixture = TestBed.createComponent(OnPushVerticalNavHost);
      fixture = hostFixture;
      host = hostFixture.componentInstance;
      host.groups.set(true);
      await fixture.whenStable();
    });

    function finishAnimations() {
      nav()
        .querySelectorAll('.nav-group-children')
        .forEach(children => children.getAnimations().forEach(animation => animation.finish()));
    }

    it('closes the group once its children have collapsed', async () => {
      clickGroupTrigger(0);
      await fixture.whenStable();
      finishAnimations();

      clickGroupTrigger(0);
      await fixture.whenStable();

      // Still open while the children collapse.
      expect(groupStates()).toEqual(['true/true/true', 'false/false/false']);

      finishAnimations();
      // The group closes when the animation's `finished` promise resolves, after the current task.
      await delay();
      await fixture.whenStable();

      expect(groupStates()).toEqual(['false/false/false', 'false/false/false']);
      expect(host.groupExpanded()).toBe(false);
    });
  });
});
