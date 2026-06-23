/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxCardContainerModule } from '@clr/addons/card-container';
import { ClarityModule } from '@clr/angular';

import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';
import { DynamicCardComponent } from './cards/dynamic/dynamic.component';
import { NotesCardComponent } from './cards/notes/notes.component';
import { SummaryCardComponent } from './cards/summary/summary.component';
import { TagsCardComponent } from './cards/tags/tags.component';

const BasicCardContainerHtml = require('!raw-loader!./ng/basic-card-container.html').default;
const BasicCardContainerTs = require('!raw-loader!./ng/basic-card-container.ts').default;

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
  styleUrl: './card-container.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    ClarityModule,
    AppfxCardContainerModule,
    CodeSnippetComponent,
    DocTabComponent,
    DocTabsComponent,
    StackblitzExampleComponent,
    SummaryCardComponent,
    NotesCardComponent,
    TagsCardComponent,
    DynamicCardComponent,
  ],
})
export class CardContainerDemoComponent extends ClarityDocComponent {
  readonly moduleImportTs = ModuleImportTs;
  readonly basicCardContainerHtml = BasicCardContainerHtml;
  readonly basicCardContainerTs = BasicCardContainerTs;

  cards: any[] = [
    { id: 'summary', title: 'Summary', unitWidth: 2, unitHeight: 4, componentClass: SummaryCardComponent },
    { id: 'notes', title: 'Notes', unitWidth: 1, unitHeight: 4, componentClass: NotesCardComponent },
    { id: 'tags', title: 'Tags', unitWidth: 1, unitHeight: 4, componentClass: TagsCardComponent },
    { id: 'dynamic', title: 'Dynamic', unitWidth: 1, unitHeight: 4, componentClass: DynamicCardComponent },
  ];

  constructor() {
    super('card-container');
  }

  addCard() {
    this.cards = [
      ...this.cards,
      {
        id: `extra-${this.cards.length}`,
        title: 'Summary',
        unitWidth: 1,
        unitHeight: 4,
        componentClass: SummaryCardComponent,
      },
    ];
  }

  removeCard() {
    if (this.cards.length > 1) {
      this.cards = this.cards.slice(0, -1);
    }
  }
}
