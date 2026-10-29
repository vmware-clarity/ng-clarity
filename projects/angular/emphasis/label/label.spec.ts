/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@clr/angular/emphasis/common';

import { ClrLabel, ClrLabelColors } from './label';

@Component({
  template: ` <clr-label
    [clrColor]="color"
    [clrBadgeText]="badgeText"
    [clrText]="text"
    [clrType]="type"
    [clrClickable]="clickable"
    [clrDisabled]="disabled"
    (click)="clicks = clicks + 1"
  >
    {{ projectedContent }}
  </clr-label>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrLabel) badgeInstance: ClrLabel;

  projectedContent = '';
  text = '';
  badgeText = '';
  clickable = false;
  type = Type.Outlined;
  disabled = false;
  clicks = 0;
  color: ClrLabelColors | string = ClrLabelColors.None;
}

describe('ClrLabel component', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrLabel], declarations: [TestComponent] });

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
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      expect(htmlElement.textContent.trim()).toBeEmptyString();

      const newText = 'Hello World';
      fixture.componentInstance.projectedContent = newText;
      fixture.detectChanges();

      expect(htmlElement.textContent.trim()).toBe(newText);
    });

    it('use API for content', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      const newText = 'Hello World';
      const badgeText = '15';
      fixture.componentInstance.text = newText;
      fixture.componentInstance.badgeText = badgeText;
      fixture.detectChanges();

      const textElement = fixture.nativeElement.querySelector('.text');
      expect(textElement.textContent).toBe(newText);

      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement.textContent).toBe(badgeText);
    });

    it('use API and projection for content', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      const newText = 'Hello World';
      const badgeText = '15';
      const projectedText = 'Projected Cpontent';
      fixture.componentInstance.projectedContent = projectedText;
      fixture.componentInstance.text = newText;
      fixture.componentInstance.badgeText = badgeText;
      fixture.detectChanges();

      expect(htmlElement.textContent.trim()).toEndWith(projectedText);

      const textElement = fixture.nativeElement.querySelector('.text');
      expect(textElement.textContent).toBe(newText);

      const badgeElement = fixture.nativeElement.querySelector('.badge');
      expect(badgeElement.textContent).toBe(badgeText);
    });

    it('change to regular colors', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      // set purple color
      fixture.componentInstance.color = ClrLabelColors.Purple;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-purple');

      // set blue color
      fixture.componentInstance.color = ClrLabelColors.Blue;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-blue');

      // set light blue color
      fixture.componentInstance.color = ClrLabelColors.LightBlue;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-light-blue');

      // set orange color
      fixture.componentInstance.color = ClrLabelColors.Orange;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-orange');
      // set gray color
      fixture.componentInstance.color = ClrLabelColors.Gray;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-gray');
    });

    it('change to status colors', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      // set info color
      fixture.componentInstance.color = ClrLabelColors.Info;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-info');

      // set warning color
      fixture.componentInstance.color = ClrLabelColors.Warning;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-warning');

      // set danger color
      fixture.componentInstance.color = ClrLabelColors.Danger;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-danger');

      // set success color
      fixture.componentInstance.color = ClrLabelColors.Success;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('label-success');
    });

    it('change to solid variant', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      // set solid color
      fixture.componentInstance.type = Type.Solid;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('solid');
    });

    it('make it clickable', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      // set color 1
      fixture.componentInstance.clickable = true;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('clickable');
    });

    it('make it disabled', () => {
      // default
      const htmlElement = fixture.nativeElement.querySelector('.label');
      expect(htmlElement).not.toBeNull();

      // set color 1
      fixture.componentInstance.clickable = true;
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      expect(htmlElement.className).toContain('clickable');
      expect(htmlElement.className).toContain('disabled');
    });

    describe('Accessibility', () => {
      let htmlElement: HTMLElement;

      function pressKey(key: string) {
        htmlElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      }

      beforeEach(() => {
        htmlElement = fixture.nativeElement.querySelector('.label');
      });

      it('is not a button when not clickable', () => {
        expect(htmlElement.getAttribute('role')).toBeNull();
        expect(htmlElement.getAttribute('tabindex')).toBeNull();
        expect(htmlElement.getAttribute('aria-disabled')).toBeNull();
      });

      it('is a focusable button when clickable', () => {
        fixture.componentInstance.clickable = true;
        fixture.detectChanges();

        expect(htmlElement.getAttribute('role')).toBe('button');
        expect(htmlElement.getAttribute('tabindex')).toBe('0');
        expect(htmlElement.getAttribute('aria-disabled')).toBeNull();
      });

      it('is a disabled button out of the tab order when clickable and disabled', () => {
        fixture.componentInstance.clickable = true;
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();

        expect(htmlElement.getAttribute('role')).toBe('button');
        expect(htmlElement.getAttribute('tabindex')).toBeNull();
        expect(htmlElement.getAttribute('aria-disabled')).toBe('true');
      });

      it('triggers click on Enter and Space when clickable', () => {
        fixture.componentInstance.clickable = true;
        fixture.detectChanges();

        pressKey('Enter');
        pressKey(' ');

        expect(fixture.componentInstance.clicks).toBe(2);
      });

      it('does not trigger click on Enter and Space when not clickable', () => {
        pressKey('Enter');
        pressKey(' ');

        expect(fixture.componentInstance.clicks).toBe(0);
      });

      it('does not trigger click handlers when clickable and disabled', () => {
        fixture.componentInstance.clickable = true;
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();

        pressKey('Enter');
        pressKey(' ');
        htmlElement.click();

        expect(fixture.componentInstance.clicks).toBe(0);
      });

      it('keeps click handlers working when disabled but not clickable', () => {
        fixture.componentInstance.disabled = true;
        fixture.detectChanges();

        htmlElement.click();

        expect(fixture.componentInstance.clicks).toBe(1);
      });
    });
  });
});
