/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@clr/angular';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-drag-and-drop-demo',
  templateUrl: './drag-and-drop.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent],
})
export class DragAndDropDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('drag-and-drop');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
