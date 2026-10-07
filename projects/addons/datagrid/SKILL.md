---
name: appfx-datagrid
description: Build tables with the AppFX datagrid (`<appfx-datagrid>` from `@clr/addons/datagrid`) — a column-definition driven wrapper over the Clarity datagrid with quick/advanced filters, export, action bar, row actions, detail pane, settings persistence, column ordering, drag-drop, and virtual scroll. Use when adding or changing an `appfx-datagrid`, `ColumnDefinition`, or `@clr/addons/datagrid-filters` filter definitions.
metadata:
  docs: /documentation/advanced-datagrid
---

# AppFX datagrid (`appfx-datagrid`)

## When to use it vs `clr-datagrid`

Use `appfx-datagrid` for complex, configuration-driven grids: columns are data (`ColumnDefinition[]`), and the grid needs several of advanced filters, export, column toggle, action bar, row actions, persisted settings, or column ordering. These come built-in, along with a11y and l10n.

For a simple list or table, `clr-datagrid` is the default. Don't switch an existing `clr-datagrid` to `appfx-datagrid` unless asked.

Use plain `clr-datagrid` (see the clr-datagrid skill) when every cell needs custom markup or you need structures the column model can't express. The AppFX column-ordering, toggle, export, and cell/filter container pieces are internal — they cannot be used on a plain `clr-datagrid`.

## Setup

```ts
import { ActionClickEvent, ActionDefinition, AppfxDatagridModule, ClientSideExportConfig, ColumnDefinition } from '@clr/addons/datagrid';
import { SelectionType } from '@clr/angular/data/datagrid';
import { ClrDatagridStateInterface } from '@clr/angular';

@Component({
  imports: [AppfxDatagridModule],
  // ...
})
```

Components are NgModule-declared (not standalone). Optional app-level: `AppfxDatagridModule.forRoot(MyErrorNotifiableService)`. Filter definitions from `@clr/addons/datagrid-filters` are plain classes; the filter UI is rendered inside `appfx-datagrid`.

## Client-side

```ts
columns: ColumnDefinition<Vm>[] = [
  { uid: 'name', displayName: 'VM Name', field: 'name' },
  { uid: 'state', displayName: 'State', field: 'state', width: '120px' },
  { uid: 'host', displayName: 'Host', field: 'host.name', hidden: true },
];
filteredVms: Vm[] = [];
selected: Vm[] = [];
loading = false;
exportConfig: ClientSideExportConfig = { columnDefinitions: [] };
readonly SelectionType = SelectionType;
onSearch(term: string): void {}
```

```html
<appfx-datagrid
  [gridItems]="filteredVms"
  [columns]="columns"
  [trackByGridItemProperty]="'id'"
  [selectionType]="SelectionType.Multi"
  [selectedItems]="selected"
  (selectedItemsChange)="selected = $event"
  [loading]="loading"
  [pageSize]="10"
  [pageSizeOptions]="[10, 20, 50]"
  [footerModel]="{ clientSideExportConfig: exportConfig }"
  (searchTermChange)="onSearch($event)"
>
</appfx-datagrid>
```

Do not set `totalItems` in client mode — the grid computes it. `footerModel` replaces the whole default object (only `showFooter` falls back to `true`), so pass every non-default flag you need.

## Server-driven

```ts
page: Vm[] = [];
total = 0;
pageSize = 20;
loading = false;
onRefresh(state: ClrDatagridStateInterface): void {}
onExport(event: unknown): void {}
```

```html
<appfx-datagrid
  appfxPreserveSelection
  [trackByGridItemProperty]="'id'"
  [serverDrivenDatagrid]="true"
  [gridItems]="page"
  [columns]="columns"
  [totalItems]="total"
  [loading]="loading"
  [pageSize]="pageSize"
  [footerModel]="{ enableCustomExport: true }"
  (refreshGridData)="onRefresh($event)"
  (exportDataEvent)="onExport($event)"
>
</appfx-datagrid>
```

`onRefresh(state: ClrDatagridStateInterface)` receives page/sort/filters; fetch and assign a **new** `gridItems` array plus `totalItems`.

## Filters (`@clr/addons/datagrid-filters`)

```ts
import { FilterMode, StringPropertyDefinition, NumericPropertyDefinition, EnumPropertyDefinition, PropertyFilter } from '@clr/addons/datagrid-filters';

filterableProperties = [
  new StringPropertyDefinition('VM Name', 'name'),
  new NumericPropertyDefinition('Memory', 'memory'),
  new EnumPropertyDefinition('State', 'state', new Map([['on', 'Powered On'], ['off', 'Powered Off']])),
];
filteredItems: Vm[] = [];
readonly FilterMode = FilterMode;
onAdvancedFilter(filter: PropertyFilter): void {}
onSearch(term: string): void {}
```

```html
<appfx-datagrid
  [gridItems]="filteredItems"
  [columns]="columns"
  [filterableProperties]="filterableProperties"
  [filterMode]="FilterMode.Advanced"
  (advancedFilterChange)="onAdvancedFilter($event)"
  (searchTermChange)="onSearch($event)"
>
</appfx-datagrid>
```

- `FilterMode`: `Quick` = search box only; `Advanced` = selector between search box and advanced filter; `AdvancedOnly` = advanced filter only.
- Enum filter labels should match what the column renders, or render the column through the same map.
- The grid only **emits** filters — apply them to the data yourself (`PropertyFilter { criteria: PropertyPredicate[], operator }`) and pass the result as `gridItems`.
- Other definitions: `DateTimePropertyDefinition`, `UserPropertyDefinition` (requires providing `DatagridFiltersUserService`).
- Per-column filters: `ColumnDefinition.stringFilter` or `ColumnDefinition.filter` (a `ColumnFilter<T>` component type).

## Actions

```ts
actionBarActions: ActionDefinition[] = [
  { id: 'add', label: 'Add', enabled: true, icon: 'plus' },
  { id: 'delete', label: 'Delete', enabled: false },
];
rowActions: ActionDefinition[] = [{ id: 'edit', label: 'Edit', enabled: true }];
onAction(event: ActionClickEvent): void {}
```

```html
<appfx-datagrid
  [actionBarActions]="actionBarActions"
  [singleRowActions]="rowActions"
  (actionClick)="onAction($event)"
  ...
></appfx-datagrid>
```

`ActionClickEvent` is `{ action, context }`. Update `enabled` by assigning a new array when selection changes.

## Custom cells

```ts
@Component({ selector: 'app-status-cell', template: `<span class="label">{{ item.state }}</span>` })
export class StatusCell implements ColumnRenderer<Vm> {
  item!: Vm;
  column?: ColumnDefinition<Vm>;
}

columns = [{ displayName: 'State', field: 'state', columnRenderer: StatusCell }];
```

## Detail pane and persistence

```html
<appfx-datagrid
  [gridItems]="items"
  [columns]="columns"
  [appfxPersistDatagridSettings]="'vm-list'"
  [detailHeader]="detailHeader"
  [detailBody]="detailBody"
  [rowSelectionMode]="false"
>
  <ng-template #detailHeader let-context><h3>{{ context.name }}</h3></ng-template>
  <ng-template #detailBody let-context>...</ng-template>
</appfx-datagrid>
```

Persistence needs a `PersistDatagridSettingsService` provided via `appfxDatagridPersistSettingsToken` and a stable `uid` on each column (falls back to `field`, then `displayName`). It is injected optionally, so **missing setup fails silently**.

## Rules

- The component is OnPush: always assign new array/object references for `gridItems`, `columns`, `selectedItems`, `layoutModel`, `footerModel`, and actions. In-place mutation will not refresh.
- Bind `layoutModel` / `footerModel` to stable fields (not inline object literals) when values change, to avoid needless re-renders.
- `rowSelectionMode` defaults to `true` (clicking a row selects it). Set `false` when rows open a detail pane or have interactive content.
- Defaults: `selectionType` = `Single`, `layoutModel.compact` = `true`, `disableUnsort` = `true`, column header menu is opt-in (`enableColumnActions`).
- `virtualScrolling` requires `serverDrivenDatagrid` and uses `dataRange` instead of `gridItems`. Rows are fixed height and there are no expandable rows.
- Always set `trackByGridItemProperty` (or `trackByFunction`) when you replace the `gridItems` array, so rows are not recreated (client and server mode).
- Localize with `[datagridLabels]` (`Partial<DatagridStrings>`) or by providing `DatagridStrings` / `DatagridFiltersStrings`.

## References

- API: `projects/addons/datagrid/datagrid.api.md`, `projects/addons/datagrid-filters/datagrid-filters.api.md`
- Docs: `projects/addons/datagrid/README.md`, demos in `projects/website/src/app/documentation/demos/advanced-datagrid/ng/`
