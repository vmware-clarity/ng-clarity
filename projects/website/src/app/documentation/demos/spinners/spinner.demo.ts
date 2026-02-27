/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SpinnerComponentDemo } from './spinner-component';
import { SpinnerSizesDemo } from './spinner-sizes';
import { SpinnerTypesDemo } from './spinner-types';
import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocTabActiveDirective } from '../../../shared/doc-tabs/doc-tab-active.directive';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-spinner-demo',
  templateUrl: './spinner.demo.html',
  styleUrl: './spinner.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    AnimatedExampleComponent,
    RouterLink,
    DocTabActiveDirective,
    SpinnerComponentDemo,
    SpinnerTypesDemo,
    SpinnerSizesDemo,
    StyleDocsComponent,
  ],
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
