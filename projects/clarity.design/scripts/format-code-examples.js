/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const glob = require('glob');
const ignore = require('ignore');
const prettier = require('prettier');
const ts = require('typescript');

const prettierConfig = require('../.prettierrc.js');

let exitCode = 0;
const fix = process.argv.includes('--fix');

const ignoreList = ignore().add(fs.readFileSync('.codeexampleignore').toString());

for (const tsFilePath of glob.sync('src/**/*.ts')) {
  if (ignoreList.ignores(tsFilePath)) {
    continue;
  }

  const tsCode = fs.readFileSync(tsFilePath).toString();
  const formattedTsCode = formatTsCode(tsFilePath, tsCode);

  if (formattedTsCode !== tsCode) {
    if (fix) {
      fs.writeFileSync(tsFilePath, formattedTsCode);
    } else {
      console.error(tsFilePath);
      exitCode = 1;
    }
  }
}

process.exit(exitCode);

function formatTsCode(tsFilePath, tsCode) {
  const codeExamples = findCodeExamples(tsFilePath, tsCode);

  let formattedTsCode = tsCode;

  for (const codeExample of codeExamples) {
    const formattedCodeExample = formatCodeExample(codeExample);

    if (formattedCodeExample) {
      const trimmedFormattedCodeExample = formattedCodeExample.trim();
      const formattedCodeExampleIsOneLine = !trimmedFormattedCodeExample.includes('\n');

      const replacementCodeExample = formattedCodeExampleIsOneLine
        ? trimmedFormattedCodeExample
        : `\n${formattedCodeExample}`;

      formattedTsCode = formattedTsCode.replace(codeExample, replacementCodeExample);
    } else {
      throw new Error(`Unable to format: ${codeExample}`);
    }
  }
  return formattedTsCode;
}

function findCodeExamples(tsFilePath, tsCode) {
  const codeExamples = [];
  const sourceFile = ts.createSourceFile(tsFilePath, tsCode, ts.ScriptKind.TS, /* setParentNodes */ true);

  sourceFile.forEachChild(function visit(node) {
    if (
      ts.isTemplateLiteral(node) &&
      ts.isVariableDeclaration(node.parent) &&
      // The following conditions skip any template literal variables that are inside classes, methods, functions, etc.
      ts.isVariableDeclarationList(node.parent.parent) &&
      ts.isVariableStatement(node.parent.parent.parent) &&
      ts.isSourceFile(node.parent.parent.parent.parent)
    ) {
      codeExamples.push(node.text);
    }

    node.forEachChild(visit);
  });

  return codeExamples;
}

function formatCodeExample(codeExample) {
  for (const parser of guessParser(codeExample)) {
    try {
      return prettier.format(codeExample, {
        ...prettierConfig,
        parser,
        printWidth: 104, // any longer will cause horizontal scrolling at full width
        htmlWhitespaceSensitivity: 'ignore',
      });
    } catch {
      // next parser
    }
  }
}

function guessParser(codeExample) {
  const trimmedCodeExample = codeExample.trim();

  if (trimmedCodeExample.startsWith('<')) {
    return ['angular'];
  } else if (trimmedCodeExample.startsWith('{') || trimmedCodeExample.startsWith('[')) {
    return ['json'];
  } else {
    return ['typescript', 'css', 'angular', 'json'];
  }
}
