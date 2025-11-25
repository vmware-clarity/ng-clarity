/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ClrCommonFormsModule,
  IfControlStateService,
  LayoutService,
  NgControlService,
} from '@clr/angular/src/forms/common';
import { ClrIcon } from '@clr/angular/src/icon';

import { ClrCheckbox } from './checkbox';
import { ClrCheckboxContainer } from './checkbox-container';
import { ClrCheckboxWrapper } from './checkbox-wrapper';
import { WrapperContainerSpec, WrapperFullSpec, WrapperNoLabelSpec } from '../tests/wrapper.spec';

@Component({
  template: `
    <clr-toggle-wrapper>
      <label>Hello World</label>
      <input type="checkbox" clrToggle name="model" [(ngModel)]="model" />
    </clr-toggle-wrapper>
  `,
  standalone: false,
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <clr-toggle-wrapper>
      <input type="checkbox" clrToggle name="model" [(ngModel)]="model" />
    </clr-toggle-wrapper>
  `,
  standalone: false,
})
class NoLabelTest {
  model = '';
}

@Component({
  template: `
    <clr-toggle-container>
      <clr-toggle-wrapper>
        <input type="checkbox" clrToggle name="model" [(ngModel)]="model" />
      </clr-toggle-wrapper>
    </clr-toggle-container>
  `,
  standalone: false,
})
class ContainerTest {
  model = '';
}

export default function (): void {
  describe('ClrCheckboxWrapper', () => {
    WrapperNoLabelSpec(ClrCheckboxWrapper, ClrCheckbox, NoLabelTest);
    WrapperFullSpec(ClrCheckboxWrapper, ClrCheckbox, FullTest, 'clr-toggle-wrapper');
    WrapperContainerSpec(ClrCheckboxContainer, ClrCheckboxWrapper, ClrCheckbox, ContainerTest, 'clr-toggle-wrapper');

    describe('toggle class', () => {
      let fixture, containerDE, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
          declarations: [ClrCheckboxWrapper, ClrCheckbox, FullTest],
          providers: [IfControlStateService, NgControl, NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(FullTest);

        containerDE = fixture.debugElement.query(By.directive(ClrCheckboxWrapper));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('adds the toggle class', () => {
        expect(containerEl.className).toContain('clr-toggle-wrapper');
        expect(containerEl.className).not.toContain('clr-checkbox-wrapper');
      });
    });
  });
}
