/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, helpInfoIcon, userIcon } from '@cds/core/icon';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { onboardingPatternLink } from '../pattern-links';

const html = `
<clr-signpost>
  <clr-signpost-content *clrIfOpen>
    <h3>Default Signpost</h3>
    <p>
      Position:
      <code cds-text="code">right-middle</code>
    </p>
  </clr-signpost-content>
</clr-signpost>
`;

@Component({
  templateUrl: './signpost.demo.html',
  styleUrl: './signpost.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class SignpostDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [onboardingPatternLink];
  openState = false;

  html = html;

  constructor() {
    super('signpost');

    ClarityIcons.addIcons(userIcon, helpInfoIcon);
  }
}
