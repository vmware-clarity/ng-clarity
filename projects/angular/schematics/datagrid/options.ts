/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { strings } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';

import { ColumnType, DatagridDetail, DatagridMode, DatagridSchema, DatagridSelection } from './schema';

export const COLUMN_TYPES: readonly ColumnType[] = ['string', 'number', 'date', 'boolean'];

const FIELD_PATTERN = /^[A-Za-z_$][\w$]*$/;

export interface ColumnDefinition {
  /** Property name on the row item, e.g. `createdAt`. */
  field: string;
  type: ColumnType;
  /** Column header, e.g. `Created at`. */
  label: string;
}

/** Fully resolved, validated options. Every rule that derives one option from another is applied here. */
export interface NormalizedOptions {
  /** Component class name, e.g. `UsersList`. */
  className: string;
  /** Row item interface name, e.g. `UsersListItem`. */
  itemType: string;
  /** File name without extension, e.g. `users-list`. */
  fileName: string;
  selector: string;
  columns: ColumnDefinition[];
  /** True when the columns include an `id` field; otherwise the item interface gets `id: number`. */
  hasIdColumn: boolean;
  mode: DatagridMode;
  pagination: boolean;
  pageSize: number;
  sort: boolean;
  filter: boolean;
  selection: DatagridSelection;
  actionBar: boolean;
  rowActions: boolean;
  detail: DatagridDetail;
  hideableColumns: boolean;
  compact: boolean;
  animations: boolean;
  /** Messages about options that were adjusted because of another option. */
  notes: string[];
}

/** Resolves the option defaults and the rules between options. `name` must already be the bare component name. */
export function normalizeOptions(options: DatagridSchema, prefix: string): NormalizedOptions {
  const name = options.name?.trim();
  if (!name) {
    throw new SchematicsException('A component name is required, e.g. `ng generate @clr/angular:datagrid users-list`.');
  }

  const notes: string[] = [];
  const columns = parseColumns(options.columns);
  const mode = options.mode ?? 'client';

  let pagination = options.pagination ?? true;
  if (mode === 'virtual-scroll' && pagination) {
    pagination = false;
    notes.push('Pagination is not used with virtual scroll; the footer shows the row count instead.');
  }

  const pageSize = options.pageSize ?? 10;
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new SchematicsException(`pageSize must be a positive integer, got "${options.pageSize}".`);
  }

  const sort = options.sort ?? true;
  let filter = options.filter ?? true;
  if (filter && !sort) {
    filter = false;
    notes.push('The built-in filters need sortable columns (clrDgField); filters were disabled because sort is off.');
  }

  const actionBar = options.actionBar ?? false;
  let selection = options.selection ?? 'none';
  if (actionBar && selection === 'none') {
    selection = 'multi';
    notes.push('An action bar acts on selected rows; selection was set to "multi".');
  }

  const fileName = strings.dasherize(name);
  const className = strings.classify(name);

  return {
    className,
    itemType: `${className}Item`,
    fileName,
    selector: `${prefix}-${fileName}`,
    columns,
    hasIdColumn: columns.some(column => column.field === 'id'),
    mode,
    pagination,
    pageSize,
    sort,
    filter,
    selection,
    actionBar,
    rowActions: options.rowActions ?? false,
    detail: options.detail ?? 'none',
    hideableColumns: options.hideableColumns ?? false,
    compact: options.compact ?? false,
    animations: options.animations ?? true,
    notes,
  };
}

/**
 * Parses the `columns` option: `field[:type]` entries separated by commas (or an array of them).
 * The type defaults to `string`.
 */
export function parseColumns(columns: string | string[] | undefined): ColumnDefinition[] {
  const specs = (Array.isArray(columns) ? columns : (columns ?? '').split(','))
    .map(spec => spec.trim())
    .filter(spec => spec.length > 0);

  if (!specs.length) {
    throw new SchematicsException(
      'At least one column is required, e.g. `--columns=name,age:number,createdAt:date,active:boolean`.'
    );
  }

  const seen = new Set<string>();
  return specs.map(spec => {
    const [field, rawType, ...rest] = spec.split(':').map(part => part.trim());
    if (rest.length) {
      throw new SchematicsException(`Invalid column "${spec}": expected \`field\` or \`field:type\`.`);
    }
    if (!FIELD_PATTERN.test(field)) {
      throw new SchematicsException(
        `Invalid column field "${field}": use a property name such as \`name\` or \`createdAt\`.`
      );
    }
    const type = (rawType || 'string').toLowerCase() as ColumnType;
    if (!COLUMN_TYPES.includes(type)) {
      throw new SchematicsException(
        `Invalid type "${rawType}" for column "${field}": use one of ${COLUMN_TYPES.join(', ')}.`
      );
    }
    if (seen.has(field)) {
      throw new SchematicsException(`Column "${field}" is listed more than once.`);
    }
    seen.add(field);
    return { field, type, label: labelize(field) };
  });
}

/** `createdAt`, `created_at` and `created-at` all become `Created at`; `id` and `userId` become `ID` and `User ID`. */
export function labelize(field: string): string {
  const words = field
    .replace(/^[$_]+|[$_]+$/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(word => word.length > 0);

  return words
    .map((word, index) => {
      if (word.toLowerCase() === 'id') {
        return 'ID';
      }
      const isAcronym = word.length > 1 && word === word.toUpperCase();
      if (isAcronym) {
        return word;
      }
      return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase();
    })
    .join(' ');
}
