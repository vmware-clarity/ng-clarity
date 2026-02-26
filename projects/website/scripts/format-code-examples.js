/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ignore = require('ignore');
const prettier = require('prettier');
const ts = require('typescript');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const prettierConfig = require(path.resolve(PROJECT_ROOT, '../../.prettierrc.js'));

const fix = process.argv.includes('--fix');

const codeExampleIgnorePath = path.join(PROJECT_ROOT, '.codeexampleignore');
const ignoreList = fs.existsSync(codeExampleIgnorePath)
  ? ignore().add(fs.readFileSync(codeExampleIgnorePath).toString())
  : ignore();

async function main() {
  let exitCode = 0;

  for (const tsFilePath of glob.sync('src/**/*.ts', { cwd: PROJECT_ROOT }).map(f => path.join(PROJECT_ROOT, f))) {
    if (ignoreList.ignores(path.relative(PROJECT_ROOT, tsFilePath))) {
      continue;
    }

    const tsCode = fs.readFileSync(tsFilePath).toString();
    const formattedTsCode = await formatTsCode(tsFilePath, tsCode);

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
}

async function formatTsCode(tsFilePath, tsCode) {
  const codeExamples = findCodeExamples(tsFilePath, tsCode);

  let formattedTsCode = tsCode;

  for (const codeExample of codeExamples) {
    const formattedCodeExample = await formatCodeExample(codeExample);

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

async function formatCodeExample(codeExample) {
  for (const parser of guessParser(codeExample)) {
    try {
      return await prettier.format(codeExample, {
        ...prettierConfig,
        parser,
        printWidth: 104,
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

main();
