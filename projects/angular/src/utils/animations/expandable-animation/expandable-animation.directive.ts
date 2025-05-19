/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Directive, ElementRef, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';

@Directive({
  selector: '[clrExpandableAnimation]',
  providers: [DomAdapter],
  host: {
    '[class.clr-expandable-animation]': 'true',
  },
})
export class ClrExpandableAnimationDirective implements OnChanges, OnDestroy {
  @Input('clrExpandableAnimation') expanded = false;

  startHeight = 0;

  private player: AnimationPlayer;

  constructor(
    private element: ElementRef<HTMLElement>,
    private domAdapter: DomAdapter,
    private renderer: Renderer2,
    private builder: AnimationBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expanded'] && !changes['expanded'].firstChange) {
      Promise.resolve().then(() => this.playAnimation());
    }
  }

  ngOnDestroy() {
    this.player?.destroy();
  }

  /** Can be called manually by parent to reset baseline height */
  updateStartHeight() {
    this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
  }

  playAnimation() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = this.builder
      .build([style({ height: `${this.startHeight}px` }), animate(`200ms ease-in-out`, style({ height: '*' }))])
      .create(this.element.nativeElement);

    this.player.onStart(() => {
      this.renderer.setStyle(this.element.nativeElement, 'overflow', 'hidden');
    });

    this.player.onDone(() => {
      this.renderer.removeStyle(this.element.nativeElement, 'overflow');
      // A "safe" auto-update of the height ensuring basic OOTB user experience .
      // Prone to small jumps in initial animation height if data was changed in the meantime, window was resized, etc.
      // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
      this.updateStartHeight();
      this.cancelAnimation();
    });

    this.player.play();
  }

  private cancelAnimation() {
    this.element.nativeElement.getAnimations().forEach(animation => {
      if (animation.playState === 'finished') {
        animation.cancel(); // clears animation-style set on the element
      }
    });
  }
}
