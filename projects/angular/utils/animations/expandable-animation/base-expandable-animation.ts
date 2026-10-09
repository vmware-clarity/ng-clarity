/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterNextRender, DestroyRef, Directive, ElementRef, inject, Injector, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { ClrAnimationsService } from '../animations.service';
import { measureHeight, readAnimationTiming } from '../height-animation';

@Directive()
export class BaseExpandableAnimation {
  startHeight = 0;

  // ECMAScript private fields, so that they cannot clash with the members of existing subclasses.
  readonly #animations = inject(ClrAnimationsService);
  readonly #injector = inject(Injector);
  #animation: Animation | null = null;
  #animationId = 0;

  constructor(
    protected element: ElementRef<HTMLElement>,
    protected domAdapter: DomAdapter,
    protected renderer: Renderer2
  ) {
    inject(DestroyRef).onDestroy(() => this.#stop());
  }

  updateStartHeight() {
    this.startHeight = measureHeight(this.element.nativeElement);
  }

  /** Animates the height of the host from `startHeight` to the height of its current content. */
  playAnimation() {
    this.#play(this.#stop(), this.#measure());
  }

  initAnimationEffects() {
    // `clip` rather than `hidden`: both clip the content that grows past the animated height, but
    // `hidden` also turns this element into a scroll container, and a scroll container is what a
    // `position: sticky` descendant anchors itself to. Anything sticky inside would come loose for
    // the length of the animation - which is what the datagrid's static columns do. See CDE-3127.
    this.renderer.setStyle(this.element.nativeElement, 'overflow', 'clip');
  }

  /** @deprecated `cancelAnimations` is no longer needed: the animation leaves no styles behind. */
  cleanupAnimationEffects(cancelAnimations = false) {
    this.renderer.removeStyle(this.element.nativeElement, 'overflow');

    // A "safe" auto-update of the height ensuring basic OOTB user experience .
    // Prone to small jumps in initial animation height if data was changed in the meantime, the window was resized, etc.
    // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
    this.updateStartHeight();
    if (cancelAnimations) {
      this.element.nativeElement.getAnimations?.().forEach(animation => {
        if (animation.playState === 'finished') {
          animation.cancel();
        }
      });
    }
  }

  /** Plays the animation after the next render. All the rows expanding at once measure the DOM together. */
  protected scheduleAnimation() {
    if (this.playAnimation !== BaseExpandableAnimation.prototype.playAnimation) {
      Promise.resolve().then(() => this.playAnimation()); // a subclass overrides it
      return;
    }
    const id = this.#stop();
    if (this.#animations.disabled) {
      Promise.resolve().then(() => this.#play(id, null));
    } else {
      afterNextRender(
        { earlyRead: () => this.#measure(), write: target => this.#play(id, target) },
        { injector: this.#injector }
      );
    }
  }

  /** Stops the running animation and returns the id of the next one. */
  #stop() {
    if (this.#animation) {
      this.#animation.cancel();
      this.#animation = null;
      this.renderer.removeClass(this.element.nativeElement, 'clr-expandable-animation-active');
    }
    return ++this.#animationId;
  }

  #measure() {
    const element = this.element.nativeElement;
    return { height: measureHeight(element), timing: this.#animations.disabled ? null : readAnimationTiming(element) };
  }

  #play(id: number, target: { height: number; timing: KeyframeAnimationOptions | null } | null) {
    if (id !== this.#animationId) {
      return; // superseded or destroyed
    }
    const element = this.element.nativeElement;
    let animation: Animation | undefined;
    if (target?.timing && target.height !== this.startHeight && typeof element.animate === 'function') {
      try {
        animation = element.animate(
          [{ height: `${this.startHeight}px` }, { height: `${target.height}px` }],
          target.timing
        );
      } catch {
        // Invalid timing (customized animation tokens): no animation.
      }
    }
    if (!animation) {
      this.cleanupAnimationEffects();
      return;
    }

    this.#animation = animation;
    this.initAnimationEffects();
    this.renderer.addClass(element, 'clr-expandable-animation-active');
    animation.finished.then(
      () => {
        if (this.#animation === animation) {
          this.#stop();
          this.cleanupAnimationEffects();
        }
      },
      () => {} // cancelled
    );
  }
}
