/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<a href="..." class="label label-purple clickable">
  <span class="text">Austin</span>
  <span class="badge">1</span>
</a>
<a href="..." class="label label-blue clickable">
  <span class="text">New York</span>
  <span class="badge">2</span>
</a>
<a href="..." class="label label-orange clickable">
  <span class="text">Palo Alto</span>
  <span class="badge">3</span>
</a>
<a href="..." class="label label-light-blue clickable">
  <span class="text">San Francisco</span>
  <span class="badge">12</span>
</a>
<a href="..." class="label clickable">
  <span class="text">Seattle</span>
  <span class="badge">15</span>
</a>
<a href="..." class="label label-purple clickable">
  <span class="text">Chicago</span>
  <span class="badge">55</span>
</a>
<a href="..." class="label label-blue clickable">
  <span class="text">San Jose</span>
  <span class="badge">66</span>
</a>
<a href="..." class="label label-orange clickable">
  <span class="text">Charlotte</span>
  <span class="badge">88</span>
</a>
<a href="..." class="label label-light-blue clickable">
  <span class="text">Atlanta</span>
  <span class="badge">99+</span>
</a>
<a href="..." class="label clickable">
  <span class="text">Philadephia</span>
  <span class="badge">0</span>
</a>
`;

@Component({
  selector: 'clr-labels-with-badges-demo',
  templateUrl: './labels-with-badges.demo.html',
  imports: [StackblitzExampleComponent],
})
export class LabelsWithBadgesDemo {
  example = EXAMPLE;
}
