/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const MESSAGE =
  'No `@Component` in a story file. Move the component into a sibling `*.storybook.component.ts` and import it.';

function isComponentDecorator(node) {
  const expression = node.expression;

  if (expression.type === 'CallExpression') {
    return expression.callee.type === 'Identifier' && expression.callee.name === 'Component';
  }

  return expression.type === 'Identifier' && expression.name === 'Component';
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `@Component` decorators inside Storybook story files',
    },
  },
  create: context => {
    return {
      Decorator: node => {
        if (isComponentDecorator(node)) {
          context.report({ node: node, message: MESSAGE });
        }
      },
    };
  },
};
