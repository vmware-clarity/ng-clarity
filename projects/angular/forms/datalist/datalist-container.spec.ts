/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ClrDatalistContainer } from './datalist-container';
import { ClrDatalistInput } from './datalist-input';
import { ClrDatalistModule } from './datalist.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container';
import {
  ContainerChangeDetectionSpec,
  ContainerTestHostOptions,
  containerTestHosts,
  eachContainerHost,
} from '../tests/onpush-container';

@Component({
  template: `
    <clr-datalist-container>
      <input clrDatalistInput list="clr-datalist-1" required name="Option" [(ngModel)]="model" [disabled]="disabled" />
      <datalist id="clr-datalist-1">
        <option [value]="'item1'"></option>
        <option [value]="'item2'"></option>
        <option [value]="'item3'"></option>
      </datalist>
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-datalist-container>
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
    <clr-datalist-container>
      <input clrDatalistInput list="clr-datalist-1" name="Option" />
      <datalist id="clr-datalist-1">
        <option [value]="'item1'"></option>
        <option [value]="'item2'"></option>
        <option [value]="'item3'"></option>
      </datalist>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-datalist-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-datalist-container>
        <input clrDatalistInput list="clr-datalist-1" formControlName="model" />
        <datalist id="clr-datalist-1">
          <option [value]="'item1'"></option>
          <option [value]="'item2'"></option>
          <option [value]="'item3'"></option>
        </datalist>
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-datalist-container>
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

const hostOptions: ContainerTestHostOptions = {
  imports: [ClrDatalistModule],
  container: 'clr-datalist-container',
  controlMarkup: '<input clrDatalistInput [formControl]="control" /><datalist><option value="One"></option></datalist>',
  initialValue: '',
  validValue: 'One',
  validator: Validators.required,
};

describe('ClrDatalist', () => {
  describe('ClrDatalistContainer', () => {
    ContainerNoLabelSpec(ClrDatalistContainer, ClrDatalistInput, NoLabelTest);
    TemplateDrivenSpec(
      ClrDatalistContainer,
      ClrDatalistInput,
      TemplateDrivenTest,
      '.clr-input-wrapper [clrDatalistInput]'
    );
    ReactiveSpec(ClrDatalistContainer, ClrDatalistInput, ReactiveTest, '.clr-input-wrapper [clrDatalistInput]');
  });

  ContainerChangeDetectionSpec(hostOptions);

  describe('ClrDatalistContainer change detection', () => {
    eachContainerHost('clr-datalist-container', containerTestHosts(hostOptions), context => {
      it('shows the focus state while the input has focus', async () => {
        const { containerEl, settle } = context();
        const input = containerEl.querySelector('input');
        const group = containerEl.querySelector('.clr-input-group');

        input.dispatchEvent(new Event('focus'));
        await settle();
        expect(group.classList).toContain('clr-focus');

        input.dispatchEvent(new Event('blur'));
        await settle();
        expect(group.classList).not.toContain('clr-focus');
      });
    });
  });
});
