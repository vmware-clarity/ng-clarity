---
name: clr-navigation
description: Make Clarity navigation responsive with `[clr-nav-level]` (levels 1 and 2; hamburger and overflow triggers rendered by `clr-header` inside `clr-main-container`) and choose the navigation pattern (header nav, subnav, vertical nav as primary or secondary) from `@clr/angular`. Use when navigation must collapse on small screens, when the hamburger or overflow toggle does not appear, or when deciding which navigation levels an app uses. For the header markup use `clr-header`, for side navigation `clr-vertical-nav`, for the shell `clr-app-layout`.
metadata:
  docs: /documentation/navigation
  guidance: ['105:2024-12-03', '1038:2024-10-30']
---

# Clarity responsive navigation

## When to use

- Any app whose navigation must stay usable on small screens: mark each navigation element with `[clr-nav-level]` and Clarity renders the triggers.
- Pick one secondary navigation: a subnav **or** a vertical nav below the header, not both ([vertical nav guidance](https://guidance.clarity.design/1038)).
- See the [navigation guidance](https://guidance.clarity.design/105) for choosing between the patterns.

## Setup

```ts
import { ClrNavigationModule } from '@clr/angular';

@Component({ imports: [ClrNavigationModule] /* ... */ })
```

`[clr-nav-level]` only works inside `clr-main-container` with `clr-header` (not a plain `header.header`). The shell is the `clr-app-layout` guide; the header markup is the `clr-header` guide.

## Usage

Levels: `1` is the primary navigation, `2` the secondary. Level 1 collapses into the hamburger on the left, level 2 into the overflow menu at the right of the header. `clr-header` renders both toggle buttons automatically.

```html
<clr-main-container>
  <clr-header>
    <div class="branding">...</div>
    <div class="header-nav" [clr-nav-level]="1">...</div>
  </clr-header>

  <nav class="subnav" [clr-nav-level]="2">...</nav>

  <div class="content-container">
    <main class="content-area">...</main>
  </div>
</clr-main-container>
```

The three combinations the documentation shows:

| Pattern                                | Level 1      | Level 2            |
| -------------------------------------- | ------------ | ------------------ |
| Header navigation plus subnav          | `header-nav` | `nav.subnav`       |
| Header navigation plus vertical nav    | `header-nav` | `clr-vertical-nav` |
| Subnav primary, vertical nav secondary | `nav.subnav` | `clr-vertical-nav` |

```html
<clr-vertical-nav [clr-nav-level]="2" closeAriaLabel="Close navigation">...</clr-vertical-nav>
```

## Rules

- `[clr-nav-level]` accepts only `1` and `2`. Any other value, or a level on an element outside `clr-main-container` + `clr-header`, is ignored.
- Do not hand-build hamburger or overflow toggles; let `clr-header` + `[clr-nav-level]` create them.
- Localize the close button with `closeAriaLabel` on the `[clr-nav-level]` element.
- Use the same level on only one element per level; two elements claiming level 1 is not a supported layout.
- A vertical nav goes inside `div.content-container`, next to `content-area` — guide `clr-vertical-nav`.

## References

- Design guidance: https://guidance.clarity.design/105, https://guidance.clarity.design/1038
- Public API: `projects/angular/layout/layout.api.md` (`ClrNavLevel`)
- Styles: `projects/angular/layout/nav/_responsive-nav.clarity.scss`
- Docs demos: `projects/website/src/app/documentation/demos/nav/`
