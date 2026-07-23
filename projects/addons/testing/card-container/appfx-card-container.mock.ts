/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EmbeddedViewRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AppfxCard } from '@clr/addons/card-container';

// mock for container service
export class MockContainerService {
  getCardOrder() {}

  moveCard() {}

  getVisibleCardsCount() {}
}

// mock for A11y service
export class MockA11yService {
  isSelected() {}

  isDraggableOver() {}

  selectCard() {}

  moveDropPosition() {}
}

// mock for DragDrop service
export class MockDragDropService {
  onDragStart() {}

  onDragDrop() {}
}

// mock for Layout service
export class MockLayoutService {
  updateCardSize() {}
}

// Renderer2 Mock
export class MockRenderer2 {
  setStyle(el: any, name: string, style: string): void {
    el[name] = style;
  }

  removeStyle(el: any, name: string): void {
    el[name] = null;
  }
}

// Mock Card Container for ViewContainerRef
@Component({
  standalone: false,
  template: `
    <div class="scrollable">
      <div>
        <ng-template #cardContainer></ng-template>
      </div>
    </div>
  `,
  styles: [
    '.scrollable { overflow: auto; position: absolute; left: 0; right: 0; top: 0; bottom: 0; max-height: 20px; }',
  ],
})
export class MockCardContainerComponent {
  @ViewChild('cardContainer', { read: ViewContainerRef, static: true }) cardContainer: ViewContainerRef;
}

// Sample Card to test scenarios
@Component({
  standalone: false,
  template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
      <div class="card-footer"></div>
    </div>
  `,
})
export class SampleCardComponent {
  eleRef: ElementRef;

  constructor(el: ElementRef) {
    this.eleRef = el;
  }
}

// Sample Card to without footer test scenarios
@Component({
  standalone: false,
  template: `
    <div class="card">
      <div class="card-header">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-block"></div>
    </div>
  `,
})
export class SampleCardWithoutFooterComponent {
  eleRef: ElementRef;

  constructor(el: ElementRef) {
    this.eleRef = el;
  }
}

// Sample Card to without header test scenarios
@Component({
  standalone: false,
  template: `
    <div class="card">
      <div class="card-block">
        <div class="card-title">Sample Card</div>
      </div>
      <div class="card-footer"></div>
    </div>
  `,
})
export class SampleCardWithoutHeaderComponent {
  eleRef: ElementRef;

  constructor(el: ElementRef) {
    this.eleRef = el;
  }
}

// mock element ref
export class MockElementRef extends ElementRef {
  nativeElement = {
    querySelector: () => {},
  };
}

// sort function to display cards by sorted titles
export const sortCardsFn = (a: AppfxCard, b: AppfxCard) => {
  if (a.title && b.title) {
    return a.title.localeCompare(b.title);
  }
  return 0;
};

// sample cards for unit tests
export const sampleCards = [
  {
    id: 'sample-card-1',
    title: 'Sample Card 1',
    componentClass: SampleCardComponent,
    hidden: false,
    order: 0,
    view: undefined as unknown as EmbeddedViewRef<void>,
  },
  {
    id: 'sample-card-2',
    title: 'Sample Card 2',
    componentClass: SampleCardComponent,
    hidden: false,
    canHide: false,
    order: 1,
    view: undefined as unknown as EmbeddedViewRef<void>,
  },
  {
    id: 'sample-card-3',
    title: 'Sample Card 3',
    componentClass: SampleCardComponent,
    hidden: false,
    canHide: false,
    order: 5,
    view: undefined as unknown as EmbeddedViewRef<void>,
  },
];

// sample card settings
export const sampleCardsSettings = [
  {
    id: 'sample-card-1',
    hidden: false,
    order: 0,
  },
  {
    id: 'sample-card-2',
    hidden: true,
    order: 2,
  },
  {
    id: 'sample-card-3',
    hidden: false,
    order: 5,
  },
];

// card to order mapping
export const cardIdToOrder = {
  cardWithDefaultOrder: Infinity,
  [sampleCards[0].id]: 0,
  [sampleCards[1].id]: 1,
  [sampleCards[2].id]: 2,
};
