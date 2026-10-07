---
name: clr-wizard
description: Guide users through a modal (or in-page) multi-step flow with the Clarity wizard (`clr-wizard`, `clr-wizard-page`, `clr-wizard-button`, `clrPageTitle`, `clrPageButtons` from `@clr/angular`). Use when building a step-by-step dialog with Next/Back/Finish buttons, per-page validation (`clrWizardPageNextDisabled`), async validation before moving on, custom buttons, or when choosing between a wizard and a stepper.
metadata:
  docs: /documentation/wizard
  guidance: ['1039:2024-10-30', '1030:2024-10-30']
---

# Clarity wizard (`clr-wizard`)

## When to use (wizard vs stepper)

From the [wizard design guidance](https://guidance.clarity.design/1039):

- **Wizard**: a self-contained flow of at least two steps that needs no other part of the app. It is a modal that blocks the page until finished or cancelled.
- **Stepper** (`form[clrStepper]`, see the clr-stepper skill): the form stays inline with the page, users may navigate away mid-flow, or each step needs a description/summary ([stepper guidance](https://guidance.clarity.design/1030)).
- Use a stepper or a saved draft when users must leave and resume later; a wizard loses its state.
- Never open a wizard from a modal or a modal from a wizard.
- The wizard title describes the whole workflow; each page title matches its step name. Keep page content short.

## Setup

```ts
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrSpinnerModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({ imports: [ClrWizardModule, ClrFormsModule, FormsModule, ClrSpinnerModule] /* ... */ })
```

`ClrWizardModule` is an NgModule (the components are not standalone). Import `ClrWizard` only as a type for `viewChild`.

## Basic wizard

```html
<button type="button" class="btn btn-primary" (click)="open = true">New VM</button>

<clr-wizard [(clrWizardOpen)]="open" clrWizardSize="lg" (clrWizardOnFinish)="create()">
  <clr-wizard-title>Create virtual machine</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page [clrWizardPageNextDisabled]="!nameForm.valid">
    <ng-template clrPageTitle>Name</ng-template>
    <form clrForm #nameForm="ngForm">
      <clr-input-container>
        <label>Name</label>
        <input clrInput name="name" [(ngModel)]="model.name" required />
      </clr-input-container>
    </form>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Review</ng-template>
    <ng-template clrPageNavTitle>Review</ng-template>
    <p>{{ model.name }}</p>
  </clr-wizard-page>
</clr-wizard>
```

- Every page needs `<ng-template clrPageTitle>`; `clrPageNavTitle` overrides the step-nav label.
- Button types: `cancel`, `previous`, `next`, `finish`, `danger`. Prefix with `custom-` (e.g. `custom-next`) to handle the click yourself via `(clrWizardPageCustomButton)`.
- `clrWizardSize`: `md`, `lg`, `xl` (default), `full-screen`. `[clrWizardStepnavLayout]`: `ClrWizardStepnavLayout.VERTICAL`/`HORIZONTAL`.
- Outputs: `clrWizardOnFinish`, `clrWizardOnCancel`, `clrWizardOnNext`, `clrWizardOnPrevious`, `clrWizardCurrentPageChange`, `clrWizardOnReset`.
- Methods (via `viewChild(ClrWizard)`): `open()`, `close()`, `next()`, `previous()`, `goTo(pageId)`, `forceNext()`, `forceFinish()`, `reset()`.
- Call `wizard.reset()` before reopening to start at the first page with cleared completion.

## Per-page validation and async checks

```html
<clr-wizard-page
  clrWizardPagePreventDefault="true"
  (clrWizardPageOnCommit)="validate()"
  (clrWizardPageOnCancel)="wizard()?.close()"
  [clrWizardPageHasError]="error"
>
  <ng-template clrPageTitle>Credentials</ng-template>
  @if (checking) {
  <clr-spinner clrInline>Checking</clr-spinner>
  } ...
</clr-wizard-page>
```

```ts
open = false;
model = { name: '' };
checking = false;
error = false;
create(): void;
wizard = viewChild<ClrWizard>(ClrWizard);

validate() {
  this.checking = true;
  this.api.check(this.model).subscribe(ok => {
    this.checking = false;
    this.error = !ok;
    if (ok) this.wizard()?.forceNext();
  });
}
```

- `clrWizardPagePreventDefault` stops the default Next/Finish/Cancel so the page decides; then call `forceNext()` / `forceFinish()` / `close()`.
- Narrower: `clrWizardPagePreventDefaultNext`, `clrWizardPagePreventDefaultCancel`, or on the wizard `clrWizardPreventDefaultNext`, `clrWizardPreventDefaultCancel`.
- Page events: `clrWizardPageOnLoad`, `clrWizardPageOnCommit`, `clrWizardPageNext`, `clrWizardPagePrevious`, `clrWizardPageFinish`, `clrWizardPageDanger`.
- `[clrWizardPagePreviousDisabled]` disables Back; `[clrWizardPreventNavigation]` / `[clrWizardDisableStepnav]` lock the step nav while saving.
- `[clrWizardForceForwardNavigation]="true"` marks later pages incomplete when the user goes back.

## Custom buttons and in-page wizard

- `<ng-template clrPageButtons>` with `clr-wizard-button`s replaces the footer buttons for one page.
- `clr-wizard-header-action` (with `(actionClicked)`) adds header icon actions; give it a `title` for its accessible name.
- `[clrWizardInPage]="true"` (plus `[clrWizardInPageFillContentArea]="true"`) renders the wizard inline without modal or close button. The docs use it for a nested wizard inside a parent page and advance the parent with `forceNext()` from `(clrWizardOnFinish)`.

## Rules

- Localize all button labels and `clrWizardStepnavAriaLabel`.
- Set `[clrHeadingLevel]` on `clr-wizard-title` / `clrPageTitle` to fit the page heading outline.
- Show errors in a `clr-alert` on the page, plus `clrWizardPageHasError` to flag the step.

## References

- Design guidance: https://guidance.clarity.design/1039
- Source: `projects/angular/wizard/`
- Docs demos: `projects/website/src/app/documentation/demos/wizard/`
