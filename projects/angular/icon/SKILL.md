---
name: clr-icons
description: Render Clarity SVG icons with the standalone `ClrIcon` component (`<clr-icon>`) from `@clr/angular` — registering shapes with `ClarityIcons.addIcons(...)` or `load*IconSet()`, custom shapes and aliases, `size`, `direction`, `flip`, `solid`, `status`, `inverse`, `badge`, and icon accessibility. Use when adding any icon to a Clarity app or when an icon renders as the "unknown" shape.
metadata:
  docs: /documentation/icons
  guidance: ['102:2024-12-03']
---

# Clarity icons

- The tag is `<clr-icon>` (component `ClrIcon`).
- `cds-icon` resolves to the same component, but that selector is scheduled for removal in v19.
- `ClrIconModule`, `ClrIconCustomTag` and `CdsIconCustomTag` are deprecated.

## When to use

From the [icons guidance](https://guidance.clarity.design/102): use the Clarity icon library rather than other icon sets or inline SVGs. Add a custom shape only when the library has no fitting one.

## Setup

```ts
import { ClarityIcons, ClrIcon, cogIcon, homeIcon, userIcon } from '@clr/angular';

ClarityIcons.addIcons(homeIcon, cogIcon, userIcon); // once, e.g. in main.ts or the app root

@Component({ imports: [ClrIcon] /* ... */ })
```

- `ClrIcon` is **standalone** — import the class directly. Many Clarity modules (e.g. `ClrVerticalNavModule`) also re-export it.
- Every shape must be registered before use; an unregistered shape renders the "unknown" icon. Each shape is exported as `<camelName>Icon` (e.g. `exclamationTriangleIcon` for `exclamation-triangle`).
- Clarity components register the icons they use internally; you register the ones in your own templates.
- Whole collections: `loadCoreIconSet()`, `loadEssentialIconSet()`, `loadCommerceIconSet()`, `loadMediaIconSet()`, `loadSocialIconSet()`, `loadTravelIconSet()`, `loadTextEditIconSet()`, `loadTechnologyIconSet()`, `loadChartIconSet()`, `loadMiniIconSet()`. Prefer individual shapes for bundle size.

## Usage

```html
<clr-icon shape="user"></clr-icon>
<clr-icon shape="angle" direction="down"></clr-icon>
<clr-icon shape="image" flip="horizontal"></clr-icon>
<clr-icon shape="info-circle" size="lg" status="info" solid></clr-icon>
<clr-icon shape="bell" badge="danger"></clr-icon>
<clr-icon shape="user" inverse></clr-icon>
<clr-icon [shape]="item.icon" size="24"></clr-icon>
```

| Input         | Values                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shape`       | registered shape name or alias                                                                                                                                             |
| `size`        | `xs`, `sm` (16px, same as no `size`), `md` (one step larger; the exact size depends on the density setting), `lg`, `xl`, `xxl`, `3xl`, `4xl`, `fit`, or a number of pixels |
| `direction`   | `up` (default), `down`, `left`, `right` — rotates directional icons such as `angle`, `arrow`                                                                               |
| `flip`        | `horizontal`, `vertical`                                                                                                                                                   |
| `solid`       | boolean — filled variant                                                                                                                                                   |
| `status`      | `info`, `success`, `warning`, `danger`, `neutral`                                                                                                                          |
| `inverse`     | boolean — for dark backgrounds                                                                                                                                             |
| `badge`       | `info`, `success`, `warning`, `danger`, `neutral`, `inherit`, `warning-triangle`, `inherit-triangle` (or `true`)                                                           |
| `innerOffset` | pixels to grow the glyph into its own whitespace: `innerOffset="4"` or `[innerOffset]="4"` (reflected as the `inner-offset` attribute)                                     |

- Color and badge color can be themed with the `--color` and `--badge-color` CSS custom properties.
- Not every shape supports every badge or solid variant; check the shape in the icon library.

## Custom shapes and aliases

```ts
ClarityIcons.addIcons(['my-logo', '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">...</svg>']);
ClarityIcons.addAliases(['home', ['dashboard']], ['cog', ['preferences']]);
```

Shape names must be unique. Collections already register built-in aliases (e.g. `cog` as `settings`).

## Accessibility

```html
<!-- Decorative: next to visible text, no extra markup -->
<button type="button" class="btn"><clr-icon shape="plus"></clr-icon> Add</button>

<!-- Icon-only control: label the control -->
<button type="button" class="btn btn-icon" aria-label="Open menu"><clr-icon shape="bars"></clr-icon></button>

<!-- Meaningful standalone icon (status/indicator) -->
<clr-icon shape="exclamation-triangle" status="warning" role="img" aria-label="Warning"></clr-icon>
```

- Icons are inert (hidden from screen readers) by default.
- Never rely on `status` color alone; use a shape that conveys the meaning, or text.

## Rules

- Use `<clr-icon>`. The older `cds-icon` selector is an alias of the same component that is removed in v19; replace it when you touch that code.
- Do not import `ClrIconModule` (deprecated) — import `ClrIcon`.
- Do not use `<img>`, icon fonts, or inline `<svg>` for library icons.
- Prefer the `direction` input over CSS `transform: rotate()`, and `size` over CSS width/height.

## References

- Design guidance: https://guidance.clarity.design/102
- Public API: `projects/angular/icon/icon.api.md` (`ClrIcon`, `ClarityIcons`, shape exports)
- Source: `projects/angular/icon/icon.component.ts`, `projects/angular/icon/shapes/`
- Docs demos: `projects/website/src/app/documentation/demos/icons/`
