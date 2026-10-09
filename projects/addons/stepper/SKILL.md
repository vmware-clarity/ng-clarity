---
name: appfx-stepper
description: Build inline multi-step forms with the AppFX stepper (`<appfx-stepper>` from `@clr/addons/stepper`) — a `Step[]` + workflow-model driven wrapper over `clr-stepper` with data injection between steps (`Var`, `@In`/`@Out`), async validation, loading/error handling, conditional steps, and per-step summaries. Use when adding or changing an `appfx-stepper` or its `Step` definitions.
metadata:
  docs: /documentation/stepper-addon
---

# AppFX stepper (`appfx-stepper`)

## When to use it vs `clr-stepper`

`clr-stepper` is the default: a reactive form (`form[clrStepper]`) with `clr-stepper-panel` sections written in the template.

Use `appfx-stepper` when steps are components described by `Step[]` sharing a workflow model — the same engine as `appfx-wizard`, rendered inline. It adds model injection between steps, per-step loading/validation/error states, conditional steps (`isRelevant`), and a summary shown in each collapsed panel header. The same `Step[]` and model can be reused with `appfx-wizard`, `appfx-tabs`, and `appfx-dialog`.

Do not migrate existing `clr-stepper` usage unless asked.

## Setup

```ts
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Out, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';

@Component({ imports: [AppfxStepperModule /* + step components */] })
```

NgModule-declared, no `forRoot()`.

## Usage

```ts
export class ProjectNameModel implements StepModel {
  @Out() name = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'app-project-name-step',
  imports: [FormsModule],
  template: `
    <label for="proj-name">Project name</label>
    <input id="proj-name" class="clr-input" [(ngModel)]="model.name.value" required />
  `,
})
export class ProjectNameStep implements StepModelHolder {
  model!: ProjectNameModel;
}

export class ProjectWorkflowModel {
  name = Var.of<string>();
  team = Var.of<string>();
}

model = new ProjectWorkflowModel();
steps: Step[] = [
  {
    title: 'Project name',
    description: 'Enter a unique name',
    componentClass: ProjectNameStep,
    model: new ProjectNameModel(),
    summary: (builder, m: ProjectNameModel) => builder.property('Name', m.name.value).build(),
  },
  { title: 'Team', componentClass: TeamStep, model: new TeamModel() },
];
```

```html
<appfx-stepper
  [steps]="steps"
  [wizardModel]="model"
  [showCancelButton]="true"
  (onFinish)="create()"
  (onCancel)="reset()"
></appfx-stepper>
```

- Inputs: `steps`, `wizardModel`, `loading`, `usePrimaryNextButton`, `showBackButton`, `showCancelButton`.
- Outputs: `onFinish`, `onCancel`, `onModelChange`.
- `Step.description` shows beside the title until the step is completed; then `summary` (if defined) replaces it.
- Step components can implement `OnStepActivate` / `OnStepValidate` (`validate(): Observable<boolean>`), and set `model.loading` / `model.validationState`.
- `StepperStateService` (`onStepActivated$`, `areAllStepsCompleted()`) and `SummaryService` are exported for advanced control.

## Rules

- Step components are created before `@In()` values are injected; the model is filled when the step becomes active, then `activate(changes)` is called (on the first activation `changes` has every `@In` property). Build or patch the step's form in `activate()`, not in the constructor or `ngOnInit()`, or bind the template to the model's `Var`s directly. Alternatively set `instantiateLazy: true` on the step so the component is created after injection. Example: `activate(): void { this.form.patchValue({ name: this.model.name.value }); }`
- `onFinish` fires after the last step validates; read results from the workflow model (`model.name.value`). Apply them yourself.
- To reset, assign a new workflow model and new `steps`.
- Mutate `Var.value`, keep the `Var` instance; page and workflow properties match by name (use `Mappings` otherwise).
- `readyToComplete = false` on a step model disables its Next button.
- Pass translated `Step.title` / `description`; built-in button text comes from the workflow library.

## References

- API: `projects/addons/stepper/stepper.api.md`, `projects/addons/var/var.api.md`
- Demos: `projects/website/src/app/documentation/demos/stepper-addon/`, `projects/demo/src/app/addons/stepper-addon/`
- Model concepts in detail: the appfx-wizard skill
