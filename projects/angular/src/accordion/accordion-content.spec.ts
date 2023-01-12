/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IfExpandService } from '../utils/conditional/if-expanded.service';
import { ClrAccordionModule } from './accordion.module';

@Component({
  template: `
    <clr-accordion>
      <clr-accordion-content>Hello world</clr-accordion-content>
    </clr-accordion>
  `,
})
class TestComponent {}

describe('ClrAccordionContent', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ReactiveFormsModule, NoopAnimationsModule, ClrAccordionModule],
        providers: [IfExpandService],
      });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
    });

    it('projects content', () => {
      expect(fixture.nativeElement.textContent.trim()).toMatch('Hello world');
    });
  });
});
