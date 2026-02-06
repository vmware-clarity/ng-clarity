/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrSignpostTitle } from './signpost-title';
import { ClrSignpostModule } from './signpost.module';

@Component({
  template: `<clr-signpost-title>Title</clr-signpost-title>`,
  standalone: false,
})
class TestComponent {}

describe('ClrSignpostTitle', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ClrSignpostModule],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('projects content', () => {
      expect(fixture.nativeElement.textContent.trim()).toMatch('Title');
    });

    it('adds a .signpost-title class on the host element', () => {
      const signpostTitleElement = fixture.debugElement.query(By.directive(ClrSignpostTitle)).nativeElement;
      expect(signpostTitleElement.classList.contains('signpost-title')).toBe(true);
    });
  });
});
