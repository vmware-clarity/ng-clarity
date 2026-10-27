/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCheckboxModule, ClrCommonFormsModule, ClrIcon, ClrIconModule } from '@clr/angular';
import { TOGGLE_EXAMPLES } from '@clr/examples/toggle';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

@Component({
  templateUrl: './toggles.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrCheckboxModule,
    DocExampleComponent,
    ClrCommonFormsModule,
    FormsModule,
    ClrIcon,
    ClrIconModule,
    ThemedImageComponent,
    RouterLink,
    LinkCardsComponent,
    StyleDocsComponent,
  ],
})
export class TogglesDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  readonly examples = TOGGLE_EXAMPLES;

  checked = true;
  disabled = true;

  constructor() {
    super('toggle-switch');
  }
}
