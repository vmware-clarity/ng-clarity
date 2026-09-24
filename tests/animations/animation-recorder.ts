/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CDPSession, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { ElementQuery, ScenarioStep, TrackedElement } from './animation-scenarios';

/**
 * State of a tracked element on one animation frame; `null` when it is not in the DOM. `x` and `y` are the viewport
 * position of its layout box (moved by translations, not by rotations), `width` and `height` its layout size.
 */
export interface ElementSample {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  transform: string;
  visibility: string;
}

export interface FrameSample {
  /** Milliseconds since the trigger (negative before it). */
  t: number;
  values: Record<string, ElementSample | null>;
}

/** An animation or transition seen running in the page (CSS, Web Animations API or Angular animations). */
export interface RecordedAnimation {
  /** Milliseconds since the trigger when the animation was first seen. */
  t: number;
  kind: string;
  name: string;
  target: string;
  duration: number | string;
  delay: number;
  easing: string;
  iterations: number | null;
  fill: string;
  keyframes: Record<string, unknown>[];
}

export interface ScreencastFrame {
  /** Milliseconds since the trigger. */
  t: number;
  file: string;
}

export interface AnimationRecording {
  scenario: string;
  story: string;
  label: string;
  recordedAt: string;
  userAgent: string;
  duration: number;
  samples: FrameSample[];
  animations: RecordedAnimation[];
  frames: ScreencastFrame[];
  video?: string;
}

interface PageTraceResult {
  samples: FrameSample[];
  animations: RecordedAnimation[];
  /** Wall clock time of the trigger, in milliseconds since the epoch. */
  triggerTime: number;
}

declare global {
  interface Window {
    __clrAnimationTrace?: {
      markTrigger(): void;
      stop(): PageTraceResult;
    };
    __STORYBOOK_ADDONS_CHANNEL__?: { emit(event: string, data: unknown): void };
  }
}

/** Frames recorded before the trigger, to show the state the animation starts from. */
const LEAD_TIME = 100;

export async function runSteps(page: Page, story: string, steps: ScenarioStep[]) {
  for (const step of steps) {
    if ('click' in step) {
      await locate(page, step.click).click();
    } else if ('fill' in step) {
      await locate(page, step.fill).fill(step.value);
    } else if ('args' in step) {
      await page.evaluate(
        ({ storyId, updatedArgs }) => {
          window.__clrAnimationTrace?.markTrigger();
          window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', { storyId, updatedArgs });
        },
        { storyId: story, updatedArgs: step.args }
      );
    } else {
      await page.waitForTimeout(step.wait);
    }
  }
}

/**
 * Records what happens in the page from the moment `trigger` is called:
 *
 * - the geometry, opacity and transform of the tracked elements on every animation frame,
 * - every animation and transition that runs, with its timing and keyframes,
 * - the rendered frames (Chrome DevTools screencast, about 60 frames per second).
 *
 * Nothing in the page is slowed down or paused: the recording shows the animations as users see them.
 */
export async function recordAnimation(
  page: Page,
  track: TrackedElement[],
  duration: number,
  outputDir: string,
  trigger: () => Promise<void>
): Promise<Pick<AnimationRecording, 'samples' | 'animations' | 'frames' | 'duration'>> {
  const framesDir = path.join(outputDir, 'frames');
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const cdp = await page.context().newCDPSession(page);
  const screencast = await startScreencast(cdp);
  await page.evaluate(installTrace, track);
  await page.waitForTimeout(LEAD_TIME);

  await trigger();
  await page.waitForTimeout(duration);

  const trace = await page.evaluate(() => window.__clrAnimationTrace.stop());
  const rawFrames = await screencast.stop();
  await cdp.detach();

  const frames: ScreencastFrame[] = rawFrames
    .map(frame => ({ ...frame, t: Math.round(frame.timestamp - trace.triggerTime) }))
    .filter(frame => frame.t >= -LEAD_TIME && frame.t <= duration)
    .sort((a, b) => a.t - b.t)
    .map((frame, i) => {
      const file = `frames/${String(i).padStart(4, '0')}.jpg`;
      fs.writeFileSync(path.join(outputDir, file), Buffer.from(frame.data, 'base64'));
      return { t: frame.t, file };
    });

  return { duration, samples: trace.samples, animations: trace.animations, frames };
}

function locate(page: Page, query: ElementQuery) {
  let locator = page.locator(query.selector);
  if (query.text) {
    locator = locator.filter({ hasText: new RegExp(`^\\s*${escapeRegExp(query.text)}`) });
  }
  locator = locator.nth(query.index ?? 0);
  return query.child ? locator.locator(query.child).first() : locator;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function startScreencast(cdp: CDPSession) {
  const frames: { data: string; timestamp: number }[] = [];
  cdp.on('Page.screencastFrame', frame => {
    // Screencast timestamps are in seconds since the epoch.
    frames.push({ data: frame.data, timestamp: frame.metadata.timestamp * 1000 });
    cdp.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => undefined);
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 });
  return {
    async stop() {
      await cdp.send('Page.stopScreencast');
      return frames;
    },
  };
}

/** Runs in the page: samples the tracked elements and the running animations on every animation frame. */
function installTrace(track: TrackedElement[]) {
  const samples: FrameSample[] = [];
  const animations: RecordedAnimation[] = [];
  const seen = new WeakSet<Animation>();
  let triggerAt: number | null = null;
  let running = true;

  const relative = (time: number) => time - (triggerAt ?? time);

  const describe = (element: Element | null) => {
    if (!element) {
      return '';
    }
    const classes = [...element.classList].filter(name => !name.startsWith('ng-'));
    return element.tagName.toLowerCase() + classes.map(name => `.${name}`).join('');
  };

  const resolve = (query: ElementQuery): Element | null => {
    let elements = [...document.querySelectorAll(query.selector)];
    if (query.text) {
      elements = elements.filter(element => element.textContent.trim().startsWith(query.text));
    }
    const element = elements[query.index ?? 0];
    return (query.child ? element?.querySelector(query.child) : element) ?? null;
  };

  const sample = () => {
    if (!running) {
      return;
    }
    // Time of the reading rather than the frame start time given to the callback, which may precede the trigger.
    const now = performance.now();
    const values: Record<string, ElementSample | null> = {};
    for (const tracked of track) {
      const element = resolve(tracked);
      if (!element) {
        values[tracked.label] = null;
        continue;
      }
      // Layout size, and position of the visual center: a rotating element (a spinner) keeps the same values.
      // Translations move the position; transforms are recorded as well.
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const width = element instanceof HTMLElement ? element.offsetWidth : rect.width;
      const height = element instanceof HTMLElement ? element.offsetHeight : rect.height;
      values[tracked.label] = {
        x: rect.x + rect.width / 2 - width / 2,
        y: rect.y + rect.height / 2 - height / 2,
        width,
        height,
        opacity: parseFloat(style.opacity),
        transform: style.transform,
        visibility: style.visibility,
      };
    }
    samples.push({ t: now, values });

    for (const animation of document.getAnimations()) {
      if (seen.has(animation)) {
        continue;
      }
      seen.add(animation);
      const effect = animation.effect as KeyframeEffect | null;
      const timing = effect?.getTiming();
      animations.push({
        t: now,
        kind: animation.constructor.name,
        name:
          (animation as CSSAnimation).animationName ??
          (animation as CSSTransition).transitionProperty ??
          animation.id ??
          '',
        target: describe(effect?.target ?? null),
        duration: timing?.duration as number | string,
        delay: timing?.delay ?? 0,
        easing: timing?.easing ?? '',
        iterations: Number.isFinite(timing?.iterations) ? timing.iterations : null,
        fill: timing?.fill ?? '',
        keyframes: (effect?.getKeyframes?.() ?? []).map(keyframe => ({ ...keyframe })),
      });
    }

    requestAnimationFrame(sample);
  };

  const markTrigger = () => {
    triggerAt ??= performance.now();
  };
  // Clicks are dispatched as real input events: the trigger time is the time of the first one.
  const onInput = () => markTrigger();
  window.addEventListener('pointerdown', onInput, { capture: true, once: true });
  window.addEventListener('keydown', onInput, { capture: true, once: true });

  window.__clrAnimationTrace = {
    markTrigger,
    stop() {
      running = false;
      window.removeEventListener('pointerdown', onInput, { capture: true });
      window.removeEventListener('keydown', onInput, { capture: true });
      markTrigger();
      return {
        samples: samples.map(frame => ({ ...frame, t: Math.round(relative(frame.t) * 10) / 10 })),
        animations: animations.map(animation => ({ ...animation, t: Math.round(relative(animation.t)) })),
        triggerTime: performance.timeOrigin + triggerAt,
      };
    },
  };

  requestAnimationFrame(sample);
}
