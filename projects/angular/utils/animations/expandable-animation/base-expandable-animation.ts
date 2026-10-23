/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { animateHeight } from '../height-animation';
import { noopAnimations } from '../noop-animations';

@Directive()
export class BaseExpandableAnimation {
  startHeight = 0;

  /**
   * Set when Angular adds the element (see the `animate.enter` host listener), so that nothing animates on the first
   * render. Angular calls `animate.enter` handlers only when animations are enabled, and the listener leaves it unset
   * with `provideNoopAnimations()` or `NoopAnimationsModule`.
   */
  protected animates = false;

  /** Whether the application turned animations off with `provideNoopAnimations()` or `NoopAnimationsModule`. */
  protected readonly noopAnimations = noopAnimations();

  constructor(
    protected element: ElementRef<HTMLElement>,
    protected domAdapter: DomAdapter,
    protected renderer: Renderer2
  ) {}

  updateStartHeight() {
    this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
  }

  initAnimationEffects() {
    // `clip` rather than `hidden`: both clip the content that grows past the animated height, but
    // `hidden` also turns this element into a scroll container, and a scroll container is what a
    // `position: sticky` descendant anchors itself to. Anything sticky inside would come loose for
    // the length of the animation - which is what the datagrid's static columns do. See CDE-3127.
    this.renderer.setStyle(this.element.nativeElement, 'overflow', 'clip');
  }

  cleanupAnimationEffects(cancelAnimations = false) {
    this.renderer.removeStyle(this.element.nativeElement, 'overflow');

    // A "safe" auto-update of the height ensuring basic OOTB user experience .
    // Prone to small jumps in initial animation height if data was changed in the meantime, the window was resized, etc.
    // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
    this.updateStartHeight();
    if (cancelAnimations) {
      this.cancelElementAnimations();
    }
  }

  /**
   * Animates the height of the element from `startHeight` to its current height, then updates `startHeight`. Call it
   * once the change is rendered.
   */
  protected animateFromStartHeight() {
    const animation = this.animates ? animateHeight(this.element.nativeElement, { from: this.startHeight }) : null;
    (animation?.finished ?? Promise.resolve()).then(
      () => this.updateStartHeight(),
      () => {
        // Canceled by the next animation.
      }
    );
  }

  private cancelElementAnimations() {
    this.element.nativeElement.getAnimations().forEach(animation => {
      if (animation.playState === 'finished') {
        animation.cancel(); // clears animation-style set on the element
      }
    });
  }
}
