---
name: clr-card
description: Build Clarity cards — the `clr-card` component family (`clr-card-header`, `clr-card-body`, `clr-card-body-title`, `clr-card-body-text`, `clr-card-image`, `clr-card-media-block`, `clr-card-divider`, `clr-card-footer`, collapsible via `clrCardCollapsible`) and `.card` CSS classes incl. clickable cards. Use when grouping related content and actions in a card or card grid.
metadata:
  docs: /documentation/card
  guidance: ['1005:2024-10-30']
---

# Clarity card

## When to use

From the [card guidance](https://guidance.clarity.design/1005):

- One card per topic, showing high-level information that leads to details and actions. Don't overload a card.
- Never nest a card inside another card. Lay cards out in a fixed-column grid layout, grouped by theme.
- Footer: at most a primary and one secondary action, left-aligned, as flat buttons (`btn btn-sm btn-link`). For more actions, use a dropdown.
- Use dividers to separate regions. Use a clickable card when the whole card starts one action.

## Setup

```ts
import { ClrCardModule } from '@clr/angular';

@Component({ imports: [ClrCardModule] /* ... */ })
export class Projects {
  projects: { id: string; name: string; owner: string; summary: string; logo: string; image: string }[] = [];
  expanded = true;
  open(project: { id: string }): void {}
}
```

## Card component

```html
@for (project of projects; track project.id) {
<clr-card>
  <clr-card-header>{{ project.name }}</clr-card-header>
  <clr-card-body>
    <clr-card-media-block>
      <img clrCardMediaImage [src]="project.logo" alt="" />
      <clr-card-media-description>
        <span clrCardMediaTitle>{{ project.name }}</span>
        <span clrCardMediaText>Owner: {{ project.owner }}</span>
      </clr-card-media-description>
    </clr-card-media-block>
    <clr-card-divider></clr-card-divider>
    <clr-card-body-title>Status</clr-card-body-title>
    <clr-card-body-text>{{ project.summary }}</clr-card-body-text>
  </clr-card-body>
  <clr-card-footer>
    <button type="button" class="btn btn-sm btn-link" (click)="open(project)">Open</button>
  </clr-card-footer>
</clr-card>
}
```

- Image card: put `<clr-card-image><img src="..." alt="..." /></clr-card-image>` before `clr-card-body`.
- `clrHeadingLevel` (1-6) on `clr-card-header` / `clr-card-body-title` sets the heading level to fit the page outline.
- `[clrCardMediaWrap]="true"` on `clr-card-media-block` stacks the image above the text.

## Collapsible card

```html
<clr-card clrCardCollapsible [(clrCardExpanded)]="expanded" [clrCardFooterCollapsible]="false">
  <clr-card-header>Details</clr-card-header>
  <clr-card-body>...</clr-card-body>
  <clr-card-footer>...</clr-card-footer>
</clr-card>
```

- The header gets a toggle button. `(clrCardExpandedChange)` emits the new state.
- `[clrCardFooterCollapsible]="false"` keeps the footer visible while collapsed.

## CSS only / clickable card

```html
<a [routerLink]="['/projects', project.id]" class="card clickable">
  <div class="card-img"><img [src]="project.image" alt="" /></div>
  <div class="card-block">
    <h3 class="card-title">{{ project.name }}</h3>
    <p class="card-text">{{ project.summary }}</p>
  </div>
</a>
```

Classes: `card`, `card-header`, `card-block`, `card-title`, `card-text`, `card-img`, `card-media-block`, `card-divider`, `card-footer`, `clickable`.

## Rules

- A clickable card must be a real `<a>` or `<button>`, and it must not contain other interactive elements.
- Decorative images get `alt=""`. Meaningful images get descriptive alt text.
- Alerts in a card: only one, at the very top, with `[clrAlertSizeSmall]="true"`.

## References

- Design guidance: https://guidance.clarity.design/1005
- API: `projects/angular/card/card.api.md`
- Styles: `projects/angular/card/_card.clarity.scss`, `projects/angular/card/STYLES.md`
- Docs demos: `projects/website/src/app/documentation/demos/card/` (Angular: `.../card/angular/`)
