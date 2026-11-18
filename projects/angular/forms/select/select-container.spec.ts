/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrSelect } from './select';
import { ClrSelectContainer } from './select-container';
import { ClrSelectModule } from './select.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container';
import { ContainerChangeDetectionSpec } from '../tests/onpush-container';

@Component({
  template: `
    <clr-select-container>
      <select clrSelect [(ngModel)]="model">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-select-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoLabelTest {}

@Component({
  template: `
    <clr-select-container>
      <select name="test" clrSelect required [(ngModel)]="model" [disabled]="disabled">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-select-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TemplateDrivenTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-select-container>
      <select multiple name="test" clrSelect required [(ngModel)]="model" [disabled]="disabled">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-select-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TemplateDrivenMultipleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-select-container>
        <select name="test" clrSelect formControlName="model">
          <option value="1">one</option>
          <option value="2">two</option>
        </select>
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-select-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-select-container>
        <select multiple name="test" clrSelect formControlName="model">
          <option value="1">one</option>
          <option value="2">two</option>
        </select>
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-select-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ReactiveMultipleTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

describe('Select component', () => {
  describe('ClrSelectContainer', () => {
    ContainerNoLabelSpec(ClrSelectContainer, ClrSelect, NoLabelTest);

    describe('Single select', () => {
      TemplateDrivenSpec(ClrSelectContainer, ClrSelect, TemplateDrivenTest, '.clr-select-wrapper [clrSelect]');
      ReactiveSpec(ClrSelectContainer, ClrSelect, ReactiveTest, '.clr-select-wrapper [clrSelect]');
    });

    describe('Multi-select', () => {
      TemplateDrivenSpec(
        ClrSelectContainer,
        ClrSelect,
        TemplateDrivenMultipleTest,
        '.clr-multiselect-wrapper [clrSelect]'
      );
      ReactiveSpec(ClrSelectContainer, ClrSelect, ReactiveMultipleTest, '.clr-multiselect-wrapper [clrSelect]');
    });
  });

  ContainerChangeDetectionSpec({
    imports: [ClrSelectModule],
    container: 'clr-select-container',
    controlMarkup:
      '<select clrSelect [formControl]="control"><option value="">None</option><option value="one">One</option></select>',
    initialValue: '',
    validValue: 'one',
    validator: Validators.required,
  });

  describe('multi-select wrapper on the first render', () => {
    const template = `
      <form clrForm>
        <clr-select-container>
          <label>Options</label>
          <select clrSelect name="options" [(ngModel)]="model" multiple>
            <option value="one">One</option>
          </select>
          <clr-control-helper>Helper</clr-control-helper>
        </clr-select-container>
        <clr-select-container>
          <label>Options</label>
          <select clrSelect [formControl]="control" multiple>
            <option value="one">One</option>
          </select>
        </clr-select-container>
      </form>
    `;

    @Component({
      imports: [FormsModule, ReactiveFormsModule, ClrSelectModule],
      template,
      changeDetection: ChangeDetectionStrategy.Eager,
    })
    class EagerMultiSelectTest {
      model: string[] = [];
      control = new FormControl<string[]>([]);
    }

    @Component({
      imports: [FormsModule, ReactiveFormsModule, ClrSelectModule],
      template,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class OnPushMultiSelectTest {
      model: string[] = [];
      control = new FormControl<string[]>([]);
    }

    for (const host of [EagerMultiSelectTest, OnPushMultiSelectTest]) {
      it(`uses the multi-select wrapper (${host.name})`, async () => {
        TestBed.configureTestingModule({ imports: [host] });
        const fixture = TestBed.createComponent(host);
        renderFixture(fixture);
        await fixture.whenStable();

        const wrappers = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('select')).map(
          select => select.parentElement.className
        );
        expect(wrappers).toEqual(['clr-multiselect-wrapper', 'clr-multiselect-wrapper']);
        fixture.destroy();
      });
    }
  });
});
