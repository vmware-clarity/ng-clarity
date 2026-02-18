/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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

const TEMP_GEN_FOLDER = path.join(CWD, '.api-temp');
const BASE_CONFIG_PATH = path.join(CWD, 'api-extractor-base.json');

// Directories within a library source root that are not secondary entry points.
const EXCLUDED_SUB_DIRS = new Set(['src', 'assets', 'styles', 'types', 'schematics', 'migrations']);

// Library configurations
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
  },
];

// --- Helpers ---

function getDistPathMappings() {
  return LIBRARIES.reduce((paths, lib) => {
    paths[lib.pkgName] = [lib.typesDir, lib.distDir];
    paths[`${lib.pkgName}/*`] = [`${lib.typesDir}/*`, `${lib.distDir}/*`];
    return paths;
  }, {});
}

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

function getDtsPath(libConfig, entryName) {
  const cleanPkgName = libConfig.pkgName.replace('@', '').replace('/', '-');
  if (entryName === 'root') {
    return path.join(libConfig.typesDir, `${cleanPkgName}.d.ts`);
  }
  return path.join(libConfig.typesDir, `${cleanPkgName}-${entryName}.d.ts`);
}

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
        distEntryFile: getDtsPath(lib, 'root'),
      });
    } else {
      console.warn(`⚠️  ${lib.id}: source root exists but no entry file found`);
    }

    // Secondary entry points
    const subDirs = fs.readdirSync(lib.srcRoot, { withFileTypes: true });
    subDirs.forEach(dirent => {
      if (!dirent.isDirectory() || EXCLUDED_SUB_DIRS.has(dirent.name)) {
        return;
      }

      const subPath = path.join(lib.srcRoot, dirent.name);
      const subEntry = getEntryFile(subPath);

      if (subEntry) {
        tasks.push({
          id: `${lib.id}/${dirent.name}`,
          libConfig: lib,
          entryName: dirent.name,
          isSubEntry: true,
          distEntryFile: getDtsPath(lib, dirent.name),
        });
      }
    });
  });

  return tasks;
}

function getReportFilename(task) {
  if (task.isSubEntry) {
    return `${task.entryName}.api.md`;
  }
  return task.libConfig.reportName;
}

// --- Temp File Helpers ---

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

// --- Core Processor ---

function processTask(task, baseConfig, distPaths) {
  const reportFileName = getReportFilename(task);

  // Resolve the report output directory based on whether this is a root or secondary entry point.
  const reportDir = task.isSubEntry ? path.join(task.libConfig.srcRoot, task.entryName) : task.libConfig.srcRoot;

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

// --- Main Execution ---

function main() {
  console.log('--------------------------------------------------');
  console.log(`API EXTRACTOR: ${IS_LOCAL_MODE ? 'UPDATE MODE' : 'CHECK MODE'}`);
  console.log('--------------------------------------------------');

  if (!fs.existsSync(BASE_CONFIG_PATH)) {
    console.error(`Error: base config not found at ${BASE_CONFIG_PATH}`);
    process.exit(1);
  }

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
