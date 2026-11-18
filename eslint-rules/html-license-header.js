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
    const text = context.sourceCode.text;
    const newlineChar = (text.match(/\r\n|[\r\n]/) || ['\n'])[0];
    const licenseHeader = normalizeNewlines(readLicenseFile(context.options[0]), newlineChar);

    // Works on the source text, so that it does not depend on the HTML parser.
    return {
      Program(node) {
        if (text.startsWith(licenseHeader)) {
          const newlinesAfter = text.slice(licenseHeader.length).match(/^\s*/)[0].match(LINEBREAK_MATCHER) || [];
          if (newlinesAfter.length > 2) {
            context.report({
              node,
              loc: { line: licenseHeader.split(newlineChar).length, column: 0 },
              message: 'Superfluous new lines after license header',
              fix(fixer) {
                const end = licenseHeader.length + text.slice(licenseHeader.length).match(/^\s*/)[0].length;
                return fixer.replaceTextRange([licenseHeader.length, end], newlineChar + newlineChar);
              },
            });
          }
          return;
        }

        const firstComment = text.match(/^<!--[\s\S]*?-->/);
        if (firstComment && isLicenseComment(firstComment[0])) {
          context.report({
            node,
            loc: { line: 1, column: 0 },
            message: 'Invalid license header',
            fix(fixer) {
              return fixer.replaceTextRange([0, firstComment[0].length], licenseHeader);
            },
          });
          return;
        }

        context.report({
          node,
          loc: { line: 1, column: 0 },
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
  },
};
