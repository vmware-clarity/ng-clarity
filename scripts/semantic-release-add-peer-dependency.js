/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');

// https://semantic-release.gitbook.io/semantic-release/developer-guide/plugin
function prepare(_, context) {
  const packagePeers = {
    './dist/clr-angular/package.json': '@clr/ui',
    './dist/clr-addons/package.json': '@clr/angular',
  };

  for (const [packageManifestPath, peerName] of Object.entries(packagePeers)) {
    const packageManifest = JSON.parse(fs.readFileSync(packageManifestPath, 'utf8'));
    packageManifest.peerDependencies = packageManifest.peerDependencies || {};
    packageManifest.peerDependencies[peerName] = context.nextRelease.version;
    fs.writeFileSync(packageManifestPath, JSON.stringify(packageManifest, null, 2) + '\n');
  }
}

module.exports = {
  prepare,
};
