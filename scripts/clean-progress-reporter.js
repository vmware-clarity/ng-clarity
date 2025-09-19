/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// A minimal, readable progress reporter for Karma that prints
// a single updating line per browser, e.g.:
//   Chrome Headless ...: Executed 152 of 3393 SUCCESS (1.756 secs)
//
// - No dots, no duplicate stack traces (pair with mocha reporter for failures)
// - Periodic updates every N specs (configurable)
// - Live, increasing "secs" value during the run
// - Colored status (SUCCESS/FAILED/ERROR/DISCONNECTED)
//
// Optional configuration in karma.conf.js:
//   cleanProgressReporter: { updateEvery: 50 }
// Or via environment variable (fallback):
//   CLEAN_PROGRESS_UPDATE_EVERY=50
//
// Wiring in karma.conf.js:
//   reporters: ['clean-progress', 'mocha']
//   plugins: [ require('karma-mocha-reporter'), require('./clean-progress-reporter') ]
//
function CleanProgressReporter(baseReporterDecorator, karmaConfig) {
  baseReporterDecorator(this);

  // ---------- Formatting / Colors ----------
  const ANSI = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    red: '\u001b[31m',
    yellow: '\u001b[33m',
    cyan: '\u001b[36m',
    clrLine: '\u001b[2K', // clear entire line
    toCol0: '\u001b[0G', // move cursor to column 0
  };

  const COLORS = {
    browser: ANSI.cyan,
    success: ANSI.green,
    failed: ANSI.red,
    error: ANSI.red,
    disconnected: ANSI.yellow,
    skipped: ANSI.cyan,
    reset: ANSI.reset,
  };

  // Whether we can safely update the same line (TTY).
  // On some CI systems, inline updates don’t render well — we’ll fall back to newline.
  const canInlineUpdate = typeof process !== 'undefined' && process.stdout && process.stdout.isTTY;

  // ---------- Options ----------
  const options = (karmaConfig && karmaConfig.cleanProgressReporter) || {};
  const updateEvery = Number(options.updateEvery) || Number(process.env.CLEAN_PROGRESS_UPDATE_EVERY) || 50; // default cadence

  // ---------- Per-browser state ----------
  const browserStateById = Object.create(null);

  function getBrowserState(browser) {
    if (!browserStateById[browser.id]) {
      browserStateById[browser.id] = {
        browserName: browser.name,
        completedCount: 0,
        lastPrintedCount: 0,
        totalSpecs: undefined,
        startTimestamp: Date.now(),
      };
    }
    return browserStateById[browser.id];
  }

  // ---------- Utilities ----------
  function colorizeStatus(status) {
    switch (status) {
      case 'SUCCESS':
        return COLORS.success + status + COLORS.reset;
      case 'FAILED':
        return COLORS.failed + status + COLORS.reset;
      case 'ERROR':
        return COLORS.error + status + COLORS.reset;
      case 'DISCONNECTED':
        return COLORS.disconnected + status + COLORS.reset;
      case 'SKIPPED':
        return COLORS.skipped + status + COLORS.reset;
      default:
        return status;
    }
  }

  function deriveStatusFromLastResult(lastResult) {
    if (lastResult.disconnected) {
      return 'DISCONNECTED';
    }
    if (lastResult.error) {
      return 'ERROR';
    }
    if (lastResult.failed) {
      return 'FAILED';
    }
    return 'SUCCESS';
  }

  function liveSecondsSince(startTimestamp, lastResult) {
    const liveMs = typeof lastResult.netTime === 'number' ? lastResult.netTime : Date.now() - startTimestamp;
    return (liveMs / 1000).toFixed(3);
  }

  function printInline(message, forceNewline) {
    if (canInlineUpdate) {
      // Clear the line, move to column 0, write message; no newline unless forced.
      this.writeCommonMsg(ANSI.clrLine + ANSI.toCol0 + message + (forceNewline ? '\n' : ''));
    } else {
      // CI fallback: print each update as its own line.
      this.writeCommonMsg(message + '\n');
    }
  }

  // ---------- Karma hooks ----------
  this.onBrowserStart = function (browser) {
    browserStateById[browser.id] = {
      browserName: browser.name,
      completedCount: 0,
      lastPrintedCount: 0,
      totalSpecs: undefined,
      startTimestamp: Date.now(),
    };
  };

  // Some launchers provide the total via the info channel.
  this.onBrowserInfo = function (browser, info) {
    const state = getBrowserState(browser);
    if (typeof info.total === 'number' && info.total > 0) {
      state.totalSpecs = info.total;
    }
  };

  this.onSpecComplete = function (browser) {
    const state = getBrowserState(browser);
    state.completedCount += 1;

    const lastResult = browser.lastResult || {};
    if (typeof lastResult.total === 'number' && lastResult.total > 0) {
      state.totalSpecs = lastResult.total;
    }

    const status = deriveStatusFromLastResult(lastResult);
    const totalSpecs = Number.isFinite(state.totalSpecs) ? state.totalSpecs : undefined;
    const totalLabel = Number.isFinite(totalSpecs) ? totalSpecs : '?';
    const seconds = liveSecondsSince(state.startTimestamp, lastResult);

    // Throttle: print every N specs, and always on the final spec.
    const reachedEnd = Number.isFinite(totalSpecs) && state.completedCount === totalSpecs;
    const shouldPrint =
      state.completedCount !== state.lastPrintedCount && (state.completedCount % updateEvery === 0 || reachedEnd);

    if (!shouldPrint) {
      return;
    }

    const line =
      `${COLORS.browser}${state.browserName}${COLORS.reset}: ` +
      `Executed ${state.completedCount} of ${totalLabel} ${colorizeStatus(status)} ` +
      `(${seconds} secs)`;

    printInline.call(this, line, false);
    state.lastPrintedCount = state.completedCount;
  };

  this.onBrowserComplete = function (browser) {
    const lastResult = browser.lastResult || {};
    const finishedCount = (lastResult.success || 0) + (lastResult.failed || 0) + (lastResult.skipped || 0);
    const totalSpecs = Number.isFinite(lastResult.total) ? lastResult.total : finishedCount;
    const seconds = ((lastResult.netTime || 0) / 1000).toFixed(3);
    const status = deriveStatusFromLastResult(lastResult);

    const line =
      `${COLORS.browser}${browser.name}${COLORS.reset}: ` +
      `Executed ${finishedCount} of ${totalSpecs} ${colorizeStatus(status)} ` +
      `(${seconds} secs)`;

    // Finalize the line with a newline so the next reporter starts on a new line.
    printInline.call(this, line, true);
  };

  this.onRunComplete = function (_browsers, results) {
    const finishedTotal = (results.success || 0) + (results.failed || 0) + (results.skipped || 0);
    const overallStatus = results.exitCode === 0 ? 'SUCCESS' : 'FAILED';

    this.writeCommonMsg(`TOTAL: ${finishedTotal} of ${finishedTotal} ${colorizeStatus(overallStatus)}\n`);
  };
}

CleanProgressReporter.$inject = ['baseReporterDecorator', 'config'];

module.exports = {
  'reporter:clean-progress': ['type', CleanProgressReporter],
};
