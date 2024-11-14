/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('fs');
const glob = require('glob');

const styleDocs = glob
  .sync('./projects/**/STYLES.md')
  .map(filePath => fs.readFileSync(filePath).toString())
  .join('\n')
  .split(/^(?=# )/m) // split on level-one headings without capturing the leading hash symbol
  .sort() // sort the components alphabetically
  .map(content => content.trim())
  .join('\n\n');

fs.writeFileSync('./dist/clr-ui/STYLES.md', `${styleDocs}\n`);
