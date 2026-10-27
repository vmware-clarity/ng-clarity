/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { LOGIN_EXAMPLES } from '@clr/examples/login';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { onboardingPatternLink } from '../pattern-links';
import { LoginExampleDemo } from './login-example.demo';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';

@Component({
  selector: 'clr-login-demo',
  templateUrl: './login.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    LoginExampleDemo,
    DocExampleComponent,
    LinkCardsComponent,
    StyleDocsComponent,
  ],
})
export class LoginDemo extends ClarityDocComponent {
  readonly patternLinks: LinkCardsLink[] = [onboardingPatternLink];

  expanded = false;
  readonly examples = LOGIN_EXAMPLES;

  constructor() {
    super('login');
  }
}
