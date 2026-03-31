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
  <label>Favorite States</label>
  <clr-combobox [(ngModel)]="selection" name="selectAll" clrMulti="true" showSelectAll>
    <ng-container *clrOptionSelected="let selected">
      <clr-icon shape="home" role="img" aria-label="welcome home"></clr-icon>
      {{ selected?.name }}
    </ng-container>
    <clr-options>
      <clr-option *clrOptionItems="let state of states; field: 'name'" [clrValue]="state">
        <clr-icon shape="world" role="img" aria-label="World is turning"></clr-icon>
        {{ state.name }}
      </clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Open the dropdown to use "Select All"</clr-control-helper>
</clr-combobox-container>
`;

const basicComponent = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { states, State } from './states';

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
  selector: 'clr-combobox-select-all-demo',
  templateUrl: './combobox-select-all.demo.html',
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
export class ComboboxSelectAllDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  states = states;
  selection: State[] = [];
}
