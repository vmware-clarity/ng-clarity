/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxCardContainerModule } from '@clr/addons/card-container';

import { DynamicCardComponent } from './cards/dynamic/dynamic.component';
import { NotesCardComponent } from './cards/notes/notes.component';
import { SummaryCardComponent } from './cards/summary/summary.component';
import { TagsCardComponent } from './cards/tags/tags.component';

@Component({
  selector: 'clr-card-container-demo',
  standalone: true,
  imports: [
    AppfxCardContainerModule,
    SummaryCardComponent,
    NotesCardComponent,
    TagsCardComponent,
    DynamicCardComponent,
  ],
  templateUrl: './card-container.demo.html',
})
export class CardContainerDemo {
  cards: any[] = [
    { id: 'summary', title: 'Summary', unitWidth: 2, unitHeight: 4, componentClass: SummaryCardComponent },
    { id: 'notes', title: 'Notes', unitWidth: 1, unitHeight: 4, componentClass: NotesCardComponent },
    { id: 'tags', title: 'Tags', unitWidth: 1, unitHeight: 4, componentClass: TagsCardComponent },
    { id: 'dynamic', title: 'Dynamic', unitWidth: 1, unitHeight: 4, componentClass: DynamicCardComponent },
  ];

  addCard() {
    this.cards = [
      ...this.cards,
      {
        id: `card-${this.cards.length}`,
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
