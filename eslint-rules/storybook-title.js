/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const path = require('path');

const TITLE_OVERRIDES = require('./storybook-title-overrides');

const STORIES_ROOT_MARKER = '.storybook/stories/';
const STORY_SUFFIX = '.stories.ts';

// Words that stay lower-case inside a title unless they open it.
const LOWERCASE_WORDS = new Set(['and', 'or', 'in', 'on', 'of', 'with', 'to', 'a', 'an', 'the']);

/** Title-Cases one kebab-case path or file segment: `stack-view` -> `Stack View`. */
function titleCase(segment) {
  return segment
    .split('-')
    .filter(word => word.length > 0)
    .map((word, index) => {
      if (index > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

/**
 * Splits an absolute story file path into the parts the derivation needs, or returns undefined when
 * the file is not a story file under a `.storybook/stories/` tree (a RuleTester snippet, say).
 */
function locate(filename) {
  if (typeof filename !== 'string' || !filename.endsWith(STORY_SUFFIX)) {
    return undefined;
  }

  const posix = toPosix(filename);
  const markerIndex = posix.lastIndexOf(STORIES_ROOT_MARKER);

  if (markerIndex === -1) {
    return undefined;
  }

  const storiesRoot = posix.slice(0, markerIndex + STORIES_ROOT_MARKER.length);
  const relativePath = posix.slice(markerIndex + STORIES_ROOT_MARKER.length);
  const relativeDirectory = path.posix.dirname(relativePath);

  if (relativeDirectory === '.' || relativeDirectory === '') {
    // A story file sitting directly in `.storybook/stories/` has no directory to name it.
    return undefined;
  }

  return {
    storiesRoot: storiesRoot,
    relativePath: relativePath,
    relativeDirectory: relativeDirectory,
    directory: path.posix.dirname(posix),
    base: path.posix.basename(relativePath, STORY_SUFFIX),
    directoryName: path.posix.basename(relativeDirectory),
  };
}

function storyFilesIn(directory) {
  try {
    return fs
      .readdirSync(directory)
      .filter(name => name.endsWith(STORY_SUFFIX))
      .sort();
  } catch {
    return [];
  }
}

/**
 * The canonical title for a story file.
 *
 * A directory with a single story file, or whose story file repeats the directory name, is that
 * directory's *primary* file and takes the directory's own title. Every other file appends its own
 * leaf — with a redundant `<directory>-` prefix stripped — so that sibling files never merge into
 * one title. Merged titles share one story-id namespace, which silently drops stories whose export
 * names collide, so each file keeping its own title is load bearing, not cosmetic.
 */
function canonicalTitle(located) {
  const fileOverride = TITLE_OVERRIDES[located.relativePath];

  if (typeof fileOverride === 'string') {
    return fileOverride;
  }

  const directoryOverride = TITLE_OVERRIDES[located.relativeDirectory];
  const directoryTitle =
    typeof directoryOverride === 'string'
      ? directoryOverride
      : located.relativeDirectory.split('/').map(titleCase).join('/');

  const siblings = storyFilesIn(located.directory);
  const isPrimary = siblings.length <= 1 || located.base === located.directoryName;

  if (isPrimary) {
    return directoryTitle;
  }

  const prefix = `${located.directoryName}-`;
  const leaf = located.base.startsWith(prefix) ? located.base.slice(prefix.length) : located.base;

  return `${directoryTitle}/${titleCase(leaf)}`;
}

/** Every story file under the same `.storybook/stories/` root, as absolute posix paths. */
function allStoryFiles(storiesRoot) {
  const found = [];

  const walk = directory => {
    let entries;

    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries.sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const full = path.posix.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith(STORY_SUFFIX)) {
        found.push(full);
      }
    }
  };

  walk(storiesRoot.replace(/\/$/, ''));

  return found;
}

/** Story export names of a story file, read straight off the source. */
function exportedStoryNames(filePath) {
  let source;

  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }

  const names = [];
  const pattern = /^export\s+const\s+([A-Za-z_$][\w$]*)/gm;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    names.push(match[1]);
  }

  return names;
}

/**
 * Files that resolve to `title` other than `self`. Recomputed per lint run and cached per stories
 * root, because both cross-file checks below need it.
 */
const siblingTitleCache = new Map();

function filesSharingTitle(storiesRoot, title, self) {
  let byTitle = siblingTitleCache.get(storiesRoot);

  if (byTitle === undefined) {
    byTitle = new Map();

    for (const file of allStoryFiles(storiesRoot)) {
      const located = locate(file);

      if (located === undefined) {
        continue;
      }

      const fileTitle = canonicalTitle(located);
      const bucket = byTitle.get(fileTitle);

      if (bucket === undefined) {
        byTitle.set(fileTitle, [file]);
      } else {
        bucket.push(file);
      }
    }

    siblingTitleCache.set(storiesRoot, byTitle);
  }

  return (byTitle.get(title) ?? []).filter(file => file !== self);
}

/** The story meta object: `const meta = {…}` (the canon) or a bare `export default {…}`. */
function isMetaObject(node) {
  const parent = node.parent;

  if (parent === undefined || parent === null) {
    return false;
  }

  if (parent.type === 'ExportDefaultDeclaration') {
    return true;
  }

  return (
    parent.type === 'VariableDeclarator' &&
    parent.init === node &&
    parent.id.type === 'Identifier' &&
    parent.id.name === 'meta'
  );
}

function quote(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        "Require a Storybook story `title` that matches the title derived from the story file's path. Titles are derived, never typed: `npx eslint --fix` writes them. The single escape hatch is eslint-rules/storybook-title-overrides.js.",
    },
  },
  create: context => {
    const filename = context.filename ?? context.getFilename();
    const located = locate(filename);

    if (located === undefined) {
      return {};
    }

    const expected = canonicalTitle(located);
    const absolute = toPosix(path.resolve(filename));
    const shared = filesSharingTitle(located.storiesRoot, expected, absolute);
    let sawTitle = false;

    return {
      "ObjectExpression > Property[key.name='title']": node => {
        if (!isMetaObject(node.parent)) {
          return;
        }

        sawTitle = true;

        if (node.value.type !== 'Literal' || typeof node.value.value !== 'string') {
          context.report({
            node: node.value,
            message: `Story title must be the literal string derived from the file path: ${quote(expected)}.`,
          });

          return;
        }

        if (node.value.value === expected) {
          return;
        }

        context.report({
          node: node.value,
          message: `Story title must be derived from the file path. Expected ${quote(
            expected
          )}, found ${quote(node.value.value)}. Run \`npx eslint --fix\` — never type a title by hand.`,
          fix: fixer => fixer.replaceText(node.value, quote(expected)),
        });
      },
      'Program:exit': node => {
        if (!sawTitle) {
          context.report({
            node: node,
            message: `Story meta must declare a title. The title derived from this file's path is ${quote(expected)}.`,
          });
        }

        // Two story files resolving to one title share a story-id namespace, so any story export
        // name they have in common is silently dropped by Storybook. Both halves of that hazard are
        // reported here: the collision itself, and — belt and braces — the colliding export names.
        if (shared.length === 0) {
          return;
        }

        const relative = others => others.map(file => file.slice(located.storiesRoot.length)).join(', ');

        context.report({
          node: node,
          message: `Story title ${quote(expected)} is also the derived title of ${relative(
            shared
          )}. Files sharing a title share one story-id namespace. Rename one of the files so their derived titles differ.`,
        });

        const ownNames = new Set(exportedStoryNames(absolute));

        for (const other of shared) {
          const clashing = exportedStoryNames(other).filter(name => ownNames.has(name));

          if (clashing.length > 0) {
            context.report({
              node: node,
              message: `Story export ${clashing.join(', ')} is declared in both this file and ${relative([
                other,
              ])}, which share the derived title ${quote(
                expected
              )}. Duplicate export names under one title overwrite each other and the story is lost.`,
            });
          }
        }
      },
    };
  },
};
