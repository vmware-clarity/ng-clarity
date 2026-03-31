/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrCommonFormsModule } from '@clr/angular';

import { State, states } from './states';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicHTML = `
<clr-combobox-container>
  <label>My State</label>
  <clr-combobox [(ngModel)]="selection" name="myState" [clrEditable]="true">
    <clr-options>
      <clr-option *clrOptionItems="let state of states; field: 'name'" [clrValue]="state">
        {{ state.name }}
      </clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Select from the list or type a custom value</clr-control-helper>
</clr-combobox-container>
`;

const basicComponent = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrCommonFormsModule } from '@clr/angular';

import { states, State } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrComboboxModule],
})
export class ExampleComponent {
  states = states;
  selection: State;
}
`;

const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};

@Component({
  selector: 'clr-combobox-editable-demo',
  templateUrl: './combobox-editable.demo.html',
  imports: [ClrComboboxModule, ClrCommonFormsModule, FormsModule, StackblitzExampleComponent],
})
export class ComboboxEditableDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  states = states;
  selection: State;
}
