/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrComboboxModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { State, states } from './states';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicHTML = `
<clr-combobox-container>
  <label>My State</label>
  <clr-combobox [(ngModel)]="selection" name="myState" required>
    <clr-options>
      <clr-option *clrOptionItems="let state of states; field: 'name'" [clrValue]="state">
        <clr-icon shape="world" role="img" aria-label="World is turning"></clr-icon>
        {{ state.name }}
        <clr-icon shape="sun" role="img" aria-label="Sun is shining"></clr-icon>
      </clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Helper text</clr-control-helper>
  <clr-control-error>There was an error</clr-control-error>
</clr-combobox-container>
`;

const basicComponent = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { states, State } from './states';
import { ClrComboboxModule, ClrFormsModule, ClrIcon } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ClrIcon, ClrFormsModule, ClrComboboxModule],
})
export class ExampleComponent {
  states = states;
  selection: State[] = [];
}
`;

const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};

@Component({
  selector: 'clr-combobox-single-demo',
  templateUrl: './combobox-single.demo.html',
  imports: [
    ClrComboboxModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    FormsModule,
    ClrIcon,
    ClrIconModule,
    StackblitzExampleComponent,
  ],
})
export class ComboboxSingleDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  states = states;
  selection: State[] = [];
}
