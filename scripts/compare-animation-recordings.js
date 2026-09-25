/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Compares two animation recordings made by `npm run animations:record` (see tests/animations/README.md) and writes
// an HTML report next to them: dist/animation-recordings/<base>-vs-<head>.html
//
// Usage: node ./scripts/compare-animation-recordings.js <base label> <head label>

const fs = require('fs');
const path = require('path');

const recordingsDir = path.join('dist', 'animation-recordings');
const reportAssetsDir = path.join(__dirname, '..', 'tests', 'animations', 'report');

/** Properties compared between samples, with the difference under which two values are considered equal. */
const PROPERTIES = {
  x: 1,
  y: 1,
  width: 1,
  height: 1,
  opacity: 0.01,
  translateX: 1,
  translateY: 1,
  scale: 0.01,
};
/** Two runs whose animations end within this many milliseconds of each other have the same timing. */
const TIMING_TOLERANCE = 40;
/** An element that goes through at least this many intermediate states is animated, not just updated. */
const MIN_ANIMATED_CHANGES = 3;
/** Animation durations and delays within this many milliseconds of each other are the same. */
const DURATION_TOLERANCE = 10;

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  console.error('Usage: node ./scripts/compare-animation-recordings.js <base label> <head label>');
  process.exit(1);
}

const scenarios = listScenarios(base).filter(name => {
  const found = fs.existsSync(recordingPath(head, name));
  if (!found) {
    console.warn(`${name}: not recorded for ${head}, skipped`);
  }
  return found;
});

const report = {
  base,
  head,
  generatedAt: new Date().toISOString(),
  scenarios: scenarios.map(name => compareScenario(name)),
};

const reportFile = path.join(recordingsDir, `${base}-vs-${head}.html`);
fs.writeFileSync(reportFile, renderReport(report));
// Summary for job summaries, and the verdicts for scripts (see update-animation-recordings.js).
fs.writeFileSync(path.join(recordingsDir, `${base}-vs-${head}.md`), renderMarkdownSummary(report));
fs.writeFileSync(
  path.join(recordingsDir, `${base}-vs-${head}.json`),
  JSON.stringify(summarizeVerdicts(report.scenarios), null, 2)
);

for (const scenario of report.scenarios) {
  console.log(
    `${scenario.verdict.padEnd(9)} ${scenario.name}${scenario.notes.map(note => `\n          - ${note}`).join('')}`
  );
}
console.log(`\nReport: ${reportFile}`);

function listScenarios(label) {
  const dir = path.join(recordingsDir, label);
  if (!fs.existsSync(dir)) {
    console.error(`No recording found in ${dir}`);
    process.exit(1);
  }
  return fs
    .readdirSync(dir)
    .filter(name => fs.existsSync(recordingPath(label, name)))
    .sort();
}

function recordingPath(label, scenario) {
  return path.join(recordingsDir, label, scenario, 'recording.json');
}

function compareScenario(name) {
  const runs = {
    base: loadRun(base, name),
    head: loadRun(head, name),
  };
  const labels = Object.keys(runs.base.samples[0]?.values ?? {});
  const elements = labels.map(label => {
    const baseAnalysis = analyzeElement(runs.base.samples, label);
    const headAnalysis = analyzeElement(runs.head.samples, label);
    const notes = compareElement(label, baseAnalysis, headAnalysis);
    return { label, base: baseAnalysis, head: headAnalysis, notes };
  });
  const notes = [
    ...elements.flatMap(element => element.notes.map(note => note.text)),
    ...compareAnimations(runs.base.animations, runs.head.animations),
  ];
  const verdict = elements.some(element => element.notes.some(note => note.level === 'differs'))
    ? 'differs'
    : notes.length
      ? 'changed'
      : 'same';

  return {
    name,
    story: runs.base.story,
    duration: Math.max(runs.base.duration, runs.head.duration),
    verdict,
    notes,
    elements,
    runs,
  };
}

function loadRun(label, scenario) {
  const recording = JSON.parse(fs.readFileSync(recordingPath(label, scenario), 'utf8'));
  const dir = `${label}/${scenario}`;
  return {
    label,
    story: recording.story,
    duration: recording.duration,
    userAgent: recording.userAgent,
    recordedAt: recording.recordedAt,
    video: { src: `${dir}/${recording.video.file}`, fps: recording.video.fps, start: recording.video.start },
    samples: recording.samples.map(sample => ({
      t: sample.t,
      values: Object.fromEntries(Object.entries(sample.values).map(([label, value]) => [label, metrics(value)])),
    })),
    animations: recording.animations
      .filter(animation => animation.t >= 0)
      .map(animation => ({ ...animation, keyframes: summarizeKeyframes(animation.keyframes) })),
  };
}

/** The measured values of a sample, with the transform decomposed. `null` when the element is not rendered. */
function metrics(value) {
  if (!value) {
    return null;
  }
  const { translateX, translateY, scale } = decomposeTransform(value.transform);
  return {
    x: value.x,
    y: value.y,
    width: value.width,
    height: value.height,
    opacity: value.visibility === 'hidden' ? 0 : value.opacity,
    translateX,
    translateY,
    scale,
  };
}

function decomposeTransform(transform) {
  const match = /^matrix\(([^)]+)\)$/.exec(transform || '');
  if (!match) {
    return { translateX: 0, translateY: 0, scale: 1 };
  }
  const [a, b, , , e, f] = match[1].split(',').map(Number);
  return { translateX: e, translateY: f, scale: Math.hypot(a, b) };
}

function equal(a, b) {
  if (!a || !b) {
    return a === b;
  }
  return Object.entries(PROPERTIES).every(([property, tolerance]) => Math.abs(a[property] - b[property]) <= tolerance);
}

/** When the element starts and stops changing after the trigger, and how many states it goes through. */
function analyzeElement(samples, label) {
  const before = samples.filter(sample => sample.t < 0).pop() ?? samples[0];
  let previous = before?.values[label] ?? null;
  let first = null;
  let last = null;
  let changes = 0;
  for (const sample of samples.filter(sample => sample.t >= 0)) {
    const value = sample.values[label];
    if (!equal(value, previous)) {
      first ??= sample.t;
      last = sample.t;
      changes++;
    }
    previous = value;
  }
  return {
    start: before?.values[label] ?? null,
    end: samples[samples.length - 1]?.values[label] ?? null,
    first,
    last,
    changes,
    animated: changes >= MIN_ANIMATED_CHANGES,
  };
}

function compareElement(label, baseAnalysis, headAnalysis) {
  const notes = [];
  const describe = analysis =>
    analysis.animated ? `animated from ${ms(analysis.first)} to ${ms(analysis.last)}` : describeInstantChange(analysis);

  if (!equal(baseAnalysis.start, headAnalysis.start)) {
    notes.push({ level: 'differs', text: `${label}: different state before the trigger` });
  }
  if (!equal(baseAnalysis.end, headAnalysis.end)) {
    notes.push({
      level: 'differs',
      text: `${label}: different end state (${state(baseAnalysis.end)} vs ${state(headAnalysis.end)})`,
    });
  }
  if (baseAnalysis.animated !== headAnalysis.animated) {
    notes.push({
      level: 'changed',
      text: `${label}: ${base} ${describe(baseAnalysis)}, ${head} ${describe(headAnalysis)}`,
    });
  } else if (baseAnalysis.animated && Math.abs(headAnalysis.last - baseAnalysis.last) > TIMING_TOLERANCE) {
    notes.push({
      level: 'changed',
      text: `${label}: ${base} ${describe(baseAnalysis)}, ${head} ${describe(headAnalysis)}`,
    });
  }
  return notes;
}

/**
 * Compares the animations and transitions that ran, as the browser declares them: duration, delay, easing, animated
 * properties. Unlike the measured values, they do not vary from run to run, so they show a change of easing or
 * duration reliably (durations within `DURATION_TOLERANCE` match: an interrupted transition is shortened by a few
 * milliseconds).
 */
function compareAnimations(baseAnimations, headAnimations) {
  const unmatched = [...headAnimations];
  const removed = [];
  for (const animation of baseAnimations) {
    const match = unmatched.findIndex(candidate => sameAnimation(animation, candidate));
    if (match === -1) {
      removed.push(animation);
    } else {
      unmatched.splice(match, 1);
    }
  }
  const notes = [];
  for (const animation of removed) {
    // The same animation with another timing, rather than an animation replaced by another one.
    const changed = unmatched.findIndex(
      candidate => animationSubject(candidate) === animationSubject(animation) && candidate.kind === animation.kind
    );
    if (changed === -1) {
      notes.push(`${describeAnimation(animation)}: runs in ${base} only`);
    } else {
      notes.push(`${describeAnimation(animation)} in ${base}, ${animationTiming(unmatched[changed])} in ${head}`);
      unmatched.splice(changed, 1);
    }
  }
  notes.push(...unmatched.map(animation => `${describeAnimation(animation)}: runs in ${head} only`));
  // The same difference on several elements (the buttons of a group, for instance) is listed once.
  const counts = new Map();
  notes.forEach(note => counts.set(note, (counts.get(note) || 0) + 1));
  return [...counts].map(([note, count]) => (count > 1 ? `${note} (×${count})` : note));
}

function sameAnimation(a, b) {
  return (
    animationKey(a) === animationKey(b) &&
    closeTo(a.duration, b.duration, DURATION_TOLERANCE) &&
    closeTo(a.delay, b.delay, DURATION_TOLERANCE)
  );
}

function animationKey(animation) {
  return [
    animationSubject(animation),
    animation.kind,
    animation.easing,
    animation.iterations,
    animation.keyframes.map(keyframe => keyframe.easing || 'linear').join('/'),
  ].join('|');
}

/** What is animated: the element (tag name) and the animation name or the animated properties. */
function animationSubject(animation) {
  const properties = [
    ...new Set(
      animation.keyframes.flatMap(keyframe => Object.keys(keyframe).filter(key => key !== 'offset' && key !== 'easing'))
    ),
  ].sort();
  return `${animation.name || properties.join(', ') || animation.kind} on ${animation.target.split('.')[0]}`;
}

function describeAnimation(animation) {
  return `${animationSubject(animation)} (${animationTiming(animation)})`;
}

function animationTiming(animation) {
  const keyframeEasings = [...new Set(animation.keyframes.map(keyframe => keyframe.easing).filter(Boolean))];
  return [
    typeof animation.duration === 'number' ? ms(animation.duration) : animation.duration,
    animation.delay ? `after ${ms(animation.delay)}` : null,
    animation.easing,
    keyframeEasings.length ? `keyframes ${keyframeEasings.join(', ')}` : null,
    animation.iterations === null ? 'infinite' : null,
  ]
    .filter(Boolean)
    .join(', ');
}

function closeTo(a, b, tolerance) {
  return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= tolerance : a === b;
}

function describeInstantChange(analysis) {
  return analysis.first === null ? 'does not change' : `changes at once (${ms(analysis.first)})`;
}

function state(value) {
  if (!value) {
    return 'not rendered';
  }
  return `${Math.round(value.width)}×${Math.round(value.height)} at ${Math.round(value.x)},${Math.round(value.y)}, opacity ${round(value.opacity)}`;
}

function ms(value) {
  return `${Math.round(value)} ms`;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

/** Keeps the animated properties of each keyframe, which is what tells the animations apart. */
function summarizeKeyframes(keyframes) {
  return keyframes.map(keyframe => {
    const { offset, easing, computedOffset, ...properties } = keyframe;
    delete properties.composite;
    return {
      offset: round(computedOffset ?? offset ?? 0),
      ...(easing && easing !== 'linear' ? { easing } : {}),
      ...properties,
    };
  });
}

/** Verdict counts, and the verdict of each scenario. */
function summarizeVerdicts(scenarios) {
  const summary = { same: 0, changed: 0, differs: 0, scenarios: {} };
  for (const scenario of scenarios) {
    summary[scenario.verdict]++;
    summary.scenarios[scenario.name] = scenario.verdict;
  }
  return summary;
}

function renderMarkdownSummary(data) {
  const different = data.scenarios.filter(scenario => scenario.verdict !== 'same');
  const lines = ['### Animation recordings', ''];
  if (!different.length) {
    lines.push(`The animations of the ${data.scenarios.length} recorded scenarios match \`${data.base}\`.`);
    return lines.join('\n') + '\n';
  }
  lines.push(
    `${different.length} of ${data.scenarios.length} recorded scenarios animate differently from \`${data.base}\`. ` +
      'Open the report to watch them side by side.',
    '',
    '| Scenario | Verdict | Differences |',
    '| --- | --- | --- |',
    ...different.map(
      scenario =>
        `| ${markdownCell(scenario.name)} | ${scenario.verdict} | ${scenario.notes.map(markdownCell).join('<br>')} |`
    )
  );
  return lines.join('\n') + '\n';
}

/** Escapes text for a Markdown table cell: backslashes first, then the column separators; no line breaks. */
function markdownCell(text) {
  return text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function renderReport(data) {
  const template = fs.readFileSync(path.join(reportAssetsDir, 'report.html'), 'utf8');
  const styles = fs.readFileSync(path.join(reportAssetsDir, 'report.css'), 'utf8');
  const script = fs.readFileSync(path.join(reportAssetsDir, 'report.js'), 'utf8');
  // `<` is escaped so that the data cannot close the script element.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return template
    .replace('{{title}}', () => escapeHtml(`Animations: ${data.base} vs ${data.head}`))
    .replace('/* {{styles}} */', () => styles)
    .replace('/* {{data}} */', () => `window.ANIMATION_REPORT = ${json};`)
    .replace('/* {{script}} */', () => script);
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character]);
}
