/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Copies the non-TypeScript schematic files into the built package and keeps the schematics loadable:
//   projects/angular/schematics/collection.json      -> dist/clr-angular/schematics/collection.json
//   projects/angular/schematics/package.json         -> dist/clr-angular/schematics/package.json
//   projects/angular/schematics/**/schema.json       -> dist/clr-angular/schematics/**/schema.json
// The package is published with "type": "module" while tsc emits the schematics as CommonJS, so the nested
// package.json ("type": "commonjs") must ship. ng-packagr writes a .npmignore that drops every nested
// package.json; this script adds an exception for the schematics one.
// Usage: node ./scripts/copy-schematics-files.js

const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../projects/angular/schematics');
const dist = path.resolve(__dirname, '../dist/clr-angular');
const dest = path.join(dist, 'schematics');

function copy(relative) {
  fs.mkdirSync(path.dirname(path.join(dest, relative)), { recursive: true });
  fs.copyFileSync(path.join(src, relative), path.join(dest, relative));
  console.log(`copied schematics/${relative}`);
}

copy('collection.json');
copy('package.json');
for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
  if (entry.isDirectory() && fs.existsSync(path.join(src, entry.name, 'schema.json'))) {
    copy(`${entry.name}/schema.json`);
  }
}

const npmignore = path.join(dist, '.npmignore');
const exception = '!schematics/package.json';
const current = fs.existsSync(npmignore) ? fs.readFileSync(npmignore, 'utf8') : '';
if (!current.split(/\r?\n/).includes(exception)) {
  fs.writeFileSync(npmignore, `${current.replace(/\s*$/, '')}\n${exception}\n`);
  console.log(`added ${exception} to .npmignore`);
}
