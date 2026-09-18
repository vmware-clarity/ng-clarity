/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/*
 * Verifies that a pull request which RENAMES visual regression snapshots changed only paths, never pixels.
 *
 * Why this exists
 * ---------------
 * Snapshots are not maintained by hand. `.github/workflows/pr-build.yml` runs
 * `npx playwright test --update-snapshots` over the browser x theme x density matrix and uploads a binary
 * diff; `.github/workflows/pr-visual-snapshot-update-bot.yml` applies that diff and then runs
 * `scripts/delete-unused-screenshots.ts` to drop the orphans. So when a story is retitled or a story file is
 * moved, every snapshot is deleted and re-created under a new path. In the review of such a pull request
 * *every* snapshot looks new, which means a genuine visual regression is invisible. This script is the
 * safety net: it compares the CONTENT of the snapshot set before and after, ignoring paths entirely.
 *
 * Equality test: byte equality
 * ----------------------------
 * Two snapshots are "the same picture" here when their bytes are identical. That is a valid test in this
 * repository because CI already depends on Playwright's PNG output being byte-stable: the snapshot bot
 * commits the regenerated snapshots only when `git diff-index` reports the work tree dirty, so an unstable
 * encoder would make the bot commit noise on every single run, which it does not.
 *
 * If byte instability ever does show up in practice, the correct fallback is a PIXEL comparison (decode both
 * PNGs and compare with e.g. `pixelmatch`), keeping the same report shape. Silently weakening this to a
 * count-only comparison ("both sides still have 6368 files, looks fine") is NOT an acceptable fallback - a
 * count comparison passes happily while every pixel changes, which is exactly the failure this guards.
 *
 * Hashing: git's blob sha1, on both sides
 * ---------------------------------------
 * The base side is read straight out of the object database with `git ls-tree -r <ref>`, which already
 * carries a content hash per blob - git's sha1. Using it means the 894 MB of base snapshot bytes never has
 * to be piped out of `git cat-file`. For the comparison to mean anything the work tree side has to be
 * hashed the same way, so it goes through `git hash-object --stdin-paths`, which produces the identical
 * sha1 for identical content (verified: `git hash-object <path>` matches the `ls-tree` blob id for a tracked
 * snapshot). sha256 was the alternative, but it would force the whole base tree through a pipe for no gain:
 * the threat model here is an accidental byte change, not an adversary crafting a sha1 collision.
 *
 * Usage
 * -----
 *   npm run verify:snapshot-parity -- --base <git-ref> [--verbose]
 *
 * Exit codes: 0 parity holds, 1 content present in base is missing from head, 2 usage or git error.
 */

const DEFAULT_SNAPSHOT_DIR = 'tests/snapshots';
const EXIT_OK = 0;
const EXIT_CONTENT_LOST = 1;
const EXIT_USAGE = 2;
const HASH_BATCH_SIZE = 2000;
const MAX_RENAME_GROUPS = 40;

const USAGE = `Usage: npm run verify:snapshot-parity -- --base <git-ref> [options]

Compares the snapshot set at <git-ref> with the snapshot set in the working tree by content, not by path,
and fails when content that exists at <git-ref> cannot be found anywhere in the working tree.

Options:
  --base <git-ref>   Required. The ref to compare against, e.g. origin/main or HEAD.
  --base-dir <path>  Snapshot root inside <git-ref>. Default: ${DEFAULT_SNAPSHOT_DIR}
  --head-dir <path>  Snapshot root in the working tree. Default: ${DEFAULT_SNAPSHOT_DIR}
                     Both directory options exist so the check can be scoped to a subtree
                     (e.g. --base-dir ${DEFAULT_SNAPSHOT_DIR}/chromium) and so it can be exercised
                     against a fixture directory in tests.
  --verbose          Print every old -> new path pair instead of the collapsed per-directory summary.
  --help             Print this message.

Exit codes:
  0  parity holds
  1  content present in the base is missing from the working tree (a pixel change or a lost snapshot)
  2  usage error, bad ref, or a failing git command`;

interface Options {
  base: string;
  baseDir: string;
  headDir: string;
  verbose: boolean;
}

interface RenamePair {
  from: string;
  to: string;
}

interface RenameGroup {
  fromDir: string;
  toDir: string;
  pairs: RenamePair[];
}

/** Snapshot content hash -> every snapshot path (relative to the snapshot root) holding that content. */
type PathsByHash = Map<string, string[]>;

const options = parseArguments(process.argv.slice(2));
const repositoryRoot = findRepositoryRoot();

verifyRef(options.base);

const basePathsByHash = readBaseSnapshots(options.base, options.baseDir);
const headPathsByHash = readHeadSnapshots(options.headDir);

process.exit(report(basePathsByHash, headPathsByHash, options));

function parseArguments(argv: string[]): Options {
  const values = new Map<string, string>();
  let verbose = false;

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];

    if (argument === '--help' || argument === '-h') {
      console.log(USAGE);
      process.exit(EXIT_OK);
    } else if (argument === '--verbose') {
      verbose = true;
    } else if (argument === '--base' || argument === '--base-dir' || argument === '--head-dir') {
      const value = argv[index + 1];

      if (value === undefined || value.startsWith('--')) {
        failWithUsage(`${argument} requires a value.`);
      }

      values.set(argument, value);
      index++;
    } else {
      failWithUsage(`unknown argument '${argument}'.`);
    }
  }

  const base = values.get('--base');

  if (base === undefined) {
    failWithUsage('--base <git-ref> is required.');
  }

  return {
    base,
    baseDir: toPosixPath(values.get('--base-dir') ?? DEFAULT_SNAPSHOT_DIR),
    headDir: values.get('--head-dir') ?? DEFAULT_SNAPSHOT_DIR,
    verbose,
  };
}

function findRepositoryRoot(): string {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  } catch {
    fail('not inside a git repository (git rev-parse --show-toplevel failed).');
  }
}

function verifyRef(ref: string): void {
  try {
    git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
  } catch {
    fail(`'${ref}' is not a commit in this repository. Pass an existing ref to --base, e.g. origin/main.`);
  }
}

function readBaseSnapshots(ref: string, baseDir: string): PathsByHash {
  const listing = git(['ls-tree', '-r', '-z', '--full-name', `${ref}^{tree}`, '--', baseDir]);
  const pathsByHash: PathsByHash = new Map();

  for (const record of listing.split('\0')) {
    if (record === '') {
      continue;
    }

    // Record shape: "<mode> SP <type> SP <object-id> TAB <path>".
    const tabIndex = record.indexOf('\t');
    const metadata = record.slice(0, tabIndex).split(' ');
    const type = metadata[1];
    const objectId = metadata[2];
    const filePath = record.slice(tabIndex + 1);

    if (type !== 'blob' || !filePath.endsWith('.png')) {
      continue;
    }

    addPath(pathsByHash, objectId, path.posix.relative(baseDir, filePath));
  }

  if (pathsByHash.size === 0) {
    fail(`no .png files found under '${baseDir}' at '${ref}'. Check --base and --base-dir.`);
  }

  return pathsByHash;
}

function readHeadSnapshots(headDir: string): PathsByHash {
  const absoluteRoot = path.resolve(repositoryRoot, headDir);

  if (!fs.existsSync(absoluteRoot) || !fs.statSync(absoluteRoot).isDirectory()) {
    fail(`'${headDir}' is not a directory. Check --head-dir.`);
  }

  const relativePaths = listPngFiles(absoluteRoot, '').sort();

  if (relativePaths.length === 0) {
    fail(`no .png files found under '${headDir}' in the working tree. Check --head-dir.`);
  }

  const hashes = hashFiles(absoluteRoot, relativePaths);
  const pathsByHash: PathsByHash = new Map();

  for (let index = 0; index < relativePaths.length; index++) {
    addPath(pathsByHash, hashes[index], relativePaths[index]);
  }

  return pathsByHash;
}

function listPngFiles(absoluteRoot: string, relativeDir: string): string[] {
  const filePaths: string[] = [];

  for (const entry of fs.readdirSync(path.join(absoluteRoot, relativeDir), { withFileTypes: true })) {
    const relativePath = relativeDir === '' ? entry.name : `${relativeDir}/${entry.name}`;

    if (entry.isDirectory()) {
      filePaths.push(...listPngFiles(absoluteRoot, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      filePaths.push(relativePath);
    }
  }

  return filePaths;
}

/*
 * Hashes work tree files with git itself, so that the resulting sha1 is directly comparable with the blob
 * ids `git ls-tree` reported for the base side. `--stdin-paths` reads newline separated paths, so a path
 * containing a newline or a double quote cannot be passed unambiguously - no snapshot has one, but bail out
 * loudly rather than silently mis-hashing if that ever changes.
 */
function hashFiles(absoluteRoot: string, relativePaths: string[]): string[] {
  const hashes: string[] = [];

  for (let start = 0; start < relativePaths.length; start += HASH_BATCH_SIZE) {
    const batch = relativePaths.slice(start, start + HASH_BATCH_SIZE);
    const absolutePaths = batch.map(relativePath => {
      if (/["\n\r]/.test(relativePath)) {
        fail(`snapshot path cannot be hashed because it contains a quote or newline: ${relativePath}`);
      }

      return path.join(absoluteRoot, relativePath);
    });

    const output = git(['hash-object', '--stdin-paths'], `${absolutePaths.join('\n')}\n`);
    const batchHashes = output.split('\n').filter(line => line !== '');

    if (batchHashes.length !== batch.length) {
      fail(`git hash-object returned ${batchHashes.length} hashes for ${batch.length} files.`);
    }

    hashes.push(...batchHashes);
  }

  return hashes;
}

function report(base: PathsByHash, head: PathsByHash, reportOptions: Options): number {
  const baseFileCount = countPaths(base);
  const headFileCount = countPaths(head);

  console.log('Snapshot parity check');
  console.log(`  base : ${reportOptions.baseDir} @ ${reportOptions.base} (${describeRef(reportOptions.base)})`);
  console.log(`  head : ${reportOptions.headDir} (working tree)`);
  console.log('');
  console.log(
    `  files          base ${baseFileCount}   head ${headFileCount}   (delta ${headFileCount - baseFileCount})`
  );
  console.log(`  distinct bytes base ${base.size}   head ${head.size}`);
  console.log('');

  const baseOnly = hashesMissingFrom(base, head);
  const headOnly = hashesMissingFrom(head, base);

  reportBaseOnly(base, baseOnly);
  reportHeadOnly(head, headOnly);
  reportDuplicateCountChanges(base, head);
  reportMatchedPaths(base, head, reportOptions);

  if (baseOnly.length > 0) {
    console.log(
      `RESULT: FAIL - ${baseOnly.length} content hash(es) from the base are not present in the working tree.`
    );
    console.log('        A snapshot rename must not change a single byte. Investigate before merging.');
    return EXIT_CONTENT_LOST;
  }

  console.log('RESULT: PASS - every byte sequence in the base is still present in the working tree.');

  if (headOnly.length > 0) {
    console.log(`        ${headOnly.length} new content hash(es) were added and must be justified by a human.`);
  }

  return EXIT_OK;
}

function reportBaseOnly(base: PathsByHash, baseOnly: string[]): void {
  console.log(`Content in the base that is MISSING from the working tree: ${baseOnly.length}`);

  if (baseOnly.length === 0) {
    console.log('  (none)');
    console.log('');
    return;
  }

  console.log('  Each of these is a real pixel change or a lost snapshot:');

  for (const hash of baseOnly.sort()) {
    const paths = base.get(hash) ?? [];
    console.log(`  ${hash}  (${paths.length} base path(s))`);

    for (const filePath of paths) {
      console.log(`      ${filePath}`);
    }
  }

  console.log('');
}

function reportHeadOnly(head: PathsByHash, headOnly: string[]): void {
  console.log(`Content in the working tree that is NEW (absent from the base): ${headOnly.length}`);

  if (headOnly.length === 0) {
    console.log('  (none)');
    console.log('');
    return;
  }

  console.log('  Not fatal - these are new stories, but a human must confirm that is intended:');

  for (const hash of headOnly.sort()) {
    const paths = head.get(hash) ?? [];
    console.log(`  ${hash}  (${paths.length} head path(s))`);

    for (const filePath of paths) {
      console.log(`      ${filePath}`);
    }
  }

  console.log('');
}

/*
 * A hash legitimately repeats: stories that render identically across themes or densities produce identical
 * PNGs. Comparing the two sides as multisets means a change in how often a hash occurs is reported too - it
 * usually means a duplicate snapshot was added or dropped.
 */
function reportDuplicateCountChanges(base: PathsByHash, head: PathsByHash): void {
  const changes: string[] = [];

  base.forEach((paths, hash) => {
    const headPaths = head.get(hash);

    if (headPaths !== undefined && headPaths.length !== paths.length) {
      changes.push(`  ${hash}  base ${paths.length} file(s) -> head ${headPaths.length} file(s)`);
    }
  });

  console.log(`Content kept on both sides but a different number of times: ${changes.length}`);

  if (changes.length === 0) {
    console.log('  (none)');
  } else {
    console.log('  Not fatal - the pixels still exist, but a snapshot was duplicated or dropped:');
    changes.sort().forEach(change => console.log(change));
  }

  console.log('');
}

function reportMatchedPaths(base: PathsByHash, head: PathsByHash, reportOptions: Options): void {
  const renames: RenamePair[] = [];
  const droppedPaths: string[] = [];
  const addedPaths: string[] = [];
  let unchangedCount = 0;

  base.forEach((basePaths, hash) => {
    const headPaths = head.get(hash);

    if (headPaths === undefined) {
      return;
    }

    const headPathSet = new Set(headPaths);
    const movedFrom = basePaths.filter(basePath => !headPathSet.has(basePath));
    const basePathSet = new Set(basePaths);
    const movedTo = headPaths.filter(headPath => !basePathSet.has(headPath));

    unchangedCount += basePaths.length - movedFrom.length;

    for (let index = 0; index < Math.max(movedFrom.length, movedTo.length); index++) {
      if (index < movedFrom.length && index < movedTo.length) {
        renames.push({ from: movedFrom[index], to: movedTo[index] });
      } else if (index < movedFrom.length) {
        droppedPaths.push(movedFrom[index]);
      } else {
        addedPaths.push(movedTo[index]);
      }
    }
  });

  console.log('Matched content');
  console.log(`  same bytes, same path : ${unchangedCount} file(s)`);
  console.log(`  same bytes, new path  : ${renames.length} file(s)`);
  console.log('');

  if (renames.length > 0) {
    printRenames(renames, reportOptions.verbose);
  }

  printExtraPaths('Base paths with no working tree counterpart (their bytes survive elsewhere)', droppedPaths);
  printExtraPaths('Working tree paths with no base counterpart (their bytes existed in the base)', addedPaths);
}

function printRenames(renames: RenamePair[], verbose: boolean): void {
  if (verbose) {
    console.log('  old -> new (full listing):');
    renames
      .slice()
      .sort((left, right) => left.from.localeCompare(right.from))
      .forEach(rename => console.log(`    ${rename.from} -> ${rename.to}`));
    console.log('');
    return;
  }

  const groups = groupRenames(renames);
  console.log(`  old -> new, collapsed into ${groups.length} directory group(s) (run with --verbose for every file):`);

  for (const group of groups.slice(0, MAX_RENAME_GROUPS)) {
    console.log(`    ${group.fromDir} -> ${group.toDir}    ${group.pairs.length} file(s)`);

    const renamedFiles = group.pairs.filter(pair => path.posix.basename(pair.from) !== path.posix.basename(pair.to));

    if (renamedFiles.length === 0) {
      console.log('        file names unchanged');
    } else {
      const example = renamedFiles[0];
      console.log(`        e.g. ${path.posix.basename(example.from)} -> ${path.posix.basename(example.to)}`);
    }
  }

  if (groups.length > MAX_RENAME_GROUPS) {
    console.log(
      `    ... and ${groups.length - MAX_RENAME_GROUPS} more group(s); run with --verbose for the full listing`
    );
  }

  console.log('');
}

function groupRenames(renames: RenamePair[]): RenameGroup[] {
  const groups = new Map<string, RenameGroup>();
  const orderedGroups: RenameGroup[] = [];

  for (const rename of renames) {
    const fromDir = `${path.posix.dirname(rename.from)}/`;
    const toDir = `${path.posix.dirname(rename.to)}/`;
    const key = `${fromDir}\0${toDir}`;
    let group = groups.get(key);

    if (group === undefined) {
      group = { fromDir, toDir, pairs: [] };
      groups.set(key, group);
      orderedGroups.push(group);
    }

    group.pairs.push(rename);
  }

  return orderedGroups.sort((left, right) => left.fromDir.localeCompare(right.fromDir));
}

function printExtraPaths(label: string, filePaths: string[]): void {
  if (filePaths.length === 0) {
    return;
  }

  console.log(`  ${label}: ${filePaths.length}`);
  filePaths.sort().forEach(filePath => console.log(`    ${filePath}`));
  console.log('');
}

function describeRef(ref: string): string {
  try {
    return git(['rev-parse', '--short', `${ref}^{commit}`]).trim();
  } catch {
    return 'unknown';
  }
}

function addPath(pathsByHash: PathsByHash, hash: string, filePath: string): void {
  const paths = pathsByHash.get(hash);

  if (paths === undefined) {
    pathsByHash.set(hash, [filePath]);
  } else {
    paths.push(filePath);
  }
}

function countPaths(pathsByHash: PathsByHash): number {
  let total = 0;

  pathsByHash.forEach(paths => {
    total += paths.length;
  });

  return total;
}

/** Content hashes that exist in `source` but nowhere in `other`. */
function hashesMissingFrom(source: PathsByHash, other: PathsByHash): string[] {
  const missing: string[] = [];

  source.forEach((paths, hash) => {
    if (!other.has(hash)) {
      missing.push(hash);
    }
  });

  return missing;
}

function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/\/+$/, '');
}

function git(args: string[], input?: string): string {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    input,
    maxBuffer: 256 * 1024 * 1024,
  });
}

function fail(message: string): never {
  process.stderr.write(`verify-snapshot-parity: ${message}\n`);
  process.exit(EXIT_USAGE);
}

function failWithUsage(message: string): never {
  process.stderr.write(`verify-snapshot-parity: ${message}\n\n${USAGE}\n`);
  process.exit(EXIT_USAGE);
}
