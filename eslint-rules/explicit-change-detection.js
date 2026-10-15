/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      missing: 'Declare changeDetection explicitly so library behavior does not depend on consumer defaults.',
    },
  },
  create(context) {
    const components = new Set();
    const namespaces = new Set();
    return {
      Program(node) {
        for (const statement of node.body) {
          if (statement.type !== 'ImportDeclaration' || statement.source.value !== '@angular/core') {
            continue;
          }
          for (const specifier of statement.specifiers) {
            if (specifier.type === 'ImportNamespaceSpecifier') {
              namespaces.add(specifier.local.name);
            }
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'Component') {
              components.add(specifier.local.name);
            }
          }
        }
      },
      Decorator(node) {
        const call = node.expression;
        if (call.type !== 'CallExpression') {
          return;
        }
        const callee = call.callee;
        const isComponent =
          (callee.type === 'Identifier' && components.has(callee.name)) ||
          (callee.type === 'MemberExpression' &&
            namespaces.has(callee.object.name) &&
            callee.property.name === 'Component');
        if (!isComponent) {
          return;
        }
        const metadata = call.arguments[0];
        if (
          metadata?.type !== 'ObjectExpression' ||
          !metadata.properties.some(
            property => property.type === 'Property' && (property.key.name || property.key.value) === 'changeDetection'
          )
        ) {
          context.report({ node, messageId: 'missing' });
        }
      },
    };
  },
};
