/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { GroupedStates, groupedStates } from './states';

const basicHTML = `
<clr-combobox-container>
  <label>My State</label>
  <clr-combobox [(ngModel)]="selection" name="myState">
    <clr-options>
      <ng-container *ngFor="let group of groupedStates">
        <clr-option-group [clrOptionGroupLabel]="group.name">
          <clr-option *clrOptionItems="let state of group.states; field: 'name'" [clrValue]="state">
            {{ state.name }}
          </clr-option>
        </clr-option-group>
      </ng-container>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Which state do you live in?</clr-control-helper>
  <clr-control-error>There was an error</clr-control-error>
</clr-combobox-container>
`;

const basicComponent = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ClrComboboxModule, ClrIconModule, ClrFormsModule } from '@clr/angular';

import { groupedStates, GroupedStates } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [FormsModule, ClrIconModule, ClrFormsModule, ClrComboboxModule, NgFor],
})
export class ExampleComponent {
  groupedStates = groupedStates;
  selection: GroupedStates[] = [];
}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-combobox-grouping-demo',
  templateUrl: './combobox-grouping.demo.html',
  standalone: false,
})
export class ComboboxGroupingDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  groupedStates = groupedStates;
  selection: GroupedStates[] = [];
}
