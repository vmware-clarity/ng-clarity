/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Page } from '@playwright/test';

/** An animation or transition as the browser declares it. */
export interface DeclaredAnimation {
  /** The animated element: tag and classes. */
  target: string;
  /** CSS animation name or transitioned property; empty for Web Animations API animations. */
  name: string;
  /** Milliseconds after the step. */
  startedAt: number;
  duration: number | string;
  delay: number;
  easing: string;
  iterations: number | string;
  keyframes: Record<string, unknown>[];
}

interface AnimationFreezer {
  startStep(): void;
  seek(time: number): void;
  /** Returns how many animations it ended. */
  finishAll(): number;
  /** The animations started since the step. */
  describe(): DeclaredAnimation[];
}

declare global {
  interface Window {
    __clrAnimationFreezer?: AnimationFreezer;
  }
}

/** Any fixed date: the pages see the same date on every run. */
const CLOCK_START = new Date('2026-01-01T00:00:00Z');
/** How long timers run between two rounds of ending animations. */
const TIMERS_TIME = 2000;
/** Real time for the page to render and dispatch the events of the animations that ended. */
const RENDER_TIME = 100;
/** Ending animations can start others (a leave animation after a transition): end them round after round. */
const MAX_FINISH_ROUNDS = 5;

/**
 * Controls time in a page, so that it looks the same at a given time on every run:
 *
 * - the timers (`setTimeout`, animation frames...) run on Playwright's fake clock, paused: they only run when the
 *   timeline moves,
 * - the animations and transitions (CSS, Web Animations API, Angular animations) are paused as soon as they start, and
 *   seeked when the timeline moves.
 */
export class AnimationTimeline {
  /** Milliseconds since the step. */
  private time = 0;

  private constructor(private readonly page: Page) {}

  /** Stops time in the page. */
  static async start(page: Page) {
    await page.clock.install({ time: CLOCK_START });
    // `pauseAt` needs a time after the current one.
    await page.clock.pauseAt(CLOCK_START.getTime() + 1000);
    await page.evaluate(installAnimationFreezer);
    return new AnimationTimeline(page);
  }

  /** Call it right before the step: its time is 0. */
  async startStep() {
    this.time = 0;
    await this.page.evaluate(() => window.__clrAnimationFreezer.startStep());
  }

  /** Shows the page as it is `time` milliseconds after the step. */
  async goTo(time: number) {
    await this.page.clock.runFor(time - this.time);
    this.time = time;
    await this.page.evaluate(time => window.__clrAnimationFreezer.seek(time), time);
  }

  /** The animations that started in the first `time` milliseconds after the step. */
  async animationsStartedWithin(time: number) {
    await this.page.clock.runFor(time - this.time);
    this.time = time;
    return this.page.evaluate(() => window.__clrAnimationFreezer.describe());
  }

  /** Ends every animation, as if it had run: its end handlers run (removing the elements that left, for example). */
  async finish() {
    for (let round = 0; round < MAX_FINISH_ROUNDS; round++) {
      const finished = await this.page.evaluate(() => window.__clrAnimationFreezer.finishAll());
      await this.page.clock.runFor(TIMERS_TIME);
      this.time += TIMERS_TIME;
      await this.page.waitForTimeout(RENDER_TIME);
      if (!finished) {
        return;
      }
    }
  }
}

/**
 * Runs in the page (it cannot use anything outside of itself), with the fake clock paused: pauses the animations as
 * soon as they start, and records when they started.
 */
function installAnimationFreezer() {
  /** The times are those of the fake clock, which only moves when the timeline moves. */
  let stepTime = Date.now();
  const startTimes = new Map<Animation, number>();

  function startStep() {
    stepTime = Date.now();
  }

  function pauseNewAnimations() {
    for (const animation of document.getAnimations()) {
      if (!startTimes.has(animation)) {
        animation.pause();
        startTimes.set(animation, Date.now());
      }
    }
  }

  /** The animations still in the page: seeking or ending one the page cancelled would apply it again. */
  function pausedAnimations() {
    pauseNewAnimations();
    return document.getAnimations().filter(animation => startTimes.has(animation));
  }

  function endTime(animation: Animation) {
    return Number(animation.effect?.getComputedTiming().endTime ?? 0);
  }

  function end(animation: Animation) {
    if (animation.playState !== 'finished') {
      animation.finish();
    }
  }

  /** Ended when it reaches its end, so that its end handlers run when they would. */
  function seek(time: number) {
    for (const animation of pausedAnimations()) {
      const animationTime = Math.max(0, stepTime + time - startTimes.get(animation));
      if (animationTime < endTime(animation)) {
        animation.currentTime = animationTime;
      } else {
        end(animation);
      }
    }
  }

  function finishAll() {
    const running = pausedAnimations().filter(
      animation => Number.isFinite(endTime(animation)) && animation.playState !== 'finished'
    );
    running.forEach(end);
    return running.length;
  }

  function describe(): DeclaredAnimation[] {
    const stepAnimations = [...startTimes].filter(([, startTime]) => startTime >= stepTime);
    return stepAnimations.map(([animation, startTime]) => {
      const effect = animation.effect as KeyframeEffect;
      const { duration, delay, easing, iterations } = effect.getTiming();
      return {
        target: describeElement(effect.target),
        name: (animation as CSSAnimation).animationName ?? (animation as CSSTransition).transitionProperty ?? '',
        startedAt: startTime - stepTime,
        duration: duration as number | string,
        delay,
        easing,
        iterations: Number.isFinite(iterations) ? iterations : 'infinite',
        keyframes: effect.getKeyframes().map(({ computedOffset: _computedOffset, ...keyframe }) => keyframe),
      };
    });
  }

  function describeElement(element: Element | null) {
    if (!element) {
      return '';
    }
    // Angular's generated classes (`ng-tns-c123-4`...) change with the build.
    const classes = [...element.classList].filter(name => !name.startsWith('ng-'));
    return [element.tagName.toLowerCase(), ...classes].join('.');
  }

  // Animations start from DOM changes (Angular animations, CSS classes), caught at once by the observer, or from style
  // changes (CSS transitions), caught by their events.
  new MutationObserver(pauseNewAnimations).observe(document, { subtree: true, childList: true, attributes: true });
  window.addEventListener('animationstart', pauseNewAnimations, true);
  window.addEventListener('transitionrun', pauseNewAnimations, true);

  window.__clrAnimationFreezer = { startStep, seek, finishAll, describe };
}
