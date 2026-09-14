### Overview

AppFx Multi-Page Dialog (`appfx-dialog`) renders a composition of step components as tabs inside a Clarity modal.
It is built on top of [AppFx Tabs](../tabs/README.md), reusing the same `Step`/`WorkflowModel` API, and adds the
modal chrome (title, footer buttons, close handling) on top.

Step components and step models can be reused between AppFx Tabs and AppFx Dialog.

### Features

#### Horizontal or Vertical tabs

AppFx Dialog offers the flexibility to display tabs horizontally (the default) or in a vertical orientation.
To customize the layout, refer to the `DialogComponent.tabLayout` property.

#### Submit / Cancel workflow

The dialog's OK and Cancel buttons are wired to an optional `closeHandler`. `closeHandler.onSubmit` is invoked
when the user clicks OK, `closeHandler.onCancel` when the user clicks Cancel or closes the dialog. The dialog
waits for the returned `Observable` to complete before closing; if it errors, the error is shown in the dialog
and it remains open.

#### Reusable with AppFx Tabs

AppFx Dialog is fully compatible with AppFx Tabs, with both components sharing the same functionality. The key
distinction lies in how they are rendered, with AppFx Dialog appearing as a modal popup. This compatibility
allows one to effortlessly reuse the same steps and models between an inline AppFx Tabs page and an AppFx Dialog,
reducing code duplication and enhancing maintainability.

### Component API

#### appfx-dialog

| Attribute            | I/O    | Type                           | Required? | Description                                                                                     |
| -------------------- | ------ | ------------------------------ | --------- | ----------------------------------------------------------------------------------------------- |
| `title`              | Input  | `string`                       | No        | The title of the dialog.                                                                        |
| `subTitle`           | Input  | `string \| Observable<string>` | No        | The sub title of the dialog.                                                                    |
| `size`               | Input  | `ModalSize`                    | No        | Dialog's Clarity size (`'xl' \| 'lg' \| 'md' \| 'sm' \| 'full-screen'`).                        |
| `height`             | Input  | `string`                       | No        | Specifies the height of the dialog.                                                             |
| `defaultButton`      | Input  | `'submit' \| 'close'`          | No        | Which button is highlighted. Default value: `'close'`.                                          |
| `cancelButtonLabel`  | Input  | `string`                       | No        | The cancel button label.                                                                        |
| `okButtonLabel`      | Input  | `string`                       | No        | The OK button label.                                                                            |
| `tabLayout`          | Input  | `'horizontal' \| 'vertical'`   | No        | Tab layout. Default value: `'horizontal'`.                                                      |
| `disableTabsContent` | Input  | `boolean`                      | No        | Disable the content of the tabs.                                                                |
| `loading`            | Input  | `boolean`                      | No        | Display loading indicator when set to `true`. Default value: `false`.                           |
| `steps`              | Input  | `Step[]`                       | Yes       | Configure pages of the dialog - title, component class, model, etc.                             |
| `model`              | Input  | `WorkflowModel`                | No        | Object used to inject/eject properties between step models. Steps stay disconnected if omitted. |
| `closeHandler`       | Input  | `CloseHandler`                 | No        | Callbacks invoked when the dialog is submitted or cancelled.                                    |
| `showTabLinks`       | Input  | `boolean`                      | No        | Show tab links. Default value: `true`. Set to `false` if you have only one step.                |
| `opened`             | Input  | `boolean`                      | No        | Controls the dialog open/close state.                                                           |
| `onModelChange`      | Output | `EventEmitter<ModelChange[]>`  | No        | Emits when any of the workflow model's variables changes.                                       |
| `onClose`            | Output | `EventEmitter<void>`           | No        | Emits when the dialog is closed (close button, or the OK/Cancel buttons).                       |
| `openedChange`       | Output | `EventEmitter<boolean>`        | No        | Emits when the `opened` input changes.                                                          |

See [AppFx Tabs](../tabs/README.md) for the `Step` interface reference.

### Examples

_sample-dialog.component.html_:

```html
<button class="btn btn-primary" (click)="dialogOpened = true">Open Dialog</button>

<appfx-dialog
  [(opened)]="dialogOpened"
  [steps]="steps"
  [model]="dialogModel"
  [title]="'Sample Dialog'"
  [tabLayout]="TabLayout.horizontal"
  [closeHandler]="closeHandler"
>
</appfx-dialog>
```

_sample-dialog.component.ts_:

```ts
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { CloseHandler, Step, TabLayout } from '@clr/addons/var';

@Component({
  templateUrl: 'sample-dialog.component.html',
})
export class SampleDialog {
  TabLayout = TabLayout;

  dialogOpened = false;
  steps: Step[];
  dialogModel: SampleWorkflowModel;

  closeHandler: CloseHandler = {
    onSubmit: () => this.workflowService.apply(this.dialogModel),
    onCancel: () => of(true),
  };

  constructor() {
    this.dialogModel = new SampleWorkflowModel();
    this.steps = [
      <Step>{
        title: 'Virtual Machine Name',
        componentClass: ObjectNameComponent,
        model: new ObjectNameModel(),
      },
      <Step>{
        title: 'Select a Compute Resource',
        componentClass: SelectHostComponent,
        model: new SelectHostModel(),
      },
    ];
  }
}
```
