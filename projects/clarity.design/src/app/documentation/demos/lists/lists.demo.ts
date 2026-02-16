/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

const EXAMPLE1 = `
<ol class="list">
  <li>Split chicken breast in half.</li>
  <li>Dust chicken with flour.</li>
  <li>Sear chicken, add butter, garlic, vinegar, soy sauce, honey.</li>
  <li>Simmer until the sauce thickens.</li>
</ol>
`;

const EXAMPLE2 = `
<ul class="list">
  <li>Chicken Breast</li>
  <li>Flour</li>
  <li>Garlic</li>
  <li>Honey</li>
</ul>
`;

const EXAMPLE3 = `
<ul class="list list-unstyled">
  <li>Calories: 323 cal</li>
  <li>Carbohydrates: 23g</li>
  <li>Protein: 28g</li>
  <li>Fat: 13g</li>
</ul>
`;

const EXAMPLE4 = `
<ul class="list">
  <li>Calories</li>
  <li>Fat</li>
  <li>Protein</li>
  <li>
    Diet type
    <ul class="list list-unordered">
      <li>Vegan</li>
      <li>Gluten Free</li>
      <li>Vegetarian</li>
    </ul>
  </li>
  <li>
    Allergens
    <ul class="list">
      <li>Peanut</li>
      <li>Shellfish</li>
      <li>Soy</li>
    </ul>
  </li>
  <li>Other Allergens</li>
</ul>
<ul class="list list-spacer">
  <li>Fish</li>
  <li>Groundnut or tree nuts</li>
  <li>Eggs</li>
  <li>Dairy</li>
</ul>
`;
@Component({
  selector: 'clr-lists-demo',
  templateUrl: './lists.demo.html',
  styleUrl: './lists.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class ListsDemo extends ClarityDocComponent {
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  example3 = EXAMPLE3;
  example4 = EXAMPLE4;

  listItems = ['Chicken Breast', 'Flour', 'Garlic', 'Honey'];
  listItemsOrdered = [
    'Split chicken breast in half.',
    'Dust chicken with flour.',
    'Sear chicken, add butter, garlic, vinegar, soy sauce, honey.',
    'Simmer until the sauce thickens.',
  ];

  constructor() {
    super('list');
  }
}
