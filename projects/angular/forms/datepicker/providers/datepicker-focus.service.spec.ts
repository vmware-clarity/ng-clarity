/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerFocusService } from './datepicker-focus.service';

describe('Datepicker focus (zoneless, OnPush host)', () => {
      let fixture: ComponentFixture<TestComponent>;
      let service: DatepickerFocusService;

      beforeEach(async () => {
        TestBed.configureTestingModule({
          declarations: [TestComponent],
          providers: [
            provideZonelessChangeDetection(),
            provideCheckNoChangesConfig({ exhaustive: true }),
          ],
        });
        fixture = TestBed.createComponent(TestComponent);
        fixture.autoDetectChanges();
        service = fixture.componentInstance.focusService;
        await fixture.whenStable();
      });

      afterEach(() => fixture.destroy());

      it('focuses the cell after its tab index has rendered', async () => {
        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        fixture.componentInstance.tabIndex.set('0');
        service.focusCell(fixture.componentInstance.elementRef);
        expect(document.activeElement).not.toBe(button);
        await fixture.whenStable();
        expect(document.activeElement).toBe(button);
      });

      it('leaves focus alone when there is no focusable cell', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        input.focus();
        service.focusCell(fixture.componentInstance.elementRef);
        await fixture.whenStable();
        expect(document.activeElement).toBe(input);
      });

      it('restores focus to the input after rendering', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        expect(service.elementIsFocused(input)).toBe(false);
        service.focusInput(input);
        expect(service.elementIsFocused(input)).toBe(false);
        await fixture.whenStable();
        expect(service.elementIsFocused(input)).toBe(true);
      });

      it('cancels pending focus when its host is destroyed', async () => {
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        const focus = vi.spyOn(input, 'focus');
        service.focusInput(input);
        fixture.destroy();
        await fixture.whenStable();
        expect(focus).not.toHaveBeenCalled();
      });
});

describe('Datepicker focus on the server', () => {
    it('does not access the DOM', () => {
      TestBed.configureTestingModule({
        providers: [DatepickerFocusService, { provide: PLATFORM_ID, useValue: 'server' }],
      });
      const service = TestBed.inject(DatepickerFocusService);
      service.focusCell(new ElementRef(null));
      service.focusInput(null);
      expect(service.elementIsFocused(null)).toBe(false);
    });
  });

@Component({
  template: `
    <button [attr.tabindex]="tabIndex()">Test Button</button>
    <input type="date" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  providers: [DatepickerFocusService],
})
class TestComponent {
  readonly tabIndex = signal('-1');
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly focusService = inject(DatepickerFocusService);
}
