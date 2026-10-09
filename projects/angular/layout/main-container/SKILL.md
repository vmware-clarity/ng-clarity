---
name: clr-app-layout
description: Build the Clarity application shell — `clr-main-container`, the app header (`clr-header` / `header.header`, branding, header nav, header actions, search, header colors), subnav, `content-container` / `content-area`, and responsive navigation with `[clr-nav-level]`. Use when creating or changing the top-level page layout, header, or app-level navigation of a Clarity app.
metadata:
  docs: /documentation/header
  guidance: ['1013:2024-10-30', '1038:2024-10-30']
---

# Clarity application layout and header

## When to use

From the [header design guidance](https://guidance.clarity.design/1013):

- Exactly one header per page, at the top. Never put a header inside a modal, popover, or other small container.
- Keep the header light: at most four top-level navigation items. Put global actions (settings, user menu, notifications) and less-used top-level items in `header-actions` on the right.
- Include search in the header when search matters to the app.
- Use short, clear labels. Pair an icon with text only when the text adds context (e.g. the user's name).
- Pick one secondary navigation: a subnav **or** a vertical nav below the header, not both ([vertical nav guidance](https://guidance.clarity.design/1038)).

## Setup

```ts
import { ClrIcon, ClrMainContainerModule, ClrNavigationModule, ClrVerticalNavModule } from '@clr/angular';

@Component({ imports: [ClrMainContainerModule, ClrNavigationModule, ClrVerticalNavModule, ClrIcon] /* ... */ })
```

- `ClrMainContainerModule` (`clr-main-container`) and `ClrNavigationModule` (`clr-header`, `[clr-nav-level]`, `[clrAriaCurrentLink]`) are NgModules — import the modules, not the classes. `ClrLayoutModule` bundles all layout modules.
- The layout is CSS-driven; `div.main-container` + `header.header` work without Angular, but responsive navigation needs `clr-main-container` + `clr-header`.

## Shell

```html
<clr-main-container>
  <clr-header class="header-1">
    <div class="branding">
      <a routerLink="/" class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">My App</span>
      </a>
    </div>
    <div class="header-nav" [clr-nav-level]="1">
      <a routerLink="/dashboard" routerLinkActive="active" clrAriaCurrentLink class="nav-link">
        <span class="nav-text">Dashboard</span>
      </a>
      <a routerLink="/reports" routerLinkActive="active" clrAriaCurrentLink class="nav-link">
        <span class="nav-text">Reports</span>
      </a>
    </div>
    <form class="search">
      <label for="app-search">
        <input id="app-search" type="text" placeholder="Search..." aria-label="Search" />
      </label>
    </form>
    <div class="header-actions">
      <a routerLink="/settings" class="nav-link nav-icon" aria-label="Settings">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
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
- Inside `content-container`: `content-area` holds the page; a `clr-vertical-nav` is placed next to it (see the clr-vertical-nav skill).
- Header parts: `branding` (logo + `span.title`, links to home), `header-nav` (top-level links, `nav-link` + `span.nav-text`, or `nav-icon` for icon-only), `form.search`, `header-actions` (right-aligned).
- Mark the current item with `active` and `aria-current="page"`; with the router, `routerLinkActive="active"` + `clrAriaCurrentLink` sets both.
- Header colors: `header-1`, `header-2`, `header-3` on the header. Theme the header with its CSS custom properties (listed in `STYLES.md`).

## Header actions with a menu

```html
<div class="header-actions">
  <clr-dropdown>
    <button type="button" class="nav-text" clrDropdownTrigger aria-label="Open user menu">
      {{ user.email }}
      <clr-icon shape="angle" direction="down"></clr-icon>
    </button>
    <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
      <a routerLink="/preferences" clrDropdownItem>Preferences</a>
      <button type="button" clrDropdownItem (click)="logout()">Log out</button>
    </clr-dropdown-menu>
  </clr-dropdown>
</div>
```

Needs `ClrDropdownModule`; the example assumes `user = { email: '' };` and `logout(): void {}` on the component. Trigger classes: `nav-text` (text), `nav-icon` (icon only, with `aria-label`), `nav-icon-text` (icon plus text).

## Subnav

```html
<nav class="subnav">
  <ul class="nav">
    <li class="nav-item">
      <a class="nav-link active" routerLink="/overview" aria-current="page">Overview</a>
    </li>
    <li class="nav-item"><a class="nav-link" routerLink="/details">Details</a></li>
  </ul>
</nav>
```

Place it directly after the header. Add `[clr-nav-level]="2"` to make it part of responsive navigation.

## Responsive navigation

- `[clr-nav-level]="1"` when it is the primary navigation, `"2"` when secondary (only 1 and 2 are valid). Level 1 collapses into the hamburger, level 2 into the overflow menu at the right of the header. `clr-header` renders both toggle buttons automatically.
- Only works inside `clr-main-container` with `clr-header` (not plain `header.header`).
- Localize the close button with `closeAriaLabel` on the `[clr-nav-level]` element.

## Rules

- Header actions: navigation is `<a class="nav-link nav-icon">`; an action is `<button type="button" class="btn btn-link nav-link">` (a bare `<button class="nav-link">` keeps the browser's gray button color). Icon-only items need `aria-label`.
- Page content goes directly inside `content-area`. If you wrap it in `cds-layout="vertical ..."`, add `align:horizontal-stretch`; without it, datagrids and cards shrink to their content width.
- Themes: light is the default. Keep `cds-theme` on `<body>` at all times and switch its value, e.g. `[attr.cds-theme]="isDark ? 'dark' : 'light'"`. Tokens follow the attribute, so never style colors per theme yourself.
- Do not hand-build hamburger or overflow toggles; let `clr-header` + `[clr-nav-level]` create them.
- Icon-only header links and buttons (`nav-icon`) must have an `aria-label`. Give the search input a label.
- Use real links (`<a>`) for navigation and `<button type="button">` for actions.
- Register every icon shape you use with `ClarityIcons.addIcons(...)` (see the clr-icons skill).
- Do not nest a `main-container` or a second header inside page content.

## References

- Design guidance: https://guidance.clarity.design/1013
- Public API: `projects/angular/layout/layout.api.md` (`ClrMainContainer`, `ClrHeader`, `ClrNavLevel`)
- Styles: `projects/angular/layout/main-container/STYLES.md`, `projects/angular/layout/nav/`
- Docs demos: `projects/website/src/app/documentation/demos/header/`, `.../demos/nav/`, `.../demos/app-layout/`
