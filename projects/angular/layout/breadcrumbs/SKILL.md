---
name: clr-breadcrumbs
description: Show the page hierarchy with Clarity breadcrumbs (`clr-breadcrumbs` with an `[items]` array of `BreadcrumbItem`, `routerLink` or `href`, `(clrBreadcrumbItemClick)`) from `@clr/angular`. Use when adding breadcrumbs, a hierarchical "you are here" trail, or route-driven breadcrumbs to a Clarity page.
metadata:
  docs: /documentation/breadcrumbs
---

# Clarity breadcrumbs

## When to use

From the breadcrumbs documentation (no separate design guidance exists):

- Use breadcrumbs only for deeply nested pages (more than three levels) that the main navigation cannot lead back to. For fewer levels, use a back button (`btn btn-link btn-sm`) instead.
- The first item is the first actionable item from the vertical nav. The last item is the current page.
- Place breadcrumbs (or the back button) above the page title.

## Setup

```ts
import { BreadcrumbItem, ClrBreadcrumbsModule } from '@clr/angular';

@Component({ imports: [ClrBreadcrumbsModule] /* ... */ })
```

`ClrBreadcrumbsModule` is an NgModule; import it, not the component classes.

## Usage

```ts
breadcrumbs: BreadcrumbItem[] = [
  { label: 'Inventory', routerLink: '/inventory' },
  { label: 'Hosts', routerLink: '/inventory/hosts', queryParams: { view: 'list' } },
  { label: 'host-01' }, // current page
];
```

```html
<clr-breadcrumbs [items]="breadcrumbs" (clrBreadcrumbItemClick)="onCrumb($event)"></clr-breadcrumbs>
<h1>host-01</h1>
```

- `BreadcrumbItem`: `label` (required), and either `routerLink` (with optional `queryParams`) or `href`, plus optional `target`.
- The last item is always rendered as plain text with `aria-current="page"`; it never becomes a link.
- With more than three items, the leading items collapse behind an expand (ellipsis) button; all items are shown after expanding.
- `(clrBreadcrumbItemClick)` emits the clicked `BreadcrumbItem`.
- The component renders its own `role="navigation"` and a localized `aria-label`.

## Route-driven breadcrumbs

Store a label in route `data` (e.g. `data: { breadcrumb: 'Hosts' }`) and build the `items` array from the `ActivatedRoute` tree on `NavigationEnd`. Keep the array immutable (assign a new array) so the view updates.

## Rules

- Pass data through `[items]`. Do not write `clr-breadcrumb-item` elements by hand or build a custom `<ol>` trail.
- Do not make the current page a link and do not repeat breadcrumbs that duplicate the vertical nav for shallow pages.
- Keep labels short; they should match the page titles they point to.

## References

- Public API: `projects/angular/layout/layout.api.md` (`ClrBreadcrumbs`, `BreadcrumbItem`)
- Source: `projects/angular/layout/breadcrumbs/`
- Docs demos: `projects/website/src/app/documentation/demos/breadcrumbs/`
