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
  <clr-card-img>
    <img
      src="/assets/images/documentation/cards/placeholder_480x200.png"
      alt="Example of Image in a Card"
    />
  </clr-card-img>
  <clr-card-body>
    <clr-card-body-text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</clr-card-body-text>
  </clr-card-body>
</clr-card>
`;

@Component({
  selector: 'clr-card-angular-image-demo',
  styleUrl: '../card.demo.scss',
  templateUrl: './card-angular-image.html',
  imports: [ClrCardModule, StackblitzExampleComponent],
})
export class CardAngularImageDemo {
  htmlExample = HTML_EXAMPLE;
}
