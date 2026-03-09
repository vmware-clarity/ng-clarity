/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrButtonGroupModule, ClrPopoverHostDirective, ClrStopEscapePropagationDirective } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<clr-button-group [clrMenuPosition]="'bottom-right'">
  <clr-button>Add</clr-button>
  <clr-button>Edit</clr-button>
  <clr-button>Download</clr-button>
  <clr-button [clrInMenu]="true">Assign</clr-button>
  <clr-button [clrInMenu]="true">Move</clr-button>
  <clr-button [clrInMenu]="true">Delete</clr-button>
</clr-button-group>
`;

@Component({
  selector: 'clr-button-group-angular-directions-demo',
  templateUrl: './angular-directions.html',
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrButtonGroupModule,
    StackblitzExampleComponent,
  ],
})
export class ButtonGroupAngularDirectionsDemo {
  htmlExample = HTML_EXAMPLE;
}
