# @clr/angular schematics

Schematics shipped with `@clr/angular`. Sources live in this folder and are compiled by `npm run _build:schematics` into
`dist/clr-angular/schematics`; `collection.json` registers them. Tests are `*.vitest.ts` files run by `npm run _test:schematics`.

| Schematic     | Command                                                  | Purpose                                                                          |
| ------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `datagrid`    | `ng generate @clr/angular:datagrid <name> --columns=...` | Generates a standalone component with a configured `<clr-datagrid>`.             |
| `migrate-v18` | `ng generate @clr/angular:migrate-v18`                   | Applies the v17 to v18 source migrations (also run by `ng update @clr/angular`). |

## `datagrid`

Generates a component whose template and class already follow the Clarity datagrid rules for the chosen data mode,
so humans and AI agents start from a grid that compiles and runs, and only have to bind their data.

```bash
ng generate @clr/angular:datagrid users-list --columns=name,email,age:number,createdAt:date,active:boolean
ng generate @clr/angular:datagrid users/users-admin --columns=name,email,active:boolean --selection=multi --action-bar --row-actions
ng generate @clr/angular:datagrid orders --columns=number,customer,total:number --mode=server --detail=pane
ng generate @clr/angular:datagrid events --columns=name,at:date --mode=virtual-scroll --sort=false
```

Generated files (Angular 20+ naming, no `.component` suffix):

```text
src/app/users-list/
  users-list.ts     standalone component UsersList, imports ClrDatagridModule, the UsersListItem interface
  users-list.html   the <clr-datagrid> template
```

The schematic also adds `provideAnimationsAsync()` to the project's `app.config.ts` when no animations provider is set up,
because the datagrid needs one at runtime.

### Options

| Option               | Values (default)                                                             | Effect                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name` (positional)  | kebab-case, may contain a directory                                          | Class `UsersList`, selector `<prefix>-users-list`, folder `users-list/`.                                                                                                                                                 |
| `--columns`          | `field[:type],...` with type `string` (default), `number`, `date`, `boolean` | One `clr-dg-column` and one `clr-dg-cell` per column, and a typed field on the item interface. Date cells use the `date` pipe, boolean cells render Yes/No. Headers come from the field name (`createdAt` → Created at). |
| `--mode`             | `client` (default), `server`, `virtual-scroll`                               | See below.                                                                                                                                                                                                               |
| `--pagination`       | `true`                                                                       | Footer with `clr-dg-pagination` and a `clr-dg-page-size` selector. Off for virtual scroll.                                                                                                                               |
| `--page-size`        | `10`                                                                         | Page size; the page size options are 1x, 2x and 5x.                                                                                                                                                                      |
| `--sort`             | `true`                                                                       | Sortable columns.                                                                                                                                                                                                        |
| `--filter`           | `true`                                                                       | String and number columns get `[clrDgField]` (sort plus built-in filter, number columns also `[clrDgColType]="'number'"`). Date and boolean columns get `[clrDgSortBy]` (sort only). Requires `--sort`.                  |
| `--selection`        | `none` (default), `single`, `multi`                                          | `[clrDgSelectionType]` and `[(clrDgSelected)]="selected"`; `selected` is always an array.                                                                                                                                |
| `--action-bar`       | `false`                                                                      | `clr-dg-action-bar` with Edit and Delete buttons that act on `selected` and are disabled while nothing is selected. Sets `--selection=multi` when no selection is given.                                                 |
| `--row-actions`      | `false`                                                                      | `clr-dg-action-overflow` with Edit and Delete per row.                                                                                                                                                                   |
| `--detail`           | `none` (default), `expandable`, `pane`                                       | `clr-dg-row-detail *clrIfExpanded` inside the row, or `clr-dg-detail *clrIfDetail` with header and body.                                                                                                                 |
| `--hideable-columns` | `false`                                                                      | Column headers wrapped in `*clrDgHideableColumn`, so users can show and hide columns.                                                                                                                                    |
| `--compact`          | `false`                                                                      | `clr-density="compact"` on the datagrid.                                                                                                                                                                                 |
| `--animations`       | `true`                                                                       | Add `provideAnimationsAsync()` to `app.config.ts` when missing. Logs a warning when the file or its `providers` array is not found.                                                                                      |
| `--path`             | project `src/app`                                                            | Directory to generate into, relative to the workspace root.                                                                                                                                                              |
| `--project`          | first application in `angular.json`                                          | Project whose source root and prefix are used.                                                                                                                                                                           |
| `--prefix`           | project prefix, or `app`                                                     | Selector prefix.                                                                                                                                                                                                         |
| `--flat`             | `false`                                                                      | Generate directly into `--path` instead of a folder named after the component.                                                                                                                                           |

### Data modes

| `--mode`         | Rows                                                                                                  | Who sorts, filters and pages                    | What to do after generating                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `client`         | `*clrDgItems="let item of items; trackBy: trackById"`                                                 | The datagrid                                    | Fill `items`.                                                                                              |
| `server`         | `@for (item of items; track item.id)` with `(clrDgRefresh)`, `[clrDgLoading]` and `[clrDgTotalItems]` | Your backend, from the `refresh(state)` handler | Implement `fetch(request)`: it gets `offset`, `size`, `sort` and `filters` and returns `{ items, total }`. |
| `virtual-scroll` | `<ng-template ClrVirtualScroll ...>` with no pagination                                               | The datagrid                                    | Fill `items` and give the datagrid a height that fits your layout.                                         |

Every row item has an `id` used by `trackBy` and to keep the selection stable; add `id` to `--columns` (for example `id:string`)
when it should be shown or has another type.

### Development

```bash
npm run _test:schematics            # vitest, tests in datagrid/tests and ng-update/tests
npm run _build:schematics           # tsc + scripts/copy-schematics-files.js (collection.json, package.json, schema.json, .npmignore)
```

To try the built schematic in an app: `npm run _build:angular`, install `dist/clr-angular` into the app
(`npm install <path to ng-clarity>/dist/clr-angular`), then run `ng generate @clr/angular:datagrid ...` there.
