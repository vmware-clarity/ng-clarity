/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrBadge, ClrBadgeColors } from './badge';

@Component({
  template: ` <clr-badge [clrColor]="color">{{ content }}</clr-badge> `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrBadge) badgeInstance: ClrBadge;

  content = '';
  color: ClrBadgeColors | string = ClrBadgeColors.Empty;
}

describe('ClrBadge component', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrBadge], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    afterEach(() => {
      if (fixture) {
        fixture.destroy();
      }
    });

    it('projects content', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      expect(badgeElement.textContent).toBeEmptyString();

      const newBadgeText = '15';
      fixture.componentInstance.content = newBadgeText;
      fixture.detectChanges();

      expect(badgeElement.textContent).toBe(newBadgeText);
    });

    it('change to regular colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set purple color
      fixture.componentInstance.color = ClrBadgeColors.Purple;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-purple');

      // set blue color
      fixture.componentInstance.color = ClrBadgeColors.Blue;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-blue');

      // set light blue color
      fixture.componentInstance.color = ClrBadgeColors.LightBlue;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-light-blue');

      // set orange color
      fixture.componentInstance.color = ClrBadgeColors.Orange;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-orange');
      // set gray color
      fixture.componentInstance.color = ClrBadgeColors.Gray;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-gray');
    });

    it('change to status colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set info color
      fixture.componentInstance.color = ClrBadgeColors.Info;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-info');

      // set warning color
      fixture.componentInstance.color = ClrBadgeColors.Warning;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-warning');

      // set danger color
      fixture.componentInstance.color = ClrBadgeColors.Danger;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-danger');

      // set success color
      fixture.componentInstance.color = ClrBadgeColors.Success;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-success');
    });

    it('change to number colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set color 1
      fixture.componentInstance.color = '1';
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-1');

      // set color 2
      fixture.componentInstance.color = '2';
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-2');

      // set color 3
      fixture.componentInstance.color = '3';
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-3');

      // set color 4
      fixture.componentInstance.color = '4';
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-4');

      // set color 5
      fixture.componentInstance.color = '5';
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-5');
    });
  });
});
