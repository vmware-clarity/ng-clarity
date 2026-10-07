/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

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
export class ClrExpandableAnimation extends BaseExpandableAnimation {
  // ECMAScript private fields, so that they cannot clash with the members of existing subclasses.
  #expandTrigger = false;
  #expandTriggerSet = false;

  /**
   * Changing this value animates the height of the host to the height of its updated content. A setter rather than
   * `ngOnChanges()`, so that subclasses defining their own `ngOnChanges()` keep the animation.
   */
  @Input()
  get clrExpandTrigger() {
    return this.#expandTrigger;
  }
  set clrExpandTrigger(value: boolean) {
    this.#expandTrigger = value;
    if (this.#expandTriggerSet) {
      this.scheduleAnimation();
    }
    this.#expandTriggerSet = true;
  }

  /** @deprecated The expansion is animated with native CSS; there is no Angular animation state anymore. */
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
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
