/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Writes the Markdown report of dist/benchmarks/results.json to dist/benchmarks/report.md, the body of the
// performance report comment on pull requests.
//
// Usage: node tests/performance/report.ts

import * as fs from 'fs';
import * as path from 'path';

import type { Results, Sample } from './run.ts';

/** Changes of the median time smaller than this are reported as no change, even when they are significant. */
const threshold = 0.05;

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/**
 * The 95% confidence interval of the relative change of the median, by bootstrap: the samples of each version are
 * resampled with replacement many times. The random numbers are seeded, so that the same results give the same report.
 */
function confidenceInterval(base: number[], head: number[]): [number, number] {
  let seed = 1;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const resample = (values: number[]) => values.map(() => values[Math.floor(random() * values.length)]);
  const changes = Array.from({ length: 2000 }, () => median(resample(head)) / median(resample(base)) - 1).sort(
    (a, b) => a - b
  );
  return [changes[Math.floor(changes.length * 0.025)], changes[Math.floor(changes.length * 0.975)]];
}

const percent = (value: number) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
const ms = (value: number) => `${value < 10 ? value.toFixed(1) : Math.round(value)} ms`;

function timeColumns(base: Sample[], head: Sample[], metric: 'duration' | 'scriptDuration') {
  const [baseValues, headValues] = [base, head].map(samples => samples.map(sample => sample[metric]));
  const change = median(headValues) / median(baseValues) - 1;
  const [low, high] = confidenceInterval(baseValues, headValues);
  const verdict =
    low > 0 && change > threshold ? '🔴 slower' : high < 0 && change < -threshold ? '🟢 faster' : '⚪ same';
  return {
    verdict,
    cells: [
      `${ms(median(baseValues))} → ${ms(median(headValues))}`,
      `${percent(change)} (${percent(low)}, ${percent(high)})`,
    ],
  };
}

/**
 * Counts are the same on every run of a build for most scenarios, so a difference comes from the code. Some vary by a
 * few between runs (an overlay positioned over several frames): those show their range, and are marked changed only
 * when the ranges of the base and the head do not overlap.
 */
function countCell(base: Sample[], head: Sample[], metric: 'layoutCount' | 'recalcStyleCount' | 'domNodes') {
  const [before, after] = [base, head].map(samples => {
    const values = samples.map(sample => sample[metric]);
    const [min, max] = [Math.min(...values), Math.max(...values)];
    return { min, max, text: min === max ? `${min}` : `${min}–${max}` };
  });
  if (before.max < after.min || after.max < before.min) {
    return `**${before.text} → ${after.text}**`;
  }
  return before.text === after.text ? before.text : `${before.text} / ${after.text}`;
}

const results: Results = JSON.parse(fs.readFileSync(path.join('dist', 'benchmarks', 'results.json'), 'utf8'));
const rows = results.scenarios.map(({ name, samples: { base, head } }) => {
  const time = timeColumns(base, head, 'duration');
  const script = timeColumns(base, head, 'scriptDuration');
  return [
    name,
    time.verdict,
    ...time.cells,
    script.cells[0],
    countCell(base, head, 'layoutCount'),
    countCell(base, head, 'recalcStyleCount'),
    countCell(base, head, 'domNodes'),
  ];
});
const sampleCount = results.scenarios[0]?.samples.head.length ?? 0;

const report = [
  '<!-- clarity-performance-report -->',
  '### ⏱️ Performance Report',
  '',
  `Base and head of the pull request measured alternately in the same job, ${sampleCount} runs each, in Chromium.` +
    ` A time is marked slower or faster when its 95% confidence interval excludes no change and the median moved by` +
    ` more than ${threshold * 100}%. Layouts, style recalculations and DOM nodes vary little or not at` +
    ` all between runs: a change there, in bold, comes from the code.`,
  '',
  '| Scenario | | Time (median) | Change (95% CI) | JavaScript | Layouts | Style recalcs | DOM nodes |',
  '| --- | --- | --: | --: | --: | --: | --: | --: |',
  ...rows.map(row => `| ${row.join(' | ')} |`),
  '',
].join('\n');

fs.writeFileSync(path.join('dist', 'benchmarks', 'report.md'), report);
console.log(report);
