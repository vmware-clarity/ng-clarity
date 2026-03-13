/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrSignpostModule,
  ClrStopEscapePropagationDirective,
  helpInfoIcon,
  userIcon,
} from '@clr/angular';

import { SignpostOpenAtPointDemo } from './signpost-open-at-point.demo';
import { SignpostParagraphDemo } from './signpost-paragraph.demo';
import { SignpostPositionsDemo } from './signpost-positions.demo';
import { SignpostTriggersDemo } from './signpost-triggers.demo';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
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
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LinkCardsComponent,
    ThemedImageComponent,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrSignpostModule,
    ClrIfOpen,
    ClrPopoverContent,
    ClrIcon,
    CodeSnippetComponent,
    SignpostOpenAtPointDemo,
    SignpostParagraphDemo,
    SignpostPositionsDemo,
    SignpostTriggersDemo,
    StyleDocsComponent,
  ],
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
