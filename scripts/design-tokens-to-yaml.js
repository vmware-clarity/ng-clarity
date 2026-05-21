/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * @file design-tokens-to-yaml.js
 *
 * Purpose:
 * This script is an automated build tool designed to extract design tokens from
 * the ng-clarity repository's SCSS files and output them as a W3C Design Tokens
 * Community Group (DTCG) compliant YAML spec. It performs bottom-up dependency
 * analysis: parsing all component properties (_properties.*.scss) and
 * recursively resolving only the alias and global tokens actually utilized by
 * those components to maintain a lean, accurate manifest.
 *
 * Optional Parameter:
 *   --patch-md   If specified, the script will write/update the frontmatter
 *                block inside `DESIGN.md` rather than emitting the generated
 *                YAML to stdout.
 *
 * Usage:
 *   node scripts/design-tokens-to-yaml.js            # Outputs W3C DTCG YAML to stdout
 *   node scripts/design-tokens-to-yaml.js --patch-md # Patches DESIGN.md
 */

const fs = require('fs');
const path = require('path');

/**
 * Recursively find files matching a pattern
 */
function findFiles(dir, pattern, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFiles(filePath, pattern, fileList);
    } else if (pattern.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

/**
 * Clean and normalize SCSS values into DTCG format
 */
function cleanValue(val) {
  // Replace tokens.$cds-alias-* -> {alias.*}
  val = val.replace(/#\{tokens\.\$cds-alias-([a-zA-Z0-9-]+)\}/g, '{alias.$1}');
  // Replace tokens.$cds-global-* -> {global.*}
  val = val.replace(/#\{tokens\.\$cds-global-([a-zA-Z0-9-]+)\}/g, '{global.$1}');

  // Replace var(--cds-alias-*) -> {alias.*}
  val = val.replace(/var\(--cds-alias-([a-zA-Z0-9-]+)\)/g, '{alias.$1}');
  // Replace var(--cds-global-*) -> {global.*}
  val = val.replace(/var\(--cds-global-([a-zA-Z0-9-]+)\)/g, '{global.$1}');

  // Replace var(--cds-*) if it didn't match above
  val = val.replace(/var\(--cds-([a-zA-Z0-9-]+)\)/g, (match, p1) => {
    if (p1.startsWith('alias-')) {
      return `{alias.${p1.replace('alias-', '')}}`;
    }
    if (p1.startsWith('global-')) {
      return `{global.${p1.replace('global-', '')}}`;
    }
    return `{components.${p1}}`;
  });

  // Replace var(--clr-*) -> {components.*}
  val = val.replace(/var\(--clr-([a-zA-Z0-9-]+)\)/g, '{components.$1}');

  // Clean up any double alias.alias
  val = val.replace(/alias\.alias-/g, 'alias.');
  return val;
}

/**
 * Infer the W3C DTCG type based on the value or key path
 */
function inferType(val, keyPath = []) {
  const lowerVal = val.toLowerCase();
  const pathStr = keyPath.join('-').toLowerCase();

  if (
    lowerVal.includes('hsl') ||
    lowerVal.includes('rgb') ||
    lowerVal.includes('#') ||
    lowerVal === 'transparent' ||
    (lowerVal === 'none' && pathStr.includes('color'))
  ) {
    return 'color';
  } else if (
    lowerVal.includes('rem') ||
    lowerVal.includes('px') ||
    lowerVal.includes('em') ||
    lowerVal.includes('calc(') ||
    pathStr.includes('width') ||
    pathStr.includes('height') ||
    pathStr.includes('size') ||
    pathStr.includes('padding') ||
    pathStr.includes('margin') ||
    pathStr.includes('radius') ||
    pathStr.includes('space')
  ) {
    return 'dimension';
  } else if (pathStr.includes('font-family') || pathStr.includes('fontfamily') || pathStr.includes('font')) {
    return 'fontFamily';
  } else if (pathStr.includes('font-weight') || pathStr.includes('fontweight') || pathStr.includes('weight')) {
    return 'fontWeight';
  } else if (pathStr.includes('shadow') || pathStr.includes('elevation')) {
    return 'shadow';
  } else if (
    pathStr.includes('duration') ||
    pathStr.includes('time') ||
    lowerVal.includes('ms') ||
    lowerVal.includes('s')
  ) {
    return 'duration';
  }

  // Default fallback if we can't infer
  return 'string';
}

/**
 * Parse core tokens into a flat dictionary
 */
function parseCoreTokensFlat(dir, prefix) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith(`_${prefix}-`) && f.endsWith('.scss'));
  const tokens = {};

  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const lines = content.split('\n');

    const regex = new RegExp(`--cds-${prefix}-([a-zA-Z0-9-]+):\\s*([^;]+);`);

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        const key = match[1];
        let val = match[2].trim();
        const cleanedVal = cleanValue(val);
        tokens[key] = {
          $value: cleanedVal,
          $type: inferType(cleanedVal, key.split('-')),
        };
      }
    });
  });

  return tokens;
}

/**
 * Extract SCSS component properties
 */
function extractComponentTokens() {
  const files = findFiles(path.join(__dirname, '../projects/angular'), /_properties\..*\.scss$/);
  const components = {};

  const targetComponents = [
    'accordion',
    'alert',
    'badge',
    'breadcrumb',
    'btn',
    'card',
    'combobox',
    'datagrid',
    'dropdown',
    'forms',
    'label',
    'modal',
    'progress',
    'signpost',
    'spinner',
    'stack-view',
    'stepper',
    'table',
    'tabs',
    'timeline',
    'tooltip',
    'tree-view',
    'wizard',
  ];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    const regex = /--clr-([a-zA-Z0-9-]+)-([a-zA-Z0-9-]+(?:-[a-zA-Z0-9-]+)*):\s*([^;]+);/;

    lines.forEach(line => {
      const match = line.match(regex);
      if (match) {
        let rawComp = match[1];
        let rawProp = match[2];

        let comp = targetComponents.find(c => rawComp === c || rawComp.startsWith(c + '-'));
        if (!comp) {
          comp = rawComp.split('-')[0];
        }

        let prop = rawComp === comp ? rawProp : rawComp.substring(comp.length + 1) + '-' + rawProp;
        let val = cleanValue(match[3].trim());

        if (!components[comp]) {
          components[comp] = {};
        }

        const camelProp = prop.replace(/-([a-z])/g, g => g[1].toUpperCase());

        if (
          Object.keys(components[comp]).length < 15 ||
          val.includes('color') ||
          val.includes('background') ||
          val.includes('hsl')
        ) {
          components[comp][camelProp] = {
            $value: val,
            $type: inferType(val, prop.split('-')),
          };
        }
      }
    });
  });

  for (const comp in components) {
    const keys = Object.keys(components[comp]);
    if (keys.length > 15) {
      const newComp = {};
      keys.slice(0, 15).forEach(k => (newComp[k] = components[comp][k]));
      components[comp] = newComp;
    }
  }

  return components;
}

/**
 * Set nested object properties from an array of keys
 */
function setNested(obj, pathArray, tokenObj) {
  let current = obj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const part = pathArray[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  current[pathArray[pathArray.length - 1]] = tokenObj;
}

/**
 * Convert JS Object to YAML string
 */
function objectToYaml(obj, indent = 0) {
  let yaml = '';
  const spaces = '  '.repeat(indent);

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !obj[key].$value) {
      yaml += `${spaces}${key}:\n`;
      yaml += objectToYaml(obj[key], indent + 1);
    } else if (obj[key] && obj[key].$value) {
      yaml += `${spaces}${key}: { "$value": "${obj[key].$value}", "$type": "${obj[key].$type}" }\n`;
    }
  }
  return yaml;
}

/**
 * Main execution: Generate YAML and optionally patch DESIGN.md
 */
function generateTokensYaml() {
  const flatGlobals = parseCoreTokensFlat(path.join(__dirname, '../projects/angular/styles/core/tokens'), 'global');
  const flatAliases = parseCoreTokensFlat(path.join(__dirname, '../projects/angular/styles/core/tokens'), 'alias');
  const components = extractComponentTokens();

  const usedAliases = new Set();
  const usedGlobals = new Set();

  // 1. Scan components for dependencies
  for (const comp in components) {
    for (const prop in components[comp]) {
      const val = components[comp][prop].$value;

      const aliasMatches = [...val.matchAll(/\{alias\.([a-zA-Z0-9-]+)\}/g)];
      aliasMatches.forEach(m => usedAliases.add(m[1]));

      const globalMatches = [...val.matchAll(/\{global\.([a-zA-Z0-9-]+)\}/g)];
      globalMatches.forEach(m => {
        usedGlobals.add(m[1]);
        console.error(`⚠️  WARNING: Direct global token used in component '${comp}.${prop}': {global.${m[1]}}`);
      });
    }
  }

  // 2. Scan used aliases for their dependencies (iteratively to handle alias-to-alias)
  let aliasesToProcess = Array.from(usedAliases);
  const processedAliases = new Set();

  while (aliasesToProcess.length > 0) {
    const currentAlias = aliasesToProcess.pop();
    if (processedAliases.has(currentAlias)) {
      continue;
    }
    processedAliases.add(currentAlias);

    const tokenObj = flatAliases[currentAlias];
    if (tokenObj && tokenObj.$value) {
      const val = tokenObj.$value;
      const aliasMatches = [...val.matchAll(/\{alias\.([a-zA-Z0-9-]+)\}/g)];
      aliasMatches.forEach(m => {
        usedAliases.add(m[1]);
        aliasesToProcess.push(m[1]);
      });

      const globalMatches = [...val.matchAll(/\{global\.([a-zA-Z0-9-]+)\}/g)];
      globalMatches.forEach(m => usedGlobals.add(m[1]));
    }
  }

  // 3. Build filtered nested objects
  const filteredAliases = {};
  const filteredGlobals = {};

  usedAliases.forEach(aliasKey => {
    if (flatAliases[aliasKey]) {
      setNested(filteredAliases, aliasKey.split('-'), flatAliases[aliasKey]);
    }
  });

  usedGlobals.forEach(globalKey => {
    if (flatGlobals[globalKey]) {
      setNested(filteredGlobals, globalKey.split('-'), flatGlobals[globalKey]);
    }
  });

  // 4. Generate full YAML
  let fullYaml = '$schema: "https://tr.designtokens.org/format/"\n';
  if (Object.keys(filteredGlobals).length > 0) {
    fullYaml += 'global:\n' + objectToYaml(filteredGlobals, 1);
  }
  if (Object.keys(filteredAliases).length > 0) {
    fullYaml += 'alias:\n' + objectToYaml(filteredAliases, 1);
  }
  if (Object.keys(components).length > 0) {
    fullYaml += 'components:\n' + objectToYaml(components, 1);
  }

  return fullYaml;
}

function patchDesignMd(yamlContent) {
  const designMdPath = path.join(__dirname, '../DESIGN.md');
  if (!fs.existsSync(designMdPath)) {
    console.error('❌ DESIGN.md not found at', designMdPath);
    return;
  }

  const designMd = fs.readFileSync(designMdPath, 'utf8');

  const firstFence = designMd.indexOf('---');
  const secondFence = designMd.indexOf('---', firstFence + 3);

  if (firstFence !== -1 && secondFence !== -1) {
    const before = designMd.substring(0, firstFence + 3) + '\n';
    const after = '\n' + designMd.substring(secondFence);

    fs.writeFileSync(designMdPath, before + yamlContent + after);
    console.error('✅ Successfully updated DESIGN.md with ONLY used global, alias, and component tokens.');
  } else {
    console.error('❌ Could not find YAML frontmatter fences (---) in DESIGN.md');
  }
}

// Execute
const yamlOutput = generateTokensYaml();
if (process.argv.includes('--patch-md')) {
  patchDesignMd(yamlOutput);
} else {
  console.log(yamlOutput);
}
