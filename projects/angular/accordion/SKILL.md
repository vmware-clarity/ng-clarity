---
name: clr-accordion
description: Build Clarity accordions — vertically stacked panels that expand and collapse (`clr-accordion`, `clr-accordion-panel`, `clr-accordion-title`, `clr-accordion-description`, `clr-accordion-content`) from `@clr/angular`. Use when adding collapsible sections, single- or multi-open panels, or controlling panel open/disabled state with `clrAccordionPanelOpen` / `clrAccordionMultiPanel`.
metadata:
  docs: /documentation/accordion
  guidance: ['1000:2024-10-30']
---

# Clarity accordion

## When to use

From the [accordion guidance](https://guidance.clarity.design/1000):

- Use it to break a large amount of information into collapsible sections. Skip it when the page has little content.
- Keep each panel's content reasonably short, and headers concise.
- Header holds only a title plus optional short description — never buttons, links, or other clickable elements.
- Nest accordions at most two levels deep.

## Setup

```ts
import { ClrAccordionModule, ClrIfExpanded } from '@clr/angular';

@Component({ imports: [ClrAccordionModule, ClrIfExpanded] /* ... */ })
```

`ClrAccordionModule` is an NgModule. `ClrIfExpanded` (for lazy content) is a standalone directive, also exported by `ClrConditionalModule`.

## Basic accordion

```html
<clr-accordion>
  @for (section of sections; track section.id) {
  <clr-accordion-panel [(clrAccordionPanelOpen)]="section.open">
    <clr-accordion-title>{{ section.title }}</clr-accordion-title>
    <clr-accordion-description>{{ section.summary }}</clr-accordion-description>
    <clr-accordion-content *clrIfExpanded>{{ section.body }}</clr-accordion-content>
  </clr-accordion-panel>
  }
</clr-accordion>
```

- Each `clr-accordion-panel` needs a `clr-accordion-title` and a `clr-accordion-content`. `clr-accordion-description` is optional.
- `*clrIfExpanded` on the content renders it only while the panel is open. Leave it out if the content must stay in the DOM, for example form state.

## API

| Element               | Input / output                          | Purpose                                                    |
| --------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `clr-accordion`       | `[clrAccordionMultiPanel]`              | `true` lets several panels be open at once (default: one)  |
| `clr-accordion-panel` | `[(clrAccordionPanelOpen)]`             | Open state, two-way (`clrAccordionPanelOpenChange` output) |
| `clr-accordion-panel` | `[clrAccordionPanelDisabled]`           | Panel can't be toggled                                     |
| `clr-accordion-panel` | `[clrAccordionPanelHeadingLevel]` (1-6) | Heading level of the panel header, to fit page outline     |

```html
<clr-accordion [clrAccordionMultiPanel]="true">
  <clr-accordion-panel [clrAccordionPanelOpen]="true" [clrAccordionPanelHeadingLevel]="3">
    <clr-accordion-title>General</clr-accordion-title>
    <clr-accordion-content>...</clr-accordion-content>
  </clr-accordion-panel>
  <clr-accordion-panel [clrAccordionPanelDisabled]="!advancedAllowed">
    <clr-accordion-title>Advanced</clr-accordion-title>
    <clr-accordion-content>...</clr-accordion-content>
  </clr-accordion-panel>
</clr-accordion>
```

## Rules

- The panel header is the toggle button. Don't put interactive elements inside `clr-accordion-title` or `clr-accordion-description`.
- Set `clrAccordionPanelHeadingLevel` so the headers fit the page's heading hierarchy.
- For a step-by-step form flow, use the Clarity stepper (`clr-stepper`), not an accordion.
- For a single show/hide region, a collapsible card (`clr-card` with `clrCardCollapsible`) or a plain toggle is lighter.

## References

- Design guidance: https://guidance.clarity.design/1000
- API: `projects/angular/accordion/accordion.api.md`
- Docs demos: `projects/website/src/app/documentation/demos/accordion/`
