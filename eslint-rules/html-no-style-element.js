/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// The Angular template parser leaves <style> elements out of its AST, so they are found in the source text.
const STYLE_ELEMENT = /<style[\s>]/gi;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow <style> elements in HTML templates',
    },
    schema: [
      {
        type: 'string',
      },
    ],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const message = context.options[0] || 'Unexpected <style> element.';

    return {
      Program(node) {
        for (const match of sourceCode.text.matchAll(STYLE_ELEMENT)) {
          context.report({ node, loc: sourceCode.getLocFromIndex(match.index), message });
        }
      },
    };
  },
};
