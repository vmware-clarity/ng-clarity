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

/**
 * The initializer of the same-file `const` that `identifier` names, or undefined when it names
 * anything else (a `let`, a parameter, an import, an unresolved global). Imports are not followed.
 */
function constInitializer(sourceCode, identifier) {
  for (let scope = sourceCode.getScope(identifier); scope; scope = scope.upper) {
    const variable = scope.set.get(identifier.name);

    if (variable === undefined) {
      continue;
    }

    const definition = variable.defs[variable.defs.length - 1];

    if (
      definition === undefined ||
      definition.type !== 'Variable' ||
      definition.parent.kind !== 'const' ||
      definition.node.id.type !== 'Identifier'
    ) {
      return undefined;
    }

    return definition.node.init ?? undefined;
  }

  return undefined;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow inline `<style>` blocks in Storybook story templates',
    },
  },
  create: context => {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      Property: node => {
        if (!isTemplateProperty(node)) {
          return;
        }

        // `template: tpl` is inspected through `tpl`'s same-file `const` initializer.
        const template = node.value.type === 'Identifier' ? constInitializer(sourceCode, node.value) : node.value;

        if (template !== undefined && containsStyleTag(template)) {
          context.report({ node: node.value, message: MESSAGE });
        }
      },
    };
  },
};
