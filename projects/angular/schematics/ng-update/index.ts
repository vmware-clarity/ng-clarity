/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { chain, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

// Schematic for the ticket -> https://jira.eng.vmware.com/browse/CDE-55
// Schematic for the ticket -> https://jira.eng.vmware.com/browse/CDE-56
// TBD - list out the actual CSS classes and variables
const replacements = {
  'lib-breadcrumb': 'clr-breadcrumb',
};

// Schematic for the ticket -> https://jira.eng.vmware.com/browse/CDE-53
const inputsToRemove = [
  '\\[clrStackViewSetsize\\]="[^"]*"',
  "\\[clrStackViewSetsize\\]='[^']*'",
  '\\[clrStackViewSetsize\\]=[^\\s>]*',
  '\\[clrStackViewPosinset\\]="[^"]*"',
  "\\[clrStackViewPosinset\\]='[^']*'",
  '\\[clrStackViewPosinset\\]=[^\\s>]*',
];

export function migration16(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const targetDirs = getTargetDirs(tree);
    const filePaths = getFilePaths(tree, targetDirs);
    const rules = filePaths.map(filePath =>
      chain([renameTheSpecifics(filePath, replacements), removeSpecificInputs(filePath, inputsToRemove)])
    );

    return chain(rules)(tree, _context);
  };
}

function getTargetDirs(tree: Tree) {
  const workspaceConfig = tree.read('/angular.json');
  if (!workspaceConfig) {
    throw new SchematicsException('Could not find Angular workspace configuration');
  }
  const workspace = JSON.parse(workspaceConfig.toString());
  const projects = Object.keys(workspace['projects']);

  const dirs: string[] = [];
  if (projects.length > 1) {
    for (const p of projects) {
      const path = '/' + p + '/' + workspace['projects'][p]['sourceRoot'] + '/';
      dirs.push(path);
    }
  } else {
    const path = '/' + workspace['projects'][projects[0]]['sourceRoot'] + '/';
    dirs.push(path);
  }
  return dirs;
}

// Iterate through the tree and collects all file paths (.ts, .html, .scss, .css) which will be processed
function getFilePaths(tree: Tree, rootDirs: string[]): string[] {
  const filePaths: string[] = [];

  rootDirs.forEach(rootDir => {
    tree.getDir(rootDir).visit(filePath => {
      if (
        !filePath.includes('/environments/') &&
        (filePath.endsWith('.ts') ||
          filePath.endsWith('.html') ||
          filePath.endsWith('scss') ||
          filePath.endsWith('.css'))
      ) {
        filePaths.push(filePath);
      }
    });
  });
  return filePaths;
}

// Read through all the target files. Find and replace the css tokens
function renameTheSpecifics(filePath: string, replacements: { [key: string]: string }): Rule {
  return (tree: Tree) => {
    const fileContent = tree.read(filePath);
    if (!fileContent) {
      return tree;
    }

    const content = fileContent.toString();
    let newContent = content;

    for (const [oldValue, newValue] of Object.entries(replacements)) {
      const regex = new RegExp(oldValue, 'g');
      newContent = newContent.replace(regex, newValue);
    }

    if (newContent !== content) {
      tree.overwrite(filePath, newContent);
    }

    return tree;
  };
}

function removeSpecificInputs(filePath: string, inputsToRemove: string[]): Rule {
  return (tree: Tree) => {
    const fileContent = tree.read(filePath);
    if (!fileContent) {
      return tree;
    }

    const content = fileContent.toString();

    const newContent = inputsToRemove.reduce((acc, inputRegex) => {
      const regex = new RegExp(inputRegex, 'g');
      return acc.replace(regex, '');
    }, content);

    if (newContent !== content) {
      tree.overwrite(filePath, newContent);
    }

    return tree;
  };
}
