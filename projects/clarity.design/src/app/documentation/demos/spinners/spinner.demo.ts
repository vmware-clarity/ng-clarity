/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-spinner-demo',
  templateUrl: './spinner.demo.html',
  styleUrl: './spinner.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class SpinnerDemo extends ClarityDocComponent {
  props = [
    {
      name: '[clrInline]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Create an inline spinner',
    },
    {
      name: '[clrInverse]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Create spinner for dark background',
    },
    {
      name: '[clrSmall]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Make the spinner small 18x18 pixels',
    },
    {
      name: '[clrMedium]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Medium spinners 36x36 pixels',
    },
  ];

  constructor() {
    super('spinner');
  }
}
