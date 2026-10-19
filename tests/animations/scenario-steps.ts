/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Page } from '@playwright/test';

import { AnimationStep } from './animation-scenarios';

declare global {
  interface Window {
    __STORYBOOK_ADDONS_CHANNEL__?: { emit(event: string, data: unknown): void };
  }
}

/** Time for the story to render. */
const RENDER_TIME = 500;

/**
 * Whether an element keeps the focus can depend on the order of asynchronous work: for instance, a dropdown focuses
 * its first item while its menu moves to the overlay container, and moving the focused item drops the focus. Focus
 * rings are not part of the animations, so they are not drawn.
 */
const NO_FOCUS_RINGS = '*:focus, *:focus-visible { outline: none !important; }';

export async function openStory(page: Page, story: string) {
  const params = new URLSearchParams({ id: story, args: 'highlight:false', viewMode: 'story' });
  await page.goto(`http://localhost:8080/iframe.html?${params}`);
  await page.addStyleTag({ content: NO_FOCUS_RINGS });
  await page.locator('#storybook-root > *').first().waitFor();
  await page.waitForTimeout(RENDER_TIME);
}

/**
 * The clicks are dispatched without moving the mouse: a real click also starts hover transitions, which would start
 * before the animations are paused in some runs and after in others.
 */
export async function runStep(page: Page, story: string, step: AnimationStep) {
  if (typeof step === 'string') {
    await page.locator(step).filter({ visible: true }).first().dispatchEvent('click');
  } else {
    await page.evaluate(args => window.__STORYBOOK_ADDONS_CHANNEL__.emit('updateStoryArgs', args), {
      storyId: story,
      updatedArgs: step,
    });
  }
}

export function describeStep(step: AnimationStep) {
  return typeof step === 'string' ? `click ${step}` : `set ${JSON.stringify(step)}`;
}
