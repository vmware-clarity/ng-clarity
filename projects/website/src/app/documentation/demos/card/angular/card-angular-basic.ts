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
    <clr-card-body-title>Title</clr-card-body-title>
    <clr-card-body-text>
      Card content can contain text, links, images, data visualizations, lists and more.
    </clr-card-body-text>
  </clr-card-body>
  <clr-card-footer>
    <button class="btn btn-sm btn-link">Action</button>
  </clr-card-footer>
</clr-card>
`;

@Component({
  selector: 'clr-card-angular-basic-demo',
  styleUrl: '../card.demo.scss',
  templateUrl: './card-angular-basic.html',
  imports: [ClrCardModule, StackblitzExampleComponent],
})
export class CardAngularBasicDemo {
  htmlExample = HTML_EXAMPLE;
}
