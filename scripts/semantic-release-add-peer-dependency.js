/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');

// https://semantic-release.gitbook.io/semantic-release/developer-guide/plugin
function prepare(_, context) {
  const packagePath = './dist/clr-ui/package.json';
  const packageObj = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageObj.peerDependencies = packageObj.peerDependencies || {};
  packageObj.peerDependencies['@clr/angular'] = context.nextRelease.version;
  fs.writeFileSync(packagePath, JSON.stringify(packageObj, null, 2) + '\n');
}

module.exports = {
  prepare,
};
