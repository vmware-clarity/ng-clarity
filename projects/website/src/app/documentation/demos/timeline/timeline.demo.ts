/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  circleIcon,
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrSpinnerModule,
  dotCircleIcon,
  errorStandardIcon,
  successStandardIcon,
} from '@clr/angular';

import { TimelineBodyDemo } from './timeline-body-demo';
import { TimelineComponentDemo } from './timeline-component';
import { TimelineContainerDemo } from './timeline-container-demo';
import { TimelineFullDemo } from './timeline-full-demo.component';
import { TimelineStepDemo } from './timeline-step-demo';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-timeline-demo',
  templateUrl: './timeline.demo.html',
  styleUrl: './timeline.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LinkCardsComponent,
    ThemedImageComponent,
    ClrIcon,
    ClrIconModule,
    ClrSpinnerModule,
    RouterLink,
    TimelineContainerDemo,
    TimelineStepDemo,
    TimelineBodyDemo,
    TimelineFullDemo,
    TimelineComponentDemo,
    StyleDocsComponent,
  ],
})
export class TimelineDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('timeline');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
