/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCommonFormsModule,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrSelectModule,
  ClrSignpostModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { SignpostDemo } from './signpost.demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const html = `
<clr-select-container>
  <label>Select a position:</label>
  <select clrSelect name="position" [(ngModel)]="position">
    @for (position of positions; track position) {
      <option [ngValue]="position">{{ position }}</option>
    }
  </select>
</clr-select-container>
<clr-signpost>
  <clr-signpost-content [clrPosition]="position" *clrIfOpen>
    <h3 style="margin-top: 0">Position</h3>
    <p>
      <code cds-text="code">{{ position }}</code>
    </p>
  </clr-signpost-content>
</clr-signpost>
`;

const code = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrSignpostModule, ClrSelectModule, FormsModule],
})
export class ExampleComponent {
  positions: string[] = [
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'left-top',
    'left-middle',
    'left-bottom',
  ];
  position: string = 'right-middle';
}
`;

@Component({
  selector: 'clr-signpost-positions-demo',
  templateUrl: './signpost-positions.demo.html',
  styleUrl: './signpost.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    ClrSelectModule,
    ClrCommonFormsModule,
    FormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrSignpostModule,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
    SignpostDemo,
  ],
})
export class SignpostPositionsDemo {
  positions: string[] = [
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'left-top',
    'left-middle',
    'left-bottom',
  ];
  position = 'right-middle';
  html = html;
  code = code;
}
