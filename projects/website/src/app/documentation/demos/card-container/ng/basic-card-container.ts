/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxCardContainerModule } from '@clr/addons/card-container';

@Component({
  selector: 'appfx-demo-summary-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Summary</div>
      <div class="card-block">Summary</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Summary Action</button>
      </div>
    </div>
  `,
})
export class SummaryCardComponent {}

@Component({
  selector: 'appfx-demo-note-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Notes</div>
      <div class="card-block">Notes</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Notes Action</button>
      </div>
    </div>
  `,
})
export class NotesCardComponent {}

@Component({
  selector: 'appfx-demo-tags-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Tags</div>
      <div class="card-block">Tags Sample</div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Tags Action</button>
      </div>
    </div>
  `,
})
export class TagsCardComponent {}

@Component({
  selector: 'appfx-demo-dynamic-card',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">Dynamic</div>
      <div class="card-block">Dynamic</div>
    </div>
  `,
})
export class DynamicCardComponent {}

@Component({
  selector: 'clr-basic-card-container-demo',
  standalone: true,
  imports: [
    AppfxCardContainerModule,
    SummaryCardComponent,
    NotesCardComponent,
    TagsCardComponent,
    DynamicCardComponent,
  ],
  template: `
    <div class="clr-mb-16px">
      <button class="btn btn-outline" (click)="addCard()">Add Card</button>
      <button class="btn btn-outline" (click)="removeCard()" [disabled]="cards.length <= 1">Remove Last</button>
    </div>
    <appfx-card-container [cards]="cards" [containerId]="'demo-container'"></appfx-card-container>
  `,
})
export class BasicCardContainerDemoComponent {
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
