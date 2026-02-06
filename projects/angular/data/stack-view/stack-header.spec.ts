/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ClrStackView } from './stack-view';
import { ClrStackViewModule } from './stack-view.module';
import { HeadingLevel } from '../../utils/types/heading-level';

@Component({
  template: `
    <clr-stack-header [clrStackHeaderLevel]="headingLevel">
      Title
      <a class="stack-action">Action</a>
    </clr-stack-header>
  `,
  standalone: false,
})
class TestComponent {
  headingLevel: HeadingLevel = null;
}

export default function (): void {
  'use strict';
  describe('StackHeader', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;
    let component: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrStackViewModule, FormsModule],
        declarations: [TestComponent],
        providers: [ClrStackView],
      });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
    });

    /**
     * There are basically no tests at the moment because the StackHeader component itself
     * doesn't do anything apart from projecting content.
     *
     * This will change when inline editing becomes a public feature.
     */

    it('projects content', () => {
      expect(compiled.textContent).toMatch(/Title/);
      expect(compiled.textContent).toMatch(/Action/);
    });

    it('should not have heading role and aria-level attribute set if ariaLevel is not set', () => {
      fixture.detectChanges();

      const stackTitle = compiled.querySelector('.stack-title');
      expect(stackTitle.getAttribute('role')).toBeNull();
      expect(stackTitle.getAttribute('aria-level')).toBeNull();
    });

    it('should have heading role and aria-level set when ariaLevel is set', () => {
      component.headingLevel = 1;
      fixture.detectChanges();

      const stackTitle = compiled.querySelector('.stack-title');
      expect(stackTitle.getAttribute('role')).toBe('heading');
      expect(stackTitle.getAttribute('aria-level')).toBe('1');
    });
  });
}
