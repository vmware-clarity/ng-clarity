/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, infoCircleIcon } from '@clr/angular';
import { TOOLTIP_EXAMPLES } from '@clr/examples/tooltip';

import { TooltipsDirectionsDemo } from './tooltips-directions';
import { TooltipsSizesDemo } from './tooltips-sizes';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-tooltips-demo',
  templateUrl: './tooltips.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    DocExampleComponent,
    TooltipsSizesDemo,
    TooltipsDirectionsDemo,
    StyleDocsComponent,
    AiSkillComponent,
  ],
})
export class TooltipsDemo extends ClarityDocComponent {
  readonly examples = TOOLTIP_EXAMPLES;

  constructor() {
    super('tooltip');
    ClarityIcons.addIcons(infoCircleIcon);
  }
}
