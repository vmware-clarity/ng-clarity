/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { notificationsPatternLink, onboardingPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-modal-demo',
  templateUrl: './modal.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class ModalDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [notificationsPatternLink, onboardingPatternLink];

  expanded = false;

  constructor() {
    super('modal');
  }
}
