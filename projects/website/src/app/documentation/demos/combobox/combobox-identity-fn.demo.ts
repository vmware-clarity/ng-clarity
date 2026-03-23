/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const basicHTML = `
<clr-combobox-container>
  <label>Single Selection</label>
  <clr-combobox [(ngModel)]="selection" name="user" required [clrComboboxIdentityFn]="identityFn">
    <ng-container *clrOptionSelected="let selected">
      {{ selected?.name }}
    </ng-container>
    <clr-options>
      <clr-option *clrOptionItems="let user of users; field: 'name'" [clrValue]="user">
        {{ user.name }}
        <span>(ID: {{ user.id }})</span>
      </clr-option>
    </clr-options>
  </clr-combobox>
</clr-combobox-container>
`;

const basicComponent = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [CommonModule, FormsModule, ClrComboboxModule],
})
export class ExampleComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];

  selection = { id: 2, name: 'Bob' };

  identityFn = (item: any) => {
    return item ? item.id : null;
  };
}
`;

@Component({
  selector: 'clr-combobox-identity-fn-demo',
  templateUrl: './combobox-identity-fn.demo.html',
  imports: [CommonModule, FormsModule, ClrComboboxModule, StackblitzExampleComponent],
})
export class ComboboxIdentityFnDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;

  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'Dave' },
  ];

  selection = { id: 2, name: 'Bob' };

  identityFn = (item: any) => {
    return item ? item.id : null;
  };
}
