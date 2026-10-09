---
name: appfx-dialog
description: Build multi-page modal dialogs with the AppFX dialog (`<appfx-dialog>` from `@clr/addons/dialog`) — a `clr-modal` that hosts `Step[]` components as tabs (horizontal/vertical) over a shared workflow model, with OK/Cancel wired to an async `CloseHandler`, loading, and validation. Use when adding or changing an `appfx-dialog`, `appfx-dialog-header`, `DialogOptions`, or a tabbed edit/settings modal.
metadata:
  docs: /documentation/dialog
---

# AppFX dialog (`appfx-dialog`)

## When to use it vs `clr-modal`

`clr-modal` is the default for confirmations, simple forms, and any modal with its own markup.

Use `appfx-dialog` for a tabbed "edit settings" style modal whose pages are step components sharing a workflow model (`Var`, `@In`/`@Out`): it adds tab layout, per-tab validation before submit, a spinner while `onSubmit` runs, and an error banner if it fails. It is `appfx-tabs` inside a `clr-modal`, so the same `Step[]` and models work in both.

Do not migrate existing `clr-modal` usage unless asked.

## Setup

```ts
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { CloseHandler, Step, TabLayout } from '@clr/addons/var';

@Component({ imports: [AppfxMultiPageDialogModule /* + step components */] })
```

NgModule-declared, no `forRoot()`. Use `DialogComponent` / `DialogHeaderComponent` (the `Dialog` / `DialogHeader` aliases are deprecated).

## Usage

```ts
readonly TabLayout = TabLayout;
opened = false;
model = new VmSettingsModel();
vmName = '';
private api = inject(VmApiService); // your service
onClosed(): void {}
steps: Step[] = [
  { title: 'General', componentClass: GeneralTab, model: new GeneralModel() },
  { title: 'Hardware', componentClass: HardwareTab, model: new HardwareModel() },
];
closeHandler: CloseHandler = {
  onSubmit: () => this.api.save(this.model),
  onCancel: () => of(true),
};
```

```html
<button type="button" class="btn btn-primary" (click)="opened = true">Edit settings</button>

<appfx-dialog
  [(opened)]="opened"
  title="Edit VM settings"
  [subTitle]="vmName"
  size="lg"
  [steps]="steps"
  [model]="model"
  [tabLayout]="TabLayout.vertical"
  [closeHandler]="closeHandler"
  okButtonLabel="Save"
  defaultButton="submit"
  (onClose)="onClosed()"
></appfx-dialog>
```

Step components and models are written as for `appfx-tabs` (`StepModelHolder`, `OnStepValidate`, `StepModel`).

- `size`: `ModalSize` (`'sm' | 'md' | 'lg' | 'xl' | 'full-screen'`); `height` sets a fixed height.
- `defaultButton`: `'submit'` or `'close'`; unset, neither button is primary, so set it explicitly.
- `showTabLinks` defaults to `true`; set `false` for a single step.
- Other inputs: `cancelButtonLabel`, `disableTabsContent`, `loading`. Outputs: `onClose`, `openedChange`, `onModelChange`.
- Custom header content: project `<appfx-dialog-header>` inside `appfx-dialog`.
- `appfx-toggle` (`ToggleComponent`: `toggleState`/`toggleStateChange`, `label`, `toggleId`, `disabled`) is a small toggle exported from the same module.

## Rules

- `onSubmit` must return an `Observable`; the dialog closes when it completes and stays open showing the error if it errors.
- Create a fresh model (and steps) when reopening for a different object.
- Pass translated `title`, `okButtonLabel`, `cancelButtonLabel`, and `Step.title`.

## References

- API: `projects/addons/dialog/dialog.api.md`, `projects/addons/var/var.api.md`
- Docs: `projects/addons/dialog/README.md`; demos in `projects/website/src/app/documentation/demos/dialog/`, `projects/demo/src/app/addons/dialog/`
- Step/model concepts: the appfx-tabs and appfx-wizard skills
