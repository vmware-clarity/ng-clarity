/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrAlertModule, ClrCommonFormsModule, ClrVerticalNavModule } from '@clr/angular';

import { ProgressBarAnimationsDemo } from './progress-bar-animations';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarColorsDemo } from './progress-bar-colors';
import { ProgressBarComponentDemo } from './progress-bar-component.demo';
import { ProgressBarExamplesDemo } from './progress-bar-examples';
import { ProgressBarInlineDemo } from './progress-bar-inline';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
import { ProgressBarLoopDemo } from './progress-bar-loop';
import { ProgressBarStaticDemo } from './progress-bar-static';
import { ProgressBarStaticCardsDemo } from './progress-bar-static-cards';
import { ProgressBarStoryDemo } from './progress-bar-story';
import { AnimatedExampleComponent } from '../../../shared/animated-example/animated-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

export const OPTIONAL_PERCENTAGE_LABEL = `
<!-- Visual Presentation -->
<div aria-hidden="true">
  <div>Container 1 loading Progress</div>
  <progress max="100" value="65" data-displayval="65%"></progress>
</div>

<!-- Screen Reader Presentation -->
<!-- Screen reader users will be interrupted and hear "Container 1 Loading Progress is 65%" when the progress bar appears -->
<!-- Screen reader users will also be able to read this text with the screen reader's cursor -->
<span aria-live="polite">
  <span class="clr-sr-only">Container 1 Loading Progress is</span>
  65%
</span>
`;

@Component({
  selector: 'clr-progress-bars-demo',
  templateUrl: './progress-bars.demo.html',
  styleUrl: './progress-bars.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    AnimatedExampleComponent,
    ProgressBarStoryDemo,
    RouterLink,
    ClrVerticalNavModule,
    ClrCommonFormsModule,
    ProgressBarComponentDemo,
    ProgressBarExamplesDemo,
    ProgressBarLoopDemo,
    ProgressBarColorsDemo,
    ProgressBarAnimationsDemo,
    ClrAlertModule,
    ProgressBarCardsDemo,
    ProgressBarStaticCardsDemo,
    ProgressBarStaticDemo,
    ProgressBarInlineDemo,
    ProgressBarInlineCardsDemo,
    StyleDocsComponent,
  ],
})
export class ProgressBarsDemo extends ClarityDocComponent {
  newLayout = true;
  optionalPercentageLabel = OPTIONAL_PERCENTAGE_LABEL;

  props = [
    {
      name: '[id]',
      type: 'String',
      defaultValue: 'Random ID',
      description: 'HTML ID to bind label to progress bar',
    },
    {
      name: '[clrValue]',
      type: 'Number',
      defaultValue: '0',
      description:
        'This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and max',
    },
    {
      name: '[clrMax]',
      type: 'Number',
      defaultValue: '100',
      description:
        'This attribute describes how much work the task indicated by the progress element requires. The max attribute, if present, must have a value greater than zero and be a valid floating point number. The default value is 100',
    },
    {
      name: '[clrDisplayval]',
      type: 'String',
      defaultValue: 'Empty string',
      description: 'Overwrite the default value representation.',
    },
    {
      name: '[clrLabeled]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Display progress value or displayval',
    },
    {
      name: '[clrLoop]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Add looping animation',
    },
    {
      name: '[clrFade]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Flash animation',
    },
    {
      name: '[clrFlashDanger]',
      type: 'Boolean',
      defaultValue: 'false',
      description: 'Flash in danger animation',
    },
    {
      name: '[clrColor]',
      type: `String ('' | 'success' | 'warning' | 'danger')`,
      defaultValue: 'Empty string',
      description: 'Add color style',
    },
  ];

  constructor() {
    super('progress');
  }
}
