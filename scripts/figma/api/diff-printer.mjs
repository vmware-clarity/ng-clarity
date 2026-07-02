/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Print a stats summary table to the console.
 *
 * Used for both the dry-run/extract plan summary and the post-push summary so
 * the layout stays consistent without copy-paste drift.
 *
 * @param {string} label  Heading shown after the 📊 icon (e.g. "Token plan" or "Push summary").
 * @param {{ collections: number, created: number, updated: number, skipped: number, deprecated: number, modeValues: number }} stats
 * @param {string} [doneMsg]  Optional trailing message (e.g. "✅  Dry run complete").
 */
export function printStats(label, { collections, created, updated, skipped, deprecated, modeValues }, doneMsg) {
  console.log(`\n📊  ${label}:`);
  console.log(`    Collections    : ${collections}`);
  console.log(`    New vars       : ${created}`);
  console.log(`    Updated vars   : ${updated}`);
  console.log(`    Skipped        : ${skipped}  (complex multi-value strings)`);
  console.log(`    Deprecated     : ${deprecated}  (old var deprecated, new var created)`);
  console.log(`    Mode values    : ${modeValues}`);
  if (doneMsg) {
    console.log(doneMsg);
  }
}

/**
 * Format one diff-entry line: `<marker>  <name padded>  <suffix>`.
 * Shared by the created/updated/deprecated branches below so the column width
 * and marker placement can only drift in one place.
 *
 * @param {string} marker
 * @param {import('./planner.mjs').DiffEntry} e
 * @param {string} suffix
 * @returns {string}
 */
const formatEntry = (marker, e, suffix) => `    ${marker}  ${e.name.padEnd(60)}  ${suffix}`;

/**
 * Prints a human-readable diff of all variable changes grouped by collection.
 *
 * Output format per collection:
 *   📦  <collection name>  (+<created> ~<updated> ⚠<deprecated>)
 *     ⚠  <name>    <prevType> → <newType>   ← type changed; old var renamed to <name>_deprecated
 *     +  <name>    <type>                   ← new variables
 *     ~  <name>    <type>                   ← updated variables
 *          <field>   <from>  →  <to>        ← one line per changed field
 *
 * Collections with no changes are omitted.
 *
 * @param {Array<{ collectionName: string, diff: import('./planner.mjs').DiffEntry[] }>} diffReport
 */
export function printDiff(diffReport) {
  console.log(formatDiff(diffReport));
}

/**
 * Build the human-readable diff string (see {@link printDiff}) without emitting it.
 * Kept side-effect-free so the formatting can be unit-tested.
 *
 * @param {Array<{ collectionName: string, diff: import('./planner.mjs').DiffEntry[] }>} diffReport
 * @returns {string}
 */
export function formatDiff(diffReport) {
  const lines = ['\n📋  Diff:\n'];

  let hasChanges = false;

  for (const { collectionName, diff } of diffReport) {
    if (diff.length === 0) {
      continue;
    }
    hasChanges = true;

    const diffGroupedByAction = Object.groupBy(diff, ({ action }) => action);

    const deprecated = diffGroupedByAction.deprecate ? diffGroupedByAction.deprecate : [];
    const created = diffGroupedByAction.create ? diffGroupedByAction.create : [];
    const updated = diffGroupedByAction.update ? diffGroupedByAction.update : [];

    const badge = [
      created.length ? `+${created.length}` : null,
      updated.length ? `~${updated.length}` : null,
      deprecated.length ? `⚠${deprecated.length}` : null,
    ]
      .filter(Boolean)
      .join('  ');

    lines.push(`  📦  ${collectionName}  (${badge})`);

    deprecated.forEach(e =>
      lines.push(`${formatEntry('⚠', e, `${e.prevType} → ${e.type}`)}\n         (old var → ${e.name}_deprecated)`)
    );
    created.forEach(e => lines.push(formatEntry('+', e, e.type)));
    updated.forEach(e => {
      lines.push(formatEntry('~', e, e.type));

      e.changes?.forEach(c => {
        lines.push(`         ${c.field.padEnd(22)}  ${c.from}  →  ${c.to}`);
      });
    });

    lines.push('');
  }

  if (!hasChanges) {
    lines.push('  No changes.\n');
  }

  return lines.join('\n');
}
