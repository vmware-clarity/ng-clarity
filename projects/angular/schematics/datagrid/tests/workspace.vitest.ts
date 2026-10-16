/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { describe, expect, it } from 'vitest';

import { createWorkspace } from './test-helpers';
import { buildDefaultPath, findProject, normalizePath, parseName } from '../workspace';

describe('findProject', () => {
  it('returns undefined without angular.json', () => {
    expect(findProject(new HostTree())).toBeUndefined();
  });

  it('fails when a project is requested without angular.json', () => {
    expect(() => findProject(new HostTree(), 'demo')).toThrow(/there is no angular.json/);
  });

  it('defaults to the first application project', () => {
    expect(findProject(createWorkspace())).toEqual({
      name: 'demo',
      root: '',
      sourceRoot: 'src',
      projectType: 'application',
      prefix: 'demo',
    });
  });

  it('returns the requested project', () => {
    expect(findProject(createWorkspace(), 'shared-lib')).toEqual({
      name: 'shared-lib',
      root: 'projects/shared-lib',
      sourceRoot: 'projects/shared-lib/src',
      projectType: 'library',
      prefix: 'lib',
    });
  });

  it('fails for an unknown project', () => {
    expect(() => findProject(createWorkspace(), 'nope')).toThrow(
      /Project "nope" does not exist in angular.json. Available projects: shared-lib, demo./
    );
  });

  it('derives sourceRoot from root and tolerates a missing prefix', () => {
    const tree = new HostTree();
    tree.create('angular.json', JSON.stringify({ projects: { app: { root: 'apps/app' } } }));
    expect(findProject(tree)).toEqual({
      name: 'app',
      root: 'apps/app',
      sourceRoot: 'apps/app/src',
      projectType: 'application',
      prefix: undefined,
    });
  });

  it('fails on invalid or empty angular.json', () => {
    const invalid = new HostTree();
    invalid.create('angular.json', '{');
    expect(() => findProject(invalid)).toThrow(/Could not parse angular.json/);

    const empty = new HostTree();
    empty.create('angular.json', '{}');
    expect(() => findProject(empty)).toThrow(/angular.json has no projects/);
  });
});

describe('buildDefaultPath', () => {
  it('uses src/app without a project, app for applications and lib for libraries', () => {
    expect(buildDefaultPath(undefined)).toBe('src/app');
    expect(buildDefaultPath(findProject(createWorkspace(), 'demo'))).toBe('src/app');
    expect(buildDefaultPath(findProject(createWorkspace(), 'shared-lib'))).toBe('projects/shared-lib/src/lib');
  });
});

describe('parseName', () => {
  it('splits a directory off the name', () => {
    expect(parseName('src/app', 'users-list')).toEqual({ name: 'users-list', path: 'src/app' });
    expect(parseName('src/app', 'users/users-list')).toEqual({ name: 'users-list', path: 'src/app/users' });
    expect(parseName('src/app/', './admin/users/list')).toEqual({ name: 'list', path: 'src/app/admin/users' });
  });
});

describe('normalizePath', () => {
  it('normalizes to a workspace-relative POSIX path', () => {
    expect(normalizePath('/src/app/')).toBe('src/app');
    expect(normalizePath('./src//app')).toBe('src/app');
    expect(normalizePath('src\\app')).toBe('src/app');
    expect(normalizePath('')).toBe('');
    expect(normalizePath('.')).toBe('');
  });
});
