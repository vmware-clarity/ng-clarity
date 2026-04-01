/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrCommonFormsModule } from '@clr/angular';

import { State, states } from './states';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicHTML = `
<clr-combobox-container>
  <label>Visited States</label>
  <clr-combobox
    [(ngModel)]="selection"
    name="visitedStates"
    clrMulti="true"
    [clrEditable]="true"
    [clrEditableResolverFn]="stateResolver"
    [clrComboboxIdentityFn]="identityFn"
  >
    <ng-container *clrOptionSelected="let selected">
      {{ selected?.name }}
    </ng-container>
    <clr-options>
      <clr-option *clrOptionItems="let state of states; field: 'name'" [clrValue]="state">
        {{ state.name }}
        <span class="clr-combobox-secondary-text">({{ state.abbreviation }})</span>
      </clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Pick from the list or type a custom state and press Enter</clr-control-helper>
</clr-combobox-container>
`;

const basicComponent = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrCommonFormsModule } from '@clr/angular';

import { states, State } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [CommonModule, FormsModule, ClrCommonFormsModule, ClrComboboxModule],
})
export class ExampleComponent {
  states = states;
  selection: State[] = [];

  identityFn = (item: State) => item?.abbreviation;

  stateResolver = (input: string): State => ({
    name: input,
    abbreviation: input.substring(0, 2).toUpperCase(),
  });
}
`;

const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};

@Component({
  selector: 'clr-combobox-editable-multi-demo',
  templateUrl: './combobox-editable-multi.demo.html',
  imports: [CommonModule, ClrComboboxModule, ClrCommonFormsModule, FormsModule, StackblitzExampleComponent],
})
export class ComboboxEditableMultiDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  states = states;
  selection: State[] = [];

  identityFn = (item: State) => item?.abbreviation;

  stateResolver = (input: string): State => ({
    name: input,
    abbreviation: input.substring(0, 2).toUpperCase(),
  });
}
