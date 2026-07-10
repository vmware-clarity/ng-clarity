/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * API Extractor Runner
 *
 * Runs Microsoft's API Extractor against every public entry point of each
 * library in this monorepo (@clr/angular and @clr/addons). It operates in
 * two modes controlled by the --local flag:
 *
 *   npm run public-api:update   (--local)  — Regenerates .api.md report files
 *                                            next to each entry point source.
 *   npm run public-api:check    (no flag)  — CI guard; fails if any report is
 *                                            out of date or extraction errors.
 *
 * Prerequisites:
 *   - The libraries must be built first (dist/ must contain compiled output
 *     including rolled-up .d.ts files under dist/<lib>/types/).
 *   - A base configuration file must exist at api-extractor-base.json.
 *
 * High-level workflow:
 *   1. Discover entry points — scan each library's source root for a root
 *      entry file and secondary entry points (sub-directories with their own
 *      entry files).
 *   2. For each entry point, generate a temporary tsconfig and API Extractor
 *      config, invoke the extractor, and evaluate the result.
 *   3. Clean up all temporary files regardless of success or failure.
 *
 * To add a new library, append an entry to the LIBRARIES array below.
 * To exclude additional sub-directories from secondary entry point discovery,
 * add them to EXCLUDED_SUB_DIRS.
 */

const path = require('path');
const fs = require('fs');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

// --- Configuration ---

/** When true, reports are regenerated in place. When false, the script fails if reports are stale. */
const IS_LOCAL_MODE = process.argv.includes('--local');
const CWD = process.cwd();

/** Temporary working directory for API Extractor output; cleaned up after each run. */
const TEMP_GEN_FOLDER = path.join(CWD, '.api-temp');
const BASE_CONFIG_PATH = path.join(CWD, 'api-extractor-base.json');

/** Directories within a library source root that are not secondary entry points. */
const EXCLUDED_SUB_DIRS = new Set(['src', 'assets', 'styles', 'types', 'schematics', 'migrations']);

/**
 * Library configurations. Each entry describes one publishable package:
 *   id                     — Short identifier used in log output and task IDs.
 *   pkgName                — npm package name, used for TypeScript path mappings.
 *   distDir                — Root of the compiled library output.
 *   typesDir               — Directory containing rolled-up .d.ts declaration files.
 *   srcRoot                — Source root; scanned for root and secondary entry points.
 *   tsconfig               — Filename of the production tsconfig within srcRoot.
 *   reportName             — Filename for the root entry point's API report.
 *   recurseSecondaryEntries — When true, a subdirectory with no entry file of its own
 *                            (e.g. one that merely groups related entry points) is
 *                            searched one level deeper instead of being skipped.
 */
const LIBRARIES = [
  {
    id: 'angular',
    pkgName: '@clr/angular',
    distDir: path.join(CWD, 'dist/clr-angular'),
    typesDir: path.join(CWD, 'dist/clr-angular/types'),
    srcRoot: path.join(CWD, 'projects/angular'),
    tsconfig: 'tsconfig.lib.prod.json',
    reportName: 'clarity.api.md',
  },
  {
    id: 'addons',
    pkgName: '@clr/addons',
    distDir: path.join(CWD, 'dist/clr-addons'),
    typesDir: path.join(CWD, 'dist/clr-addons/types'),
    srcRoot: path.join(CWD, 'projects/addons'),
    tsconfig: 'tsconfig.lib.prod.json',
    reportName: 'clr-addons.api.md',
    recurseSecondaryEntries: true,
  },
];

// --- Helpers: Path Resolution & Task Discovery ---

/**
 * Builds a TypeScript path-mapping object that maps each library's package name
 * to its dist types and output directories, enabling cross-library type resolution.
 */
function getDistPathMappings() {
  return LIBRARIES.reduce((paths, lib) => {
    paths[lib.pkgName] = [lib.typesDir, lib.distDir];
    paths[`${lib.pkgName}/*`] = [`${lib.typesDir}/*`, `${lib.distDir}/*`];
    return paths;
  }, {});
}

/**
 * Searches a directory for a recognized entry file (index.ts, src/index.ts, or public-api.ts).
 * Returns the absolute path of the first match, or null if none is found.
 */
function getEntryFile(dir) {
  const candidates = ['index.ts', 'src/index.ts', 'public-api.ts'];
  for (const file of candidates) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Constructs the expected path to the rolled-up .d.ts file for a given entry point.
 * For root entries the filename matches the package name; for secondary entries
 * the entry name is appended as a suffix.
 */
function getTypeDeclarationPath(libConfig, entryName) {
  const cleanPkgName = libConfig.pkgName.replace('@', '').replace('/', '-');
  if (entryName === 'root') {
    return path.join(libConfig.typesDir, `${cleanPkgName}.d.ts`);
  }
  return path.join(libConfig.typesDir, `${cleanPkgName}-${entryName}.d.ts`);
}

/**
 * Searches a directory tree for secondary entry points. Descent into a directory
 * stops as soon as it resolves its own entry file — its children are not inspected.
 * If a directory has no entry file of its own (e.g. it merely groups related entry
 * points, like workflow/ grouping workflow/strings/) and `recurse` is enabled, its
 * children are searched instead; otherwise it is skipped, matching legacy behavior.
 * Returns an array of { relParts, dir }, one per discovered entry.
 */
function findSecondaryEntries(baseDir, relParts, recurse) {
  const found = [];
  const dirents = fs.readdirSync(baseDir, { withFileTypes: true });

  dirents.forEach(dirent => {
    if (!dirent.isDirectory() || EXCLUDED_SUB_DIRS.has(dirent.name)) {
      return;
    }

    const subPath = path.join(baseDir, dirent.name);
    const subRelParts = [...relParts, dirent.name];

    if (getEntryFile(subPath)) {
      found.push({ relParts: subRelParts, dir: subPath });
    } else if (recurse) {
      found.push(...findSecondaryEntries(subPath, subRelParts, recurse));
    }
  });

  return found;
}

/**
 * Scans all configured libraries and discovers their root and secondary entry points.
 * Returns an array of task objects, each describing a single entry point to process.
 *
 * Task object shape:
 *   id            — Unique identifier, e.g. "angular/root" or "addons/workflow/strings".
 *   libConfig     — Reference to the parent LIBRARIES entry.
 *   entryName     — "root" for the library root, or the entry's path segments joined
 *                   with "-" (matches ng-packagr's rolled-up .d.ts naming convention).
 *   relDir        — Entry's path relative to the library source root (undefined for root).
 *   isSubEntry    — Whether this is a secondary entry point.
 *   distEntryFile — Absolute path to the expected rolled-up .d.ts file.
 */
function getTasks() {
  const tasks = [];

  LIBRARIES.forEach(lib => {
    if (!fs.existsSync(lib.srcRoot)) {
      console.warn(`⚠️  Skipping ${lib.id}: source root not found`);
      return;
    }

    // Root entry point
    const rootEntry = getEntryFile(lib.srcRoot);
    if (rootEntry) {
      tasks.push({
        id: `${lib.id}/root`,
        libConfig: lib,
        entryName: 'root',
        isSubEntry: false,
        distEntryFile: getTypeDeclarationPath(lib, 'root'),
      });
    } else {
      console.warn(`⚠️  ${lib.id}: source root exists but no entry file found`);
    }

    // Secondary entry points, including ones nested under a grouping directory
    // that has no entry file of its own (e.g. workflow/strings), for libraries
    // that opt into it.
    findSecondaryEntries(lib.srcRoot, [], Boolean(lib.recurseSecondaryEntries)).forEach(({ relParts }) => {
      const entryName = relParts.join('-');
      tasks.push({
        id: `${lib.id}/${relParts.join('/')}`,
        libConfig: lib,
        entryName,
        relDir: path.join(...relParts),
        isSubEntry: true,
        distEntryFile: getTypeDeclarationPath(lib, entryName),
      });
    });
  });

  return tasks;
}

/**
 * Determines the API report filename for a task. Secondary entry points are named
 * after their own directory (not the full path); root entry points use the
 * library-level report name.
 */
function getReportFilename(task) {
  if (task.isSubEntry) {
    return `${path.basename(task.relDir)}.api.md`;
  }
  return task.libConfig.reportName;
}

// --- Helpers: Temporary Config File Generation ---

/**
 * Writes a temporary tsconfig.json file that extends the library's production
 * tsconfig and adds path mappings pointing to the dist output directories.
 */
function writeTempTsConfig(filePath, libConfig, distPaths) {
  const projectTsConfig = path.join(libConfig.srcRoot, libConfig.tsconfig);

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        extends: fs.existsSync(projectTsConfig) ? projectTsConfig : undefined,
        compilerOptions: {
          baseUrl: '.',
          moduleResolution: 'node',
          preserveSymlinks: true,
          paths: distPaths,
          types: [],
          skipLibCheck: true,
        },
      },
      null,
      2
    )
  );
}

/**
 * Creates the per-task API Extractor configuration file by merging the base config
 * with task-specific settings (entry point, compiler, and report output paths).
 * Also ensures the report and temp generation directories exist.
 */
function writeExtractorConfig(filePath, baseConfig, task, tempTsConfigPath, reportDir, reportFileName, tempGenDir) {
  const config = {
    ...baseConfig,
    projectFolder: CWD,
    mainEntryPointFilePath: task.distEntryFile,
    compiler: {
      tsconfigFilePath: tempTsConfigPath,
    },
    apiReport: {
      enabled: true,
      reportFileName,
      reportFolder: reportDir,
      reportTempFolder: tempGenDir,
    },
  };

  fs.mkdirSync(reportDir, { recursive: true });
  fs.mkdirSync(tempGenDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

/**
 * Interprets the API Extractor result. In local mode, copies the generated report
 * to its final location. In CI/check mode, throws if the report has changed or
 * the build failed.
 */
function evaluateResult(result, task, tempGenDir, reportDir, reportFileName) {
  if (IS_LOCAL_MODE) {
    if (result.succeeded) {
      const generatedFilePath = path.join(tempGenDir, reportFileName);
      if (fs.existsSync(generatedFilePath)) {
        const finalFilePath = path.join(reportDir, reportFileName);
        fs.copyFileSync(generatedFilePath, finalFilePath);
      }
      console.log(`   ✅ OK (updated)`);
    } else {
      console.warn(`   ⚠️  Finished with warnings`);
    }
  } else {
    if (result.apiReportChanged) {
      throw new Error(`API report changed for ${task.id}. Run local update.`);
    }
    if (!result.succeeded) {
      throw new Error(`Build failed for ${task.id}. Errors: ${result.errorCount}`);
    }
    console.log(`   ✅ OK`);
  }
}

/**
 * Processes a single entry point task: generates temporary tsconfig and extractor
 * config files, invokes API Extractor, evaluates the result, and cleans up
 * temporary files. Returns true on success, false on failure.
 */
function processTask(task, baseConfig, distPaths) {
  const reportFileName = getReportFilename(task);

  // Resolve the report output directory based on whether this is a root or secondary entry point.
  const reportDir = task.isSubEntry ? path.join(task.libConfig.srcRoot, task.relDir) : task.libConfig.srcRoot;

  const tempGenDir = path.join(TEMP_GEN_FOLDER, task.id);
  const safeId = task.id.replace(/\//g, '-');

  const tempTsConfigPath = path.join(CWD, `temp-tsconfig-${safeId}.json`);
  const tempExtractorPath = path.join(CWD, `temp-extractor-${safeId}.json`);

  console.log(`Processing: ${task.id.padEnd(25)} -> ${path.join(path.basename(reportDir), reportFileName)}`);

  try {
    if (!fs.existsSync(task.distEntryFile)) {
      throw new Error(`Definition file not found: ${task.distEntryFile}`);
    }

    writeTempTsConfig(tempTsConfigPath, task.libConfig, distPaths);
    writeExtractorConfig(tempExtractorPath, baseConfig, task, tempTsConfigPath, reportDir, reportFileName, tempGenDir);

    const loadedConfig = ExtractorConfig.loadFileAndPrepare(tempExtractorPath);

    const result = Extractor.invoke(loadedConfig, {
      localBuild: IS_LOCAL_MODE,
      showVerboseMessages: false,
    });

    evaluateResult(result, task, tempGenDir, reportDir, reportFileName);
  } catch (err) {
    console.error(`   ❌ FAIL: ${err.message}`);
    return false;
  } finally {
    if (fs.existsSync(tempTsConfigPath)) {
      fs.unlinkSync(tempTsConfigPath);
    }
    if (fs.existsSync(tempExtractorPath)) {
      fs.unlinkSync(tempExtractorPath);
    }
  }

  return true;
}

/**
 * Entry point. Loads the base API Extractor configuration, discovers all entry
 * point tasks across configured libraries, processes each one sequentially,
 * and exits with a non-zero code if any task failed.
 */
function main() {
  console.log('--------------------------------------------------');
  console.log(`API EXTRACTOR: ${IS_LOCAL_MODE ? 'UPDATE MODE' : 'CHECK MODE'}`);
  console.log('--------------------------------------------------');

  if (!fs.existsSync(BASE_CONFIG_PATH)) {
    console.error(`Error: base config not found at ${BASE_CONFIG_PATH}`);
    process.exit(1);
  }

  // The 'extends' field must be a relative path so API Extractor resolves it
  // correctly from the per-task config files written to the project root.
  const baseConfig = {
    ...JSON.parse(fs.readFileSync(BASE_CONFIG_PATH, 'utf8')),
    extends: './api-extractor-base.json',
  };

  const tasks = getTasks();
  const distPaths = getDistPathMappings();

  console.log(`Scanning libraries: ${LIBRARIES.map(l => l.pkgName).join(', ')}`);
  console.log(`Found ${tasks.length} total entry points.\n`);

  let hasErrors = false;
  for (const task of tasks) {
    const success = processTask(task, baseConfig, distPaths);
    if (!success) {
      hasErrors = true;
    }
  }

  if (fs.existsSync(TEMP_GEN_FOLDER)) {
    fs.rmSync(TEMP_GEN_FOLDER, { recursive: true, force: true });
  }

  if (hasErrors) {
    console.error('\n❌ One or more entry points failed.');
    process.exit(1);
  } else {
    console.log('\n✅ All entry points processed successfully.');
  }
}

main();
