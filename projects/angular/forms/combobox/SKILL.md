---
name: clr-combobox
description: Use the Clarity combobox (`clr-combobox`) from `@clr/angular` — a filterable dropdown with single or multi select (`clrMulti`), async loading, option groups, custom selected templates, select-all and editable mode. Use when adding `clr-combobox`, `clr-options`, `clr-option`, `*clrOptionItems` or `*clrOptionSelected`, or picking from a long or searchable list.
metadata:
  docs: /documentation/combobox
  guidance: ['1007:2024-10-30']
---

# Clarity combobox

## When to use

From the [combobox guidance](https://guidance.clarity.design/1007):

- Use it for lists with more than 10 options, when users must search/filter, for multi-select, and for async-loaded options.
- Short lists belong in radios or a select (see `clr-forms`).
- Keep option text short; options should fit the field width.

## Setup

```ts
import { ClrComboboxModule, ClrIcon } from '@clr/angular'; // or ClrFormsModule
```

`ClrIcon` is standalone; import it whenever a template contains `<clr-icon>`.

## Single select

```html
<clr-combobox-container>
  <label>State</label>
  <clr-combobox [(ngModel)]="state" name="state" required placeholder="Search states">
    <ng-container *clrOptionSelected="let selected">{{ selected?.name }}</ng-container>
    <clr-options>
      <clr-option *clrOptionItems="let s of states; field: 'name'" [clrValue]="s">{{ s.name }}</clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Type to filter</clr-control-helper>
  <clr-control-error>Select a state</clr-control-error>
</clr-combobox-container>
```

- `*clrOptionItems="let x of items; field: 'name'"` renders and filters options; `field` is the property to filter on and to show in the input. `trackBy` is also supported.
- `[clrValue]` is the value written to the model. `*clrOptionSelected` customizes how the selection is shown.
- Works with `ngModel` or `formControlName`; wrap it in `<clr-combobox-container>` with a `<label>`.

## Multi select, select all

```html
<clr-combobox formControlName="states" clrMulti="true" [showSelectAll]="true">
  <ng-container *clrOptionSelected="let selected">{{ selected?.name }}</ng-container>
  <clr-options>
    <clr-option *clrOptionItems="let s of states; field: 'name'" [clrValue]="s">{{ s.name }}</clr-option>
  </clr-options>
</clr-combobox>
```

- With `clrMulti` the model is an array. Selections show as removable pills.
- Object values: provide `[clrComboboxIdentityFn]="byId"` (e.g. `byId = (s: State) => s.id`) so preselected objects match options.

## Async options

```html
<clr-combobox
  [(ngModel)]="state"
  name="state"
  [clrLoading]="loading"
  (clrInputChange)="search($event)"
  (clrOpenChange)="$event ? search('') : null"
>
  <clr-options>
    <clr-option *clrOptionItems="let s of (results$ | async) ?? []; field: 'name'" [clrValue]="s"
      >{{ s.name }}</clr-option
    >
  </clr-options>
</clr-combobox>
```

- `[clrLoading]` needs `ClrLoadingModule`. `(clrInputChange)` emits the typed text, `(clrOpenChange)` the open state, `(clrSelectionChange)` the new selection.

## Groups and rich options

```html
<clr-options>
  @for (group of groups; track group.name) {
  <clr-option-group [clrOptionGroupLabel]="group.name">
    <clr-option *clrOptionItems="let s of group.states; field: 'name'" [clrValue]="s">
      <clr-icon shape="world"></clr-icon> {{ s.name }}
    </clr-option>
  </clr-option-group>
  }
</clr-options>
```

## Rules

- Restrict input to predefined options by default. `[clrEditable]="true"` (plus optional `[clrEditableResolverFn]` to turn typed text into a value) is only for cases that really need custom values; consider a datalist there.
- Always provide a `<label>` in the container; `placeholder` is not a label.
- Decorative icons in options need no label; meaningful ones need `aria-label` or adjacent text.
- Use `*clrOptionItems` rather than `@for` over `clr-option`, so filtering and virtual focus work.

## References

- Design guidance: https://guidance.clarity.design/1007
- API report: `projects/angular/forms/forms.api.md`
- Docs demos: `projects/website/src/app/documentation/demos/combobox/`
