/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createWriteStream, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import JSZip from 'jszip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');
const DIST_ANGULAR = resolve(REPO_ROOT, 'dist/clr-angular');

main();

async function main() {
  const iconsModule = await loadIconsModule();
  const iconsZip = new JSZip();

  addReadmeToIconsZip(iconsZip);
  addIconsToIconsZip(iconsZip, iconsModule);
  saveIconsZip(iconsZip);
}

async function loadIconsModule() {
  const entryPoint = resolve(DIST_ANGULAR, 'fesm2022/clr-angular-icon.mjs');
  if (!existsSync(entryPoint)) {
    throw new Error(`Icon module not found at ${entryPoint}. Run "npm run _build:angular" first.`);
  }
  return import(entryPoint);
}

function addReadmeToIconsZip(iconsZip) {
  const packageManifest = JSON.parse(readFileSync(resolve(REPO_ROOT, 'package.json')).toString());

  const readme = `
This zip contains all of the icons from @clr/angular@${packageManifest.version || 'latest'}.

Each icon collection is in its own folder and each collection contains an SVG file for all variants
of each icon in that collection.
`;

  iconsZip.file('README.md', `${readme.trim()}\n`);
}

function addIconsToIconsZip(iconsZip, iconsModule) {
  const collectionNames = [
    'core',
    'commerce',
    'essential',
    'media',
    'social',
    'technology',
    'textEdit',
    'travel',
    'chart',
    'mini',
  ];

  for (const collectionName of collectionNames) {
    const iconsKey = `${collectionName}CollectionIcons`;
    const collectionIcons = iconsModule[iconsKey];

    if (!collectionIcons) {
      console.warn(`Collection "${collectionName}" (${iconsKey}) not found, skipping.`);
      continue;
    }

    const folderName = camelCaseToKebabCase(collectionName);
    const collectionZipFolder = iconsZip.folder(folderName);

    for (const [iconName, iconShape] of collectionIcons) {
      if (typeof iconShape === 'string') {
        collectionZipFolder.file(`${iconName}.svg`, wrapSvg(iconShape));
      } else {
        for (const [variant, svgContent] of Object.entries(iconShape)) {
          if (typeof svgContent === 'string') {
            collectionZipFolder.file(`${iconName}-${camelCaseToKebabCase(variant)}.svg`, wrapSvg(svgContent));
          }
        }
      }
    }
  }
}

function wrapSvg(innerSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">${innerSvg}</svg>`;
}

function saveIconsZip(iconsZip) {
  const outputDir = resolve(__dirname, '../src/assets');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const iconsZipFilePath = resolve(outputDir, 'clarity-icons.zip');

  iconsZip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(iconsZipFilePath))
    .on('finish', () => {
      console.log(`${iconsZipFilePath} written.`);
    });
}

function camelCaseToKebabCase(value) {
  return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
