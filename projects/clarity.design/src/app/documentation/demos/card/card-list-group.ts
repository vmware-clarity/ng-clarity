/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="card">
  <div class="card-img">
    <img
      src="/assets/images/documentation/cards/placeholder_350x150.png"
      alt="Example of Image in a Card"
    />
  </div>
  <div class="card-block">
    <div class="card-title">Title</div>
    <p class="card-text">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, aut. Nihil nemo, necessitatibus
      earum.
    </p>
  </div>
  <ul class="list-group">
    <li class="list-group-item">Lorem ipsum dolor.</li>
    <li class="list-group-item">Lorem ipsum dolor sit.</li>
    <li class="list-group-item">Lorem ipsum.</li>
  </ul>
  <div class="card-footer">
    <a href="javascript://" class="btn btn-sm btn-link">Action 1</a>
    <a href="javascript://" class="btn btn-sm btn-link">Action 2</a>
  </div>
</div>
`;

@Component({
  selector: 'clr-list-group-demo',
  styleUrl: './card.demo.scss',
  templateUrl: './card-list-group.html',
  standalone: false,
})
export class CardListGroupDemo {
  htmlExample = HTML_EXAMPLE;
}
