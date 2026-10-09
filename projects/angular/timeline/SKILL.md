---
name: clr-timeline
description: Show progress through a workflow or a chronological list of events with the Clarity timeline (`clr-timeline`, `clr-timeline-step`, `clr-timeline-step-header`, `clr-timeline-step-title`, `clr-timeline-step-description` from `@clr/angular`). Use when rendering step states (`ClrTimelineStepState`), horizontal or vertical layouts (`clrLayout`, `ClrTimelineLayout`), or an event history.
metadata:
  docs: /documentation/timeline
  guidance: ['1036:2024-10-30', '1030:2024-10-30']
---

# Clarity timeline (`clr-timeline`)

## When to use

From the [timeline design guidance](https://guidance.clarity.design/1036):

- Use a timeline for events in chronological order, or to show where the user is in a workflow and what is left.
- Use it for workflows with fewer steps and richer content per step. For many steps with little data each, use the stepper (`form[clrStepper]`) ([stepper guidance](https://guidance.clarity.design/1030)); for a modal guided flow use `clr-wizard`.
- Layout: horizontal for 3 to 5 steps that fit without wrapping; vertical for more than 5 steps.

## Setup

```ts
import { ClrTimelineLayout, ClrTimelineModule, ClrTimelineStepState } from '@clr/angular';

@Component({ imports: [ClrTimelineModule] /* ... */ })
```

`ClrTimelineModule` is an NgModule (the components are not standalone); it re-exports `ClrSpinnerModule` and the icon.

## Usage

```html
<clr-timeline [clrLayout]="ClrTimelineLayout.VERTICAL">
  @for (step of steps; track step.id) {
  <clr-timeline-step [clrState]="step.state">
    <clr-timeline-step-header>{{ step.time }}</clr-timeline-step-header>
    <clr-timeline-step-title>{{ step.title }}</clr-timeline-step-title>
    <clr-timeline-step-description>
      {{ step.description }} @if (step.state === ClrTimelineStepState.CURRENT) {
      <button type="button" class="btn btn-sm" [disabled]="uploading" (click)="upload()">Upload certificate</button>
      }
    </clr-timeline-step-description>
  </clr-timeline-step>
  }
</clr-timeline>
```

```ts
steps: { id: string; state: ClrTimelineStepState; time: string; title: string; description: string }[];
uploading = false;
upload(): void;
protected readonly ClrTimelineLayout = ClrTimelineLayout;
protected readonly ClrTimelineStepState = ClrTimelineStepState;
```

- `clrLayout`: `ClrTimelineLayout.HORIZONTAL` (default) or `VERTICAL`.
- `clrState` (`ClrTimelineStepState`): `NOT_STARTED` (default), `CURRENT`, `PROCESSING` (spinner), `SUCCESS`, `ERROR`. The step renders the matching icon/spinner and its accessible label for you.
- Order in each step: header (timestamp, optional), title, description.

## Rules

- Every step has one of the five states; use `PROCESSING` while an action runs, and disable related buttons until it ends.
- For `ERROR`, show the error message as visible text in `clr-timeline-step-description`, never only in a tooltip.
- Use descriptions to explain what each step requires.
- Static, CSS-only markup (`ul.clr-timeline` > `li.clr-timeline-step`) exists, but in Angular use the components so states and a11y labels stay correct.

## References

- Design guidance: https://guidance.clarity.design/1036
- Source: `projects/angular/timeline/`
- Docs demos: `projects/website/src/app/documentation/demos/timeline/`
