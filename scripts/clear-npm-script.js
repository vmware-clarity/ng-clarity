/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * This script will clear/disable the specified scripts in package.json.
 * It is used to skip certain build steps in pr-build.yml in certain build configurations.
 */

const fs = require('fs');

const [, , ...scriptNames] = process.argv;

const packageManifestPath = 'package.json';
const packageManifest = JSON.parse(fs.readFileSync(packageManifestPath, 'utf8'));

for (const scriptName of scriptNames) {
  packageManifest.scripts[scriptName] = '';
}

fs.writeFileSync(packageManifestPath, JSON.stringify(packageManifest, null, 2) + '\n');
