---
name: clr-datagrid
description: Build tables with the Clarity Angular datagrid (`clr-datagrid` from `@clr/angular`). Use when adding or changing a `<clr-datagrid>` — sorting, filtering, pagination, selection, expandable rows, detail pane, virtual scroll, or server-driven data. For the column-definition based `<appfx-datagrid>` from `@clr/addons`, use the appfx-datagrid skill instead.
metadata:
  docs: /documentation/datagrid
---

# Clarity datagrid (`clr-datagrid`)

## Setup

```ts
import { ClrDatagridModule, ClrDatagridStateInterface } from '@clr/angular';

@Component({
  imports: [ClrDatagridModule],
  // ...
})
```

The datagrid components are NgModule-declared (not standalone) — always import `ClrDatagridModule` (or `ClarityModule`), never the individual component classes.

## Pick the data mode first

| Mode           | When                                  | Rows                           | Who sorts/filters/pages       |
| -------------- | ------------------------------------- | ------------------------------ | ----------------------------- |
| Client-side    | All data is in memory                 | `*clrDgItems="let x of items"` | The datagrid                  |
| Server-driven  | Backend pages/sorts/filters           | `@for` + `[clrDgItem]`         | Your `(clrDgRefresh)` handler |
| Virtual scroll | Very large in-memory lists, no paging | `ng-template ClrVirtualScroll` | The datagrid (rendering only) |

Never use `*clrDgItems` on a server-driven grid — it re-sorts and re-pages an already-paged subset.

## Client-side

```html
<clr-datagrid [clrDgSelectionType]="'multi'" [(clrDgSelected)]="selected">
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
  <clr-dg-column [clrDgField]="'age'" [clrDgColType]="'number'">Age</clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users; trackBy: trackById" [clrDgItem]="user">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.age }}</clr-dg-cell>
  </clr-dg-row>

  <clr-dg-placeholder>No users found.</clr-dg-placeholder>

  <clr-dg-footer>
    <clr-dg-pagination #pagination [clrDgPageSize]="10">
      <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50]">Users per page</clr-dg-page-size>
      {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} users
    </clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
```

- `clrDgField` (property path, e.g. `'address.city'`) enables default sort **and** a string filter. `[clrDgColType]="'number'"` switches to a numeric range filter.
- Custom sort: `[clrDgSortBy]="comparator"` (`ClrDatagridComparatorInterface<T>` → `compare(a, b): number`), initial order via `[(clrDgSortOrder)]` (`ClrDatagridSortOrder.ASC | DESC | UNSORTED`).
- Custom filter: `<clr-dg-string-filter [clrDgStringFilter]="f">` (`accepts(item, search)`), `<clr-dg-numeric-filter [clrDgNumericFilter]="f">`, or fully custom `<clr-dg-filter [clrDgFilter]="f">` implementing `ClrDatagridFilterInterface<T>` (`accepts`, `changes`, `isActive`, optional `state`).

## Server-driven

```html
<clr-datagrid (clrDgRefresh)="refresh($event)" [clrDgLoading]="loading">
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>

  @for (user of users; track user.id) {
  <clr-dg-row [clrDgItem]="user">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  </clr-dg-row>
  }

  <clr-dg-footer>
    <clr-dg-pagination [clrDgPageSize]="10" [clrDgTotalItems]="total"></clr-dg-pagination>
  </clr-dg-footer>
</clr-datagrid>
```

```ts
refresh(state: ClrDatagridStateInterface<User>) {
  this.loading = true;
  const size = state.page?.size ?? 10;
  const current = state.page?.current ?? 1;
  // state.sort: { by: string | comparator, reverse: boolean }
  // state.filters: each entry is the filter's `state` object, or the filter instance if it has none
  this.api.fetch({ offset: size * (current - 1), size, sort: state.sort, filters: state.filters }).subscribe(r => {
    this.users = r.items;
    this.total = r.total;
    this.loading = false;
  });
}
```

`[clrDgTotalItems]` is required, otherwise the page count is wrong. One `clrDgRefresh` fires for sort, filter, and page changes together — handle them in one request.

## Selection

- Grid: `[clrDgSelectionType]="'multi' | 'single' | 'none'"` + `[(clrDgSelected)]` (array for multi, single item for single). Any other selection type string throws.
- Every row needs `[clrDgItem]`.
- Lock a row: `[clrDgSelectable]="false"` on `clr-dg-row`.
- Keep selection across refetches: `[clrDgItemsIdentityFn]="(u) => u.id"` and `[clrDgPreserveSelection]="true"`.
- Batch actions: `<clr-dg-action-bar>` with buttons above the columns, enabled from `selected.length`.
- Per-row actions: `<clr-dg-action-overflow>` inside `clr-dg-row` with `<button class="action-item">` children.
- Do **not** use `clrDgRowSelection` (deprecated, accessibility issue). There is no `clrDgSingleSelected` input.

## Row details

Expandable row (inline):

```html
<clr-dg-row *clrDgItems="let user of users" [clrDgItem]="user">
  <clr-dg-cell>{{ user.name }}</clr-dg-cell>
  <clr-dg-row-detail *clrIfExpanded>{{ user.bio }}</clr-dg-row-detail>
</clr-dg-row>
```

Add `[clrDgReplace]="true"` to replace the row cells with the detail. Detail pane (side panel):

```html
<clr-dg-detail *clrIfDetail="let detail">
  <clr-dg-detail-header>{{ detail.name }}</clr-dg-detail-header>
  <clr-dg-detail-body>...</clr-dg-detail-body>
</clr-dg-detail>
```

## Columns extras

- Hide/show: put content inside `<ng-container *clrDgHideableColumn="{ hidden: false }">Label</ng-container>` in the column. It is not an input on `clr-dg-column`.
- Pinning: `[clrDgPinnable]="true"`, `[(clrDgPinned)]`.
- Compact density: `class="datagrid-compact"` on `clr-datagrid` (CSS class, not an input).

## Virtual scroll

```html
<clr-datagrid>
  <clr-dg-column>Name</clr-dg-column>
  <ng-template ClrVirtualScroll let-user [clrVirtualRowsOf]="users" [clrVirtualRowsTrackBy]="trackById">
    <clr-dg-row [clrDgItem]="user"><clr-dg-cell>{{ user.name }}</clr-dg-cell></clr-dg-row>
  </ng-template>
</clr-datagrid>
```

Give the grid a fixed height. No pagination with virtual scroll.

## Rules

- Use `@for (...; track ...)` / `@if` control flow, not `*ngFor` / `*ngIf`.
- Always provide `trackBy` (`*clrDgItems`), `track` (`@for`), or `clrVirtualRowsTrackBy`.
- Icon-only buttons in action bars and overflows need `aria-label`; localize `clrDgActionOverflowButtonLabel`, `clrDgSingleSelectionAriaLabel`, `clrDetailExpandableAriaLabel` where provided.
- Prefer `appfx-datagrid` (`@clr/addons/datagrid`) when the app wants column definitions, advanced filters, export, or persisted settings out of the box.

## References

- Public API: `projects/angular/clarity.api.md` (search `ClrDatagrid`)
- Docs demos: `projects/website/src/app/documentation/demos/datagrid/`
