/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClrStackViewModule } from './stack-view.module';

@Component({
  template: `
    <clr-stack-content>
      <input type="text" clrStackInput />
    </clr-stack-content>
  `,
})
class TestComponent {}

export default function (): void {
  'use strict';
  describe('StackContentInput component', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrStackViewModule, NoopAnimationsModule],
        declarations: [TestComponent],
      });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('adds clr-input classes', () => {
      expect(compiled.querySelector('input').className).toEqual('clr-input');
    });

    it('adds aria describedby values', () => {
      expect(compiled.querySelector('input').attributes.getNamedItem('aria-labelledby').value).toContain('clr-id-');
    });
  });
}
