/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Measures the scenarios on two builds of projects/benchmarks, the base and the head of a pull request, and writes
// the samples to dist/benchmarks/results.json (see README.md).
//
// Usage: node tests/performance/run.ts [--samples=15] [--filter=datagrid]

import express from 'express';
import * as fs from 'fs';
import type { AddressInfo } from 'net';
import * as path from 'path';
import { type Browser, type CDPSession, chromium } from 'playwright';

import { type Scenario, scenarios, type Step } from './scenarios.ts';

const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? 'true'];
  })
);
const samples = Number(args['samples'] ?? 15);
const versions = ['base', 'head'] as const;
type Version = (typeof versions)[number];

/**
 * The metrics of one run of a scenario. The durations are in milliseconds and vary between runs; the counts barely
 * vary for a build, so a change between the base and the head comes from the code.
 */
export interface Sample {
  /** From the event until the frame after the last DOM change, as the user sees it. */
  duration: number;
  /** Main thread time spent in JavaScript, from Chrome's performance metrics. */
  scriptDuration: number;
  layoutCount: number;
  recalcStyleCount: number;
  /** After garbage collection, as detached nodes count until they are collected. */
  domNodes: number;
}

export interface Results {
  scenarios: { name: string; samples: Record<Version, Sample[]> }[];
}

function serve(root: string) {
  const app = express();
  app.use(express.static(root));
  return new Promise<{ url: string; close: () => void }>(resolve => {
    const server = app.listen(0, () =>
      resolve({ url: `http://localhost:${(server.address() as AddressInfo).port}`, close: () => server.close() })
    );
  });
}

function selectorOf(step: Step) {
  return 'click' in step ? step.click : step.type;
}

/**
 * Runs in the page: performs a step, then waits for frames until two frames in a row change nothing in the DOM. The
 * duration ends with the frame after the last change, so it covers the follow-up rendering passes that some
 * components schedule (the datagrid measures its columns after the first one).
 */
async function performStep(step: Step) {
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve)));
  const element = document.querySelector<HTMLElement>('click' in step ? step.click : step.type);
  if (!element) {
    throw new Error(`No element matches ${JSON.stringify(step)}`);
  }
  let changed = false;
  const observer = new MutationObserver(() => (changed = true));
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });

  const start = performance.now();
  if ('click' in step) {
    element.click();
  } else {
    (element as HTMLInputElement).value = step.text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }
  let end = 0;
  for (let quietFrames = 0; quietFrames < 2 && performance.now() - start < 10_000;) {
    await nextFrame();
    if (changed) {
      changed = false;
      quietFrames = 0;
      end = performance.now();
    } else {
      quietFrames++;
    }
  }
  observer.disconnect();
  if (!end) {
    // A scenario that no longer applies, such as a selector the component no longer renders, must not pass as fast.
    throw new Error(`${JSON.stringify(step)} changed nothing in the page`);
  }
  return end - start;
}

async function metrics(session: CDPSession) {
  const { metrics } = await session.send('Performance.getMetrics');
  return Object.fromEntries(metrics.map(metric => [metric.name, metric.value]));
}

async function measure(browser: Browser, url: string, scenario: Scenario): Promise<Sample> {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors: Error[] = [];
  page.on('pageerror', error => errors.push(error));
  try {
    const session = await page.context().newCDPSession(page);
    await session.send('Performance.enable');
    await page.goto(`${url}/#/${scenario.page}`);
    for (const step of [...(scenario.setup ?? []), scenario.measure]) {
      await page.waitForSelector(selectorOf(step), { state: 'attached' });
      if (step !== scenario.measure) {
        await page.evaluate(performStep, step);
      }
    }
    const before = await metrics(session);
    const duration = await page.evaluate(performStep, scenario.measure);
    const after = await metrics(session);
    await session.send('HeapProfiler.collectGarbage');
    const { Nodes: domNodes } = await metrics(session);
    if (errors.length) {
      throw errors[0];
    }
    const delta = (name: string) => after[name] - before[name];
    return {
      duration,
      // Chrome reports it in seconds.
      scriptDuration: delta('ScriptDuration') * 1000,
      layoutCount: delta('LayoutCount'),
      recalcStyleCount: delta('RecalcStyleCount'),
      domNodes,
    };
  } finally {
    await page.close();
  }
}

async function main() {
  const servers = Object.fromEntries(
    await Promise.all(versions.map(async version => [version, await serve(path.join('dist', 'benchmarks', version))]))
  ) as Record<Version, { url: string; close: () => void }>;
  const browser = await chromium.launch();
  const results: Results = { scenarios: [] };
  const selected = scenarios.filter(scenario => !args['filter'] || scenario.name.includes(args['filter']));

  for (const scenario of selected) {
    const result = { name: scenario.name, samples: { base: [], head: [] } as Record<Version, Sample[]> };
    // One discarded run of each version, so that the first sample does not pay for the browser's cold caches.
    for (const version of versions) {
      await measure(browser, servers[version].url, scenario);
    }
    // Alternating which version runs first, so that a slow period of the machine affects both alike.
    for (let i = 0; i < samples; i++) {
      for (const version of i % 2 ? [...versions].reverse() : versions) {
        result.samples[version].push(await measure(browser, servers[version].url, scenario));
      }
    }
    results.scenarios.push(result);
    console.log(`${scenario.name}: done`);
  }

  await browser.close();
  Object.values(servers).forEach(server => server.close());
  fs.writeFileSync(path.join('dist', 'benchmarks', 'results.json'), JSON.stringify(results, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
