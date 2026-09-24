/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterNextRender, Directive, ElementRef, inject, Injector, OnDestroy, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { ClrAnimationsService } from '../animations.service';

/** Marks the host while its height is animated. */
const ACTIVE_CLASS = 'clr-expandable-animation-active';

interface ExpandAnimationStep {
  endHeight: number;
  timing: KeyframeAnimationOptions | null;
}

@Directive()
export class BaseExpandableAnimation implements OnDestroy {
  startHeight = 0;

  // ECMAScript private fields, so that they cannot clash with the members of existing subclasses.
  readonly #animations = inject(ClrAnimationsService);
  readonly #injector = inject(Injector);
  #animationId = 0;
  #animation: Animation | null = null;

  constructor(
    protected element: ElementRef<HTMLElement>,
    protected domAdapter: DomAdapter,
    protected renderer: Renderer2
  ) {}

  ngOnDestroy() {
    this.#stopAnimation();
  }

  updateStartHeight() {
    this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
  }

  /**
   * Animates the height of the host from `startHeight` to the current height of its content.
   *
   * Call it once the content has been updated; the height it starts from is the one captured by the last
   * `updateStartHeight()` call (or the last animation).
   */
  playAnimation() {
    const animationId = this.#stopAnimation();
    this.#startAnimation(animationId, this.#measure());
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
   * @deprecated The parameter is no longer needed: the height animation leaves no styles behind.
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

  /**
   * Plays the animation once the content has been rendered.
   *
   * The animations scheduled for the same rendering (every row of a datagrid expanding at once, for instance) first
   * measure the DOM together, then all start: the layout is computed once rather than once per animation.
   */
  protected scheduleAnimation() {
    if (this.playAnimation !== BaseExpandableAnimation.prototype.playAnimation) {
      // Keep calling the playAnimation() override of a subclass.
      Promise.resolve().then(() => this.playAnimation());
      return;
    }

    const animationId = this.#stopAnimation();

    if (this.#animations.disabled) {
      Promise.resolve().then(() => this.#startAnimation(animationId, null));
      return;
    }

    afterNextRender(
      {
        earlyRead: () => this.#measure(),
        write: step => this.#startAnimation(animationId, step),
      },
      { injector: this.#injector }
    );
  }

  private cancelElementAnimations() {
    this.element.nativeElement.getAnimations?.().forEach(animation => {
      if (animation.playState === 'finished') {
        animation.cancel(); // clears animation-style set on the element
      }
    });
  }

  /** Stops the running animation, if any, and returns the id of the next one. */
  #stopAnimation(): number {
    if (this.#animation) {
      this.#animation.cancel();
      this.#animation = null;
      this.renderer.removeClass(this.element.nativeElement, ACTIVE_CLASS);
    }
    return ++this.#animationId;
  }

  #measure(): ExpandAnimationStep {
    const element = this.element.nativeElement;
    return {
      endHeight: this.domAdapter.computedHeight(element) || 0,
      timing: this.#animations.disabled || typeof element.animate !== 'function' ? null : readTiming(element),
    };
  }

  #startAnimation(animationId: number, step: ExpandAnimationStep | null) {
    if (animationId !== this.#animationId) {
      return; // superseded by another animation or destroyed
    }
    if (!step?.timing || step.endHeight === this.startHeight) {
      this.cleanupAnimationEffects();
      return;
    }

    const element = this.element.nativeElement;
    let animation: Animation;
    try {
      animation = element.animate(
        [{ height: `${this.startHeight}px` }, { height: `${step.endHeight}px` }],
        step.timing
      );
    } catch {
      // Invalid timing (customized animation tokens): no animation.
      this.cleanupAnimationEffects();
      return;
    }
    this.initAnimationEffects();
    this.renderer.addClass(element, ACTIVE_CLASS);
    this.#animation = animation;

    animation.finished.then(
      () => {
        if (this.#animation === animation) {
          this.#animation = null;
          this.renderer.removeClass(element, ACTIVE_CLASS);
          this.cleanupAnimationEffects();
        }
      },
      () => {
        // Cancelled: superseded by another animation or destroyed.
      }
    );
  }
}

/**
 * Timing of the height animation, from the Clarity animation tokens. `null` when there is nothing to animate: the
 * duration is 0 (low motion theme) or the user prefers reduced motion.
 */
function readTiming(element: HTMLElement): KeyframeAnimationOptions | null {
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  const style = getComputedStyle(element);
  const duration = parseDuration(style.getPropertyValue('--cds-global-animation-duration-quick'));
  const easing = style.getPropertyValue('--cds-global-animation-easing-in-out').trim() || 'ease-in-out';
  return duration > 0 ? { duration, easing } : null;
}

/** Parses a CSS time (`0.2s`, `200ms`) to milliseconds. */
function parseDuration(value: string): number {
  const time = value.trim();
  const amount = parseFloat(time);
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return time.endsWith('ms') ? amount : amount * 1000;
}
