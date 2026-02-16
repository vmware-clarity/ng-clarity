/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@cds/core/icon';

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
  standalone: false,
})
export class DragAndDropDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('drag-and-drop');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
