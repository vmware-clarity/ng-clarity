/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as csso from 'csso';
import * as fs from 'fs';
import * as ts from 'typescript';

import { Token } from './token-utils';
import { baseTheme } from './tokens';

const tokens: Token[] = Object.entries(flattenTokens(baseTheme)).map(token => token[1]);
const experimental = `This token format is currently experimental and may change in the future`;

fs.mkdirSync('./dist/@cds/core/styles/', { recursive: true });
fs.mkdirSync('./dist/@cds/core/tokens/', { recursive: true });
fs.mkdirSync('./dist/@cds/core/styles/tokens/generated', { recursive: true });

// Public API Tokens
buildCSSTokens('./dist/@cds/core/styles/module.tokens.css');
buildJSONTokens('./dist/@cds/core/tokens/tokens.json');
buildJSTokens('./dist/@cds/core/tokens/tokens.ts');
buildSassTokens('./dist/@cds/core/tokens/tokens.scss');

// Internal API Tokens for custom elements with fallback values
buildInternalSassTokens('./dist/@cds/core/styles/tokens/generated/_index.scss');

function buildJSTokens(path) {
  fs.writeFileSync(
    path,
    `// ${experimental}\n${tokens
      .map(t => `export const ${t.name} = 'var(--cds-${camelCaseToKebab(t.name)})';`)
      .join('\n')}`
  );

  const options = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
  };
  ts.createProgram([path], options).emit();
  fs.renameSync(path, path.replace('.ts', '.js'));
}

function buildJSONTokens(path) {
  fs.writeFileSync(path, JSON.stringify(flattenTokens(baseTheme), null, 2));
}

function buildSassTokens(path) {
  const values = tokens
    .map(token => `${tokenToSass(token)}\n`)
    .join('')
    .trim();
  fs.writeFileSync(path, `// ${experimental}\n${values}`);
}

function buildCSSTokens(path) {
  const cssTokens = `
:root {
${tokens.map(token => `  ${getTokenCSSName(token)}: ${convertCSSValue(token, false)};`).join('\n')}
}`;

  fs.writeFileSync(path, cssTokens);
  fs.writeFileSync(path.replace('.css', '.min.css'), csso.minify(cssTokens).css);
}

function buildInternalSassTokens(path) {
  const licenseHeader = fs.readFileSync('.license-header.js');
  fs.writeFileSync(
    path,
    `${licenseHeader}
// internal tokens used for custom elements, provides a fallback value if the global token fails to load
${tokens
  .map(token => `${tokenToSass(token, true)}\n`)
  .join('')
  .trim()}
`
  );
}

function tokenToSass(token: Token, fallback = false) {
  const propName = camelCaseToKebab(token.name);
  let fallbackValue = convertCSSValue(token);

  if (typeof token.value === 'number') {
    // fallback to using the global base as a divisor,
    //   which can be set even if global CSS isn't loaded
    // worse case scenario, use base 20, Clarity's default
    fallbackValue = `calc(${token.value} * (1rem / var(--cds-global-base, 20)))`;
  }

  if (token.config.raw) {
    fallbackValue = token.value;
  }

  const dynamicValue = `$cds-${propName}: var(${getTokenCSSName(token)}${
    fallback ? `, ${fallbackValue}` : ''
  }) !default;`;
  const staticValue =
    token.config.static || typeof token.value === 'number' ? `\n$cds-${propName}-static: ${token.value} !default;` : '';

  return `${dynamicValue}${staticValue}`;
}

function flattenTokens(theme: any) {
  function flatten(config: any, parent = ''): { [key: string]: Token } {
    return Object.entries(config)
      .map(([key, value]: [string, any]) => {
        if (typeof value === 'object' && !(value instanceof Token)) {
          return flatten(value, `${parent}${key[0].toUpperCase() + key.slice(1)}`);
        }

        value.name = `${parent[0].toLowerCase() + parent.slice(1)}${key[0].toUpperCase() + key.slice(1)}`
          .replace('aliases', 'alias')
          .replace('Value', '');
        return { [value.name]: value };
      })
      .reduce((prev, next) => ({ ...prev, ...next }), {});
  }

  return flatten(theme);
}

function convertCSSValue(token: Token, fallback = true) {
  let value = token.value;

  if (token.alias instanceof Token) {
    value = `var(--cds-${camelCaseToKebab(token.alias.name)}${
      fallback ? `, ${convertCSSValue(token.alias, fallback)}` : ''
    })`;
  } else if (token.config.raw) {
    value = token.value;
  } else if (token.config.scale) {
    value = `calc(${token.value} * var(--cds-${camelCaseToKebab(token.config.scale.name)}))`;
  } else if (typeof token.value === 'number') {
    value = `calc(${token.value} * (1rem / var(--cds-global-base)))`;
  } else if (isHSL(token.value)) {
    value = `hsl(${token.value[0]}, ${token.value[1]}%, ${token.value[2]}%)`;
  }

  return value;
}

function getTokenCSSName(token: Token) {
  return `--cds-${camelCaseToKebab(token.name)}`;
}

function camelCaseToKebab(val: string) {
  return val.replace(/([A-Z]|\d+)/g, '-$1').toLocaleLowerCase();
}

function isHSL(value: any) {
  return Array.isArray(value) && value.length === 3;
}
