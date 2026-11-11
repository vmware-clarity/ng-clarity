/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IfExpandService } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrAccordionModule } from './accordion.module';

@Component({
  template: `
    <clr-accordion>
      <clr-accordion-content>Hello world</clr-accordion-content>
    </clr-accordion>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {}

describe('ClrAccordionContent', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [ReactiveFormsModule, ClrAccordionModule],
        providers: [IfExpandService],
      });

      fixture = TestBed.createComponent(TestComponent);
      renderFixture(fixture);
    });

    it('projects content', () => {
      expect(fixture.nativeElement.textContent.trim()).toMatch('Hello world');
    });
  });
});
