/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

// Copies package.json and README.md
fs.copyFileSync('projects/ui/package.json', 'dist/clr-ui/package.json');
fs.copyFileSync('projects/ui/README.md', 'dist/clr-ui/README.md');

// Copies all scss fiels from angular directory
const files = glob.sync('projects/angular/**/*.scss');
for (const file of files) {
  const dest = path.join('dist/clr-ui', path.relative('projects/angular', file));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
}
