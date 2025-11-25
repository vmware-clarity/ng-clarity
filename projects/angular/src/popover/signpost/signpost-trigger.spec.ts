/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrIcon } from '../../icon';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostModule } from './signpost.module';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrPopoverService } from '../common/providers/popover.service';

export default function (): void {
  describe('SignpostToggle component', function () {
    let fixture: ComponentFixture<any>;
    let clarityElement: any;
    let popoverService: ClrPopoverService;
    let trigger: HTMLElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrSignpostModule, ClrIcon],
        declarations: [TestTrigger],
        providers: [ClrPopoverService, SignpostIdService, SignpostFocusManager],
      });

      fixture = TestBed.createComponent(TestTrigger);
      fixture.detectChanges();
      clarityElement = fixture.nativeElement;
      popoverService = TestBed.inject(ClrPopoverService);
      trigger = clarityElement.querySelector('.signpost-action');
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should toggle the IfOpenService.open property on click', function () {
      expect(popoverService.open).toBeFalsy();
      trigger.click();
      expect(popoverService.open).toEqual(true);
      trigger.click();
      expect(popoverService.open).toEqual(false);
    });

    it('should have active class when open', function () {
      expect(trigger.classList.contains('active')).toBeFalsy();
      trigger.click();
      fixture.detectChanges();
      expect(trigger.classList.contains('active')).toBeTruthy();
      trigger.click();
      fixture.detectChanges();
      expect(trigger.classList.contains('active')).toBeFalsy();
      popoverService.open = true;
      fixture.detectChanges();
      expect(trigger.classList.contains('active')).toBeTruthy();
      popoverService.open = false;
      fixture.detectChanges();
      expect(trigger.classList.contains('active')).toBeFalsy();
    });

    it('preserves explicitly set label', () => {
      const testLabel = 'Test label';
      fixture.debugElement.componentInstance.label = testLabel;
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-label')).toEqual(testLabel);
    });

    it('reflects the correct aria-expanded state', () => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      trigger.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      trigger.click();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });
}

@Component({
  template: `
    <button
      #anchor
      type="button"
      class="signpost-action btn btn-sm btn-link"
      [ngClass]="{ active: open }"
      [attr.aria-label]="label"
      clrSignpostTrigger
    >
      <cds-icon shape="info-circle"></cds-icon>
    </button>
  `,
  standalone: false,
})
class TestTrigger {
  label = null;
}
