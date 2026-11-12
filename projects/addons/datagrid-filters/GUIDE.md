---
name: appfx-datagrid-filters
description: Build a standalone filter bar with `<appfx-datagrid-filters>` from `@clr/addons/datagrid-filters` — quick search, advanced filter pills, predefined, semi-predefined and toggle filters, presets, and two-way `[(propertyFilters)]` sync with saved views or URLs. Use when placing `appfx-datagrid-filters` yourself (e.g. over a `clr-datagrid`), or when restoring, storing or syncing `PropertyFilter[]`.
metadata:
  docs: /documentation/datagrid-filters
---

# AppFX datagrid filters (`appfx-datagrid-filters`)

## When to use it

Inside `appfx-datagrid`, the filter bar is built in; configure it on the grid (see the appfx-datagrid skill). Use `appfx-datagrid-filters` directly when you host it yourself, for example in a `clr-datagrid` action bar, or when you need inputs the grid does not pass on: `presetFilters`, `predefinedFilters`, `semiPredefinedFilters`, `toggleFilters`, `propertyFilters`.

## Setup

```ts
import {
  AppfxDatagridFiltersModule,
  EnumPropertyDefinition,
  FilterMode,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
} from '@clr/addons/datagrid-filters';

@Component({
  imports: [AppfxDatagridFiltersModule],
  // ...
})
export class VmFilters {
  readonly FilterMode = FilterMode;
  name = new StringPropertyDefinition('Name', 'name');
  state = new EnumPropertyDefinition(
    'State',
    'state',
    new Map([
      ['on', 'Powered On'],
      ['off', 'Powered Off'],
    ])
  );
  filterableProperties = [this.name, this.state, new NumericPropertyDefinition('Memory', 'memory')];
  filters: PropertyFilter[] = [];
  onSearch(term: string): void {}
}
```

```html
<appfx-datagrid-filters
  [filterMode]="FilterMode.Advanced"
  [filterableProperties]="filterableProperties"
  [(propertyFilters)]="filters"
  (searchTermChange)="onSearch($event)"
></appfx-datagrid-filters>
```

The component only **emits** filters. Apply `PropertyFilter[]` (each `{ criteria: PropertyPredicate[], operator }`) and the search term to the data yourself.

## Inputs that shape the bar

- `predefinedFilters: FilterablePropertyDefinition[]` — pills always shown, in this order, even when empty.
- `semiPredefinedFilters: EnumPropertyDefinition[]` — a label with option pills; selected options are ORed and applied at once. Only `Equals` on option keys combined with OR is valid for these fields; anything else is removed with a console warning.
- `toggleFilters: PropertyFilter[]` — ready-made on/off pills. A filter with exactly a toggle's criteria turns it ON.
- Each field is used once: `predefinedFilters`, then `semiPredefinedFilters`, then `toggleFilters` claim fields left to right; claimed fields are not offered in **Add filter**.

## Keeping filters in sync

- `[(propertyFilters)]` holds the active filters, toggles that are ON included. Use it to restore a saved view or URL.
- Setting `propertyFilters` does not emit `propertyFiltersChange`, so passing the emitted value back does not loop.
- `presetFilters` is read **once** at start-up; later changes are ignored. For the same field a preset wins over `propertyFilters`. When the start-up result differs from what was passed in, `propertyFiltersChange` emits once after the first change detection.
- Quick mode clears the filters and emits `[]`.
- Keep `PropertyFilter.editorState` when storing filters in memory: it restores editor choices the criteria cannot express (e.g. _Last week_). Filters without it (host presets) are read from their criteria.

## Rules

- OnPush: assign new arrays for every input; never mutate them.
- `PropertyPredicate.value` is `undefined` for `ComparisonOperator.IsEmpty` — check the operator first.
- Date-time values are local date-times with the local UTC offset (`2026-03-29T00:00:00+02:00`). **Equals** a day is emitted as `>= day 00:00` AND `< next day 00:00`.
- `UserPropertyDefinition` requires providing `DatagridFiltersUserService`.
- Localize by providing `DatagridFiltersStrings`.

## References

- API: `@clr/addons/types/clr-addons-datagrid-filters.d.ts`
- Docs: `@clr/addons/datagrid-filters/README.md`
