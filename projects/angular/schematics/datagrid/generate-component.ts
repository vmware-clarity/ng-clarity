/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnDefinition, NormalizedOptions } from './options';

const TS_TYPES: Record<ColumnDefinition['type'], string> = {
  string: 'string',
  number: 'number',
  date: 'Date',
  boolean: 'boolean',
};

/** Generates the component class file (`<name>.ts`). */
export function generateComponentTs(options: NormalizedOptions): string {
  const { className, itemType, fileName, selector, mode, columns } = options;
  const isServer = mode === 'server';
  const hasActions = options.actionBar || options.rowActions;
  const hasDate = columns.some(column => column.type === 'date');
  const idType = columns.find(column => column.field === 'id')?.type ?? 'number';

  const imports = [
    hasDate ? `import { DatePipe } from '@angular/common';` : '',
    `import { Component } from '@angular/core';`,
    isServer
      ? `import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';`
      : `import { ClrDatagridModule } from '@clr/angular';`,
    isServer ? `import { Observable, of } from 'rxjs';` : '',
  ].filter(line => line.length > 0);

  const itemFields = [
    ...(options.hasIdColumn
      ? []
      : [`  /** Identifies a row; used to track rows and keep the selection stable. */\n  id: number;`]),
    ...columns.map(column => `  ${column.field}: ${TS_TYPES[column.type]};`),
  ];

  const interfaces = [
    `export interface ${itemType} {\n${itemFields.join('\n')}\n}`,
    ...(isServer
      ? [
          `export interface ${className}Request {\n` +
            `  offset: number;\n` +
            `  size: number;\n` +
            `  sort?: ClrDatagridStateInterface<${itemType}>['sort'];\n` +
            `  filters?: ClrDatagridStateInterface<${itemType}>['filters'];\n` +
            `}`,
          `export interface ${className}Page {\n  items: ${itemType}[];\n  total: number;\n}`,
        ]
      : []),
  ];

  const fields = [
    isServer
      ? `  items: ${itemType}[] = [];`
      : `  /** TODO: load your rows into this array. */\n  items: ${itemType}[] = [];`,
    options.selection !== 'none' ? `  selected: ${itemType}[] = [];` : '',
    isServer ? `  loading = false;` : '',
    isServer ? `  total = 0;` : '',
  ].filter(line => line.length > 0);

  const methods: string[] = [];
  if (!isServer) {
    methods.push(`  trackById(_index: number, item: ${itemType}): ${TS_TYPES[idType]} {\n    return item.id;\n  }`);
  }
  if (isServer) {
    methods.push(
      `  refresh(state: ClrDatagridStateInterface<${itemType}>): void {\n` +
        `    const size = state.page?.size ?? ${options.pageSize};\n` +
        `    const current = state.page?.current ?? 1;\n` +
        `    this.loading = true;\n` +
        `    this.fetch({ offset: size * (current - 1), size, sort: state.sort, filters: state.filters }).subscribe({\n` +
        `      next: page => {\n` +
        `        this.items = page.items;\n` +
        `        this.total = page.total;\n` +
        `        this.loading = false;\n` +
        `      },\n` +
        `      error: () => {\n` +
        `        this.loading = false;\n` +
        `      },\n` +
        `    });\n` +
        `  }`
    );
  }
  if (hasActions) {
    methods.push(stubMethod(className, 'onEdit', itemType), stubMethod(className, 'onDelete', itemType));
  }
  if (isServer) {
    methods.push(
      `  /**\n` +
        `   * TODO: replace with your API call.\n` +
        `   * \`request.sort.by\` is the \`clrDgField\` of the sorted column and \`request.sort.reverse\` its direction.\n` +
        `   * \`request.filters\` holds the state of each active built-in filter:\n` +
        `   * \`{ property, value }\` for string filters and \`{ property, low, high }\` for number filters.\n` +
        `   */\n` +
        `  private fetch(request: ${className}Request): Observable<${className}Page> {\n` +
        `    console.warn('${className}.fetch is not implemented', request);\n` +
        `    return of({ items: [], total: 0 });\n` +
        `  }`
    );
  }

  const componentImports = hasDate ? 'ClrDatagridModule, DatePipe' : 'ClrDatagridModule';

  return (
    `${imports.join('\n')}\n\n` +
    `${interfaces.join('\n\n')}\n\n` +
    `@Component({\n` +
    `  selector: '${selector}',\n` +
    `  imports: [${componentImports}],\n` +
    `  templateUrl: './${fileName}.html',\n` +
    `})\n` +
    `export class ${className} {\n` +
    `${fields.join('\n')}\n\n` +
    `${methods.join('\n\n')}\n` +
    `}\n`
  );
}

function stubMethod(className: string, name: string, itemType: string): string {
  return (
    `  ${name}(items: ${itemType}[]): void {\n` +
    `    // TODO: implement\n` +
    `    console.warn('${className}.${name} is not implemented', items);\n` +
    `  }`
  );
}

/** Generates the template file (`<name>.html`). */
export function generateComponentHtml(options: NormalizedOptions): string {
  const { mode, columns } = options;
  const isServer = mode === 'server';
  const isVirtual = mode === 'virtual-scroll';
  const lines: string[] = [];

  if (isVirtual) {
    lines.push('<!-- Virtual scroll needs a fixed height on the datagrid. Adjust it to your layout. -->');
  }

  const gridAttributes = [
    options.compact ? 'class="datagrid-compact"' : '',
    options.selection !== 'none' ? `[clrDgSelectionType]="'${options.selection}'"` : '',
    options.selection !== 'none' ? '[(clrDgSelected)]="selected"' : '',
    isServer ? '(clrDgRefresh)="refresh($event)"' : '',
    isServer ? '[clrDgLoading]="loading"' : '',
    isVirtual ? 'style="height: 24rem"' : '',
  ].filter(attribute => attribute.length > 0);
  lines.push(...openTag('clr-datagrid', gridAttributes, 0));

  if (options.actionBar) {
    lines.push(
      '  <clr-dg-action-bar>',
      '    <div class="btn-group">',
      '      <button type="button" class="btn btn-sm btn-secondary" [disabled]="!selected.length" (click)="onEdit(selected)">',
      '        Edit',
      '      </button>',
      '      <button type="button" class="btn btn-sm btn-secondary" [disabled]="!selected.length" (click)="onDelete(selected)">',
      '        Delete',
      '      </button>',
      '    </div>',
      '  </clr-dg-action-bar>',
      ''
    );
  }

  for (const column of columns) {
    lines.push(...columnElement(column, options));
  }
  lines.push('');

  const row = rowElement(options);
  if (isServer) {
    lines.push('  @for (item of items; track item.id) {', ...indent(row, 2), '  }');
  } else if (isVirtual) {
    lines.push(
      '  <ng-template ClrVirtualScroll let-item [clrVirtualRowsOf]="items" [clrVirtualRowsTrackBy]="trackById">',
      ...indent(row, 2),
      '  </ng-template>'
    );
  } else {
    lines.push(...row);
  }
  lines.push('', '  <clr-dg-placeholder>No items found.</clr-dg-placeholder>');

  if (options.detail === 'pane') {
    lines.push(
      '',
      '  <clr-dg-detail *clrIfDetail="let detail">',
      `    <clr-dg-detail-header>${cellExpression(headerColumn(columns), 'detail')}</clr-dg-detail-header>`,
      '    <clr-dg-detail-body>',
      '      <!-- TODO: detail pane content -->',
      '    </clr-dg-detail-body>',
      '  </clr-dg-detail>'
    );
  }

  lines.push('', ...footerElement(options), '</clr-datagrid>');
  return `${lines.join('\n')}\n`;
}

function columnElement(column: ColumnDefinition, options: NormalizedOptions): string[] {
  const attributes: string[] = [];
  if (options.sort) {
    const filterable = options.filter && (column.type === 'string' || column.type === 'number');
    attributes.push(filterable ? `[clrDgField]="'${column.field}'"` : `[clrDgSortBy]="'${column.field}'"`);
    if (filterable && column.type === 'number') {
      attributes.push(`[clrDgColType]="'number'"`);
    }
  }

  const open = `  <clr-dg-column${attributes.length ? ` ${attributes.join(' ')}` : ''}>`;
  if (options.hideableColumns) {
    return [
      open,
      `    <ng-container *clrDgHideableColumn="{ hidden: false }">${column.label}</ng-container>`,
      '  </clr-dg-column>',
    ];
  }
  return [`${open}${column.label}</clr-dg-column>`];
}

function rowElement(options: NormalizedOptions): string[] {
  const attributes =
    options.mode === 'client'
      ? ['*clrDgItems="let item of items; trackBy: trackById"', '[clrDgItem]="item"']
      : ['[clrDgItem]="item"'];
  const lines = openTag('clr-dg-row', attributes, 2);

  if (options.rowActions) {
    lines.push(
      '    <clr-dg-action-overflow>',
      '      <button type="button" class="action-item" (click)="onEdit([item])">Edit</button>',
      '      <button type="button" class="action-item" (click)="onDelete([item])">Delete</button>',
      '    </clr-dg-action-overflow>'
    );
  }

  for (const column of options.columns) {
    lines.push(`    <clr-dg-cell>${cellExpression(column, 'item')}</clr-dg-cell>`);
  }

  if (options.detail === 'expandable') {
    lines.push(
      '    <clr-dg-row-detail *clrIfExpanded>',
      '      <!-- TODO: expanded row content -->',
      `      ${cellExpression(headerColumn(options.columns), 'item')}`,
      '    </clr-dg-row-detail>'
    );
  }

  lines.push('  </clr-dg-row>');
  return lines;
}

function footerElement(options: NormalizedOptions): string[] {
  if (!options.pagination) {
    const count = options.mode === 'server' ? '{{ total }}' : '{{ items.length }}';
    return [`  <clr-dg-footer>${count} items</clr-dg-footer>`];
  }

  const { pageSize } = options;
  const total = options.mode === 'server' ? ' [clrDgTotalItems]="total"' : '';
  return [
    '  <clr-dg-footer>',
    `    <clr-dg-pagination #pagination [clrDgPageSize]="${pageSize}"${total}>`,
    `      <clr-dg-page-size [clrPageSizeOptions]="[${pageSize}, ${pageSize * 2}, ${pageSize * 5}]">Items per page</clr-dg-page-size>`,
    '      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} items',
    '    </clr-dg-pagination>',
    '  </clr-dg-footer>',
  ];
}

/** The column shown in a detail header: the first string column, or the first column. */
function headerColumn(columns: ColumnDefinition[]): ColumnDefinition {
  return columns.find(column => column.type === 'string') ?? columns[0];
}

function cellExpression(column: ColumnDefinition, variable: string): string {
  switch (column.type) {
    case 'date':
      return `{{ ${variable}.${column.field} | date }}`;
    case 'boolean':
      return `{{ ${variable}.${column.field} ? 'Yes' : 'No' }}`;
    default:
      return `{{ ${variable}.${column.field} }}`;
  }
}

/** `<tag a b>` on one line, or one attribute per line when it would get long. */
function openTag(tag: string, attributes: string[], indentSize: number): string[] {
  const pad = ' '.repeat(indentSize);
  const inline = `${pad}<${tag}${attributes.length ? ` ${attributes.join(' ')}` : ''}>`;
  if (inline.length <= 120) {
    return [inline];
  }
  return [`${pad}<${tag}`, ...attributes.map(attribute => `${pad}  ${attribute}`), `${pad}>`];
}

function indent(lines: string[], size: number): string[] {
  const pad = ' '.repeat(size);
  return lines.map(line => (line.length ? `${pad}${line}` : line));
}
