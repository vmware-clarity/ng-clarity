/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { posix } from 'path';

export interface ProjectInfo {
  name: string;
  root: string;
  sourceRoot: string;
  projectType: 'application' | 'library';
  prefix?: string;
}

/**
 * Reads the target project from angular.json. Returns `undefined` when there is no angular.json
 * (the schematic then falls back to `src/app` and the `app` prefix).
 */
export function findProject(tree: Tree, projectName?: string): ProjectInfo | undefined {
  if (!tree.exists('angular.json')) {
    if (projectName) {
      throw new SchematicsException(`Project "${projectName}" was requested but there is no angular.json.`);
    }
    return undefined;
  }

  let workspace: { projects?: Record<string, any> };
  try {
    workspace = JSON.parse(tree.readText('angular.json'));
  } catch (error) {
    throw new SchematicsException(`Could not parse angular.json: ${(error as Error).message}`);
  }

  const projects = workspace.projects ?? {};
  const names = Object.keys(projects);
  if (!names.length) {
    throw new SchematicsException('angular.json has no projects.');
  }

  const name = projectName ?? names.find(candidate => projects[candidate]?.projectType !== 'library') ?? names[0];
  const project = projects[name];
  if (!project) {
    throw new SchematicsException(
      `Project "${projectName}" does not exist in angular.json. Available projects: ${names.join(', ')}.`
    );
  }

  const root = normalizePath(project.root ?? '');
  return {
    name,
    root,
    sourceRoot: normalizePath(project.sourceRoot ?? posix.join(root, 'src')),
    projectType: project.projectType === 'library' ? 'library' : 'application',
    prefix: typeof project.prefix === 'string' && project.prefix ? project.prefix : undefined,
  };
}

/** `src/app` for applications, `src/lib` for libraries, relative to the workspace root. */
export function buildDefaultPath(project: ProjectInfo | undefined): string {
  if (!project) {
    return 'src/app';
  }
  return posix.join(project.sourceRoot, project.projectType === 'library' ? 'lib' : 'app');
}

/**
 * Splits a name that may contain a directory (`users/users-list`) into the directory to generate into
 * and the bare component name.
 */
export function parseName(path: string, name: string): { name: string; path: string } {
  const normalized = normalizePath(name);
  const index = normalized.lastIndexOf('/');
  if (index === -1) {
    return { name: normalized, path: normalizePath(path) };
  }
  return {
    name: normalized.slice(index + 1),
    path: normalizePath(posix.join(path, normalized.slice(0, index))),
  };
}

/** Workspace-relative POSIX path without leading `./` or `/` and without a trailing slash. */
export function normalizePath(path: string): string {
  const normalized = posix
    .normalize(path.replace(/\\/g, '/'))
    .replace(/^(\.\/|\/)+/, '')
    .replace(/\/+$/, '');
  return normalized === '.' ? '' : normalized;
}
