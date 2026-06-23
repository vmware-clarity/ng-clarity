### Overview

AppFx Tabs renders a composition of step components as tabs.
Component API is compatible with [AppFx Multi-Page Dialog](/@vmw/appfx/multi-page-dialog).
Page components and page models can be reused between the components.

The component is built on top of Clarity Tabs.

### Features

#### Horizontal, Vertical or Secondary tabs

AppFx Tabs offers the flexibility to display tabs horizontally (the default), in a vertical orientation, or as a secondary tab in a horizontal layout.
To customize the layout, refer to the Tabs.tabLayout property.

#### Disable All Tabs

Tab **content** can be disabled with the `Tab.disableTabsContent` property.
The user will still be able to click around the tabs but will not be able to interact with the page components.
When the tab content is disabled, pages will not get validated.

#### Reusable in AppFx Dialog

AppFx Tabs is fully compatible with AppFx Dialog, with both components sharing the same functionality.
The key distinction lies in how they are rendered, with AppFx Dialog appearing as a modal popup.
This compatibility allows one to effortlessly use AppFx Tabs within AppFx Dialog, reducing code duplication and enhancing maintainability.

### Component API

#### appfx-tabs

| Attribute              | I/O    | Type                                        | Required? | Description                                                                                                                                       |
| ---------------------- | ------ | ------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tabLayout`            | Input  | `'horizontal' \| 'vertical' \| 'secondary'` | No        | Tab layout - horizontal, vertical or secondary horizontal. Default value: `'horizontal'`.                                                         |
| `disableTabsContent`   | Input  | `boolean`                                   | No        | Disable the content of the tabs.                                                                                                                  |
| `loading`              | Input  | `boolean`                                   | No        | Display loading indicator when set to `true`. Default value is `false`.                                                                           |
| `showLoadingIndicator` | Input  | `boolean`                                   | No        | Display loading indicator on validate when set to `true`. Default value is `true`.                                                                |
| `tabs`                 | Input  | `Step[]`                                    | Yes       | Configure pages of the tabs - title, component class, model, etc.                                                                                 |
| `model`                | Input  | `object`                                    | Yes       | Tab model.                                                                                                                                        |
| `onModelChange`        | Output | `EventEmitter<ModelChange[]>`               | No        | Emits when the workflow model changes. Can be used for troubleshooting purposes or to render the API call that is going to be sent to the server. |
| `activeTabChange`      | Output | `EventEmitter<Step>`                        | No        | Emits when the current tab is changed.                                                                                                            |

#### Step

The `Step` interface is used to describe the content of the tabs.

| Property            | Type                                                   | Required | Description                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`             | `string`                                               | Yes      | Step title.                                                                                                                                                                                                      |
| `componentClass`    | `Type`                                                 | Yes      | Page component class.\*                                                                                                                                                                                          |
| `model`             | `StepModel \| StepModelFactory`                        | No       | `StepModel`: Data model of the page, containing inputs and output properties._<br>_`StepModelFactory`: Factory function returning `StepModel` instances. Required if `Step.recreateComponent` property is set.\* |
| `instantiateLazy`   | `boolean`                                              | No       | If `true`, page component is instantiated upon first activation. If `false`, it's instantiated immediately when Workflow component is created. Default: `false`.                                                 |
| `mappings`          | `Mappings`                                             | No       | Property name mappings from step model to step model if names differ.                                                                                                                                            |
| `recreateComponent` | `Function(stepModelChanges?: ModelChanges) => boolean` | No       | Recreate the page component if this function returns `true`.                                                                                                                                                     |
|                     |

### Examples

_sample-tabs.component.html_:

```html
<appfx-tabs [tabs]="steps" [model]="tabsModel" [tabLayout]="TabLayout.horizontal" [disableTabsContent]="false">
</appfx-tabs>

<button (click)="save()">Save</button>
```

_sample-tabs.component.ts_:

```ts
import { Tabs } from '@vmw/appfx-workflows';

@Component({
  templateUrl: 'sample-tabs.component.html',
})
export class SampleTabs {
  /**
   * Definitions of all steps.
   */
  steps: Step[];

  /**
   * Stepper model that is union of the output properties of all steps.
   */
  tabsModel: SampleWorkflowModel;

  @ViewChild(Tabs, { static: true })
  private tabs: Tabs;

  constructor() {
    this.tabsModel = new SampleTabModel();
    this.steps = [
      <Step>{
        title: 'Virtual Machine Name',
        description: 'Specify a unique name',
        componentClass: ObjectNameComponent,
        model: new ObjectNameModel(),
      },
      <Step>{
        title: 'Select a Compute Resource',
        description: 'Select the destination compute resource',
        componentClass: SelectHostComponent,
        model: new SelectHostModel(),
      },
      <Step>{
        title: 'Select Storage',
        description: 'Select the storage for the configuration and disk files',
        componentClass: SelectDatastoreComponent,
        model: new SelectDatastoreModel(),
      },
    ];
  }

  save(): void {
    // Validate all tabs that have been activated.
    this.tabs
      .validate$()
      .pipe(
        map((valid: boolean) => {
          // Do some additional validation here, if needed.
          return valid;
        })
      )
      .subscribe((valid: boolean) => {
        if (valid) {
          this.workflowService.apply(workflowModel);
        }
      });
  }
}
```

_sample-workflow.model.ts_:

```ts
import { Var } from '@vmw/appfx/var';

/**
 * Data model of SampleMultiPageDialogComponent. It contains properties that map to the inputs and
 * outputs of all pages in the dialog.
 */
export class SampleMultiPageDialogModel {
  // Retrieved from the backend; no dependencies.
  // [In] ObjectNameModel
  defaultName: Var<string>;

  // [Out] ObjectNameModel
  readonly name: Var<string> = Var.of<string>();

  // [Out] SelectHostModel
  readonly computeResourceId: Var<string> = Var.of<string>();

  // [Out] SelectHostModel
  readonly computeResourceName: Var<string> = Var.of<string>();

  // Depends on "computeResourceId"
  // [In] SelectDatastoreModel
  datastores: Var<DatastoreGridItem[]>;

  // [In] SelectDatastoreModel
  storagePolicies: Var<StoragePolicy[]>;

  // [Out] SelectDatastoreModel
  readonly selectedStoragePolicyId: Var<string> = Var.of<string>();

  // [Out] SelectDatastoreModel
  readonly selectedDatastoreId: Var<string> = Var.of<string>();
}
```
