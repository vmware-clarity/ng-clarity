/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, ClrIcon, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@clr/angular';
import { TRANSLATE_EXAMPLES } from '@clr/examples/translate';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-translate-addon-demo',
  templateUrl: './translate.demo.html',
  styleUrl: './translate.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [DocTabsComponent, DocTabComponent, ClrIcon, DocExampleComponent, AiSkillComponent],
})
export class TranslateAddonDemo extends ClarityDocComponent {
  readonly examples = TRANSLATE_EXAMPLES;

  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('translate');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
