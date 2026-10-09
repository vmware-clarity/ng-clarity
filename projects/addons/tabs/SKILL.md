---
name: appfx-tabs
description: Render step components as tabs with AppFX tabs (`<appfx-tabs>` from `@clr/addons/tabs`) — a `Step[]` + workflow-model driven wrapper over `clr-tabs` with horizontal/vertical/secondary layouts, per-tab validation, loading, and zoom-aware tab links; plus the `appfxIfTabActive` directive for plain `clr-tab`. Use when adding or changing `appfx-tabs`, `appfx-tab-links`, `appfxIfTabActive`, or tab `Step` definitions.
metadata:
  docs: /documentation/tabs-addon
---

# AppFX tabs (`appfx-tabs`)

## When to use it vs `clr-tabs`

`clr-tabs` is the default for tabbed content written in the template.

Use `appfx-tabs` when each tab is a component with its own model, data flows through a shared workflow model (`Var`, `@In`/`@Out`), and you need to validate the visited tabs before saving. It renders `clr-tabs` internally and adds loading/error states, disabled content mode, and a collapsible tab-links panel at high zoom. Its `Step[]` and models are reusable in `appfx-dialog`, `appfx-wizard`, and `appfx-stepper`.

For a plain `clr-tabs` whose active tab must be bound two-way to a component property (or needs an active CSS class), do not reach for `appfx-tabs`: put the `appfxIfTabActive` directive on each `clr-tab` (section below). The wrapper is only for model-driven step components.

Do not migrate existing `clr-tabs` usage unless asked.

## Setup

```ts
import { AppfxTabsModule, TabsComponent } from '@clr/addons/tabs';
import { Step, StepModel, StepModelHolder, TabLayout, Var } from '@clr/addons/var';

@Component({ imports: [AppfxTabsModule /* + tab components */] })
```

NgModule-declared, no `forRoot()`.

## `appfx-tabs`

```ts
export class GeneralModel implements StepModel {
  name = Var.of<string>('');
}

@Component({
  selector: 'app-general-tab',
  imports: [FormsModule],
  template: `
    <label for="res-name">Name</label>
    <input id="res-name" class="clr-input" [(ngModel)]="model.name.value" />
  `,
})
export class GeneralTab implements StepModelHolder {
  model!: GeneralModel;
}

readonly TabLayout = TabLayout;
model = new SettingsWorkflowModel();
steps: Step[] = [
  { title: 'General', componentClass: GeneralTab, model: new GeneralModel() },
  { title: 'Network', componentClass: NetworkTab, model: new NetworkModel(), instantiateLazy: true },
];
@ViewChild(TabsComponent) tabs!: TabsComponent;

save() {
  this.tabs.validate$().subscribe(valid => valid && this.api.save(this.model));
}
```

```html
<appfx-tabs
  [tabs]="steps"
  [model]="model"
  [tabLayout]="TabLayout.vertical"
  [disableTabsContent]="readOnly"
  (activeTabChange)="onTab($event)"
></appfx-tabs>
<button type="button" class="btn btn-primary" (click)="save()">Save</button>
```

- `tabLayout`: `TabLayout.horizontal` (default), `vertical`, `secondary`.
- `validate$()` validates every activated tab; `validateActiveTab$()` only the current one.
- `disableTabsContent` keeps tabs clickable but blocks interaction and skips validation.
- Other inputs: `loading`, `showLoadingIndicator` (default `true`), `showTabLinks`, `autoCollapseTabLinks`. Outputs: `onModelChange`, `tabLinksOpenedChange`.

## `appfxIfTabActive` on `clr-tab`

```html
<clr-tabs>
  <clr-tab appfxIfTabActive [activateTab]="tab === 'b'" (appfxIfTabActiveChange)="onActive('b', $event)">
    <button clrTabLink>B</button>
    <clr-tab-content *clrIfActive>...</clr-tab-content>
  </clr-tab>
</clr-tabs>
```

`activeClass` adds a CSS class while the tab is active.

## Rules

- Required inputs: `tabs` and `model`. Assign new arrays/models to reset.
- Mutate `Var.value`, keep the `Var` instance; properties match by name (or `Mappings`).
- Pass translated `Step.title`; built-in strings come from the workflow library.
- `appfx-tab-links` is used internally for the zoomed tab list; prefer the `showTabLinks` input.

## References

- API: `projects/addons/tabs/tabs.api.md`, `projects/addons/var/var.api.md`
- Docs: `projects/addons/tabs/tabs.md`; demos in `projects/website/src/app/documentation/demos/tabs-addon/ng/`
