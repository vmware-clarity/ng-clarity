/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrBadge, ClrBadgeColors } from './badge';
import { ClrBadgeModule } from './badge.module';

@Component({
  template: ` <clr-badge [clrBadgeColor]="color">{{ content }}</clr-badge> `,
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
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrBadgeModule], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    afterEach(() => {
      if (fixture) {
        fixture.destroy();
      }
    });

    it('projects content', () => {
      // default
      const badgeElement = compiled.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      expect(badgeElement.textContent).toBeEmptyString();

      const newBadgeText = '15';
      fixture.componentInstance.content = newBadgeText;
      fixture.detectChanges();

      expect(badgeElement.textContent).toBe(newBadgeText);
    });

    it('change color', () => {
      // default
      const badgeElement = compiled.querySelector('.badge');
      expect(badgeElement).not.toBeNull();

      // set color purple
      fixture.componentInstance.color = ClrBadgeColors.Purple;
      fixture.detectChanges();

      expect(badgeElement.className).toContain('badge-purple');
    });
  });
});
