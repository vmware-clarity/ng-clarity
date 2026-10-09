---
name: clr-tabs
description: Organize page content into switchable panes with Clarity tabs (`clr-tabs`, `clr-tab`, `clrTabLink`, `clr-tab-content`, `*clrIfActive`, `clr-tabs-actions`) from `@clr/angular`. Use when adding tabs, vertical tabs (`clrLayout="vertical"`), tab overflow (`clrTabLinkInOverflow`), dynamic/added tabs, or programmatic tab selection.
metadata:
  docs: /documentation/tabs
  guidance: ['1032:2024-10-30']
---

# Clarity tabs

## When to use

From the [tabs design guidance](https://guidance.clarity.design/1032):

- Use tabs for alternate, independent views of related content in the main content area. One row, above the content, no scrolling.
- Never use tabs in cards or modals, and never for sequential steps — use a stepper or wizard.
- At most seven tabs; use overflow when space runs out. Use vertical tabs for side-aligned tabs in narrow layouts.
- Labels: one or two words, title case, nouns ("Settings", "Permissions"). No generic labels ("General", "Advanced"). No icons in tab labels.
- Do not cross-link between tabs.

## Setup

```ts
import { ClrIcon, ClrTabsModule } from '@clr/angular';

@Component({ imports: [ClrTabsModule, ClrIcon] /* ... */ })
export class Settings {
  active = true;
  tabs: { id: string; title: string; content: string }[] = [];
  addTab(): void {}
}
```

`ClrTabsModule` is an NgModule and re-exports `ClrConditionalModule` (for `*clrIfActive`).

## Basic tabs

```html
<clr-tabs>
  <clr-tab>
    <button clrTabLink>Overview</button>
    <clr-tab-content *clrIfActive>
      <p>Overview content.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Permissions</button>
    <clr-tab-content *clrIfActive>
      <p>Permissions content.</p>
    </clr-tab-content>
  </clr-tab>
</clr-tabs>
```

- Each `clr-tab` has exactly one `<button clrTabLink>` and one `clr-tab-content`. The tab buttons get their type, role and ARIA attributes from Clarity.
- `*clrIfActive` renders content lazily (only the active tab). Without it, all contents stay in the DOM.
- The first tab is active by default.

## Selecting a tab

```html
<clr-tab>
  <button clrTabLink>Permissions</button>
  <clr-tab-content *clrIfActive="permissionsActive">...</clr-tab-content>
</clr-tab>
```

- `*clrIfActive="true"` (or a bound boolean) selects the tab; `(clrIfActiveChange)` reports changes. For two-way binding use the de-sugared form: `<ng-template [(clrIfActive)]="active"><clr-tab-content>...</clr-tab-content></ng-template>`.
- Set a custom id with `id` on `clrTabLink` / `clr-tab-content`.

## Vertical, overflow, dynamic

```html
<clr-tabs clrLayout="vertical">...</clr-tabs>

<button clrTabLink [clrTabLinkInOverflow]="true">Logs</button>
```

```html
<clr-tabs>
  <clr-tabs-actions position="right">
    <button type="button" class="btn btn-icon btn-link" clrTabAction aria-label="Add tab" (click)="addTab()">
      <clr-icon shape="plus"></clr-icon>
    </button>
  </clr-tabs-actions>
  @for (tab of tabs; track tab.id) {
  <clr-tab>
    <button clrTabLink>{{ tab.title }}</button>
    <clr-tab-content *clrIfActive>{{ tab.content }}</clr-tab-content>
  </clr-tab>
  }
</clr-tabs>
```

- `clrLayout`: `horizontal` (default) or `vertical`.
- `[clrTabLinkInOverflow]="true"` moves a tab into the "more" overflow dropdown (horizontal layout).
- `clr-tabs-actions` (`position`: `left` | `right`) holds buttons next to the tab row; mark each with `clrTabAction`.
- Tabs can be generated with `@for`; track by a stable id.

## Rules

- Do not build tabs from `ul.nav` + buttons with manual active state; use `clr-tabs`.
- Use `<button clrTabLink>`, not an `<a>` with a route. For route-based top navigation use a subnav (see the clr-app-layout skill).
- Do not use tabs for wizard-like steps, inside cards, or inside modals.
- Icon-only `clrTabAction` buttons need an `aria-label`.

## References

- Design guidance: https://guidance.clarity.design/1032
- Public API: `projects/angular/layout/layout.api.md` (search `ClrTab`), `projects/angular/utils/utils.api.md` (`ClrIfActive`)
- Docs demos: `projects/website/src/app/documentation/demos/tabs/`
