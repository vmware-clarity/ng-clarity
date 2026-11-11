/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrIcon } from '@clr/angular/icon';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { renderFixture } from '@clr/angular/utils/testing';

import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostModule } from './signpost.module';

describe('Signpost', () => {
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
      renderFixture(fixture);
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
      renderFixture(fixture);
      expect(trigger.classList.contains('active')).toBeTruthy();
      trigger.click();
      renderFixture(fixture);
      expect(trigger.classList.contains('active')).toBeFalsy();
      popoverService.open = true;
      renderFixture(fixture);
      expect(trigger.classList.contains('active')).toBeTruthy();
      popoverService.open = false;
      renderFixture(fixture);
      expect(trigger.classList.contains('active')).toBeFalsy();
    });

    it('preserves explicitly set label', () => {
      const testLabel = 'Test label';
      fixture.debugElement.componentInstance.label = testLabel;
      renderFixture(fixture);
      expect(trigger.getAttribute('aria-label')).toEqual(testLabel);
    });

    it('reflects the correct aria-expanded state', () => {
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      trigger.click();
      renderFixture(fixture);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      trigger.click();
      renderFixture(fixture);
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });
});

@Component({
  template: `
    <button
      #origin
      type="button"
      class="signpost-action btn btn-sm btn-link"
      [ngClass]="{ active: open }"
      [attr.aria-label]="label"
      clrSignpostTrigger
    >
      <cds-icon shape="info-circle"></cds-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestTrigger {
  label = null;
}
