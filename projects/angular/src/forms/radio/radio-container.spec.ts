/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ClrCommonFormsModule,
  IfControlStateService,
  LayoutService,
  NgControlService,
} from '@clr/angular/src/forms/common';
import { ClrIcon } from '@clr/angular/src/icon';

import { ClrRadio } from './radio';
import { ClrRadioContainer } from './radio-container';
import { ClrRadioWrapper } from './radio-wrapper';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container.spec';

@Component({
  template: `
    <clr-radio-container>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-radio-container>
  `,
  standalone: false,
})
class NoLabelTest {}

@Component({
  template: `
    <clr-radio-container [clrInline]="inline">
      <label>Hello World</label>
      <clr-radio-wrapper>
        <label>One</label>
        <input type="radio" clrRadio name="model" required [(ngModel)]="model" value="one" />
      </clr-radio-wrapper>
      <clr-radio-wrapper>
        <label>Two</label>
        <input type="radio" clrRadio name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </clr-radio-wrapper>
      <clr-control-error>There was an error</clr-control-error>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Valid</clr-control-success>
    </clr-radio-container>
  `,
  standalone: false,
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = '';
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-radio-container>
        <label>Hello World</label>
        <clr-radio-wrapper>
          <label>One</label>
          <input clrRadio type="radio" formControlName="model" value="one" />
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <label>Two</label>
          <input clrRadio type="radio" formControlName="model" value="two" />
        </clr-radio-wrapper>
        <clr-control-error>There was an error</clr-control-error>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-success>Valid</clr-control-success>
      </clr-radio-container>
    </form>
  `,
  standalone: false,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function (): void {
  describe('ClrRadioContainer', () => {
    ContainerNoLabelSpec(ClrRadioContainer, [ClrRadio, ClrRadioWrapper], NoLabelTest);
    TemplateDrivenSpec(
      ClrRadioContainer,
      [ClrRadio, ClrRadioWrapper],
      TemplateDrivenTest,
      '.clr-radio-wrapper [clrRadio]'
    );
    ReactiveSpec(ClrRadioContainer, [ClrRadio, ClrRadioWrapper], ReactiveTest, '.clr-radio-wrapper [clrRadio]');

    describe('inline buttons', () => {
      let fixture, containerDE, containerEl;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
          declarations: [ClrRadioContainer, ClrRadioWrapper, ClrRadio, TemplateDrivenTest],
          providers: [IfControlStateService, NgControl, NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);

        containerDE = fixture.debugElement.query(By.directive(ClrRadioContainer));
        containerEl = containerDE.nativeElement;
        fixture.detectChanges();
      });

      it('sets the inline class', () => {
        expect(containerEl.querySelector('.clr-control-container').className).not.toContain('clr-control-inline');
        fixture.debugElement.componentInstance.inline = true;
        fixture.detectChanges();
        expect(containerEl.querySelector('.clr-control-container').className).toContain('clr-control-inline');
      });
    });
  });
}
