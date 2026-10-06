---
name: clr-stack-view
description: Show key/value pairs with the Clarity stack view (`clr-stack-view`, `clr-stack-block`, `clr-stack-label`, `clr-stack-content` from `@clr/angular`). Use when displaying object properties or details as label/value rows, with expandable nested blocks (`clrSbExpanded`, `clrSbExpandable`), lazy-loaded children, or an edit action that opens a modal.
metadata:
  docs: /documentation/stack-view
  guidance: ['1029:2024-10-30']
---

# Clarity stack view (`clr-stack-view`)

## When to use

From the [stack view design guidance](https://guidance.clarity.design/1029):

- Use a stack view to show key/value pairs, and to progressively reveal large or less frequently used details by expanding blocks.
- Labels (keys) are short text that says what the value is. Use text labels only, never icons as labels.
- Editing: put an edit button in the header, on the right (`.stack-action`), and open a modal to edit. Keep the stack view itself read-only.
- For homogeneous tabular data use `clr-datagrid`; for hierarchical navigation use `clr-tree`.

## Setup

```ts
import { ClrStackViewModule } from '@clr/angular';

@Component({ imports: [ClrStackViewModule] /* ... */ })
```

`ClrStackViewModule` is an NgModule (the components are not standalone). It is also included in `ClarityModule`.

## Basic and nested blocks

```html
<clr-stack-view>
  <clr-stack-header>
    VM details
    <button type="button" class="stack-action btn btn-sm btn-link" (click)="openEditModal()">Edit</button>
  </clr-stack-header>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Name</clr-stack-label>
    <clr-stack-content>{{ vm.name }}</clr-stack-content>
  </clr-stack-block>

  <clr-stack-block [clrStackViewLevel]="1" [(clrSbExpanded)]="networkExpanded">
    <clr-stack-label>Network</clr-stack-label>
    <clr-stack-content>{{ vm.nics.length }} adapters</clr-stack-content>
    @for (nic of vm.nics; track nic.id) {
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>{{ nic.name }}</clr-stack-label>
      <clr-stack-content>{{ nic.ip }}</clr-stack-content>
    </clr-stack-block>
    }
  </clr-stack-block>
</clr-stack-view>
```

- Structure: `clr-stack-view` > optional `clr-stack-header` > `clr-stack-block` (with `clr-stack-label` + `clr-stack-content`). Nest `clr-stack-block` inside a block for children; a block with child blocks becomes expandable automatically.
- Header actions need the `stack-action` class so they are projected to the right side of the header.
- `[clrStackViewLevel]` sets `aria-level` for each block (1 for top level, 2 for children, ...). Set it on every block for screen readers. `[clrStackHeaderLevel]` sets the header heading level.
- `[(clrSbExpanded)]` binds the expanded state; `(clrSbExpandedChange)` emits on toggle.

## Lazy-loaded children

```html
<clr-stack-block [clrStackViewLevel]="1" [clrSbExpandable]="true" (clrSbExpandedChange)="$event && loadChildren()">
  <clr-stack-label>Disks</clr-stack-label>
  <clr-stack-content>{{ disksSummary }}</clr-stack-content>
  @if (loading) {
  <clr-stack-block [clrStackViewLevel]="2">
    <clr-spinner clrInline>Loading</clr-spinner>
  </clr-stack-block>
  } @for (disk of disks; track disk.id) {
  <clr-stack-block [clrStackViewLevel]="2">
    <clr-stack-label>{{ disk.name }}</clr-stack-label>
    <clr-stack-content>{{ disk.size }}</clr-stack-content>
  </clr-stack-block>
  }
</clr-stack-block>
```

`[clrSbExpandable]="true"` shows the caret before any children exist. Import `ClrSpinnerModule` for the spinner.

## Rules

- `[clrSbNotifyChange]="true"` highlights a block whose value changed (e.g. after an edit).
- Edit values in a `clr-modal` opened from the header action, then update the stack view from the saved model. Inline editing inside the stack view (`clrStackInput`) goes against the design guidance.
- Keep each `clr-stack-content` short; long text or rich content belongs in a card or detail page.

## References

- Design guidance: https://guidance.clarity.design/1029
- Source: `projects/angular/data/stack-view/`
- Docs demos: `projects/website/src/app/documentation/demos/stack-view/`
