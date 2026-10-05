/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * This script points tsconfig paths for @clr/angular and @clr/addons to the pre-built
 * dist/ packages. It is used in the Angular 22 CI leg so consuming applications (demo,
 * website, storybook) compile against the pre-compiled Angular 21.2 library artifacts.
 */

const fs = require('fs');

function updateJsonFile(filePath, updater) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  updater(content);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
}

// 1. Root tsconfig.json
updateJsonFile('tsconfig.json', config => {
  config.compilerOptions = config.compilerOptions || {};
  // Only on the Angular v22 leg: consuming apps compile against the dist/ typings with Angular 22.
  config.compilerOptions.skipLibCheck = true;
  config.compilerOptions.paths = config.compilerOptions.paths || {};
  config.compilerOptions.paths['@clr/angular'] = ['./dist/clr-angular'];
  config.compilerOptions.paths['@clr/angular/*'] = ['./dist/clr-angular/*'];
  config.compilerOptions.paths['@clr/addons'] = ['./dist/clr-addons'];
  config.compilerOptions.paths['@clr/addons/*'] = ['./dist/clr-addons/*'];
  config.compilerOptions.paths['@clr/angular/testing'] = ['./dist/clr-angular/testing'];
});

// 2. Demo tsconfig.json
if (fs.existsSync('projects/demo/tsconfig.json')) {
  updateJsonFile('projects/demo/tsconfig.json', config => {
    config.compilerOptions = config.compilerOptions || {};
    config.compilerOptions.paths = config.compilerOptions.paths || {};
    config.compilerOptions.paths['@clr/angular'] = ['../../dist/clr-angular'];
    config.compilerOptions.paths['@clr/angular/*'] = ['../../dist/clr-angular/*'];
    config.compilerOptions.paths['@clr/addons'] = ['../../dist/clr-addons'];
    config.compilerOptions.paths['@clr/addons/*'] = ['../../dist/clr-addons/*'];
  });
}

// 3. Storybook tsconfig.json
if (fs.existsSync('.storybook/tsconfig.json')) {
  updateJsonFile('.storybook/tsconfig.json', config => {
    config.compilerOptions = config.compilerOptions || {};
    config.compilerOptions.paths = config.compilerOptions.paths || {};
    config.compilerOptions.paths['@clr/angular'] = ['./../dist/clr-angular'];
    config.compilerOptions.paths['@clr/angular/*'] = ['./../dist/clr-angular/*'];
    config.compilerOptions.paths['@clr/addons'] = ['./../dist/clr-addons'];
    config.compilerOptions.paths['@clr/addons/*'] = ['./../dist/clr-addons/*'];
  });
}
