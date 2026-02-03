/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const path = require('path');
const fs = require('fs');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');

// --- Global Configuration ---

const IS_LOCAL_MODE = process.argv.includes('--local');
const CWD = process.cwd();
const PROJECTS_ROOT = path.join(CWD, 'projects');
const TEMP_GEN_FOLDER = path.join(CWD, '.api-temp');
const BASE_CONFIG_PATH = path.join(CWD, 'api-extractor-base.json');

// Project Definitions
const PROJECTS = {
  angular: {
    distName: 'clr-angular',
    pkgName: '@clr/angular',
    tsconfig: 'tsconfig.lib.prod.json',
    hasSubEntries: false,
    fixedReportName: 'clarity.api.md',
  },
  addons: {
    distName: 'clr-addons',
    pkgName: '@clr/addons',
    tsconfig: 'tsconfig.lib.prod.json',
    hasSubEntries: true,
    rootReportName: 'clr-addons.api.md',
  },
};

// --- Helpers ---

/**
 * Generates path mappings to force TS to read from 'dist' instead of 'src'.
 * Essential for correct type resolution in a monorepo build.
 */
function getDistPathMappings() {
  const paths = {};
  Object.values(PROJECTS).forEach(conf => {
    const distDir = path.resolve(CWD, `dist/${conf.distName}`);
    // Map package name to the folder (forces Node module resolution in dist)
    paths[conf.pkgName] = [distDir];
    paths[`${conf.pkgName}/*`] = [`${distDir}/*`];
  });
  return paths;
}

/**
 * Resolves the entry file (index.ts) for a given directory.
 */
function getEntryFile(dir) {
  const candidates = ['index.ts', 'src/index.ts']; // 'src/index.ts' is for Angular root
  for (const file of candidates) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Scans project folders to build a list of tasks to process.
 */
function getTasks() {
  const tasks = [];

  Object.keys(PROJECTS).forEach(projKey => {
    const config = PROJECTS[projKey];
    const projectRoot = path.join(PROJECTS_ROOT, projKey);

    // 1. Check Root Entry Point
    const rootEntry = getEntryFile(projectRoot);
    if (rootEntry) {
      tasks.push({
        id: projKey,
        projectKey: projKey,
        isSubEntry: false,
        sourceFile: rootEntry,
        distEntryFile: `dist/${config.distName}/index.d.ts`,
        config,
      });
    }

    // 2. Check Sub-Directories (if enabled)
    if (config.hasSubEntries && fs.existsSync(projectRoot)) {
      const subDirs = fs.readdirSync(projectRoot, { withFileTypes: true });

      subDirs.forEach(dirent => {
        if (!dirent.isDirectory()) {
          return;
        }

        const subPath = path.join(projectRoot, dirent.name);
        const subEntry = getEntryFile(subPath);

        if (subEntry) {
          tasks.push({
            id: `${projKey}/${dirent.name}`,
            projectKey: projKey,
            subEntryName: dirent.name, // e.g., 'datagrid'
            isSubEntry: true,
            sourceFile: subEntry,
            distEntryFile: `dist/${config.distName}/${dirent.name}/index.d.ts`,
            config,
          });
        }
      });
    }
  });

  return tasks;
}

/**
 * Determines the final filename based on project rules.
 */
function getReportFilename(task) {
  if (task.config.fixedReportName) {
    return task.config.fixedReportName;
  }
  if (task.isSubEntry) {
    return `${task.subEntryName}.api.md`;
  }
  return task.config.rootReportName;
}

// --- Core Processor ---

function processTask(task, baseConfig, distPaths) {
  const reportFileName = getReportFilename(task);
  const reportDir = path.join(PROJECTS_ROOT, task.id); // e.g., projects/addons/datagrid
  const tempGenDir = path.join(TEMP_GEN_FOLDER, task.id);

  // Unique ID for temp files to prevent collisions
  const safeId = task.id.replace(/\//g, '-');
  const tempTsConfigPath = path.join(CWD, `temp-tsconfig-${safeId}.json`);
  const tempExtractorPath = path.join(CWD, `temp-extractor-${safeId}.json`);

  console.log(`Processing: ${task.id} -> ${reportFileName}`);

  try {
    // 1. Generate Temporary TSConfig
    // We extend the project's PROD config but override paths to point to dist/
    const projectTsConfig = path.join(PROJECTS_ROOT, task.projectKey, task.config.tsconfig);

    fs.writeFileSync(
      tempTsConfigPath,
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

    // 2. Generate Temporary Extractor Config
    const extractorConfig = {
      ...baseConfig,
      projectFolder: CWD,
      mainEntryPointFilePath: path.resolve(CWD, task.distEntryFile),
      compiler: {
        tsconfigFilePath: tempTsConfigPath,
      },
      apiReport: {
        enabled: true,
        reportFileName: reportFileName,
        reportFolder: reportDir,
        reportTempFolder: tempGenDir, // Generate into isolation first
      },
    };

    // Ensure folders exist
    fs.mkdirSync(reportDir, { recursive: true });
    fs.mkdirSync(tempGenDir, { recursive: true });

    fs.writeFileSync(tempExtractorPath, JSON.stringify(extractorConfig, null, 2));

    // 3. Run API Extractor
    const loadedConfig = ExtractorConfig.loadFileAndPrepare(tempExtractorPath);
    const result = Extractor.invoke(loadedConfig, {
      localBuild: IS_LOCAL_MODE,
      showVerboseMessages: false,
    });

    // 4. Handle Results
    const generatedFilePath = path.join(tempGenDir, reportFileName);
    const finalFilePath = path.join(reportDir, reportFileName);

    if (IS_LOCAL_MODE) {
      if (result.succeeded && fs.existsSync(generatedFilePath)) {
        // Force update: Overwrite the project file with the newly generated one
        fs.copyFileSync(generatedFilePath, finalFilePath);
        console.log(`   ✅ OK (Updated)`);
      } else {
        throw new Error(`Errors: ${result.errorCount}, Warnings: ${result.warningCount}`);
      }
    } else {
      // CI Mode
      if (result.apiReportChanged) {
        throw new Error('API Report changed or missing. Run "npm run public-api:update" locally.');
      } else if (!result.succeeded) {
        throw new Error(`Build failed. Errors: ${result.errorCount}`);
      }
      console.log(`   ✅ OK`);
    }
  } catch (err) {
    console.error(`   ❌ FAIL: ${err.message}`);
    return false; // Task failed
  } finally {
    // Cleanup per-task temp files
    if (fs.existsSync(tempTsConfigPath)) {
      fs.unlinkSync(tempTsConfigPath);
    }
    if (fs.existsSync(tempExtractorPath)) {
      fs.unlinkSync(tempExtractorPath);
    }
  }

  return true; // Task succeeded
}

// --- Main Execution ---

function main() {
  console.log('--------------------------------------------------');
  console.log(`RUNNING IN ${IS_LOCAL_MODE ? 'UPDATE (LOCAL)' : 'CHECK (CI)'} MODE`);
  console.log('--------------------------------------------------');

  // Load Base Config
  if (!fs.existsSync(BASE_CONFIG_PATH)) {
    console.error(`Error: Base config not found at ${BASE_CONFIG_PATH}`);
    process.exit(1);
  }
  const baseConfig = JSON.parse(fs.readFileSync(BASE_CONFIG_PATH, 'utf8'));
  // Ensure we force the extends logic to be relative to CWD
  baseConfig.extends = './api-extractor-base.json';

  const tasks = getTasks();
  const distPaths = getDistPathMappings();

  console.log(`\n🔍 Found ${tasks.length} entry points.\n`);

  let hasErrors = false;
  for (const task of tasks) {
    const success = processTask(task, baseConfig, distPaths);
    if (!success) {
      hasErrors = true;
    }
  }

  // Cleanup global temp folder
  if (fs.existsSync(TEMP_GEN_FOLDER)) {
    fs.rmSync(TEMP_GEN_FOLDER, { recursive: true, force: true });
  }

  if (hasErrors) {
    console.error('\nOne or more tasks failed.');
    process.exit(1);
  }
}

main();
