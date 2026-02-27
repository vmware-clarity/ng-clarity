/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<span class="badge">
  1
  <span class="clr-sr-only">item in a badge</span>
</span>
<span class="badge badge-purple">
  15
  <span class="clr-sr-only">items in a purple badge</span>
</span>
<span class="badge badge-blue">
  2
  <span class="clr-sr-only">items in a blue badge</span>
</span>
<span class="badge badge-orange">
  3
  <span class="clr-sr-only">items in an orange badge</span>
</span>
<span class="badge badge-light-blue">
  12
  <span class="clr-sr-only">items in a light blue badge</span>
</span>
<span class="badge badge-1">
  90
  <span class="clr-sr-only">items in a badge</span>
</span>
<span class="badge badge-2">
  51
  <span class="clr-sr-only">items in a purple badge</span>
</span>
<span class="badge badge-3">
  25
  <span class="clr-sr-only">items in a blue badge</span>
</span>
<span class="badge badge-4">
  32
  <span class="clr-sr-only">items in an orange badge</span>
</span>
<span class="badge badge-5">
  57
  <span class="clr-sr-only">items in a light blue badge</span>
</span>
`;

@Component({
  selector: 'clr-badge-colors-demo',
  templateUrl: './badge-colors.demo.html',
  imports: [StackblitzExampleComponent],
})
export class BadgeColorsDemo {
  htmlExample = HTML_EXAMPLE;
}
