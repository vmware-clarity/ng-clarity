/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ErrorHandler,
  NgZone,
  provideCheckNoChangesConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrComboboxModule } from '@clr/angular/forms/combobox';
import { ComboboxFocusHandler } from '@clr/angular/forms/combobox/providers/combobox-focus-handler.service';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';

import { ClrPopoverModuleNext } from './popover.module';
import { ClrPopoverService } from './providers/popover.service';

@Component({
  template: `
    @if (show()) {
      <clr-dropdown>
        <button clrDropdownTrigger>Menu</button>
        <clr-dropdown-menu *clrIfOpen
          ><button clrDropdownItem clrPopoverCloseButton (clrPopoverOnCloseChange)="closed.push('dropdown')">
            Action
          </button></clr-dropdown-menu
        >
      </clr-dropdown>
      <clr-dropdown class="persistent">
        <button clrDropdownTrigger>Persistent menu</button>
        <clr-dropdown-menu><button clrDropdownItem>Persistent action</button></clr-dropdown-menu>
      </clr-dropdown>
      <clr-signpost>
        <button clrSignpostTrigger>Info</button>
        <clr-signpost-content *clrIfOpen
          >Details<button clrPopoverCloseButton (clrPopoverOnCloseChange)="closed.push('signpost')">
            Close
          </button></clr-signpost-content
        >
      </clr-signpost>
      <clr-combobox [ngModel]="selection()" (ngModelChange)="selection.set($event)">
        <clr-options
          ><clr-option [clrValue]="'First'">First</clr-option
          ><clr-option [clrValue]="'Second'">Second</clr-option></clr-options
        >
      </clr-combobox>
    }
    <button class="outside">Outside</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class PopoverHost {
  readonly closed: string[] = [];
  readonly show = signal(true);
  readonly selection = signal<string>(null);
}

for (const zoneless of [false, true]) {
  describe(`Popover notifications (${zoneless ? 'zoneless' : 'zone-based'}, OnPush host)`, () => {
    let fixture: ComponentFixture<PopoverHost>;
    const service = (selector: string) => fixture.debugElement.query(By.css(selector)).injector.get(ClrPopoverService);
    const trigger = (selector: string) => fixture.nativeElement.querySelector(selector) as HTMLButtonElement;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [PopoverHost],
        imports: [FormsModule, ClrDropdownModule, ClrSignpostModule, ClrComboboxModule, ClrPopoverModuleNext],
        providers: [
          zoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection(),
          provideCheckNoChangesConfig({ exhaustive: true }),
        ],
      });
      fixture = TestBed.createComponent(PopoverHost);
      fixture.autoDetectChanges();
      await fixture.whenStable();
    });
    afterEach(() => fixture.destroy());

    it('reflects programmatic open and native Escape close on the dropdown trigger', async () => {
      const popover = service('clr-dropdown');
      const button = trigger('[clrDropdownTrigger]');
      popover.open = true;
      await fixture.whenStable();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).not.toBeNull();
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await fixture.whenStable();
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).toBeNull();
      expect(document.activeElement).toBe(button);
    });

    it('updates signpost trigger state on programmatic changes and preserves outside focus', async () => {
      const popover = service('clr-signpost');
      const button = trigger('[clrSignpostTrigger]');
      popover.open = true;
      await fixture.whenStable();
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.classList.contains('active')).toBeTrue();
      const outside = trigger('.outside');
      outside.focus();
      outside.click();
      await fixture.whenStable();
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.classList.contains('active')).toBeFalse();
      expect(document.querySelector('clr-signpost-content')).toBeNull();
      expect(document.activeElement).toBe(outside);
    });

    it('closes the combobox options and updates aria-expanded on native Escape', async () => {
      const popover = service('clr-combobox');
      popover.open = true;
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('[role="combobox"]');
      expect(input.getAttribute('aria-expanded')).toBe('true');
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await fixture.whenStable();
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(popover.open).toBeFalse();
    });

    it('updates combobox pseudo-focus and closes on native blur', async () => {
      const popover = service('clr-combobox');
      const input: HTMLInputElement = fixture.nativeElement.querySelector('[role="combobox"]');
      input.focus();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await fixture.whenStable();
      expect(popover.open).toBeTrue();
      expect(input.getAttribute('aria-expanded')).toBe('true');
      const active = document.getElementById(input.getAttribute('aria-activedescendant'));
      expect(active).not.toBeNull();
      expect(active.textContent).toContain('First');
      trigger('.outside').focus();
      await fixture.whenStable();
      expect(input.getAttribute('aria-expanded')).toBe('false');
      expect(popover.open).toBeFalse();
    });

    it('notifies the host when the origin observer closes the popover and disconnects it', async () => {
      let callback: IntersectionObserverCallback;
      const observer = jasmine.createSpyObj<IntersectionObserver>('IntersectionObserver', ['observe', 'disconnect']);
      spyOn(window, 'IntersectionObserver').and.callFake(function (cb) {
        callback = cb;
        return observer;
      });
      const popover = service('clr-signpost');
      popover.open = true;
      await fixture.whenStable();
      callback([{ intersectionRatio: 1 } as IntersectionObserverEntry], observer);
      callback([{ intersectionRatio: 0 } as IntersectionObserverEntry], observer);
      await fixture.whenStable();
      expect(popover.open).toBeFalse();
      expect(trigger('[clrSignpostTrigger]').getAttribute('aria-expanded')).toBe('false');
      expect(observer.disconnect).toHaveBeenCalled();
      expect(document.querySelector('clr-signpost-content')).toBeNull();
    });

    it('ignores a queued opening scroll but still closes on subsequent scrolling', async () => {
      const host = fixture.nativeElement as HTMLElement;
      host.style.display = 'block';
      host.style.marginTop = '2000px';
      try {
        const popover = service('clr-dropdown');
        popover.open = true;
        await fixture.whenStable();
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        expect(popover.open).toBeTrue();
        document.dispatchEvent(new Event('scroll'));
        await fixture.whenStable();
        expect(popover.open).toBeTrue();
        window.scrollTo(0, 0);
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        await fixture.whenStable();
        expect(popover.open).toBeFalse();
      } finally {
        host.style.marginTop = '';
        window.scrollTo(0, 0);
      }
    });

    it('delivers child close outputs before structural content is destroyed', async () => {
      for (const selector of ['clr-dropdown', 'clr-signpost']) {
        const popover = service(selector);
        popover.open = true;
        await fixture.whenStable();
        popover.open = false;
        await fixture.whenStable();
      }
      expect(fixture.componentInstance.closed).toEqual(['dropdown', 'signpost']);
    });

    it('does not add effect dependencies when setting open or opening at a point', async () => {
      for (const atPoint of [false, true]) {
        const popover = new ClrPopoverService();
        const enabled = signal(true);
        let runs = 0;
        const ref = TestBed.runInInjectionContext(() =>
          effect(() => {
            runs++;
            if (enabled()) {
              if (atPoint) {
                popover.openAtPoint({ x: 1, y: 1 });
              } else {
                popover.open = true;
              }
            }
          })
        );
        await fixture.whenStable();
        expect(popover.open).toBeTrue();
        popover.open = false;
        await fixture.whenStable();
        expect(popover.open).toBeFalse();
        expect(runs).toBe(1);
        ref.destroy();
      }
    });

    it('preserves visible callback Zone context and forwards focus errors', async () => {
      const popover = service('clr-dropdown.persistent');
      const contexts: boolean[] = [];
      popover.popoverVisible.subscribe(visible => {
        if (visible) {
          contexts.push(NgZone.isInAngularZone());
        }
      });
      const error = new Error('focus failed');
      const handler = spyOn(TestBed.inject(ErrorHandler), 'handleError');
      const menu = fixture.nativeElement.querySelector('.persistent clr-dropdown-menu');
      spyOn(menu, 'focus').and.throwError(error);
      popover.open = true;
      await fixture.whenStable();
      expect(contexts).toEqual([!zoneless]);
      expect(handler).toHaveBeenCalledOnceWith(error);
    });

    it('keeps openChange synchronous and emits only actual changes', async () => {
      const popover = service('clr-dropdown');
      const values: boolean[] = [];
      const subscription = popover.openChange.subscribe(value => values.push(value));
      popover.open = true;
      expect(values).toEqual([true]);
      popover.open = true;
      expect(values).toEqual([true]);
      await fixture.whenStable();
      popover.open = false;
      expect(values).toEqual([true, false]);
      await fixture.whenStable();
      subscription.unsubscribe();
    });

    it('does not publish a late visible notification after immediate close', async () => {
      const popover = service('clr-dropdown');
      const visible: boolean[] = [];
      const subscription = popover.popoverVisible.subscribe(value => visible.push(value));
      popover.open = true;
      popover.open = false;
      await fixture.whenStable();
      expect(visible).toEqual([false]);
      expect(document.querySelector('clr-dropdown:not(.persistent) clr-dropdown-menu')).toBeNull();
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).toBeNull();
      subscription.unsubscribe();
    });

    it('cancels pending render work for an attached overlay closed before rendering', async () => {
      const popover = service('clr-dropdown.persistent');
      const visible: boolean[] = [];
      const subscription = popover.popoverVisible.subscribe(value => visible.push(value));
      popover.open = true;
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).not.toBeNull();
      popover.open = false;
      expect(visible).toEqual([false]);
      await fixture.whenStable();
      expect(visible).toEqual([false]);
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).toBeNull();
      subscription.unsubscribe();
    });

    it('does not restore combobox pseudo-focus after immediate close', async () => {
      const popover = service('clr-combobox');
      const focusHandler = fixture.debugElement.query(By.css('clr-combobox')).injector.get(ComboboxFocusHandler);
      popover.open = true;
      popover.open = false;
      await fixture.whenStable();
      expect(focusHandler.pseudoFocus.isEmpty()).toBeTrue();
    });

    it('coalesces combobox focus requests and cancels them on close or destruction', async () => {
      const popover = service('clr-combobox');
      const handler = fixture.debugElement.query(By.css('clr-combobox')).injector.get(ComboboxFocusHandler);
      const focus = spyOn(handler, 'focusFirstActive');
      handler.scheduleFocusFirstActive();
      handler.scheduleFocusFirstActive();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(focus).toHaveBeenCalledTimes(1);
      focus.calls.reset();
      popover.open = true;
      handler.scheduleFocusFirstActive();
      popover.open = false;
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(focus).not.toHaveBeenCalled();
      handler.scheduleFocusFirstActive();
      fixture.destroy();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(focus).not.toHaveBeenCalled();
    });

    it('cleans up pending overlay work and native event handlers on destruction', async () => {
      const popover = service('clr-dropdown.persistent');
      const visible: boolean[] = [];
      const subscription = popover.popoverVisible.subscribe(value => visible.push(value));
      popover.open = true;
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).not.toBeNull();
      fixture.destroy();
      await fixture.whenStable();
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      document.body.click();
      expect(visible).not.toContain(true);
      expect(document.querySelector('.cdk-overlay-pane .dropdown-menu')).toBeNull();
      subscription.unsubscribe();
    });
  });
}
