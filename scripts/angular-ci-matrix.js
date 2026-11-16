/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('node:fs');

function angularBuildMatrix(version) {
  const major = Number(String(version).match(/\d+/)?.[0]);
  if (![21, 22].includes(major)) {
    throw new Error(`Update the supported Angular CI matrix for ${version}`);
  }
  const matrix = [{ angular: `Angular v${major}`, primary: true }];
  if (major === 21) {
    matrix.push({ angular: 'Angular v22', primary: false });
  }
  return { major, matrix };
}

if (require.main === module) {
  const { major, matrix } = angularBuildMatrix(require('../package.json').devDependencies['@angular/core']);
  const output = `major=${major}\nmatrix=${JSON.stringify(matrix)}\n`;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  } else {
    process.stdout.write(output);
  }
}
module.exports = { angularBuildMatrix };
