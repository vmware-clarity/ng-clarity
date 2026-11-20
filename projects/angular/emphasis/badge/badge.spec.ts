/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@clr/angular/emphasis/common';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrBadge, ClrBadgeColors } from './badge';

@Component({
  template: ` <clr-badge [clrColor]="color" [clrType]="type">{{ content }}</clr-badge> `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrBadge) badgeInstance: ClrBadge;

  content = '';
  type = Type.Solid;
  color: ClrBadgeColors | string = ClrBadgeColors.None;
}

describe('ClrBadge component', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrBadge], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      renderFixture(fixture);
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

      expect(badgeElement.textContent).toBe('');

      const newBadgeText = '15';
      fixture.componentInstance.content = newBadgeText;
      renderFixture(fixture);

      expect(badgeElement.textContent).toBe(newBadgeText);
    });

    it('change to regular colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set purple color
      fixture.componentInstance.color = ClrBadgeColors.Purple;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-purple');

      // set blue color
      fixture.componentInstance.color = ClrBadgeColors.Blue;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-blue');

      // set light blue color
      fixture.componentInstance.color = ClrBadgeColors.LightBlue;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-light-blue');

      // set orange color
      fixture.componentInstance.color = ClrBadgeColors.Orange;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-orange');
      // set gray color
      fixture.componentInstance.color = ClrBadgeColors.Gray;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-gray');
    });

    it('change to status colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set info color
      fixture.componentInstance.color = ClrBadgeColors.Info;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-info');

      // set warning color
      fixture.componentInstance.color = ClrBadgeColors.Warning;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-warning');

      // set danger color
      fixture.componentInstance.color = ClrBadgeColors.Danger;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-danger');

      // set success color
      fixture.componentInstance.color = ClrBadgeColors.Success;
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-success');
    });

    it('change to outlined variant', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.badge');
      expect(htmlElement).not.toBeNull();

      // set solid color
      fixture.componentInstance.type = Type.Outlined;
      renderFixture(fixture);

      expect(htmlElement.className).toContain('outlined');
    });

    it('change to number colors', () => {
      // default
      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set color 1
      fixture.componentInstance.color = '1';
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-1');

      // set color 2
      fixture.componentInstance.color = '2';
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-2');

      // set color 3
      fixture.componentInstance.color = '3';
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-3');

      // set color 4
      fixture.componentInstance.color = '4';
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-4');

      // set color 5
      fixture.componentInstance.color = '5';
      renderFixture(fixture);

      expect(badgeElement.className).toContain('badge-5');
    });
  });
});
