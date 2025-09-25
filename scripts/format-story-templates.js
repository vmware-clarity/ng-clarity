/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const glob = require('glob');
const prettier = require('prettier');
const ts = require('typescript');

const prettierConfig = require('../.prettierrc.js');

const [, , ...args] = process.argv;
const fix = args.includes('--fix');
const filePaths = args.filter(arg => arg !== '--fix');

let exitCode = 0;

async function main() {
  const storyTsFilePaths = filePaths.length
    ? filePaths.filter(filePath => filePath.endsWith('.stories.ts'))
    : glob.sync('.storybook/**/*.stories.ts');
  for (const storyTsFilePath of storyTsFilePaths) {
    const storyTsCode = fs.readFileSync(storyTsFilePath).toString();
    const formattedStoryTsCode = await formatStoryTsCode(storyTsCode);

    if (formattedStoryTsCode !== storyTsCode) {
      if (fix) {
        fs.writeFileSync(storyTsFilePath, formattedStoryTsCode);
      } else {
        console.error(storyTsFilePath);
        exitCode = 1;
      }
    }
  }
  process.exit(exitCode);
}

async function formatStoryTsCode(storyTsCode) {
  const storyTemplates = findStoryTemplates(storyTsCode);

  let formattedStoryTsCode = storyTsCode;

  for (const { storyTemplate, expressions, indentLevel } of storyTemplates) {
    const indent = ' '.repeat(indentLevel + 2);

    const formattedStoryTemplate = await formatStoryTemplate(storyTemplate, expressions, indentLevel);

    const indentedStoryTemplate = formattedStoryTemplate
      .trim()
      .split('\n')
      .map(line => (line ? `${indent}${line}` : ''))
      .join('\n');

    const replacementStoryTemplate = `\n${indentedStoryTemplate}\n${' '.repeat(indentLevel)}`;

    if (formattedStoryTemplate) {
      formattedStoryTsCode = formattedStoryTsCode.replace(storyTemplate, replacementStoryTemplate);
    } else {
      throw new Error(`Unable to format: ${storyTemplate}`);
    }
  }
  return formattedStoryTsCode;
}

function findStoryTemplates(storyTsCode) {
  const storyTemplates = [];
  const sourceFile = ts.createSourceFile('story.ts', storyTsCode, ts.ScriptKind.TS, /* setParentNodes */ true);

  sourceFile.forEachChild(function visit(node) {
    if (
      (ts.isPropertyAssignment(node) || ts.isVariableDeclaration(node)) &&
      ts.isIdentifier(node.name) &&
      (node.name.text === 'template' || node.name.text.endsWith('Template')) &&
      ts.isTemplateLiteral(node.initializer)
    ) {
      const length = node.initializer.end - node.initializer.getStart();

      storyTemplates.push({
        storyTemplate: node.initializer.getText().substring(1, length - 1), // remove backticks
        expressions: getExpressions(node),
        indentLevel: node.getLeadingTriviaWidth() - 1, // subtract new line
      });
    } else {
      node.forEachChild(visit);
    }
  });

  return storyTemplates;
}

function getExpressions(node) {
  return ts.isTemplateExpression(node.initializer)
    ? node.initializer.templateSpans
        .filter(span => !ts.isTemplateHead(span) && !ts.isTemplateMiddle(span) && !ts.isTemplateTail(span))
        .map(span => `\${${span.expression.getFullText()}}`)
        .filter((span, index, self) => self.indexOf(span) === index) // unique
        .reduce((expressionMap, expression, index) => {
          let expressionKey = `expression_${index}`;
          while (expressionKey.length < expression.length) {
            expressionKey = `${expressionKey}_`;
          }

          expressionMap[expressionKey] = expression;
          return expressionMap;
        }, {})
    : {};
}

async function formatStoryTemplate(storyTemplate, expressions, indentLevel) {
  const storyTemplateWithExpressionPlaceholders = replaceExpressions(storyTemplate, expressions);

  const formattedStoryTemplate = await prettier.format(storyTemplateWithExpressionPlaceholders, {
    ...prettierConfig,
    printWidth: prettierConfig.printWidth - indentLevel,
    parser: 'angular',
    htmlWhitespaceSensitivity: 'ignore',
  });

  return replaceExpressionPlaceholders(formattedStoryTemplate, expressions);
}

function replaceExpressions(storyTemplate, expressions) {
  for (const [expressionPlaceholder, expression] of Object.entries(expressions)) {
    while (storyTemplate.includes(expression)) {
      storyTemplate = storyTemplate.replace(expression, expressionPlaceholder);
    }
  }

  return storyTemplate;
}

function replaceExpressionPlaceholders(storyTemplate, expressions) {
  for (const [expressionPlaceholder, expression] of Object.entries(expressions)) {
    while (storyTemplate.includes(expressionPlaceholder)) {
      storyTemplate = storyTemplate.replace(expressionPlaceholder, expression);
    }
  }

  return storyTemplate;
}

main();
