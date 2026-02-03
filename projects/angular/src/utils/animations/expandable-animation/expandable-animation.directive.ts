/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationBuilder, AnimationPlayer, useAnimation } from '@angular/animations';
import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { defaultExpandAnimation } from '../constants';
import { BaseExpandableAnimation } from './base-expandable-animation';

@Directive({
  selector: '[clrExpandableAnimation]',
  providers: [DomAdapter],
  host: {
    '[class.clr-expandable-animation]': 'true',
  },
})
export class ClrExpandableAnimationDirective extends BaseExpandableAnimation implements OnChanges, OnDestroy {
  @Input('clrExpandableAnimation') expanded = false;

  private player: AnimationPlayer;

  constructor(
    element: ElementRef<HTMLElement>,
    domAdapter: DomAdapter,
    renderer: Renderer2,
    private builder: AnimationBuilder
  ) {
    super(element, domAdapter, renderer);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expanded'] && !changes['expanded'].firstChange) {
      Promise.resolve().then(() => this.playAnimation());
    }
  }

  ngOnDestroy() {
    this.player?.destroy();
  }

  playAnimation() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = this.builder
      .build([useAnimation(defaultExpandAnimation, { params: { startHeight: this.startHeight } })])
      .create(this.element.nativeElement);

    this.player.onStart(() => this.initAnimationEffects());

    this.player.onDone(() => this.cleanupAnimationEffects(true));

    this.player.play();
  }
}
