---
name: clr-stepper
description: Build inline multi-step forms with the Clarity stepper (`form[clrStepper]`, `clr-stepper-panel`, `clr-step-title`, `clr-step-description`, `clr-step-content`, `clrStepButton` from `@clr/angular`). Use when splitting a reactive (`formGroupName`) or template-driven (`ngModelGroup`) form into accordion-like steps on the page, or when choosing between a stepper, a wizard, and a timeline.
metadata:
  docs: /documentation/stepper
  guidance: ['1030:2024-10-30', '1039:2024-10-30', '1036:2024-10-30']
---

# Clarity stepper (`form[clrStepper]`)

## When to use (stepper vs wizard)

From the [stepper design guidance](https://guidance.clarity.design/1030):

- **Stepper**: the steps are a form inline with the page content, users may leave to other parts of the app mid-flow, there are many steps with little data each, and each step needs a description or a summary of what was entered. Best with more than two steps.
- **Wizard** (`clr-wizard`, see the clr-wizard skill): a modal, self-contained flow that blocks the rest of the app until finished or cancelled ([wizard guidance](https://guidance.clarity.design/1039)).
- **Timeline** (`clr-timeline`): fewer steps with longer content, or a read-only view of progress ([timeline guidance](https://guidance.clarity.design/1036)).
- Keep each step short. Give every panel a title and a description.

## Setup

```ts
import { ReactiveFormsModule } from '@angular/forms';
import { ClrConditionalModule, ClrFormsModule, ClrStepperModule } from '@clr/angular';

@Component({ imports: [ClrStepperModule, ClrConditionalModule, ClrFormsModule, ReactiveFormsModule] /* ... */ })
```

`ClrStepperModule` is an NgModule (the components are not standalone). `ClrConditionalModule` provides `*clrIfExpanded`.

## Reactive forms

```ts
form = new FormGroup({
  name: new FormGroup({ first: new FormControl('', Validators.required), last: new FormControl('') }),
  contact: new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]) }),
});
```

```html
<form clrStepper [formGroup]="form" (ngSubmit)="submit()">
  <clr-stepper-panel formGroupName="name">
    <clr-step-title>Legal name</clr-step-title>
    <clr-step-description>Your name as it appears on official documents.</clr-step-description>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>First name</label>
        <input clrInput formControlName="first" />
        <clr-control-error *clrIfError="'required'">First name is required</clr-control-error>
      </clr-input-container>
      <button clrStepButton="next">Next</button>
    </clr-step-content>
  </clr-stepper-panel>

  <clr-stepper-panel formGroupName="contact">
    <clr-step-title>Contact</clr-step-title>
    <clr-step-description>How we reach you.</clr-step-description>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>Email</label>
        <input clrInput formControlName="email" />
      </clr-input-container>
      <button clrStepButton="previous">Back</button>
      <button clrStepButton="submit">Submit</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>
```

## Template-driven forms

```html
<form clrStepper #stepperForm="ngForm" (ngSubmit)="submit(stepperForm.value)">
  <clr-stepper-panel ngModelGroup="name">
    <clr-step-title>Legal name</clr-step-title>
    <clr-step-content *clrIfExpanded>
      <clr-input-container>
        <label>First name</label>
        <input clrInput name="first" [(ngModel)]="model.first" required />
      </clr-input-container>
      <button clrStepButton="next">Next</button>
    </clr-step-content>
  </clr-stepper-panel>
</form>
```

Import `FormsModule` instead of `ReactiveFormsModule`.

## Behavior

- `clrStepper` goes on a `<form>`. Each `clr-stepper-panel` must have `formGroupName` (reactive) or `ngModelGroup` (template-driven); the group's validity decides whether the user can move on.
- `clrStepButton` values: `next` (default), `previous`, `submit` (`ClrStepButtonType`). The directive adds the `btn` classes and `type="button"`; on the last panel `submit` emits the form's `ngSubmit` once every step is valid.
- An invalid group marks the step with an error and keeps the user on it; completed steps can be reopened by clicking their header.
- `[clrInitialStep]="'contact'"` opens a specific panel (the group name) first, e.g. when resuming.
- `form.reset()` resets the stepper back to the first step.

## Rules

- Use `*clrIfExpanded` on `clr-step-content` so only the open step is rendered.
- Place `clr-step-title`, then `clr-step-description`, then `clr-step-content` in each panel.
- Show validation errors with `clr-control-error` inside the Clarity form containers.

## References

- Design guidance: https://guidance.clarity.design/1030
- Source: `projects/angular/stepper/`
- Docs demos: `projects/website/src/app/documentation/demos/stepper/`
