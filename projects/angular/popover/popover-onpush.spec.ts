/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTrigger } from '@clr/angular/popover/signpost';
import { ClrTooltipModule, ClrTooltipTrigger } from '@clr/angular/popover/tooltip';
import { ClrCommonStringsService } from '@clr/angular/utils';

// These hosts are OnPush and change only through signals or through code that notifies nothing,
// the way a Zone application changes them from a timer or an HTTP callback. The exhaustive
// checkNoChanges in the test setup fails any binding that such a change leaves stale.

@Component({
  template: `
    <clr-signpost [clrSignpostTriggerAriaLabel]="triggerLabel()" [clrSignpostHideTrigger]="hideTrigger()">
      @if (customTrigger()) {
        <button type="button" class="custom-trigger" clrSignpostTrigger>Custom</button>
      }
      <clr-signpost-content *clrIfOpen [clrSignpostCloseAriaLabel]="closeLabel()">
        <clr-signpost-title>{{ title() }}</clr-signpost-title>
        {{ body() }}
      </clr-signpost-content>
    </clr-signpost>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class SignpostHost {
  @ViewChild(ClrSignpost) signpost: ClrSignpost;
  @ViewChild(ClrSignpostContent) content: ClrSignpostContent;

  readonly triggerLabel = signal<string>(undefined);
  readonly hideTrigger = signal(false);
  readonly customTrigger = signal(false);
  readonly closeLabel = signal<string>(undefined);
  readonly title = signal('Title');
  readonly body = signal('Body');
}

@Component({
  template: `
    <clr-tooltip>
      <button type="button" clrTooltipTrigger>Trigger</button>
      @if (showContent()) {
        <clr-tooltip-content [id]="contentId()" [clrPosition]="position()" [clrSize]="size()">
          {{ text() }}
        </clr-tooltip-content>
      }
    </clr-tooltip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class TooltipHost {
  readonly showContent = signal(true);
  readonly contentId = signal('tooltip-1');
  readonly position = signal('right');
  readonly size = signal('sm');
  readonly text = signal('Tooltip text');
}

@Component({
  template: `
    <clr-dropdown [clrCloseMenuOnItemClick]="closeOnItemClick()">
      <button type="button" class="root-trigger" clrDropdownTrigger>Menu</button>
      <clr-dropdown-menu *clrIfOpen [clrPosition]="position()">
        @for (item of items(); track item) {
          <button type="button" clrDropdownItem>{{ item }}</button>
        }
        <clr-dropdown>
          <button type="button" class="nested-trigger" clrDropdownTrigger>More</button>
          <clr-dropdown-menu *clrIfOpen>
            <button type="button" clrDropdownItem>Nested</button>
          </clr-dropdown-menu>
        </clr-dropdown>
      </clr-dropdown-menu>
    </clr-dropdown>
    <clr-dropdown class="persistent">
      <button type="button" clrDropdownTrigger>Persistent</button>
      <clr-dropdown-menu><button type="button" clrDropdownItem>Always rendered</button></clr-dropdown-menu>
    </clr-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class DropdownHost {
  readonly closeOnItemClick = signal(true);
  readonly position = signal('bottom-left');
  readonly items = signal(['First', 'Second']);
}

@Component({
  template: `
    <clr-signpost>
      <clr-signpost-content *clrIfOpen>Body</clr-signpost-content>
    </clr-signpost>
    <clr-tooltip>
      <button type="button" clrTooltipTrigger>Trigger</button>
      <clr-tooltip-content [id]="contentId()">Text</clr-tooltip-content>
    </clr-tooltip>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
class DefaultHost {
  readonly contentId = signal('default-tooltip');
}

function popoverService(fixture: ComponentFixture<unknown>, selector: string) {
  return fixture.debugElement.query(By.css(selector)).injector.get(ClrPopoverService);
}

function overlay(selector: string): HTMLElement {
  return document.querySelector(`.cdk-overlay-container ${selector}`);
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Popover components under an OnPush host', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignpostHost, TooltipHost, DropdownHost],
      imports: [ClrSignpostModule, ClrTooltipModule, ClrDropdownModule],
    });
  });

  describe('signpost', () => {
    let fixture: ComponentFixture<SignpostHost>;
    let host: SignpostHost;
    const defaultTrigger = () => fixture.nativeElement.querySelector('.signpost-action') as HTMLButtonElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SignpostHost);
      host = fixture.componentInstance;
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });
    afterEach(() => fixture.destroy());

    it('renders bound inputs that change through signals', async () => {
      host.triggerLabel.set('Bound label');
      await fixture.whenStable();
      expect(defaultTrigger().getAttribute('aria-label')).toBe('Bound label');

      host.hideTrigger.set(true);
      await fixture.whenStable();
      expect(defaultTrigger()).toBeNull();

      host.hideTrigger.set(false);
      await fixture.whenStable();
      expect(defaultTrigger()).not.toBeNull();
    });

    it('renders common strings localized after the first render', async () => {
      defaultTrigger().click();
      await fixture.whenStable();

      TestBed.inject(ClrCommonStringsService).localize({
        signpostToggle: 'Show details',
        signpostClose: 'Hide details',
      });
      await fixture.whenStable();
      expect(defaultTrigger().getAttribute('aria-label')).toBe('Show details');
      expect(overlay('clr-signpost-content .close').getAttribute('aria-label')).toBe('Hide details');
    });

    it('swaps the default trigger for a custom trigger projected later, and back', async () => {
      host.customTrigger.set(true);
      await fixture.whenStable();
      expect(defaultTrigger()).toBeNull();
      expect(host.signpost.useCustomTrigger).toBe(true);

      const custom: HTMLButtonElement = fixture.nativeElement.querySelector('.custom-trigger');
      custom.click();
      await fixture.whenStable();
      expect(custom.getAttribute('aria-expanded')).toBe('true');
      expect(custom.classList).toContain('active');
      expect(custom.getAttribute('aria-controls')).toBe(overlay('clr-signpost-content').id);

      popoverService(fixture, 'clr-signpost').open = false;
      await fixture.whenStable();
      host.customTrigger.set(false);
      await fixture.whenStable();
      expect(defaultTrigger()).not.toBeNull();
      expect(host.signpost.useCustomTrigger).toBe(false);
    });

    it('updates the default trigger when the signpost opens and closes from code', async () => {
      const service = popoverService(fixture, 'clr-signpost');
      const trigger = defaultTrigger();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.hasAttribute('aria-controls')).toBe(false);

      service.open = true;
      await fixture.whenStable();
      const content = overlay('clr-signpost-content');
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.classList).toContain('active');
      expect(trigger.getAttribute('aria-controls')).toBe(content.id);
      expect(content.querySelector('.close').getAttribute('aria-controls')).toBe(content.id);

      service.open = false;
      await fixture.whenStable();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.classList).not.toContain('active');
      expect(overlay('clr-signpost-content')).toBeNull();
    });

    it('renders the close label and projected content while open', async () => {
      defaultTrigger().click();
      await fixture.whenStable();
      const close = () => overlay('clr-signpost-content .close');
      expect(close().getAttribute('aria-label')).toBe('Close');

      host.closeLabel.set('Bound close');
      host.title.set('New title');
      host.body.set('New body');
      await fixture.whenStable();
      expect(close().getAttribute('aria-label')).toBe('Bound close');
      expect(overlay('clr-signpost-title').textContent).toContain('New title');
      expect(overlay('.signpost-content-body').textContent).toContain('New body');
    });

    it('closes from the close button and returns focus to the trigger', async () => {
      const trigger = defaultTrigger();
      trigger.click();
      await fixture.whenStable();

      (overlay('clr-signpost-content .close') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(overlay('clr-signpost-content')).toBeNull();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger);
    });

    it('stops following the popover once the trigger is destroyed', async () => {
      host.customTrigger.set(true);
      await fixture.whenStable();
      const service = popoverService(fixture, 'clr-signpost');
      service.open = true;
      await fixture.whenStable();

      const custom: HTMLButtonElement = fixture.nativeElement.querySelector('.custom-trigger');
      const focus = vi.spyOn(custom, 'focus');
      host.customTrigger.set(false);
      await fixture.whenStable();
      service.open = false;
      await fixture.whenStable();
      expect(focus).not.toHaveBeenCalled();
    });
  });

  describe('tooltip', () => {
    let fixture: ComponentFixture<TooltipHost>;
    let host: TooltipHost;
    const trigger = () => fixture.nativeElement.querySelector('[clrTooltipTrigger]') as HTMLButtonElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TooltipHost);
      host = fixture.componentInstance;
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });
    afterEach(() => fixture.destroy());

    it('describes the trigger with the content id, including a later id', async () => {
      expect(trigger().getAttribute('aria-describedby')).toBe('tooltip-1');

      host.contentId.set('tooltip-2');
      await fixture.whenStable();
      expect(trigger().getAttribute('aria-describedby')).toBe('tooltip-2');
    });

    it('describes the trigger with content that is projected later', async () => {
      host.showContent.set(false);
      await fixture.whenStable();
      host.contentId.set('late-tooltip');
      host.showContent.set(true);
      await fixture.whenStable();
      expect(trigger().getAttribute('aria-describedby')).toBe('late-tooltip');
    });

    it('opens on hover, updates size and text while open, and closes after the mouse leaves', async () => {
      trigger().dispatchEvent(new MouseEvent('mouseenter'));
      await fixture.whenStable();
      const content = () => overlay('clr-tooltip-content');
      expect(content()).not.toBeNull();
      expect(content().classList).toContain('tooltip-sm');

      host.size.set('lg');
      host.text.set('Changed text');
      await fixture.whenStable();
      expect(content().classList).toContain('tooltip-lg');
      expect(content().classList).not.toContain('tooltip-sm');
      expect(content().textContent).toContain('Changed text');

      trigger().dispatchEvent(new MouseEvent('mouseleave'));
      await wait(150);
      await fixture.whenStable();
      expect(popoverService(fixture, 'clr-tooltip').open).toBe(false);
      // Closing moves the content out of the overlay, back to where it was declared.
      expect(content()).toBeNull();
      expect(fixture.nativeElement.querySelector('clr-tooltip-content').textContent).toContain('Changed text');
    });
  });

  describe('dropdown', () => {
    let fixture: ComponentFixture<DropdownHost>;
    let host: DropdownHost;
    const rootDropdown = () => fixture.nativeElement.querySelector('clr-dropdown') as HTMLElement;
    const rootTrigger = () => fixture.nativeElement.querySelector('.root-trigger') as HTMLButtonElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(DropdownHost);
      host = fixture.componentInstance;
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });
    afterEach(() => fixture.destroy());

    it('opens from the keyboard and renders items added while it is open', async () => {
      rootTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await fixture.whenStable();
      expect(rootDropdown().classList).toContain('open');
      expect(rootTrigger().getAttribute('aria-expanded')).toBe('true');

      host.items.update(items => [...items, 'Third']);
      await fixture.whenStable();
      const labels = Array.from(document.querySelectorAll('.cdk-overlay-container [clrDropdownItem]')).map(item =>
        item.textContent.trim()
      );
      expect(labels).toEqual(['First', 'Second', 'Third']);
    });

    it('opens a nested menu and closes every menu after an item click', async () => {
      rootTrigger().click();
      await fixture.whenStable();
      (overlay('.nested-trigger') as HTMLButtonElement).click();
      await fixture.whenStable();
      const nested = overlay('.nested-trigger').closest('clr-dropdown');
      expect(nested.classList).toContain('open');
      expect(overlay('.nested-trigger').classList).toContain('active');

      const nestedItem = Array.from(
        document.querySelectorAll<HTMLElement>('.cdk-overlay-container [clrDropdownItem]')
      ).find(item => item.textContent.includes('Nested'));
      nestedItem.click();
      await wait(0);
      await fixture.whenStable();
      expect(rootDropdown().classList).not.toContain('open');
      expect(rootTrigger().getAttribute('aria-expanded')).toBe('false');
      expect(overlay('.dropdown-menu')).toBeNull();
    });

    it('keeps the menu open after an item click when the bound input says so', async () => {
      host.closeOnItemClick.set(false);
      await fixture.whenStable();
      rootTrigger().click();
      await fixture.whenStable();
      (overlay('[clrDropdownItem]') as HTMLButtonElement).click();
      await wait(0);
      await fixture.whenStable();
      expect(rootDropdown().classList).toContain('open');
    });

    it('closes on an outside click', async () => {
      rootTrigger().click();
      await fixture.whenStable();
      document.body.click();
      await fixture.whenStable();
      expect(rootDropdown().classList).not.toContain('open');
      expect(overlay('.dropdown-menu')).toBeNull();
    });

    it('hides a menu without clrIfOpen until it opens', async () => {
      const menu = () =>
        document.querySelector('clr-dropdown.persistent clr-dropdown-menu, .cdk-overlay-container clr-dropdown-menu');
      expect(menu().classList).toContain('is-off-screen');

      popoverService(fixture, 'clr-dropdown.persistent').open = true;
      await fixture.whenStable();
      expect(menu().classList).not.toContain('is-off-screen');
      expect(fixture.nativeElement.querySelector('clr-dropdown.persistent').classList).toContain('open');
    });
  });
});

describe('Popover triggers under a Default host', () => {
  let fixture: ComponentFixture<DefaultHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DefaultHost],
      imports: [ClrSignpostModule, ClrTooltipModule],
    });
    fixture = TestBed.createComponent(DefaultHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });
  afterEach(() => fixture.destroy());

  it('updates the signpost trigger attributes when the signpost opens and closes', async () => {
    const trigger = fixture.nativeElement.querySelector('.signpost-action') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    popoverService(fixture, 'clr-signpost').open = true;
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.classList).toContain('active');
    expect(trigger.getAttribute('aria-controls')).toBe(overlay('clr-signpost-content').id);

    popoverService(fixture, 'clr-signpost').open = false;
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.classList).not.toContain('active');
  });

  it('describes the tooltip trigger with the content id', async () => {
    const trigger = fixture.nativeElement.querySelector('[clrTooltipTrigger]') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-describedby')).toBe('default-tooltip');

    fixture.componentInstance.contentId.set('default-tooltip-2');
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-describedby')).toBe('default-tooltip-2');
  });

  it('keeps the trigger members writable and ngOnDestroy callable', async () => {
    const signpostTrigger = fixture.debugElement
      .query(By.directive(ClrSignpostTrigger))
      .injector.get(ClrSignpostTrigger);
    signpostTrigger.isOpen = true;
    signpostTrigger.ariaExpanded = true;
    signpostTrigger.ariaControl = 'custom-id';
    expect(signpostTrigger.isOpen).toBe(true);
    expect(signpostTrigger.ariaExpanded).toBe(true);
    expect(signpostTrigger.ariaControl).toBe('custom-id');

    const tooltipTrigger = fixture.debugElement.query(By.directive(ClrTooltipTrigger)).injector.get(ClrTooltipTrigger);
    tooltipTrigger.ariaDescribedBy = 'custom-description';
    expect(tooltipTrigger.ariaDescribedBy).toBe('custom-description');
    expect(() => tooltipTrigger.ngOnDestroy()).not.toThrow();
  });
});
