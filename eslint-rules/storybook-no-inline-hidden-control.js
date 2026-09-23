/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const MESSAGE =
  "Don't hand-write `{ control: { disable: true }, table: { disable: true } }`. Use `...hideControls('<argName>')` from `@storybook-helpers/arg-types`.";

function propertyName(node) {
  if (node.type !== 'Property' || node.computed) {
    return undefined;
  }

  if (node.key.type === 'Identifier') {
    return node.key.name;
  }

  return node.key.type === 'Literal' && typeof node.key.value === 'string' ? node.key.value : undefined;
}

function isDisableTrueObject(node) {
  return (
    node !== undefined &&
    node.type === 'ObjectExpression' &&
    node.properties.length === 1 &&
    propertyName(node.properties[0]) === 'disable' &&
    node.properties[0].value.type === 'Literal' &&
    node.properties[0].value.value === true
  );
}

function isHiddenControlObject(node) {
  if (node.properties.length !== 2) {
    return false;
  }

  const byName = {};

  for (const property of node.properties) {
    const name = propertyName(property);

    if (name === undefined) {
      return false;
    }

    byName[name] = property.value;
  }

  return isDisableTrueObject(byName.control) && isDisableTrueObject(byName.table);
}

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        "Disallow hand-written `{ control: { disable: true }, table: { disable: true } }` argTypes entries in favour of `hideControls()`. The fix rewrites the argTypes entry only — add `import { hideControls } from '@storybook-helpers/arg-types';` by hand.",
    },
  },
  create: context => {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      ObjectExpression: node => {
        if (!isHiddenControlObject(node)) {
          return;
        }

        const argProperty = node.parent;
        const argName = argProperty !== undefined && argProperty.value === node ? propertyName(argProperty) : undefined;
        const fixable =
          argName !== undefined &&
          argProperty.parent.type === 'ObjectExpression' &&
          sourceCode.getCommentsInside(argProperty).length === 0;

        context.report({
          node: node,
          message: MESSAGE,
          fix: fixable
            ? fixer =>
                fixer.replaceText(
                  argProperty,
                  `...hideControls('${argName.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')`
                )
            : undefined,
        });
      },
    };
  },
};
