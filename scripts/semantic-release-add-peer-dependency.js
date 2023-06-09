/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');

// https://semantic-release.gitbook.io/semantic-release/developer-guide/plugin
function prepare(_, context) {
  const packageManifestPath = './dist/clr-angular/package.json';
  const packageManifest = JSON.parse(fs.readFileSync(packageManifestPath, 'utf8'));
  packageManifest.peerDependencies = packageManifest.peerDependencies || {};
  packageManifest.peerDependencies['@clr/ui'] = context.nextRelease.version;
  fs.writeFileSync(packageManifestPath, JSON.stringify(packageManifest, null, 2) + '\n');
}

module.exports = {
  prepare,
};
