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
  /** @deprecated The height is no longer animated: the content shown inside animates itself with CSS. */
  @Input() clrExpandTrigger = false;

  /** @deprecated The height is no longer animated: the content shown inside animates itself with CSS. */
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
  }

  /** @deprecated The height is no longer animated: the content shown inside animates itself with CSS. */
  animationStart(event: { fromState: string }) {
    if (event.fromState !== 'void') {
      this.initAnimationEffects();
    }
  }

  /** @deprecated The height is no longer animated: the content shown inside animates itself with CSS. */
  animationDone(event: { fromState: string }) {
    if (event.fromState !== 'void') {
      this.cleanupAnimationEffects();
    }
  }
}
