/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { describe, expect, it } from 'vitest';

import { labelize, normalizeOptions, parseColumns } from '../options';

describe('parseColumns', () => {
  it('parses comma-separated fields with optional types', () => {
    expect(parseColumns('name, age:number ,createdAt:date,active:boolean')).toEqual([
      { field: 'name', type: 'string', label: 'Name' },
      { field: 'age', type: 'number', label: 'Age' },
      { field: 'createdAt', type: 'date', label: 'Created at' },
      { field: 'active', type: 'boolean', label: 'Active' },
    ]);
  });

  it('accepts an array of specs and ignores empty entries and type casing', () => {
    expect(parseColumns(['name', '', 'age:NUMBER'])).toEqual([
      { field: 'name', type: 'string', label: 'Name' },
      { field: 'age', type: 'number', label: 'Age' },
    ]);
  });

  it('rejects missing columns', () => {
    expect(() => parseColumns('')).toThrow(/At least one column/);
    expect(() => parseColumns(undefined)).toThrow(/At least one column/);
    expect(() => parseColumns(' , ')).toThrow(/At least one column/);
  });

  it('rejects unknown types', () => {
    expect(() => parseColumns('name:text')).toThrow(
      /Invalid type "text" for column "name": use one of string, number, date, boolean/
    );
  });

  it('rejects fields that are not property names', () => {
    expect(() => parseColumns('address.city')).toThrow(/Invalid column field "address.city"/);
    expect(() => parseColumns('first name')).toThrow(/Invalid column field "first name"/);
    expect(() => parseColumns('1st')).toThrow(/Invalid column field "1st"/);
  });

  it('rejects duplicate fields and malformed specs', () => {
    expect(() => parseColumns('name,name:string')).toThrow(/Column "name" is listed more than once/);
    expect(() => parseColumns('name:string:Name')).toThrow(/Invalid column "name:string:Name"/);
  });
});

describe('labelize', () => {
  it('turns property names into sentence-case headers', () => {
    expect(labelize('name')).toBe('Name');
    expect(labelize('createdAt')).toBe('Created at');
    expect(labelize('created_at')).toBe('Created at');
    expect(labelize('created-at')).toBe('Created at');
    expect(labelize('id')).toBe('ID');
    expect(labelize('userId')).toBe('User ID');
    expect(labelize('URL')).toBe('URL');
    expect(labelize('HTMLContent')).toBe('HTML content');
    expect(labelize('_private')).toBe('Private');
  });
});

describe('normalizeOptions', () => {
  const base = { name: 'users-list', columns: 'name' };

  it('applies the defaults', () => {
    expect(normalizeOptions(base, 'app')).toEqual({
      className: 'UsersList',
      itemType: 'UsersListItem',
      fileName: 'users-list',
      selector: 'app-users-list',
      columns: [{ field: 'name', type: 'string', label: 'Name' }],
      hasIdColumn: false,
      mode: 'client',
      pagination: true,
      pageSize: 10,
      sort: true,
      filter: true,
      selection: 'none',
      actionBar: false,
      rowActions: false,
      detail: 'none',
      hideableColumns: false,
      compact: false,
      animations: true,
      notes: [],
    });
  });

  it('derives the names from camelCase, PascalCase and kebab-case input', () => {
    for (const name of ['usersList', 'UsersList', 'users-list']) {
      const normalized = normalizeOptions({ ...base, name }, 'app');
      expect(normalized.className).toBe('UsersList');
      expect(normalized.fileName).toBe('users-list');
      expect(normalized.selector).toBe('app-users-list');
    }
  });

  it('requires a name', () => {
    expect(() => normalizeOptions({ ...base, name: ' ' }, 'app')).toThrow(/A component name is required/);
  });

  it('detects an id column', () => {
    expect(normalizeOptions({ ...base, columns: 'id:string,name' }, 'app').hasIdColumn).toBe(true);
  });

  it('turns pagination off for virtual scroll', () => {
    const normalized = normalizeOptions({ ...base, mode: 'virtual-scroll' }, 'app');
    expect(normalized.pagination).toBe(false);
    expect(normalized.notes).toEqual([expect.stringMatching(/Pagination is not used with virtual scroll/)]);
  });

  it('turns filters off when sort is off', () => {
    const normalized = normalizeOptions({ ...base, sort: false }, 'app');
    expect(normalized.filter).toBe(false);
    expect(normalized.notes).toEqual([expect.stringMatching(/filters were disabled/)]);

    expect(normalizeOptions({ ...base, sort: false, filter: false }, 'app').notes).toEqual([]);
  });

  it('selects multi when an action bar is requested without selection', () => {
    const normalized = normalizeOptions({ ...base, actionBar: true }, 'app');
    expect(normalized.selection).toBe('multi');
    expect(normalized.notes).toEqual([expect.stringMatching(/selection was set to "multi"/)]);

    expect(normalizeOptions({ ...base, actionBar: true, selection: 'single' }, 'app').selection).toBe('single');
  });

  it('validates the page size', () => {
    expect(() => normalizeOptions({ ...base, pageSize: 0 }, 'app')).toThrow(/pageSize must be a positive integer/);
    expect(() => normalizeOptions({ ...base, pageSize: 2.5 }, 'app')).toThrow(/pageSize must be a positive integer/);
    expect(normalizeOptions({ ...base, pageSize: 25 }, 'app').pageSize).toBe(25);
  });
});
