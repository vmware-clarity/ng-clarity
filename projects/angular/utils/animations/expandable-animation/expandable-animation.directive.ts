/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BaseExpandableAnimation } from './base-expandable-animation';
import { DomAdapter } from '../../dom-adapter/dom-adapter';

@Directive({
  selector: '[clrExpandableAnimation]',
  providers: [DomAdapter],
  host: {
    '[class.clr-expandable-animation]': 'true',
    '(animate.enter)': 'animates = !noopAnimations',
  },
  standalone: false,
})
export class ClrExpandableAnimationDirective extends BaseExpandableAnimation implements OnChanges {
  /** Animates the height of the element, from `startHeight` to its new height, each time it changes. */
  @Input('clrExpandableAnimation') expanded = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expanded'] && !changes['expanded'].firstChange) {
      // Once the change is rendered.
      Promise.resolve().then(() => this.playAnimation());
    }
  }

  playAnimation() {
    this.animateFromStartHeight();
  }
}
