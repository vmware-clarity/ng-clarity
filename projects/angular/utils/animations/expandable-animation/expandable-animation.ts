/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  host: {
    '[class.clr-expandable-animation]': 'true',
  },
  providers: [DomAdapter],
  standalone: false,
})
export class ClrExpandableAnimation extends BaseExpandableAnimation implements OnChanges {
  @Input() clrExpandTrigger = false;

  /** @deprecated The expansion is animated with native CSS; there is no Angular animation state anymore. */
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clrExpandTrigger'] && !changes['clrExpandTrigger'].firstChange) {
      // Defer until the content has been rendered, so that the height to animate to can be measured.
      Promise.resolve().then(() => this.playAnimation());
    }
  }

  /** @deprecated The expansion is animated with native CSS; there are no Angular animation callbacks anymore. */
  animationStart(event: { fromState: string }) {
    if (event.fromState !== 'void') {
      this.initAnimationEffects();
    }
  }

  /** @deprecated The expansion is animated with native CSS; there are no Angular animation callbacks anymore. */
  animationDone(event: { fromState: string }) {
    if (event.fromState !== 'void') {
      this.cleanupAnimationEffects();
    }
  }
}
