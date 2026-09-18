/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const MULTIPLE_RENDERS_MESSAGE =
  'Only one `render` is allowed per story file, and it belongs in `meta`. Hoist it, or keep the outlier and justify it with a `// render-override: <reason>` comment.';
const MISSING_OVERRIDE_COMMENT_MESSAGE =
  'A story-level `render` must be preceded by a `// render-override: <reason>` comment on the line above.';

const OVERRIDE_COMMENT_PATTERN = /^\s*render-override:\s*\S/;

function isRenderProperty(node) {
  if (node.computed || node.key === undefined) {
    return false;
  }

  if (node.key.type === 'Identifier') {
    return node.key.name === 'render';
  }

  return node.key.type === 'Literal' && node.key.value === 'render';
}

function isStoryLevel(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (current.type === 'ExportDefaultDeclaration') {
      return false;
    }

    if (current.type === 'ExportNamedDeclaration') {
      return true;
    }
  }

  return false;
}

function hasOverrideComment(sourceCode, node) {
  const comments = sourceCode.getCommentsBefore(node);
  const comment = comments[comments.length - 1];

  return Boolean(
    comment &&
    comment.type === 'Line' &&
    OVERRIDE_COMMENT_PATTERN.test(comment.value) &&
    comment.loc.end.line === node.loc.start.line - 1
  );
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require exactly one `render` per story file, declared in `meta`. Any further `render`, and any story-level `render`, must be justified with a `// render-override: <reason>` comment on the line above.',
    },
  },
  create: context => {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const renderProperties = [];

    return {
      Property: node => {
        if (isRenderProperty(node)) {
          renderProperties.push(node);
        }
      },
      'Program:exit': () => {
        renderProperties.forEach((node, index) => {
          if (hasOverrideComment(sourceCode, node)) {
            return;
          }

          if (index > 0) {
            context.report({ node: node.key, message: MULTIPLE_RENDERS_MESSAGE });
          } else if (isStoryLevel(node)) {
            context.report({ node: node.key, message: MISSING_OVERRIDE_COMMENT_MESSAGE });
          }
        });

        renderProperties.length = 0;
      },
    };
  },
};
