/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const MESSAGE =
  'No inline `<style>` in a story template. Use `withStyles(css)` from `@storybook-helpers/decorators`, or `styles:` on a `*.storybook.component.ts`.';

function isTemplateProperty(node) {
  if (node.computed) {
    return false;
  }

  if (node.key.type === 'Identifier') {
    return node.key.name === 'template';
  }

  return node.key.type === 'Literal' && node.key.value === 'template';
}

function containsStyleTag(node) {
  if (node.type === 'TemplateLiteral') {
    return node.quasis.some(quasi => quasi.value.raw.includes('<style'));
  }

  return node.type === 'Literal' && typeof node.value === 'string' && node.value.includes('<style');
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow inline `<style>` blocks in Storybook story templates',
    },
  },
  create: context => {
    return {
      Property: node => {
        if (isTemplateProperty(node) && containsStyleTag(node.value)) {
          context.report({ node: node.value, message: MESSAGE });
        }
      },
    };
  },
};
