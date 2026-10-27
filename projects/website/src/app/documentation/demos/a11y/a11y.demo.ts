/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@clr/angular';
import { A11Y_EXAMPLES } from '@clr/examples/a11y';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const ZoomLevelServiceTs = require('!raw-loader!./ng/zoom-level-service.ts').default;

const ModuleImportExample = `
import { NgModule } from '@angular/core';
import { AppfxA11yModule } from '@vmw/appfx/a11y';

@NgModule({
  imports: [AppfxA11yModule],
})
export class MyModule {}
`;

@Component({
  selector: 'clr-accessibility-addon-demo',
  templateUrl: './a11y.demo.html',
  styleUrl: './a11y.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    CodeSnippetComponent,
    StackblitzExampleComponent,
    DocExampleComponent,
    AiSkillComponent,
  ],
})
export class AcessibilityAddonDemo extends ClarityDocComponent {
  moduleImportExample = ModuleImportExample;
  zoomLevelServiceTs = ZoomLevelServiceTs;

  readonly examples = A11Y_EXAMPLES;

  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('a11y');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}
