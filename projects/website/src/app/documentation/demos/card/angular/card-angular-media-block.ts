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
    <clr-card-media-block>
      <img clrCardMediaImage src="/assets/images/documentation/cards/placeholder_60x60.png" alt="" />
      <clr-card-media-description>
        <span clrCardMediaTitle>Project A</span>
        <span clrCardMediaText>Owner: John Doe</span>
      </clr-card-media-description>
    </clr-card-media-block>
    <clr-card-body-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</clr-card-body-text>
  </clr-card-body>
  <clr-card-footer>
    <button class="btn btn-sm btn-link">Action</button>
  </clr-card-footer>
</clr-card>
`;

@Component({
  selector: 'clr-card-angular-media-block-demo',
  styleUrl: '../card.demo.scss',
  templateUrl: './card-angular-media-block.html',
  imports: [ClrCardModule, StackblitzExampleComponent],
})
export class CardAngularMediaBlockDemo {
  htmlExample = HTML_EXAMPLE;
}
