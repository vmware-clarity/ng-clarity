# AppFX datagrid filters (`appfx-datagrid-filters`)

## When to use it

Inside `appfx-datagrid`, the filter bar is built in; configure it on the grid (see the appfx-datagrid skill). Use `appfx-datagrid-filters` directly when you host it yourself, for example in a `clr-datagrid` action bar, or when you need inputs the grid does not pass on: `presetFilters`, `predefinedFilters`, `semiPredefinedFilters`, `toggleFilters`. The grid does pass on `[(propertyFilters)]`.

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
- `semiPredefinedFilters: EnumPropertyDefinition[]` — a label with option pills; selecting several options matches entries with any of them (`LogicalOperator.Or`), applied at once. Only `Equals` on option keys combined with `LogicalOperator.Or` is valid for these fields; anything else is removed with a console warning.
- `toggleFilters: ToggleFilter[]` (`{ label?: string; filter: PropertyFilter }`) — ready-made on/off pills. `label` is free text shown as given; without it the text comes from the criteria. A filter with exactly a toggle's criteria turns it ON; any other filter on a toggle's field is removed with a console warning.
- Each field is used once: `predefinedFilters`, then `semiPredefinedFilters`, then `toggleFilters` claim fields left to right; claimed fields are not offered in **Add filter**.

## Keeping filters in sync

- `[(propertyFilters)]` holds the active filters, toggles that are ON included. Use it to restore a saved view or URL. Filters stored as JSON work: each `filterableProperty` is matched to the filter bar's field definition by its `property` key.
- `[(searchTerm)]` holds the quick search text; setting it does not emit `searchTermChange`.
- Setting `propertyFilters` does not emit `propertyFiltersChange`, so passing the emitted value back does not loop. The exception is when the filter bar had to drop something you passed in, such as an invalid filter on a semi-predefined field or a toggle that is no longer configured. It then emits the corrected list once, after change detection.
- `presetFilters` is read **once** at start-up; later changes are ignored. For the same field a preset wins over `propertyFilters`. When the start-up result differs from what was passed in, `propertyFiltersChange` emits once after the first change detection. To load once at start-up, don't load in `ngOnInit`: schedule the first load in the host's `ngAfterViewInit` and coalesce loads in a microtask (`queueMicrotask`), so the start-up emit and the host's own first load become one load.
- Quick mode clears the filters and emits `[]`.
- `FilterMode.Combined`: search and filters are separate outputs, applied together (AND). **Clear all** emits `propertyFiltersChange` and then `searchTermChange` in the same turn; to load from a server once, store both values and load at the end of the turn (e.g. `queueMicrotask`).
- Keep `PropertyFilter.editorState` when storing filters: it restores editor choices the criteria cannot express (e.g. _Last week_). Filters without it (host presets) are read from their criteria. Relative filters (_Last week_, _Time span_) are a rolling window computed from the moment the user applies them, and are not recomputed on restore; updating them is the user's responsibility.

## Rules

- OnPush: assign new arrays for every input; never mutate them.
- `PropertyPredicate.value` is `undefined` for `ComparisonOperator.IsEmpty` — check the operator first.
- `DateTimePropertyDefinition`'s fourth argument `includeSeconds` shows seconds in the time inputs and makes **Equals** match one second instead of one minute.
- `DateTimePropertyDefinition`'s fifth argument `rangeOptions: DateRangeOption[]` (`{ label, value: [start, end] }`, both inclusive) adds preset ranges to **Custom range**. Dates are used as given; a `Date` at 00:00 means the whole day.
- Date-time values are the local date and time the user picked, usually followed by the browser's UTC offset (`2026-03-29T00:00:00+02:00`; no offset in a UTC browser). **Equals** a day is emitted as `>= day 00:00` AND `< next day 00:00`. The filters do not convert time zones or adjust for daylight saving; the app interprets the values. Where the clock skips midnight (e.g. America/Santiago), the browser moves times computed from that day's 00:00 to 01:00.
- `UserPropertyDefinition` requires providing `DatagridFiltersUserService`.
- Localize by providing `DatagridFiltersStrings`. There is no `appliedText`, `clearAllButtonLabel` or `dateFormat` (removed in v19).

## References

- API: `@clr/addons/types/clr-addons-datagrid-filters.d.ts`
- Docs: `@clr/addons/datagrid-filters/README.md`
