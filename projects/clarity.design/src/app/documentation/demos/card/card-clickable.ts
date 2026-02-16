/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-lg-6 clr-col-12">
    <a href="javascript://" class="card clickable">
      <div class="card-img">
        <img
          src="/assets/images/documentation/cards/placeholder_350x150.png"
          alt="Example of Image in a Card"
        />
      </div>
      <div class="card-block">
        <p class="card-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consectetur magnam eos amet
          sit rem. Ipsam maiores incidunt eum quasi enim! Corporis sunt nisi totam molestias quam
          commodi maxime mollitia.
        </p>
      </div>
    </a>
  </div>
</div>
`;

@Component({
  selector: 'clr-card-clickable-demo',
  styleUrl: './card.demo.scss',
  templateUrl: './card-clickable.html',
  standalone: false,
})
export class CardClickableDemo {
  htmlExample = HTML_EXAMPLE;
}
