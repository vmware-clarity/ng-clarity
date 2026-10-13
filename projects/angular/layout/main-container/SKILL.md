---
name: clr-app-layout
description: Build the Clarity application shell — `clr-main-container` with the header, optional subnav, `content-container`, `content-area` and vertical nav, app-level alerts, and `cds-theme` switching on `<body>` — from `@clr/angular`. Use when creating or changing the top-level page layout of a Clarity app or placing page content, cards, datagrids or forms in the content area. For the header itself use `clr-header`; for navigation that collapses on small screens use `clr-navigation`.
metadata:
  docs: /documentation/app-layout
  guidance-104: '2024-12-03'
---

# Clarity application layout

## When to use

- Every Clarity app has exactly one shell: `clr-main-container` wrapping the header, the optional subnav and `div.content-container`. See the [layout guidance](https://guidance.clarity.design/104).
- The header markup, branding, header nav, search and header actions are the `clr-header` guide.
- Making that navigation collapse on small screens is the `clr-navigation` guide.

## Setup

```ts
import { ClrMainContainerModule } from '@clr/angular';

@Component({ imports: [ClrMainContainerModule] /* ... */ })
```

- `ClrMainContainerModule` (`clr-main-container`) is an NgModule — import the module, not the class. `ClrLayoutModule` bundles all layout modules (main container, navigation, tabs, vertical nav, breadcrumbs).
- The layout is CSS-driven; `div.main-container` works without Angular, but responsive navigation needs `clr-main-container` + `clr-header`.

## Shell

```html
<clr-main-container>
  <div class="alert alert-app-level alert-info" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-text">Maintenance window tonight at 22:00 UTC.</div>
      </div>
    </div>
  </div>

  <clr-header class="header-1">
    <!-- branding, header-nav, search, header-actions — see the clr-header guide -->
  </clr-header>

  <div class="content-container">
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
    <clr-vertical-nav [clr-nav-level]="2">...</clr-vertical-nav>
  </div>
</clr-main-container>
```

- Order inside the main container: optional app-level alert (`div.alert.alert-app-level`), header, optional `nav.subnav`, then `div.content-container`.
- Inside `content-container`: `content-area` holds the page; a `clr-vertical-nav` is placed next to it — guide `clr-vertical-nav`.
- The app-level alert spans the full width above the header and is for app-wide messages only — guide `clr-alert` for the alert itself.
- Pick one secondary navigation: a subnav or a vertical nav below the header, not both.

## Content area

- Page content goes directly inside `content-area`. If you wrap it in `cds-layout="vertical ..."`, add `align:horizontal-stretch`; without it, datagrids and cards shrink to their content width.
- Cards go in a `clr-row` / `clr-col` grid inside `content-area` so they share a row and wrap together — guide `clr-card`.
- A datagrid fills the content area; give it a height constraint rather than letting the page scroll twice — guide `clr-datagrid`.
- Forms sit at the top of `content-area` with `clrForm`; don't center them in the viewport — guide `clr-forms`.
- Tabs inside `content-area` keep the page heading above the tab bar — guide `clr-tabs`.
- Keep vertical rhythm with `cds-layout` gap tokens instead of hand-written margins.

## Rules

- Themes: light is the default. Keep `cds-theme` on `<body>` at all times and switch its value, e.g. `[attr.cds-theme]="isDark ? 'dark' : 'light'"`. Tokens follow the attribute, so never style colors per theme yourself.
- Do not nest a `main-container` or a second header inside page content.

## References

- Design guidance: https://guidance.clarity.design/104
- Public API: `@clr/angular/types/clr-angular-layout-main-container.d.ts` (`ClrMainContainer`)
- Styles: `@clr/ui/layout/main-container/_layout.clarity.scss`
