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
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { GroupedStates, groupedStates } from './states';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

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

import { groupedStates, GroupedStates } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [FormsModule, ClrIcon, ClrFormsModule, ClrComboboxModule, NgFor],
})
export class ExampleComponent {
  groupedStates = groupedStates;
  selection: GroupedStates[] = [];
}
`;

const additionalFiles = {
  'states.ts': '',
};

@Component({
  selector: 'clr-combobox-grouping-demo',
  templateUrl: './combobox-grouping.demo.html',
  imports: [
    ClrComboboxModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    FormsModule,
    StackblitzExampleComponent,
  ],
})
export class ComboboxGroupingDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  groupedStates = groupedStates;
  selection: GroupedStates[] = [];
}
