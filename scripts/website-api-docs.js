/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Website API Docs Runner
 *
 * Keeps the API tables shown on the documentation website in sync with the
 * inputs and outputs that actually exist in the libraries (@clr/angular and
 * @clr/addons). It is the website counterpart of scripts/api-extractor.js and
 * follows the same two-mode workflow:
 *
 *   npm run website-api:update   (--local)  — Regenerates the JSON report files under
 *                                             projects/website/content/api-docs/.
 *   npm run website-api:check    (no flag)  — CI guard; fails if any report is out of date.
 *
 * What is generated vs. what is written by hand:
 *   - Generated from the source code (via Compodoc): which classes are part of the
 *     public API, their selectors, and every input/output with its type and default.
 *   - Written by hand: the `description` of each binding. A description comes from
 *     the JSDoc comment on the @Input()/@Output() declaration when one exists;
 *     otherwise the description already present in the report file is preserved,
 *     so descriptions can be authored directly in the JSON files.
 *
 * Only classes that are exported from a public entry point are included. The set
 * of public exports is read from the `*.api.md` reports maintained by
 * scripts/api-extractor.js, so the two workflows share one definition of "public".
 *
 * Prerequisites:
 *   - node_modules must be installed (Compodoc is a devDependency).
 *   - The `*.api.md` reports must be up to date (guarded by `npm run public-api:check`).
 *   - No library build is required; Compodoc reads the TypeScript sources directly.
 */

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// --- Configuration ---

/** When true, reports are regenerated in place. When false, the script fails if reports are stale. */
const IS_LOCAL_MODE = process.argv.includes('--local');
/** When true, every binding without a description is listed (not just counted). */
const IS_VERBOSE = process.argv.includes('--verbose');
const CWD = process.cwd();

/** Temporary working directory for Compodoc output; cleaned up after each run. */
const TEMP_GEN_FOLDER = path.join(CWD, '.website-api-temp');
/** Root of the checked-in report files consumed by the website build. */
const OUTPUT_ROOT = path.join(CWD, 'projects/website/content/api-docs');
const COMPODOC_BIN = path.join(CWD, 'node_modules/.bin/compodoc');

/** Public entry points that are not documented on the website (test helpers, mocks). */
const EXCLUDED_ENTRY_POINTS = new Set(['testing']);

/**
 * Library configurations. Each entry describes one publishable package:
 *   id        — Short identifier; also the report sub-folder name.
 *   pkgName   — npm package name, used to label entry points in the reports.
 *   srcRoot   — Source root; scanned for `*.api.md` reports and used to derive entry point names.
 *   tsconfig  — tsconfig passed to Compodoc.
 */
const LIBRARIES = [
  {
    id: 'angular',
    pkgName: '@clr/angular',
    srcRoot: path.join(CWD, 'projects/angular'),
    tsconfig: path.join(CWD, 'projects/angular/tsconfig.lib.json'),
  },
  {
    id: 'addons',
    pkgName: '@clr/addons',
    srcRoot: path.join(CWD, 'projects/addons'),
    tsconfig: path.join(CWD, 'projects/addons/tsconfig.lib.json'),
  },
];

// --- Helpers: Compodoc ---

/**
 * Runs Compodoc in JSON export mode for a library and returns the parsed documentation.
 */
function runCompodoc(lib) {
  const outDir = path.join(TEMP_GEN_FOLDER, lib.id);
  fs.mkdirSync(outDir, { recursive: true });

  const result = spawnSync(
    process.execPath,
    [COMPODOC_BIN, '-p', lib.tsconfig, '-e', 'json', '-d', outDir, '--silent'],
    { cwd: CWD, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }
  );

  const jsonPath = path.join(outDir, 'documentation.json');
  if (result.status !== 0 || !fs.existsSync(jsonPath)) {
    throw new Error(`Compodoc failed for ${lib.id}.\n${result.stdout}\n${result.stderr}`);
  }

  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

// --- Helpers: Public API ---

/**
 * Collects the names of all classes exported from any public entry point of a library
 * by scanning its `*.api.md` reports.
 */
function getPublicClassNames(lib) {
  const names = new Set();

  for (const reportPath of findFiles(lib.srcRoot, /\.api\.md$/)) {
    const content = fs.readFileSync(reportPath, 'utf8');
    for (const match of content.matchAll(/^export (?:abstract )?class (\w+)/gm)) {
      names.add(match[1]);
    }
  }

  return names;
}

/** Recursively finds files matching a pattern, skipping node_modules. */
function findFiles(dir, pattern, out = []) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name !== 'node_modules') {
        findFiles(fullPath, pattern, out);
      }
    } else if (pattern.test(dirent.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

/**
 * Derives the entry point name for a source file: the first directory below the
 * library source root, provided that directory is a secondary entry point (it has
 * its own `<name>.api.md` report, e.g. projects/angular/accordion/accordion.api.md).
 * Everything else is exported from the library root and attributed to "root".
 */
function getEntryName(lib, file) {
  const relative = path.relative(lib.srcRoot, path.resolve(CWD, file));
  const [firstSegment, ...rest] = relative.split(path.sep);

  if (rest.length > 0 && fs.existsSync(path.join(lib.srcRoot, firstSegment, `${firstSegment}.api.md`))) {
    return firstSegment;
  }
  return 'root';
}

// --- Helpers: Descriptions ---

/** Converts the HTML that Compodoc produces from JSDoc comments to plain text. */
function htmlToText(html) {
  if (!html) {
    return '';
  }
  return html
    .replace(/<\/p>\s*<p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Loads the existing report files of a library so hand-written descriptions can be
 * preserved. Returns a map of "ClassName" -> component and "ClassName.binding" -> binding.
 */
function loadExistingDescriptions(lib) {
  const existing = new Map();
  const libDir = path.join(OUTPUT_ROOT, lib.id);

  if (!fs.existsSync(libDir)) {
    return existing;
  }

  for (const reportPath of findFiles(libDir, /\.json$/)) {
    let report;
    try {
      report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch (err) {
      throw new Error(`Could not parse ${path.relative(CWD, reportPath)}: ${err.message}`);
    }

    for (const component of report.components || []) {
      existing.set(component.name, component.description || '');
      for (const binding of [...(component.inputs || []), ...(component.outputs || [])]) {
        existing.set(`${component.name}.${binding.name}`, binding.description || '');
      }
    }
  }

  return existing;
}

/** JSDoc text wins when present; otherwise the description already in the report is kept. */
function resolveDescription(jsDocHtml, existing, key) {
  const fromJsDoc = htmlToText(jsDocHtml);
  if (fromJsDoc) {
    return fromJsDoc;
  }
  return existing.get(key) || '';
}

// --- Report Generation ---

/**
 * Maps a Compodoc input/output entry to the report shape. For outputs, the emitted
 * value type is read from the `new EventEmitter<T>()` initializer and the initializer
 * itself is not reported as a default.
 */
function toBinding(entry, className, existing, isOutput) {
  const binding = {
    name: entry.name,
    type: entry.type || 'any',
  };

  if (isOutput) {
    const emitted = /EventEmitter<(.+)>\s*\(/.exec(String(entry.defaultValue || ''));
    binding.type = emitted ? emitted[1] : binding.type;
  } else if (entry.defaultValue !== undefined) {
    binding.default = String(entry.defaultValue);
  }
  if (entry.deprecated) {
    binding.deprecated = htmlToText(entry.deprecationMessage) || true;
  }

  binding.description = resolveDescription(entry.description, existing, `${className}.${entry.name}`);

  return binding;
}

/**
 * Builds the report files for a library. Returns a map of
 * "<lib id>/<entry>.json" -> report object.
 */
function buildReports(lib, documentation, publicClassNames, existing) {
  const byEntry = new Map();
  const classes = [
    ...(documentation.components || []).map(cls => ({ cls, kind: 'component' })),
    ...(documentation.directives || []).map(cls => ({ cls, kind: 'directive' })),
  ];

  const seen = new Set();

  for (const { cls, kind } of classes) {
    const inputs = cls.inputsClass || [];
    const outputs = cls.outputsClass || [];

    if (!publicClassNames.has(cls.name) || (inputs.length === 0 && outputs.length === 0)) {
      continue;
    }

    const entryName = getEntryName(lib, cls.file);
    if (EXCLUDED_ENTRY_POINTS.has(entryName)) {
      continue;
    }

    // Compodoc reports every declaration it finds; the website looks classes up by name,
    // so a name can only be documented once per library.
    if (seen.has(cls.name)) {
      console.warn(`   ⚠️  Skipping duplicate declaration of ${cls.name} in ${cls.file}`);
      continue;
    }
    seen.add(cls.name);
    if (!byEntry.has(entryName)) {
      byEntry.set(entryName, {
        entryPoint: entryName === 'root' ? lib.pkgName : `${lib.pkgName}/${entryName}`,
        components: [],
      });
    }

    byEntry.get(entryName).components.push({
      name: cls.name,
      kind,
      selector: cls.selector || '',
      description: resolveDescription(cls.description, existing, cls.name),
      inputs: inputs.map(input => toBinding(input, cls.name, existing, false)).sort(byName),
      outputs: outputs.map(output => toBinding(output, cls.name, existing, true)).sort(byName),
    });
  }

  const reports = new Map();
  for (const [entryName, report] of [...byEntry.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    report.components.sort(byName);
    reports.set(`${lib.id}/${entryName}.json`, report);
  }

  return reports;
}

function byName(a, b) {
  return a.name.localeCompare(b.name);
}

function serialize(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

// --- Check / Update ---

/**
 * Compares generated reports with the files on disk. Returns a list of human-readable
 * differences; an empty list means everything is in sync.
 */
function diffReports(lib, reports) {
  const differences = [];
  const libDir = path.join(OUTPUT_ROOT, lib.id);
  const onDisk = new Set(
    fs.existsSync(libDir) ? findFiles(libDir, /\.json$/).map(file => path.relative(OUTPUT_ROOT, file)) : []
  );

  for (const [relativePath, report] of reports) {
    const fullPath = path.join(OUTPUT_ROOT, relativePath);
    if (!onDisk.has(relativePath)) {
      differences.push(`${relativePath}: missing`);
      continue;
    }
    onDisk.delete(relativePath);

    const current = fs.readFileSync(fullPath, 'utf8');
    if (current !== serialize(report)) {
      differences.push(`${relativePath}: ${describeChanges(current, report).join(', ')}`);
    }
  }

  for (const stale of onDisk) {
    differences.push(`${stale}: no longer part of the public API`);
  }

  return differences;
}

/** Lists which components/bindings differ between the current file and the generated report. */
function describeChanges(currentContent, report) {
  let current;
  try {
    current = JSON.parse(currentContent);
  } catch {
    return ['file is not valid JSON'];
  }

  const flatten = rep => {
    const map = new Map();
    for (const component of rep.components || []) {
      const { inputs = [], outputs = [], ...rest } = component;
      map.set(component.name, JSON.stringify(rest));
      for (const binding of [...inputs, ...outputs]) {
        map.set(`${component.name}.${binding.name}`, JSON.stringify(binding));
      }
    }
    return map;
  };

  const before = flatten(current);
  const after = flatten(report);
  const changes = [];

  for (const [key, value] of after) {
    if (!before.has(key)) {
      changes.push(`+${key}`);
    } else if (before.get(key) !== value) {
      changes.push(`~${key}`);
    }
  }
  for (const key of before.keys()) {
    if (!after.has(key)) {
      changes.push(`-${key}`);
    }
  }

  return changes.length ? changes : ['formatting'];
}

/** Writes generated reports and removes stale ones. */
function writeReports(lib, reports) {
  const libDir = path.join(OUTPUT_ROOT, lib.id);
  fs.mkdirSync(libDir, { recursive: true });

  const keep = new Set();
  for (const [relativePath, report] of reports) {
    const fullPath = path.join(OUTPUT_ROOT, relativePath);
    keep.add(fullPath);
    fs.writeFileSync(fullPath, serialize(report));
  }

  for (const file of findFiles(libDir, /\.json$/)) {
    if (!keep.has(file)) {
      fs.unlinkSync(file);
      console.log(`   🗑  removed ${path.relative(CWD, file)}`);
    }
  }
}

/** Reports bindings that still have no description so authors know what to fill in. */
function reportMissingDescriptions(lib, reports) {
  const missing = [];
  for (const report of reports.values()) {
    for (const component of report.components) {
      for (const binding of [...component.inputs, ...component.outputs]) {
        if (!binding.description) {
          missing.push(`${component.name}.${binding.name}`);
        }
      }
    }
  }

  if (missing.length) {
    console.log(
      `   ℹ️  ${missing.length} binding(s) without a description${IS_VERBOSE ? ':' : ' (run with --verbose to list)'}`
    );
    if (IS_VERBOSE) {
      missing.forEach(key => console.log(`      - ${key}`));
    }
  }
}

// --- Entry Point ---

function main() {
  console.log('--------------------------------------------------');
  console.log(`WEBSITE API DOCS: ${IS_LOCAL_MODE ? 'UPDATE MODE' : 'CHECK MODE'}`);
  console.log('--------------------------------------------------');

  if (!fs.existsSync(COMPODOC_BIN)) {
    console.error(`Error: Compodoc not found at ${path.relative(CWD, COMPODOC_BIN)}. Run \`npm ci\` first.`);
    process.exit(1);
  }

  let hasErrors = false;

  for (const lib of LIBRARIES) {
    console.log(`Processing: ${lib.pkgName}`);

    try {
      const publicClassNames = getPublicClassNames(lib);
      if (publicClassNames.size === 0) {
        throw new Error(`No *.api.md reports found under ${path.relative(CWD, lib.srcRoot)}.`);
      }

      const documentation = runCompodoc(lib);
      const existing = loadExistingDescriptions(lib);
      const reports = buildReports(lib, documentation, publicClassNames, existing);

      const componentCount = [...reports.values()].reduce((sum, report) => sum + report.components.length, 0);
      console.log(`   Found ${componentCount} public components/directives across ${reports.size} entry point(s).`);

      if (IS_LOCAL_MODE) {
        writeReports(lib, reports);
        reportMissingDescriptions(lib, reports);
        console.log(`   ✅ OK (updated)`);
      } else {
        const differences = diffReports(lib, reports);
        if (differences.length) {
          differences.forEach(difference => console.error(`   ❌ ${difference}`));
          throw new Error(`Website API docs are out of date for ${lib.id}. Run \`npm run website-api:update\`.`);
        }
        console.log(`   ✅ OK`);
      }
    } catch (err) {
      console.error(`   ❌ FAIL: ${err.message}`);
      hasErrors = true;
    }
  }

  if (fs.existsSync(TEMP_GEN_FOLDER)) {
    fs.rmSync(TEMP_GEN_FOLDER, { recursive: true, force: true });
  }

  if (hasErrors) {
    console.error('\n❌ One or more libraries failed.');
    process.exit(1);
  } else {
    console.log('\n✅ All libraries processed successfully.');
  }
}

main();
