/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClarityIcons, codeIcon, rulerPencilIcon } from '@clr/angular';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

const GLOBAL_TOKENS_EXAMPLE = `
--cds-global-color-green-800
--cds-global-layout-space-sm
--cds-alias-typography-color-300
--cds-global-animation-duration-primary
`;

const GLOBAL_TOKENS_EXAMPLE_MAPPING = `
--cds-global-color-green-800: hsl(93, 80%, 23%)
--cds-global-layout-space-sm: calc((6 / 20) * 1rem)
--cds-alias-typography-color-300: hsl(198, 23%, 23%)
--cds-global-animation-duration-primary: 0.4s
`;

const ALIASES_EXAMPLE = `
--cds-alias-status-info-tint
--cds-alias-object-border-color-shade
--cds-alias-object-interaction-background-active
`;

const ALIASES_EXAMPLE_MAPPING = `
--cds-alias-status-info-tint: var(--cds-global-color-blue-50)
--cds-alias-object-border-color-shade: var(--cds-global-color-construction-300)
--cds-alias-object-interaction-background-active: var(--cds-global-color-blue-100)
`;

const COMPONENTS_TOKENS_EXAMPLE = `
/* class added to the checkbox html */ 
.my-custom-checkbox { 
  --clr-forms-checkbox-background-color: black;
}`;

@Component({
  templateUrl: './tokens.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    LinkCardsComponent,
    CodeSnippetComponent,
    RouterLink,
  ],
})
export class TokensDemo extends ClarityDocComponent {
  globalTokensExample = GLOBAL_TOKENS_EXAMPLE;
  globalTokensExampleMapping = GLOBAL_TOKENS_EXAMPLE_MAPPING;
  aliasesExample = ALIASES_EXAMPLE;
  aliasesExampleMapping = ALIASES_EXAMPLE_MAPPING;
  componentsExample = COMPONENTS_TOKENS_EXAMPLE;

  links: LinkCardsLink[] = [
    {
      routerLink: '/documentation/tokens/design',
      text: 'Design with tokens',
      hexagonColor: 'utility-tangerine',
      iconShape: 'ruler-pencil',
    },
    {
      routerLink: '/documentation/tokens/code',
      text: 'Develop with tokens',
      hexagonColor: 'sequential-blue',
      iconShape: 'code',
    },
  ];

  constructor() {
    super('tokens');

    ClarityIcons.addIcons(rulerPencilIcon, codeIcon);
  }
}
