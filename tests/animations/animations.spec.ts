/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { AnimationRecording, recordAnimation, runSteps } from './animation-recorder';
import { animationScenarios } from './animation-scenarios';
import { recordingsDir, recordingsLabel } from '../../playwright.animations.config';

const DEFAULT_DURATION = 1000;

for (const scenario of animationScenarios) {
  test(scenario.name, async ({ page, browserName }) => {
    const outputDir = path.join(recordingsDir, recordingsLabel, scenario.name);
    const storyParams = new URLSearchParams({ id: scenario.story, args: 'highlight:false', viewMode: 'story' });

    await page.goto(`/iframe.html?${storyParams}`);
    await page.locator('#storybook-root > *').first().waitFor();
    await page.waitForTimeout(500); // let the story settle

    await runSteps(page, scenario.story, scenario.setup ?? []);

    const recording = await recordAnimation(
      page,
      scenario.track,
      scenario.duration ?? DEFAULT_DURATION,
      outputDir,
      () => runSteps(page, scenario.story, scenario.trigger)
    );

    const result: AnimationRecording = {
      scenario: scenario.name,
      story: scenario.story,
      label: recordingsLabel,
      recordedAt: new Date().toISOString(),
      userAgent: `${browserName} ${page.context().browser()?.version() ?? ''}`.trim(),
      ...recording,
    };
    fs.writeFileSync(path.join(outputDir, 'recording.json'), JSON.stringify(result, null, 1));
  });
}
