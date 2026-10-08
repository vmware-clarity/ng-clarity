---
name: appfx-wizard
description: Build modal multi-step workflows with the AppFX wizard (`<appfx-wizard>` from `@clr/addons/wizard`) — a `Step[]` + workflow-model driven wrapper over `clr-wizard` with data injection between pages (`Var`, `@In`/`@Out`), per-page validation, loading/error handling, conditional steps, and an auto "Ready to Complete" summary. Use when adding or changing an `appfx-wizard`, `Step` definitions, `CloseHandler`, or `WizardFooterConfig`.
metadata:
  docs: /documentation/wizard-addon
---

# AppFX wizard (`appfx-wizard`)

## When to use it vs `clr-wizard`

`clr-wizard` is the default. Use it when pages are hand-written markup (`clr-wizard-page`) and the flow is simple.

Use `appfx-wizard` when the wizard is a data workflow: pages are components described by `Step[]`, data flows between pages through a shared workflow model, pages load data and validate asynchronously, steps appear conditionally, and you want a generated summary page. It renders a `clr-wizard` internally and adds spinners, error pages with Retry, a finish-error banner, and 200%/400% zoom support.

Do not migrate existing `clr-wizard` usage unless asked. The same `Step[]` and model work with `appfx-stepper` (inline), `appfx-tabs`, and `appfx-dialog`.

## Setup

```ts
import { AppfxWizardModule, Reason } from '@clr/addons/wizard';
import { CloseHandler, In, Out, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';

@Component({ imports: [AppfxWizardModule /* + step components */] })
```

NgModule-declared, no `forRoot()`.

## Models and pages

```ts
// Workflow model: union of all page inputs/outputs, matched by property name.
export class VmWorkflowModel {
  name = Var.of<string>('');
  datastore = Var.of<string>();
}

// Page model
export class NameModel implements StepModel {
  @Out() name = Var.of<string>('');
  readyToComplete = true; // false disables Next
}

@Component({
  selector: 'app-name-page',
  imports: [FormsModule],
  template: `
    <label for="vm-name">Name</label>
    <input id="vm-name" class="clr-input" [(ngModel)]="model.name.value" />
  `,
})
export class NamePage implements StepModelHolder {
  model!: NameModel;
}
```

- `@In()` injects a workflow property into the page model; `@Out()` writes it back. Use `Mappings` when names differ.
- Page components may implement `OnStepActivate.activate(changes)` and `OnStepValidate.validate(): Observable<boolean>`.
- Set `model.loading`, `model.validationState` (`StepValidationState`) to show spinners and messages.
- Derived/async data: `Var.from(model.host).by(host => this.api.datastores(host))`.

## Wizard

```ts
model = new VmWorkflowModel();
isOpen = false;
needsStorage = Var.of(true);
private api = inject(VmApiService); // your service
onClose(reason: Reason): void {}
steps: Step[] = [
  {
    title: 'Name',
    description: 'Specify a unique name',
    componentClass: NamePage,
    model: new NameModel(),
    summary: (builder, m: NameModel) => builder.property('Name', m.name.value).build(),
  },
  { title: 'Storage', componentClass: StoragePage, model: new StorageModel(), isRelevant: this.needsStorage },
];
closeHandler: CloseHandler = {
  onSubmit: () => this.api.create(this.model),
  onCancel: () => of(true),
};
```

```html
<button type="button" class="btn btn-primary" (click)="isOpen = true">New VM</button>
<appfx-wizard
  title="New Virtual Machine"
  [pages]="steps"
  [wizardModel]="model"
  [(opened)]="isOpen"
  [closeHandler]="closeHandler"
  (onClose)="onClose($event)"
></appfx-wizard>
```

- `onSubmit` must return an `Observable`; the wizard stays open until it completes. An error shows a banner and keeps it open; throw `preventDisplayingWizardError` to keep it open silently.
- `onClose` emits a `Reason` (`finish` / `cancel`); `onFinish` and `onModelChange` are also available.
- Any step with `summary` adds a "Ready to Complete" page (`SummaryComponent`/`SummaryModel`).
- Custom footer content: `[footer]="{ componentClass: MyFooter }"`, where `MyFooter` implements `WizardFooter` (`currentStep`, `steps`, `workflowModel` inputs).
- `WorkflowService` (abstract) supports switching between named flows (`addWorkflow`, `switchToWorkflow`).

## Rules

- Step components are created before `@In()` values are injected; the model is filled when the step becomes active, then `activate(changes)` is called (on the first activation `changes` has every `@In` property). Build or patch the step's form in `activate()`, not in the constructor or `ngOnInit()`, or bind the template to the model's `Var`s directly. Alternatively set `instantiateLazy: true` on the step so the component is created after injection. Example: `activate(): void { this.form.patchValue({ name: this.model.name.value }); }`
- Create a fresh workflow model (and steps) each time the wizard opens, or old values persist.
- Mutate `Var.value`, keep the `Var` instance. Matching is by property name between page and workflow models.
- Use `StepModelFactory` (`model: () => new X()`) when `recreateComponent` is set.
- `isRelevant` is a `Var<boolean>` (`Var.of(true)` or `Var.from(...).by(...)`).
- Built-in button and status strings come from the workflow library; pass translated `title`, `Step.title`/`description`/`navTitle`.
- Debug: `WorkflowConfigurationService.debug = true` (or `clr-addons-var.debug=true` in localStorage) shows a model signpost.

## References

- API: `projects/addons/wizard/wizard.api.md`, `projects/addons/var/var.api.md`
- Demos: `projects/website/src/app/documentation/demos/wizard-addon/`, `projects/demo/src/app/addons/wizard-addon/`
