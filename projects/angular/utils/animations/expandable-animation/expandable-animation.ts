/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BaseExpandableAnimation } from './base-expandable-animation';
import { DomAdapter } from '../../dom-adapter/dom-adapter';

@Component({
  selector: 'clr-expandable-animation',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [DomAdapter],
  host: { '(animate.enter)': 'animates = !noopAnimations' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ClrExpandableAnimation extends BaseExpandableAnimation implements OnChanges {
  /** Animates the height of the element, from `startHeight` to its new height, each time it changes. */
  @Input() clrExpandTrigger = false;

  /** @deprecated No longer used: the height animates without Angular animations. To be removed in a future major version. */
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clrExpandTrigger'] && !changes['clrExpandTrigger'].firstChange) {
      // Once the change is rendered.
      Promise.resolve().then(() => this.animateFromStartHeight());
    }
  }

  /** @deprecated No longer called. To be removed in a future major version. */
  animationStart(_event: { fromState: string }) {
    // Nothing to do.
  }

  /** @deprecated No longer called. To be removed in a future major version. */
  animationDone(_event: { fromState: string }) {
    // Nothing to do.
  }
}
