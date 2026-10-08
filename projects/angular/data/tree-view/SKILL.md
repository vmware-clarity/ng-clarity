---
name: clr-tree-view
description: Display hierarchical data with the Clarity tree view (`clr-tree`, `clr-tree-node` from `@clr/angular`). Use when building a file/folder or inventory tree — static nested nodes, recursive trees with `*clrRecursiveFor`, lazy loading (`clrLazy`, `clrIfExpanded`), checkbox selection (`clrSelected`, `ClrSelectedState`), expand/collapse, or link nodes (`.clr-treenode-link`).
metadata:
  docs: /documentation/tree-view
  guidance: ['1037:2024-10-30']
---

# Clarity tree view (`clr-tree`)

## When to use

From the [tree view design guidance](https://guidance.clarity.design/1037):

- Use a tree view for large hierarchical (parent/child) data. Keep levels few; consolidate layers where you can.
- For a single level of nesting use an accordion (`clr-accordion`) instead.
- Icons: put an icon on every node or on none, in neutral colors, to represent the item type.
- Checkboxes (selection): use them when multiple selection is allowed, on every node or none. A tree with checkboxes has no icons.

## Setup

```ts
import { ClrConditionalModule, ClrIcon, ClrTreeViewModule } from '@clr/angular';

@Component({ imports: [ClrTreeViewModule, ClrConditionalModule, ClrIcon] /* ... */ })
```

`ClrTreeViewModule` is an NgModule (the components are not standalone). Add `ClrConditionalModule` when you use `clrIfExpanded` (lazy loading), and `ClrLoadingModule` for `[clrLoading]`. `ClrIcon` is standalone; import it whenever a template contains `<clr-icon>`.

## Static tree

```html
<clr-tree>
  @for (group of groups; track group.id) {
  <clr-tree-node [clrExpanded]="true">
    <clr-icon shape="folder"></clr-icon>
    {{ group.name }} @for (item of group.items; track item.id) {
    <clr-tree-node>
      <clr-icon shape="file"></clr-icon>
      {{ item.name }}
    </clr-tree-node>
    }
  </clr-tree-node>
  }
</clr-tree>
```

- Nest `clr-tree-node` elements directly; a node with children is expandable. `[(clrExpanded)]` binds the expanded state.
- `[clrDisabled]="true"` disables a node. `[clrForTypeAhead]` sets the text used for keyboard type-ahead when the node label is not plain text.
- Navigation nodes: `<a class="clr-treenode-link" [routerLink]="..." routerLinkActive="active">` inside the node. Use a `button class="clr-treenode-link"` for in-page actions.
- `ClrTree` methods `expandAll()` / `collapseAll()` and `ClrTreeNode` methods `expandDescendants()` / `collapseDescendants()` (via a template ref or `viewChild`).

## Recursive tree

```html
<clr-tree>
  <clr-tree-node *clrRecursiveFor="let file of root; getChildren: getChildren" [(clrSelected)]="file.selected">
    {{ file.name }}
  </clr-tree-node>
</clr-tree>
```

```ts
getChildren = (file: FileNode) => file.children; // array, Promise or Observable of children
```

`*clrRecursiveFor` renders a node for each item and recursively calls `getChildren` for its children. Define `getChildren` as an arrow function property so `this` is bound.

## Lazy loading

Set `[clrLazy]="true"` on `clr-tree` so children are only created when a node expands.

```html
<!-- recursive: return a Promise/Observable from getChildren -->
<clr-tree [clrLazy]="true">
  <clr-tree-node *clrRecursiveFor="let node of roots; getChildren: loadChildren" [clrExpandable]="node.isFolder">
    {{ node.name }}
  </clr-tree-node>
</clr-tree>

<!-- manual: load on expand, show a spinner with clrLoading -->
<clr-tree [clrLazy]="true">
  <clr-tree-node [clrLoading]="loading">
    Office locations
    <ng-template clrIfExpanded (clrIfExpandedChange)="$event && fetchLocations()">
      @for (location of locations$ | async; track location) {
      <clr-tree-node>{{ location }}</clr-tree-node>
      }
    </ng-template>
  </clr-tree-node>
</clr-tree>
```

`[clrExpandable]` forces the caret (or hides it) before the children are known.

## Selection

- A single `[(clrSelected)]` binding switches the whole tree to checkbox mode; still bind it on every node and in `*clrRecursiveFor` templates so each node's state is tracked.
- Selecting a parent selects all descendants; a partly selected parent becomes indeterminate.
- The value is a boolean or `ClrSelectedState` (`SELECTED`, `UNSELECTED`, `INDETERMINATE`). `(clrSelectedChange)` emits `ClrSelectedState`.

## Rules

- A node whose children load on expand shows `[clrLoading]="loading"` on the `clr-tree-node` while the request runs; without it the user sees nothing happen.
- Node labels must be text; icon-only nodes need visible text for screen readers and type-ahead.
- Use `@for (...; track ...)` for nested nodes; give `track` a stable id.
- Tree nodes handle their own keyboard navigation (arrows, Home/End, type-ahead). Do not put extra focusable controls inside nodes besides `.clr-treenode-link`.

## References

- Design guidance: https://guidance.clarity.design/1037
- Source: `projects/angular/data/tree-view/`
- Docs demos: `projects/website/src/app/documentation/demos/tree-view/`
