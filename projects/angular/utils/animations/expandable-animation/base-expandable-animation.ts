/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, inject, OnDestroy, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { ClrAnimationsService } from '../animations.service';

/** Applied to the host while its height transitions, see `_animations.clarity.scss`. */
const ACTIVE_CLASS = 'clr-expandable-animation-active';

@Directive()
export class BaseExpandableAnimation implements OnDestroy {
  startHeight = 0;

  protected readonly animations = inject(ClrAnimationsService);

  private animationCount = 0;

  constructor(
    protected element: ElementRef<HTMLElement>,
    protected domAdapter: DomAdapter,
    protected renderer: Renderer2
  ) {}

  ngOnDestroy() {
    // Invalidates the completion callback of an animation that may still be running.
    this.animationCount++;
  }

  updateStartHeight() {
    this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
  }

  /**
   * Transitions the height of the host from `startHeight` to the current height of its content.
   *
   * Call it once the content has been updated; the height it starts from is the one captured by the last
   * `updateStartHeight()` call (or the last animation).
   */
  playAnimation() {
    const element = this.element.nativeElement;
    const animation = ++this.animationCount;

    // Interrupt a running animation, so that the natural height of the content can be measured.
    this.renderer.removeClass(element, ACTIVE_CLASS);
    this.renderer.removeStyle(element, 'height');
    const endHeight = this.domAdapter.computedHeight(element) || 0;

    if (this.animations.disabled || endHeight === this.startHeight) {
      this.cleanupAnimationEffects();
      return;
    }

    this.initAnimationEffects();
    this.renderer.setStyle(element, 'height', `${this.startHeight}px`);
    // Commit the start height before the transition is enabled, otherwise there is nothing to transition from.
    void element.offsetHeight;
    this.renderer.addClass(element, ACTIVE_CLASS);
    this.renderer.setStyle(element, 'height', `${endHeight}px`);

    this.animations.whenComplete(element).then(() => {
      if (animation !== this.animationCount) {
        return; // superseded by another animation or destroyed
      }
      this.renderer.removeClass(element, ACTIVE_CLASS);
      this.renderer.removeStyle(element, 'height');
      this.cleanupAnimationEffects();
    });
  }

  initAnimationEffects() {
    // `clip` rather than `hidden`: both clip the content that grows past the animated height, but
    // `hidden` also turns this element into a scroll container, and a scroll container is what a
    // `position: sticky` descendant anchors itself to. Anything sticky inside would come loose for
    // the length of the animation - which is what the datagrid's static columns do. See CDE-3127.
    this.renderer.setStyle(this.element.nativeElement, 'overflow', 'clip');
  }

  /**
   * @param cancelAnimations Also cancels the finished Web Animations of the host.
   * @deprecated The parameter is no longer needed: the height transition leaves no styles behind.
   */
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

  private cancelElementAnimations() {
    this.element.nativeElement.getAnimations?.().forEach(animation => {
      if (animation.playState === 'finished') {
        animation.cancel(); // clears animation-style set on the element
      }
    });
  }
}
