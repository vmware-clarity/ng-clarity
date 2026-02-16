/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createWriteStream, readFileSync } from 'fs';
import { parse } from 'path';

import { glob } from 'glob';
import jsdomGlobal from 'jsdom-global';
import JSZip from 'jszip';

main();

async function main() {
  const iconsZip = new JSZip();

  addReadmeToIconsZip(iconsZip);
  await addIconsToIconsZip(iconsZip);

  saveIconsZip(iconsZip);
}

function addReadmeToIconsZip(iconsZip) {
  const packageManifest = JSON.parse(readFileSync('./package.json').toString());

  const readme = `
This zip contains all of the icons from @cds/core@${packageManifest.dependencies['@cds/core']}.

Each icon collection is in its own folder and each collection contains an svg file for all variants
of each icon in that collection.
`;

  iconsZip.file('README.md', `${readme.trim()}\n`);
}

async function addIconsToIconsZip(iconsZip) {
  jsdomGlobal();

  await import('@cds/core/icon/register');

  const { render } = await import('lit-html');
  const iconExports = await import('@cds/core/icon');

  const collectionJsFilePaths = await glob('./node_modules/@cds/core/icon/collections/*.js');

  if (collectionJsFilePaths.length === 0) {
    throw new Error('No icon collections found');
  }

  for (const collectionJsFilePath of collectionJsFilePaths) {
    const collectionName = kebabCaseToCamelCase(parse(collectionJsFilePath).name);
    const collectionIcons = iconExports[`${collectionName}CollectionIcons`];
    const loadCollectionIconSet = iconExports[`load${camelCaseToPascalCase(collectionName)}IconSet`];

    if (!collectionIcons || !loadCollectionIconSet) {
      throw new Error(`The '${collectionName}' icon collection was not found.`);
    }

    loadCollectionIconSet();

    const collectionZipFolder = iconsZip.folder(camelCaseToKebabCase(collectionName));

    for (const [iconName, icon] of collectionIcons) {
      if (typeof icon === 'string') {
        collectionZipFolder.file(`${camelCaseToKebabCase(iconName)}.svg`, icon);
      } else {
        for (const iconVariant of Object.keys(icon)) {
          const iconFilename = `${camelCaseToKebabCase(iconName)}-${camelCaseToKebabCase(iconVariant)}.svg`;
          collectionZipFolder.file(iconFilename, renderIconSvg({ render, iconName, iconVariant }));
        }
      }
    }
  }
}

function saveIconsZip(iconsZip) {
  const iconsZipFilePath = 'src/assets/clarity-icons.zip';

  iconsZip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(iconsZipFilePath))
    .on('finish', () => {
      console.log(`${iconsZipFilePath} written.`);
    });
}

function renderIconSvg({ render, iconName, iconVariant }) {
  const solid = iconVariant.startsWith('solid');
  const alerted = iconVariant.endsWith('Alerted');
  const badged = iconVariant.endsWith('Badged');

  const iconElement = document.createElement('cds-icon');
  iconElement.shape = iconName;
  iconElement.solid = solid;
  iconElement.badge = alerted ? 'inherit-triangle' : badged ? 'info' : undefined;

  const divElement = document.createElement('div');
  render(iconElement.render(), divElement);

  const svgElement = divElement.querySelector('svg');
  svgElement.setAttribute('width', '36');
  svgElement.setAttribute('height', '36');
  svgElement.removeAttribute('aria-hidden');

  return svgElement.outerHTML;
}

function camelCaseToKebabCase(value) {
  return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function camelCaseToPascalCase(value) {
  return value.replace(/^[a-z]/, letter => letter.toUpperCase());
}

function kebabCaseToCamelCase(value) {
  return value.replace(/-[a-z]/g, ([, letter]) => letter.toUpperCase());
}
