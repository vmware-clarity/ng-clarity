/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { animationScenarios } from './animation-scenarios';
import { AnimationTimeline } from './animation-timeline';
import { describeStep, openStory, runStep } from './scenario-steps';
import { browser, screenshotExpectOptions } from '../helpers/vrt';

/** Milliseconds after each step. Clarity animations last 100 to 300 ms. */
const FRAME_TIMES = [0, 50, 100, 150, 200, 300, 500];
/** Every animation of a step starts within this time. */
const ANIMATIONS_TIME = 2000;
/**
 * Unlike the other visual regression tests, the frames are taken while the animations run. Text anti-aliasing can vary
 * by a pixel or two between runs, while an animation that changes differs by hundreds of pixels.
 */
const frameOptions = { ...screenshotExpectOptions, animations: 'allow', maxDiffPixels: 10 } as const;
/** The page before the step. */
const START_FRAME = 'start.png';
/** The page once every animation of the step ended. */
const END_FRAME = 'end.png';
const FRAMES = [START_FRAME, ...FRAME_TIMES.map(frameName), END_FRAME];

const usedScreenshotPaths: string[] = [];

for (const [component, { story, steps }] of Object.entries(animationScenarios)) {
  for (const stepName of Object.keys(steps)) {
    usedScreenshotPaths.push(...FRAMES.map(frame => path.join(...snapshotPath(component, stepName, frame))));
  }

  test(component, async ({ page }) => {
    await openStory(page, story);
    const timeline = await AnimationTimeline.start(page);

    for (const [stepName, step] of Object.entries(steps)) {
      const snapshot = (name: string) => snapshotPath(component, stepName, name);

      await test.step(`${stepName}: ${describeStep(step)}`, async () => {
        await timeline.startStep();
        await expect.soft(page).toHaveScreenshot(snapshot(START_FRAME), frameOptions);
        await runStep(page, story, step);

        for (const time of FRAME_TIMES) {
          await timeline.goTo(time);
          await expect.soft(page).toHaveScreenshot(snapshot(frameName(time)), frameOptions);
        }

        // What changed when a frame does: the animations as the browser declares them.
        const animations = await timeline.animationsStartedWithin(ANIMATIONS_TIME);
        expect.soft(JSON.stringify(animations, null, 2) + '\n').toMatchSnapshot(snapshot('animations.json'));

        await timeline.finish();
        await expect.soft(page).toHaveScreenshot(snapshot(END_FRAME), frameOptions);
      });
    }
  });
}

/**
 * In `tests/snapshots/<browser>/animations/<component>/<step>`: `vertical-nav/collapse/0050ms.png` is the frame 50 ms
 * after the vertical nav collapse started.
 */
function snapshotPath(component: string, step: string, name: string) {
  return [browser, 'animations', component, step, name];
}

function frameName(time: number) {
  return `${String(time).padStart(4, '0')}ms.png`;
}

// Like in the other visual regression tests: the PR Visual Snapshot Update Bot deletes the screenshots no test lists.
fs.writeFileSync(
  path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${browser}-animations.txt`),
  usedScreenshotPaths.join('\n')
);
