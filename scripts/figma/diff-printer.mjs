/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Prints a human-readable diff of all variable changes grouped by collection.
 *
 * Output format per collection:
 *   📦  <collection name>  (+<created> ~<updated> ↻<retyped>)
 *     ↻  <name>    <prevType> → <newType>   ← type corrections
 *     +  <name>    <type>                   ← new variables
 *     ~  <name>    <type>                   ← updated variables
 *          <field>   <from>  →  <to>        ← one line per changed field
 *
 * Collections with no changes are omitted.
 *
 * @param {Array<{ collectionName: string, diff: import('./planner.mjs').DiffEntry[] }>} diffReport
 */
export function printDiff(diffReport) {
  console.log('\n📋  Diff:\n');

  let anyChanges = false;

  for (const { collectionName, diff } of diffReport) {
    const retyped = diff.filter(e => e.action === 'retype');
    const created = diff.filter(e => e.action === 'create');
    const updated = diff.filter(e => e.action === 'update');

    if (diff.length === 0) {
      continue;
    }
    anyChanges = true;

    const badge = [
      created.length ? `+${created.length}` : null,
      updated.length ? `~${updated.length}` : null,
      retyped.length ? `↻${retyped.length}` : null,
    ]
      .filter(Boolean)
      .join('  ');

    console.log(`  📦  ${collectionName}  (${badge})`);

    for (const e of retyped) {
      console.log(`    ↻  ${e.name.padEnd(60)}  ${e.prevType} → ${e.type}`);
    }

    for (const e of created) {
      console.log(`    +  ${e.name.padEnd(60)}  ${e.type}`);
    }

    for (const e of updated) {
      console.log(`    ~  ${e.name.padEnd(60)}  ${e.type}`);
      for (const { field, from, to } of e.changes ?? []) {
        console.log(`         ${field.padEnd(22)}  ${from}  →  ${to}`);
      }
    }

    console.log('');
  }

  if (!anyChanges) {
    console.log('  No changes.\n');
  }
}
