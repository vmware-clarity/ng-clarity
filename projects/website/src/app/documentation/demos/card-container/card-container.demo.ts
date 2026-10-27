/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { CARD_CONTAINER_EXAMPLES } from '@clr/examples/card-container';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ClarityDocComponent } from '../clarity-doc';

const ModuleImportTs = `
import { AppfxCardContainerModule } from '@clr/addons/card-container';

@NgModule({
  imports: [AppfxCardContainerModule],
})
export class MyModule {}
`;

@Component({
  selector: 'clr-card-container-demo',
  standalone: true,
  templateUrl: './card-container.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [CodeSnippetComponent, DocExampleComponent, DocTabComponent, DocTabsComponent, AiSkillComponent],
})
export class CardContainerDemoComponent extends ClarityDocComponent {
  readonly moduleImportTs = ModuleImportTs;
  readonly examples = CARD_CONTAINER_EXAMPLES;

  constructor() {
    super('card-container');
  }
}
