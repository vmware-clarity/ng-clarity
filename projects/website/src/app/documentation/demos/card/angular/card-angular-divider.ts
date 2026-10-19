/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrCardModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<clr-card>
  <clr-card-header>Header</clr-card-header>
  <clr-card-body>
    <clr-card-body-text>First section of card content.</clr-card-body-text>
    <clr-card-divider></clr-card-divider>
    <clr-card-body-text>Second section of card content, separated by a divider.</clr-card-body-text>
  </clr-card-body>
</clr-card>
`;

@Component({
  selector: 'clr-card-angular-divider-demo',
  styleUrl: '../card.demo.scss',
  templateUrl: './card-angular-divider.html',
  imports: [ClrCardModule, StackblitzExampleComponent],
})
export class CardAngularDividerDemo {
  htmlExample = HTML_EXAMPLE;
}
