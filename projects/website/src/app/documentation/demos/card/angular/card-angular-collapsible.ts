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
<clr-card clrCardCollapsible [(clrCardCollapsed)]="collapsed">
  <clr-card-header>Header</clr-card-header>
  <clr-card-body>
    <clr-card-body-title>Title</clr-card-body-title>
    <clr-card-body-text>
      Click the chevron in the header to collapse or expand this card.
    </clr-card-body-text>
  </clr-card-body>
  <clr-card-footer>
    <button class="btn btn-sm btn-link">Action</button>
  </clr-card-footer>
</clr-card>
`;

@Component({
  selector: 'clr-card-angular-collapsible-demo',
  styleUrl: '../card.demo.scss',
  templateUrl: './card-angular-collapsible.html',
  imports: [ClrCardModule, StackblitzExampleComponent],
})
export class CardAngularCollapsibleDemo {
  htmlExample = HTML_EXAMPLE;
  collapsed = false;
}
