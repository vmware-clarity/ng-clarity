/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { createContext, createWorkspace, run } from './test-helpers';
import { datagrid } from '../index';
import { normalizeOptions } from '../options';

describe('datagrid schematic', () => {
  describe('files', () => {
    it('creates <name>.ts and <name>.html in a folder under the project source root', () => {
      const { tree, context } = run({});

      const files: string[] = [];
      tree.getDir('src/app/users-list').visit(file => files.push(file));
      expect(files).toEqual(['/src/app/users-list/users-list.ts', '/src/app/users-list/users-list.html']);
      expect(context.messages.map(message => message.message)).toEqual([
        'CREATE src/app/users-list/users-list.ts',
        'CREATE src/app/users-list/users-list.html',
        'UPDATE src/app/app.config.ts (provideAnimationsAsync())',
        'Next: add <demo-users-list> to a template, and load your rows into UsersList.items.',
      ]);
    });

    it('uses the project prefix for the selector and the class name from the file name', () => {
      const { ts } = run({ name: 'usersList' });

      expect(ts).toContain(`selector: 'demo-users-list'`);
      expect(ts).toContain(`templateUrl: './users-list.html'`);
      expect(ts).toContain('export class UsersList {');
      expect(ts).toContain('export interface UsersListItem {');
    });

    it('honors --prefix, --project, --path and --flat', () => {
      const { tree } = run({ prefix: 'adm', project: 'shared-lib', flat: true });
      expect(tree.exists('projects/shared-lib/src/lib/users-list.ts')).toBe(true);
      expect(tree.readText('projects/shared-lib/src/lib/users-list.ts')).toContain(`selector: 'adm-users-list'`);

      const withPath = run({ path: '/src/app/admin/' });
      expect(withPath.tree.exists('src/app/admin/users-list/users-list.ts')).toBe(true);
    });

    it('accepts a directory in the name', () => {
      const { tree } = run({ name: 'users/users-list' });
      expect(tree.exists('src/app/users/users-list/users-list.ts')).toBe(true);
      expect(tree.readText('src/app/users/users-list/users-list.ts')).toContain('export class UsersList {');
    });

    it('falls back to src/app and the app prefix without angular.json', () => {
      const tree = new HostTree();
      const { ts } = run({}, tree);
      expect(tree.exists('src/app/users-list/users-list.ts')).toBe(true);
      expect(ts).toContain(`selector: 'app-users-list'`);
    });

    it('refuses to overwrite existing files', () => {
      const tree = createWorkspace();
      tree.create('src/app/users-list/users-list.html', '');
      expect(() => run({}, tree)).toThrow('src/app/users-list/users-list.html already exists.');
    });

    it('rejects missing columns before touching the tree', () => {
      const tree = createWorkspace();
      expect(() => datagrid({ name: 'users-list', columns: '' })(tree, createContext())).toThrow(/At least one column/);
      expect(tree.exists('src/app/users-list/users-list.ts')).toBe(false);
    });
  });

  describe('columns', () => {
    it('types the item interface from the column types and adds an id for tracking', () => {
      const { ts } = run({ columns: 'name,age:number,createdAt:date,active:boolean' });

      expect(ts).toContain(
        'export interface UsersListItem {\n' +
          '  /** Identifies a row; used to track rows and keep the selection stable. */\n' +
          '  id: number;\n' +
          '  name: string;\n' +
          '  age: number;\n' +
          '  createdAt: Date;\n' +
          '  active: boolean;\n' +
          '}'
      );
    });

    it('keeps a declared id column and tracks by its type', () => {
      const { ts } = run({ columns: 'id:string,name' });

      expect(ts).toContain('export interface UsersListItem {\n  id: string;\n  name: string;\n}');
      expect(ts).toContain('trackById(_index: number, item: UsersListItem): string {\n    return item.id;\n  }');
      expect(ts).not.toContain('Identifies a row');
    });

    it('renders a column and a cell per column, with sort and filter per type', () => {
      const { html, ts } = run({ columns: 'name,age:number,createdAt:date,active:boolean' });

      expect(html).toContain(`<clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>`);
      expect(html).toContain(`<clr-dg-column [clrDgField]="'age'" [clrDgColType]="'number'">Age</clr-dg-column>`);
      expect(html).toContain(`<clr-dg-column [clrDgSortBy]="'createdAt'">Created at</clr-dg-column>`);
      expect(html).toContain(`<clr-dg-column [clrDgSortBy]="'active'">Active</clr-dg-column>`);

      expect(html).toContain('<clr-dg-cell>{{ item.name }}</clr-dg-cell>');
      expect(html).toContain('<clr-dg-cell>{{ item.age }}</clr-dg-cell>');
      expect(html).toContain('<clr-dg-cell>{{ item.createdAt | date }}</clr-dg-cell>');
      expect(html).toContain(`<clr-dg-cell>{{ item.active ? 'Yes' : 'No' }}</clr-dg-cell>`);

      expect(ts).toContain(`import { DatePipe } from '@angular/common';`);
      expect(ts).toContain('imports: [ClrDatagridModule, DatePipe],');
    });

    it('does not import DatePipe without a date column', () => {
      const { ts } = run({});
      expect(ts).not.toContain('DatePipe');
      expect(ts).toContain('imports: [ClrDatagridModule],');
    });

    it('drops the filters with --filter=false and all sorting with --sort=false', () => {
      const noFilter = run({ columns: 'name,age:number', filter: false }).html;
      expect(noFilter).toContain(`<clr-dg-column [clrDgSortBy]="'name'">Name</clr-dg-column>`);
      expect(noFilter).toContain(`<clr-dg-column [clrDgSortBy]="'age'">Age</clr-dg-column>`);
      expect(noFilter).not.toContain('clrDgColType');

      const noSort = run({ columns: 'name,age:number', sort: false }).html;
      expect(noSort).toContain('<clr-dg-column>Name</clr-dg-column>');
      expect(noSort).toContain('<clr-dg-column>Age</clr-dg-column>');
      expect(noSort).not.toContain('clrDgField');
      expect(noSort).not.toContain('clrDgSortBy');
    });

    it('wraps the headers for hideable columns', () => {
      const { html } = run({ hideableColumns: true });
      expect(html).toContain(
        `  <clr-dg-column [clrDgField]="'name'">\n` +
          `    <ng-container *clrDgHideableColumn="{ hidden: false }">Name</ng-container>\n` +
          `  </clr-dg-column>`
      );
    });
  });

  describe('modes', () => {
    it('client: iterates with *clrDgItems and trackBy and pages in the footer', () => {
      const { html, ts } = run({});

      expect(html).toContain('<clr-datagrid>');
      expect(html).toContain('<clr-dg-row *clrDgItems="let item of items; trackBy: trackById" [clrDgItem]="item">');
      expect(html).toContain('<clr-dg-placeholder>No items found.</clr-dg-placeholder>');
      expect(html).toContain(
        '  <clr-dg-footer>\n' +
          '    <clr-dg-pagination #pagination [clrDgPageSize]="10">\n' +
          '      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50]">Items per page</clr-dg-page-size>\n' +
          '      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} items\n' +
          '    </clr-dg-pagination>\n' +
          '  </clr-dg-footer>'
      );
      expect(html).not.toContain('@for');
      expect(html).not.toContain('clrDgRefresh');
      expect(html).not.toContain('clrDgTotalItems');

      expect(ts).toContain('/** TODO: load your rows into this array. */\n  items: UsersListItem[] = [];');
      expect(ts).toContain('trackById(_index: number, item: UsersListItem): number');
      expect(ts).not.toContain('ClrDatagridStateInterface');
      expect(ts).not.toContain('loading');
    });

    it('server: iterates with @for, handles clrDgRefresh and reports the total', () => {
      const { html, ts } = run({ mode: 'server', pageSize: 20 });

      expect(html).toContain('<clr-datagrid (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading">');
      expect(html).toContain('  @for (item of items; track item.id) {\n    <clr-dg-row [clrDgItem]="item">');
      expect(html).toContain('<clr-dg-pagination #pagination [clrDgPageSize]="20" [clrDgTotalItems]="total">');
      expect(html).toContain('[clrPageSizeOptions]="[20, 40, 100]"');
      expect(html).not.toContain('clrDgItems');

      expect(ts).toContain(`import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';`);
      expect(ts).toContain(`import { Observable, of } from 'rxjs';`);
      expect(ts).toContain('export interface UsersListRequest {');
      expect(ts).toContain('export interface UsersListPage {\n  items: UsersListItem[];\n  total: number;\n}');
      expect(ts).toContain('  loading = false;\n  total = 0;');
      expect(ts).toContain('refresh(state: ClrDatagridStateInterface<UsersListItem>): void {');
      expect(ts).toContain('const size = state.page?.size ?? 20;');
      expect(ts).toContain(
        'this.fetch({ offset: size * (current - 1), size, sort: state.sort, filters: state.filters })'
      );
      expect(ts).toContain('error: () => {\n        this.loading = false;\n      },');
      expect(ts).toContain('private fetch(request: UsersListRequest): Observable<UsersListPage> {');
      expect(ts).toContain('TODO: replace with your API call.');
      expect(ts).not.toContain('trackById');
    });

    it('server without pagination shows the total in the footer', () => {
      const { html } = run({ mode: 'server', pagination: false });
      expect(html).toContain('<clr-dg-footer>{{ total }} items</clr-dg-footer>');
      expect(html).not.toContain('clr-dg-pagination');
    });

    it('virtual-scroll: renders rows with ClrVirtualScroll, a fixed height and no pagination', () => {
      const { html, ts, context } = run({ mode: 'virtual-scroll' });

      expect(html).toContain('<!-- Virtual scroll needs a fixed height on the datagrid. Adjust it to your layout. -->');
      expect(html).toContain('<clr-datagrid style="height: 24rem">');
      expect(html).toContain(
        '  <ng-template ClrVirtualScroll let-item [clrVirtualRowsOf]="items" [clrVirtualRowsTrackBy]="trackById">\n' +
          '    <clr-dg-row [clrDgItem]="item">'
      );
      expect(html).toContain('<clr-dg-footer>{{ items.length }} items</clr-dg-footer>');
      expect(html).not.toContain('clr-dg-pagination');
      expect(html).not.toContain('clrDgItems');
      expect(ts).toContain('trackById(_index: number, item: UsersListItem): number');
      expect(context.messages).toContainEqual({
        level: 'info',
        message: 'Pagination is not used with virtual scroll; the footer shows the row count instead.',
      });
    });

    it('client without pagination shows the row count in the footer', () => {
      const { html } = run({ pagination: false });
      expect(html).toContain('<clr-dg-footer>{{ items.length }} items</clr-dg-footer>');
    });
  });

  describe('selection and actions', () => {
    it('binds the selection type and the selected rows', () => {
      const single = run({ selection: 'single' });
      expect(single.html).toContain(`<clr-datagrid [clrDgSelectionType]="'single'" [(clrDgSelected)]="selected">`);
      expect(single.ts).toContain('selected: UsersListItem[] = [];');

      const multi = run({ selection: 'multi' });
      expect(multi.html).toContain(`[clrDgSelectionType]="'multi'"`);

      const none = run({});
      expect(none.html).not.toContain('clrDgSelect');
      expect(none.ts).not.toContain('selected');
    });

    it('adds an action bar with buttons disabled without a selection, and multi selection by default', () => {
      const { html, ts, context } = run({ actionBar: true });

      expect(html).toContain(`[clrDgSelectionType]="'multi'"`);
      expect(html).toContain(
        '  <clr-dg-action-bar>\n' +
          '    <div class="btn-group">\n' +
          '      <button type="button" class="btn btn-sm btn-secondary" [disabled]="!selected.length" (click)="onEdit(selected)">\n' +
          '        Edit\n' +
          '      </button>\n' +
          '      <button type="button" class="btn btn-sm btn-secondary" [disabled]="!selected.length" (click)="onDelete(selected)">\n' +
          '        Delete\n' +
          '      </button>\n' +
          '    </div>\n' +
          '  </clr-dg-action-bar>'
      );
      expect(ts).toContain('onEdit(items: UsersListItem[]): void {');
      expect(ts).toContain('onDelete(items: UsersListItem[]): void {');
      expect(context.messages).toContainEqual({
        level: 'info',
        message: 'An action bar acts on selected rows; selection was set to "multi".',
      });
    });

    it('adds a row action overflow', () => {
      const { html, ts } = run({ rowActions: true });

      expect(html).toContain(
        '  <clr-dg-row *clrDgItems="let item of items; trackBy: trackById" [clrDgItem]="item">\n' +
          '    <clr-dg-action-overflow>\n' +
          '      <button type="button" class="action-item" (click)="onEdit([item])">Edit</button>\n' +
          '      <button type="button" class="action-item" (click)="onDelete([item])">Delete</button>\n' +
          '    </clr-dg-action-overflow>\n' +
          '    <clr-dg-cell>{{ item.name }}</clr-dg-cell>'
      );
      expect(ts).toContain('onEdit(items: UsersListItem[]): void {');
      expect(html).not.toContain('clrDgSelect');
    });

    it('defines the handlers once when both action bar and row actions are used', () => {
      const { ts } = run({ actionBar: true, rowActions: true });
      expect(ts.match(/onEdit\(items/g)).toHaveLength(1);
      expect(ts.match(/onDelete\(items/g)).toHaveLength(1);
    });
  });

  describe('details', () => {
    it('expandable: adds a row detail inside the row', () => {
      const { html } = run({ detail: 'expandable', columns: 'age:number,name' });
      expect(html).toContain(
        '    <clr-dg-cell>{{ item.name }}</clr-dg-cell>\n' +
          '    <clr-dg-row-detail *clrIfExpanded>\n' +
          '      <!-- TODO: expanded row content -->\n' +
          '      {{ item.name }}\n' +
          '    </clr-dg-row-detail>\n' +
          '  </clr-dg-row>'
      );
      expect(html).not.toContain('clr-dg-detail ');
    });

    it('pane: adds a detail pane after the rows with the first string column as header', () => {
      const { html } = run({ detail: 'pane', mode: 'server', columns: 'age:number,name' });
      expect(html).toContain(
        '  <clr-dg-placeholder>No items found.</clr-dg-placeholder>\n\n' +
          '  <clr-dg-detail *clrIfDetail="let detail">\n' +
          '    <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>\n' +
          '    <clr-dg-detail-body>\n' +
          '      <!-- TODO: detail pane content -->\n' +
          '    </clr-dg-detail-body>\n' +
          '  </clr-dg-detail>\n\n' +
          '  <clr-dg-footer>'
      );
      expect(html).not.toContain('clrIfExpanded');
    });

    it('uses the first column for the header when there is no string column', () => {
      const { html } = run({ detail: 'pane', columns: 'createdAt:date,count:number' });
      expect(html).toContain('<clr-dg-detail-header>{{ detail.createdAt | date }}</clr-dg-detail-header>');
    });
  });

  describe('misc options', () => {
    it('sets the compact density', () => {
      expect(run({ compact: true }).html).toContain('<clr-datagrid clr-density="compact">');
    });

    it('puts every datagrid attribute on its own line when the tag gets long', () => {
      const { html } = run({ compact: true, mode: 'server', selection: 'multi' });
      expect(html).toContain(
        '<clr-datagrid\n' +
          '  clr-density="compact"\n' +
          `  [clrDgSelectionType]="'multi'"\n` +
          '  [(clrDgSelected)]="selected"\n' +
          '  (clrDgRefresh)="refresh($event)"\n' +
          '  [clrDgLoading]="loading"\n' +
          '>'
      );
    });

    it('patches app.config.ts unless --animations=false', () => {
      const patched = run({});
      expect(patched.tree.readText('src/app/app.config.ts')).toContain('provideAnimationsAsync(),');

      const skipped = run({ animations: false });
      expect(skipped.tree.readText('src/app/app.config.ts')).not.toContain('provideAnimationsAsync');
      expect(skipped.context.messages.some(message => message.level === 'warn')).toBe(false);
    });

    it('generates only Clarity names that exist in the public API report', () => {
      const api = readFileSync(join(__dirname, '../../../data/data.api.md'), 'utf8');
      const { html } = run({
        columns: 'name,age:number,createdAt:date,active:boolean',
        mode: 'server',
        selection: 'multi',
        actionBar: true,
        rowActions: true,
        detail: 'pane',
        hideableColumns: true,
        compact: true,
      });
      const names = new Set([
        ...(html.match(/\bclr[A-Z]\w*/g) ?? []),
        ...(html.match(/\bClrVirtualScroll\b/g) ?? []),
        ...(html.match(/<(clr-[a-z-]+)/g) ?? []).map(tag => tag.slice(1)),
      ]);
      expect(names.size).toBeGreaterThan(10);
      for (const name of names) {
        expect(api, `${name} is not in data.api.md`).toContain(name);
      }
    });
  });

  describe('schema.json', () => {
    const schema = JSON.parse(readFileSync(join(__dirname, '../schema.json'), 'utf8'));
    const collection = JSON.parse(readFileSync(join(__dirname, '../../collection.json'), 'utf8'));

    it('is registered in collection.json', () => {
      expect(collection.schematics.datagrid).toEqual({
        description: expect.stringContaining('ng generate @clr/angular:datagrid'),
        factory: './datagrid/index#datagrid',
        schema: './datagrid/schema.json',
      });
    });

    it('declares the same defaults as normalizeOptions', () => {
      const defaults = Object.fromEntries(
        Object.entries(schema.properties as Record<string, { default?: unknown }>)
          .filter(([, property]) => property.default !== undefined)
          .map(([key, property]) => [key, property.default])
      );
      const normalized = normalizeOptions({ name: 'x', columns: 'name' }, 'app') as unknown as Record<string, unknown>;

      expect(Object.keys(defaults).sort()).toEqual([
        'actionBar',
        'animations',
        'compact',
        'detail',
        'filter',
        'flat',
        'hideableColumns',
        'mode',
        'pageSize',
        'pagination',
        'rowActions',
        'selection',
        'sort',
      ]);
      for (const [key, value] of Object.entries(defaults)) {
        if (key !== 'flat') {
          expect(normalized[key], key).toBe(value);
        }
      }
    });

    it('requires name and columns and lists every option once', () => {
      expect(schema.required).toEqual(['name', 'columns']);
      expect(schema.additionalProperties).toBe(false);
      expect(Object.keys(schema.properties).sort()).toEqual([
        'actionBar',
        'animations',
        'columns',
        'compact',
        'detail',
        'filter',
        'flat',
        'hideableColumns',
        'mode',
        'name',
        'pageSize',
        'pagination',
        'path',
        'prefix',
        'project',
        'rowActions',
        'selection',
        'sort',
      ]);
    });
  });
});
