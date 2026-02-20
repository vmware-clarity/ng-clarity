/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');

const LINEBREAK_MATCHER = /\r\n|[\r\n\u2028\u2029]/gu;

function readLicenseFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch (e) {
    throw new Error(`Could not read license header from <${filePath}>`, { cause: e });
  }
}

function normalizeNewlines(text, newlineChar) {
  return text.replace(LINEBREAK_MATCHER, newlineChar);
}

module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
    docs: {
      description: 'Validate the presence of a license header comment in HTML files',
    },
    schema: [
      {
        type: 'string',
      },
    ],
  },
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const text = sourceCode.getText();
    const newlineChar = (text.match(/\r\n|[\r\n]/) || ['\n'])[0];

    const rawHeader = readLicenseFile(context.options[0]);
    const licenseHeader = normalizeNewlines(rawHeader, newlineChar);

    return {
      Document(documentNode) {
        const firstChild = documentNode.children[0];

        if (firstChild && firstChild.type === 'Comment') {
          const commentText = sourceCode.getText(firstChild);

          if (commentText === licenseHeader) {
            checkSpacingAfter(firstChild, documentNode.children[1]);
            return;
          }

          if (isLicenseComment(firstChild.value.value)) {
            context.report({
              node: firstChild,
              message: 'Invalid license header',
              fix(fixer) {
                return fixer.replaceTextRange(firstChild.range, licenseHeader);
              },
            });
            return;
          }
        }

        const targetNode = firstChild || documentNode;
        context.report({
          node: targetNode,
          message: 'Missing license header',
          fix(fixer) {
            return fixer.insertTextBeforeRange([0, 0], licenseHeader + newlineChar);
          },
        });
      },
    };

    function isLicenseComment(value) {
      return /(Copyright|@license|SPDX-License-Identifier)\b/i.test(value);
    }

    function checkSpacingAfter(commentNode, nextSibling) {
      if (!nextSibling) {
        return;
      }

      const commentEndLine = commentNode.loc.end.line;
      const nextStartLine = nextSibling.loc.start.line;
      const gap = nextStartLine - commentEndLine;

      if (gap > 2) {
        context.report({
          node: commentNode,
          loc: commentNode.loc.end,
          message: 'Superfluous new lines after license header',
          fix(fixer) {
            return fixer.replaceTextRange([commentNode.range[1], nextSibling.range[0]], newlineChar);
          },
        });
      }
    }
  },
};
