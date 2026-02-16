/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { State, states } from './states';

const basicHTML = `
<clr-combobox-container>
  <label>My State</label>
  <clr-combobox [(ngModel)]="selection" name="myState" required>
    <clr-options>
      <clr-option *clrOptionItems="let state of states; field: 'name'" [clrValue]="state">
        <cds-icon shape="world" role="img" aria-label="World is turning"></cds-icon>
        {{ state.name }}
        <cds-icon shape="sun" role="img" aria-label="Sun is shining"></cds-icon>
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
import { ClrComboboxModule, ClrIconModule, ClrFormsModule } from '@clr/angular';

import { states, State } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ClrIconModule, ClrFormsModule, ClrComboboxModule],
})
export class ExampleComponent {
  states = states;
  selection: State[] = [];
}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-combobox-single-demo',
  templateUrl: './combobox-single.demo.html',
  standalone: false,
})
export class ComboboxSingleDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  states = states;
  selection: State[] = [];
}
