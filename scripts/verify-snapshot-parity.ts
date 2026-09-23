/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { parseArgs } from 'util';

import { screenshotExpectOptions } from '../tests/helpers/vrt';

/*
 * Verifies that a pull request which MOVES visual regression snapshots changed only paths, never pixels.
 *
 * When stories are retitled or story files move, their snapshots move too, and in the review of such a pull
 * request every snapshot looks new, so a genuine visual regression is invisible. This script compares the
 * CONTENT of the snapshot set before and after, ignoring paths:
 *
 *   1. Bytes. A base snapshot whose exact bytes exist anywhere in the working tree survived. Snapshots moved
 *      with `git mv` always pass here.
 *   2. Pixels. A base snapshot whose bytes are gone is compared with the working tree snapshots that could
 *      be its successor (same path, or same browser, theme, density and image size, closest file name
 *      first), using Playwright's own PNG comparator at the threshold `toHaveScreenshot()` uses. This
 *      catches re-encoded screenshots: `playwright test --update-snapshots` writes a fresh render for every
 *      snapshot path that has no baseline, and a fresh render rarely has the same bytes even when every
 *      pixel matches.
 *
 * A base snapshot that fails both is LOST: a real visual change, or a snapshot that was dropped.
 *
 * Usage:   npm run verify:snapshot-parity -- --base <git-ref> [--base-dir <path>] [--head-dir <path>] [--verbose]
 * Exit codes: 0 parity holds, 1 a base snapshot was lost, 2 usage or git error.
 */

// `playwright-core/lib/coreBundle` is a subpath playwright-core exports; it holds the comparator
// `toHaveScreenshot()` itself uses, so "matches" here means exactly what it means in CI.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { utils } = require('playwright-core/lib/coreBundle') as {
  utils: {
    getComparator(mimeType: string): (actual: Buffer, expected: Buffer, options: { threshold: number }) => unknown;
  };
};

const DEFAULT_SNAPSHOT_DIR = 'tests/snapshots';
const EXIT_OK = 0;
const EXIT_LOST = 1;
const EXIT_USAGE = 2;
const MAX_PIXEL_CANDIDATES = 10;
const BLOB_BATCH_SIZE = 500;
const CELL_SUFFIX = /-[a-z]+-[a-z]+\.png$/;
const BROWSER_DIR = /^(chromium|firefox|webkit)\//;

const USAGE = `Usage: npm run verify:snapshot-parity -- --base <git-ref> [options]

Compares the snapshots at <git-ref> with the snapshots in the working tree by content, not by path, and
fails when a snapshot at <git-ref> has no byte-identical or pixel-identical counterpart in the working tree.

Options:
  --base <git-ref>   Required. The ref to compare against, e.g. origin/main.
  --base-dir <path>  Snapshot root inside <git-ref>. Default: ${DEFAULT_SNAPSHOT_DIR}
  --head-dir <path>  Snapshot root in the working tree. Default: ${DEFAULT_SNAPSHOT_DIR}
                     Both directory options let the check be scoped to a subtree, e.g.
                     --base-dir ${DEFAULT_SNAPSHOT_DIR}/chromium --head-dir ${DEFAULT_SNAPSHOT_DIR}/chromium,
                     or pointed at a directory of snapshots extracted from a CI artifact.
  --verbose          List every moved and every re-encoded snapshot.
  --help             Print this message.`;

interface Snapshot {
  /** Path relative to its snapshot root, with forward slashes. */
  path: string;
  /** git's blob id of the content, so both sides hash identically. */
  hash: string;
}

const { values: options } = parseOptions();
const threshold = screenshotExpectOptions.threshold;
const comparePng = utils.getComparator('image/png');
const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const baseDir = toPosixPath(options['base-dir']);
const headRoot = path.resolve(repositoryRoot, options['head-dir']);

const base = readBaseSnapshots();
const head = readHeadSnapshots();
process.exit(report());

function parseOptions() {
  try {
    const parsed = parseArgs({
      options: {
        base: { type: 'string' },
        'base-dir': { type: 'string', default: DEFAULT_SNAPSHOT_DIR },
        'head-dir': { type: 'string', default: DEFAULT_SNAPSHOT_DIR },
        verbose: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });

    if (parsed.values.help) {
      console.log(USAGE);
      process.exit(EXIT_OK);
    }

    if (parsed.values.base === undefined) {
      throw new Error('--base <git-ref> is required.');
    }

    return parsed as typeof parsed & { values: { base: string } };
  } catch (error) {
    return fail(`${(error as Error).message}\n\n${USAGE}`);
  }
}

function readBaseSnapshots(): Snapshot[] {
  let listing: string;

  try {
    listing = git(['ls-tree', '-r', '-z', '--full-name', `${options.base}^{tree}`, '--', baseDir]);
  } catch {
    return fail(`'${options.base}' is not a commit in this repository. Pass an existing ref, e.g. origin/main.`);
  }

  // Record shape: "<mode> SP <type> SP <object-id> TAB <path>".
  const snapshots = listing
    .split('\0')
    .map(record => record.match(/^\d+ blob ([0-9a-f]+)\t(.*\.png)$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map(match => ({ path: path.posix.relative(baseDir, match[2]), hash: match[1] }));

  if (snapshots.length === 0) {
    fail(`no .png files found under '${baseDir}' at '${options.base}'. Check --base and --base-dir.`);
  }

  return snapshots;
}

function readHeadSnapshots(): Snapshot[] {
  if (!fs.existsSync(headRoot) || !fs.statSync(headRoot).isDirectory()) {
    fail(`'${options['head-dir']}' is not a directory. Check --head-dir.`);
  }

  const paths = fs
    .readdirSync(headRoot, { recursive: true, encoding: 'utf8' })
    .map(toPosixPath)
    .filter(relativePath => relativePath.endsWith('.png'))
    .sort();

  if (paths.length === 0) {
    fail(`no .png files found under '${options['head-dir']}'. Check --head-dir.`);
  }

  // `git hash-object --stdin-paths` produces the same blob id `git ls-tree` reports for identical content.
  // It reads newline-separated paths; no snapshot path contains a newline.
  const hashes = git(
    ['hash-object', '--stdin-paths'],
    paths.map(relativePath => path.join(headRoot, relativePath)).join('\n') + '\n'
  )
    .split('\n')
    .filter(line => line !== '');

  if (hashes.length !== paths.length) {
    fail(`git hash-object returned ${hashes.length} hashes for ${paths.length} files.`);
  }

  return paths.map((relativePath, index) => ({ path: relativePath, hash: hashes[index] }));
}

function report(): number {
  // Pass 1: bytes. Each head snapshot stands in for at most one base snapshot, and a snapshot that kept its
  // path claims its own file first, since identical renders (e.g. across densities) share their bytes.
  const headByHash = new Map<string, Snapshot[]>();
  head.forEach(snapshot => headByHash.set(snapshot.hash, [...(headByHash.get(snapshot.hash) ?? []), snapshot]));

  const claim = (candidates: Snapshot[], candidate: Snapshot) => candidates.splice(candidates.indexOf(candidate), 1);
  const unchanged = new Set<string>();
  const moved: string[] = [];
  const bytesGone: Snapshot[] = [];

  base.forEach(snapshot => {
    const candidates = headByHash.get(snapshot.hash) ?? [];
    const own = candidates.find(candidate => candidate.path === snapshot.path);

    if (own !== undefined) {
      claim(candidates, own);
      unchanged.add(snapshot.path);
    }
  });

  base
    .filter(snapshot => !unchanged.has(snapshot.path))
    .forEach(snapshot => {
      const candidates = headByHash.get(snapshot.hash) ?? [];

      if (candidates.length === 0) {
        bytesGone.push(snapshot);
      } else {
        moved.push(`${snapshot.path} -> ${candidates[0].path}`);
        claim(candidates, candidates[0]);
      }
    });

  // Pass 2: pixels, for the base snapshots whose bytes are gone, against the head snapshots left over. Only a
  // head snapshot of the same browser, theme, density and image size can be a successor, so the leftovers are
  // bucketed by exactly that, once.
  const leftover = new Set<Snapshot>();
  const buckets = new Map<string, Snapshot[]>();
  headByHash.forEach(snapshots => snapshots.forEach(snapshot => leftover.add(snapshot)));
  leftover.forEach(snapshot => {
    const key = bucketKey(snapshot.path, readHeadSnapshot(snapshot));
    buckets.set(key, [...(buckets.get(key) ?? []), snapshot]);
  });

  const reencoded: string[] = [];
  const lost: string[] = [];

  // Base blobs are read in batches: all of them at once can run to hundreds of megabytes.
  for (let start = 0; start < bytesGone.length; start += BLOB_BATCH_SIZE) {
    const batch = bytesGone.slice(start, start + BLOB_BATCH_SIZE);
    const baseImages = readBlobs(batch.map(snapshot => snapshot.hash));

    batch.forEach(snapshot => {
      const baseImage = baseImages.get(snapshot.hash) as Buffer;
      const bucket = buckets.get(bucketKey(snapshot.path, baseImage)) ?? [];
      const match = likeliestFirst(snapshot, bucket).find(
        candidate => comparePng(readHeadSnapshot(candidate), baseImage, { threshold }) === null
      );

      if (match === undefined) {
        lost.push(snapshot.path);
      } else {
        reencoded.push(`${snapshot.path} -> ${match.path}`);
        bucket.splice(bucket.indexOf(match), 1);
        leftover.delete(match);
      }
    });
  }

  const added: string[] = [];
  leftover.forEach(snapshot => added.push(snapshot.path));
  added.sort();

  console.log(
    `Snapshot parity: ${baseDir} @ ${options.base} (${base.length} files) vs ${options['head-dir']} (${head.length} files)`
  );
  console.log('');
  printGroup('same bytes, same path', unchanged.size);
  printGroup('same bytes, new path', moved, options.verbose);
  printGroup(`same pixels (threshold ${threshold}), new bytes`, reencoded, options.verbose);
  printGroup('NEW: no counterpart in the base (a human must confirm these are new stories)', added, true);
  printGroup('LOST: no byte or pixel counterpart in the working tree', lost, true);

  if (lost.length > 0) {
    console.log(`RESULT: FAIL - ${lost.length} base snapshot(s) were lost or changed. Investigate before merging.`);
    return EXIT_LOST;
  }

  console.log('RESULT: PASS - every base snapshot survives, byte for byte or pixel for pixel.');
  return EXIT_OK;
}

/**
 * Snapshots that could be successors share this key: browser directory (when the snapshot root is above
 * it), theme and density, and image size.
 */
function bucketKey(snapshotPath: string, image: Buffer) {
  return `${snapshotPath.match(BROWSER_DIR)?.[0]} ${snapshotPath.match(CELL_SUFFIX)?.[0]} ${pngSize(image)}`;
}

/**
 * The best {@link MAX_PIXEL_CANDIDATES} of a bucket, ranked by how many path words they share with the base
 * snapshot (`accordion`, `multi`, `panel`, ...) so the true successor is compared first. Comparing every
 * same-sized PNG for every lost snapshot would be quadratic in decodes; a successor ranked lower than that is
 * reported LOST, never silently passed.
 */
function likeliestFirst(snapshot: Snapshot, bucket: Snapshot[]) {
  const words = new Set(wordsOf(snapshot.path));
  const rank = (candidate: Snapshot) =>
    candidate.path === snapshot.path ? Infinity : wordsOf(candidate.path).filter(word => words.has(word)).length;

  return bucket
    .map(candidate => ({ candidate, rank: rank(candidate) }))
    .sort((left, right) => right.rank - left.rank)
    .slice(0, MAX_PIXEL_CANDIDATES)
    .map(ranked => ranked.candidate);
}

/** "chromium/components/forms/datepicker/datepicker-opened--month-view-light-default.png" -> its path words. */
function wordsOf(snapshotPath: string) {
  return snapshotPath.replace(BROWSER_DIR, '').replace(CELL_SUFFIX, '').split(/[/-]+/);
}

/** Reads many blobs through one `git cat-file --batch`, rather than one git process per blob. */
function readBlobs(hashes: string[]) {
  const blobs = new Map<string, Buffer>();
  const output = git(['cat-file', '--batch'], hashes.join('\n') + '\n', 'buffer');
  let offset = 0;

  // Each object is "<object-id> SP <type> SP <size> LF <contents> LF".
  while (offset < output.length) {
    const headerEnd = output.indexOf(0x0a, offset);
    const [hash, , size] = output.toString('utf8', offset, headerEnd).split(' ');
    const start = headerEnd + 1;
    blobs.set(hash, output.subarray(start, start + Number(size)));
    offset = start + Number(size) + 1;
  }

  return blobs;
}

function readHeadSnapshot(snapshot: Snapshot) {
  return fs.readFileSync(path.join(headRoot, snapshot.path));
}

/** Width x height from the IHDR chunk, which the PNG format requires to come first. */
function pngSize(image: Buffer) {
  return `${image.readUInt32BE(16)}x${image.readUInt32BE(20)}`;
}

function printGroup(label: string, entries: number | string[], listEntries = false) {
  const count = typeof entries === 'number' ? entries : entries.length;
  console.log(`  ${label}: ${count}`);

  if (listEntries && typeof entries !== 'number') {
    entries.forEach(entry => console.log(`      ${entry}`));
  }
}

function toPosixPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/\/+$/, '');
}

function git(args: string[], input?: string): string;
function git(args: string[], input: string, encoding: 'buffer'): Buffer;
function git(args: string[], input?: string, encoding: 'utf8' | 'buffer' = 'utf8'): string | Buffer {
  return execFileSync('git', args, {
    cwd: repositoryRoot,
    encoding: encoding === 'buffer' ? null : 'utf8',
    input,
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  }) as string | Buffer;
}

function fail(message: string): never {
  process.stderr.write(`verify-snapshot-parity: ${message}\n`);
  process.exit(EXIT_USAGE);
}
