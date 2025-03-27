/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: "Disallow using 'this' in constructors for parameter properties",
    },
  },
  create: context => {
    let parameterPropertyNames;

    return {
      "MethodDefinition[kind='constructor']": node => {
        parameterPropertyNames = node.value.params
          .filter(param => param.type === 'TSParameterProperty')
          .map(param => param.parameter.name);
      },
      "MethodDefinition[kind='constructor'] MemberExpression > ThisExpression": node => {
        const memberName = node.parent.property.name;

        if (parameterPropertyNames.includes(memberName)) {
          context.report({
            node: node,
            message: "Don't use 'this' in constructors for parameter properties.",
            fix: fixer => fixer.replaceText(node.parent, memberName),
          });
        }
      },
    };
  },
};
