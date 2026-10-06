---
name: clr-vertical-nav
description: Build side navigation with the Clarity vertical nav (`clr-vertical-nav`, `clrVerticalNavLink`, `clr-vertical-nav-group`, `clr-vertical-nav-group-children`, `clrVerticalNavIcon`) from `@clr/angular`. Use when adding a left-side app navigation, collapsible sidebar, nav groups, lazy-loaded nav children, or router-driven active links.
metadata:
  docs: /documentation/vertical-nav
  guidance: ['1038:2024-10-30']
---

# Clarity vertical nav

## When to use

From the [vertical nav design guidance](https://guidance.clarity.design/1038):

- Use it for app navigation with many links; it scrolls when content exceeds the viewport. Make it collapsible so users can maximize content space.
- Separate logical clusters with groups and dividers.
- Never combine a header nav **and** a subnav **and** a vertical nav — too many navigation points.
- Icons: either all top-level items have an icon or none do. Icons go on top-level items only, never on child links. Icons help when the nav is collapsed.
- Labels short enough to avoid ellipsis.

## Setup

```ts
import { ClrVerticalNavModule } from '@clr/angular';

@Component({ imports: [ClrVerticalNavModule, RouterLink, RouterLinkActive] /* ... */ })
```

`ClrVerticalNavModule` is an NgModule (re-exports `ClrIcon` and `ClrConditionalModule` for `*clrIfExpanded`). Place the nav inside `div.content-container`, next to `content-area` (see the clr-app-layout skill).

## Links

```html
<div class="content-container">
  <clr-vertical-nav [clrVerticalNavCollapsible]="true" [(clrVerticalNavCollapsed)]="navCollapsed">
    <a clrVerticalNavLink routerLink="/dashboard" routerLinkActive="active">
      <clr-icon shape="home" clrVerticalNavIcon></clr-icon>
      Dashboard
    </a>
    <a clrVerticalNavLink routerLink="/reports" routerLinkActive="active">
      <clr-icon shape="bar-chart" clrVerticalNavIcon></clr-icon>
      Reports
    </a>
    <div class="nav-divider"></div>
    <a clrVerticalNavLink routerLink="/settings" routerLinkActive="active">
      <clr-icon shape="cog" clrVerticalNavIcon></clr-icon>
      Settings
    </a>
  </clr-vertical-nav>
  <main class="content-area"><router-outlet></router-outlet></main>
</div>
```

- `clrVerticalNavLink` goes on an `<a>`; mark the current one with `class="active"` (`routerLinkActive="active"`).
- `clrVerticalNavIcon` goes on the `clr-icon` inside the link or group.
- `[clrVerticalNavCollapsible]` adds the collapse toggle; `[(clrVerticalNavCollapsed)]` controls/reads the state (`clrVerticalNavCollapsedChange`).
- Localize the toggle with `clrVerticalNavToggleLabel`.
- Static section labels: `<div class="nav-header">`; separators: `<div class="nav-divider">`.

## Groups

```html
<clr-vertical-nav-group routerLinkActive="active" [(clrVerticalNavGroupExpanded)]="adminExpanded">
  <clr-icon shape="administrator" clrVerticalNavIcon></clr-icon>
  Administration
  <clr-vertical-nav-group-children *clrIfExpanded>
    <a clrVerticalNavLink routerLink="/admin/users" routerLinkActive="active">Users</a>
    <a clrVerticalNavLink routerLink="/admin/roles" routerLinkActive="active">Roles</a>
  </clr-vertical-nav-group-children>
</clr-vertical-nav-group>
```

- Children go in `clr-vertical-nav-group-children`. Add `*clrIfExpanded` to render them lazily (only while expanded); `*clrIfExpanded="true"` starts it open.
- `[clrVerticalNavGroupExpanded]` / `(clrVerticalNavGroupExpandedChange)` control the group state.
- `routerLinkActive="active"` on the group highlights it when a child route is active. To make it react to a parent route, add a hidden link inside the group: `<a routerLink="/admin" hidden aria-hidden="true"></a>`.
- Groups and plain links can be mixed at the top level.

## Responsive

Add `[clr-nav-level]="2"` on `clr-vertical-nav` (inside `clr-main-container` with `clr-header`) so it collapses into the header overflow menu on small screens. Needs `ClrNavigationModule`.

## Rules

- Do not put icons on child links inside groups, and do not mix top-level items with and without icons.
- Do not build a custom sidebar with `<ul>`/`<div>`; use `clr-vertical-nav`.
- Do not use a vertical nav together with both a header nav and a subnav.
- Register every icon shape you use with `ClarityIcons.addIcons(...)` (see the clr-icons skill).
- Use real links (`<a>` with `routerLink`/`href`) for navigation, not buttons.

## References

- Design guidance: https://guidance.clarity.design/1038
- Public API: `projects/angular/layout/layout.api.md` (search `ClrVerticalNav`)
- Docs demos: `projects/website/src/app/documentation/demos/vertical-nav/`
