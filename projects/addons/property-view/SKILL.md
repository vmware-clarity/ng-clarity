---
name: appfx-property-view
description: Show read-only key/value details grouped into categories (tabs) and collapsible sections with the AppFX property view (`<appfx-property-view>` from `@clr/addons/property-view`), built with a fluent `PropertyViewBuilder`. Use when adding or changing an `appfx-property-view`, `PropertyViewBuilder`, `PropertyViewModel`, or custom property value components.
metadata:
  docs: /documentation/property-view
---

# AppFX property view (`appfx-property-view`)

## When to use it vs `clr-stack-view`

Plain Clarity `clr-stack-view` is the default for a key/value list. Use `appfx-property-view` when you need its extras: data-driven model, category tabs, collapsible sections with actions, section messages (info/warning/error), linked values, or custom value components. Leave existing `clr-stack-view` usage alone unless asked to switch.

## Setup

```ts
import { AppfxPropertyViewModule, PropertyViewBuilder, PropertyViewModel } from '@clr/addons/property-view';

@Component({
  imports: [AppfxPropertyViewModule],
  // ...
})
```

The component is NgModule-declared (not standalone). The module provides `PropertyViewService` (`createPropertyViewBuilder()`), or create `new PropertyViewBuilder()` directly.

## Basic usage

```ts
data: PropertyViewModel | null = null;

ngOnInit(): void {
  const builder = new PropertyViewBuilder();
  builder
    .category('general')
    .title('General')
    .section('vm')
    .title('Virtual Machine')
    .action({ title: 'Edit', isEnabled: true, clickHandler: () => this.edit() })
    .property('Name', this.vm.name)
    .property('IP addresses', this.vm.ips) // array = multiple values
    .warning('VMware Tools is outdated');
  this.data = builder.build();
}
```

```html
@if (data) {
<appfx-property-view [data]="data" [config]="{ propertyKeyWidthInRem: 12 }"></appfx-property-view>
}
```

## Links, icons and custom values

```ts
section
  .propertyBuilder()
  .keyBuilder()
  .text('Host')
  .icon('host')
  .exit()
  .valueBuilder()
  .text(vm.host)
  .link({ clickHandler: () => this.openHost() })
  .exit()
  .exit();

section
  .propertyBuilder()
  .keyBuilder()
  .text('Status')
  .exit()
  .valueComponentBuilder<StatusModel>()
  .component(StatusValueComponent)
  .model({ state: vm.state })
  .exit()
  .exit();
```

```ts
@Component({ selector: 'app-status-value', template: `<span class="label">{{ model?.state }}</span>` })
export class StatusValueComponent implements PropertyViewPropertyValueComponent<StatusModel> {
  model?: StatusModel | null;
}
```

- Builder chain: `category()` → `section()` → `property()` / `propertyBuilder()` / `message()` / `info()` / `warning()` / `error()`; `exit()` returns to the parent builder.
- Section options: `titleIcon()`, `collapseContent(true)` (starts collapsed), `action(...)`, `renderAsHtml(true)`.
- `generateAllCategory('All')` adds a category merging all sections.

## Rules

- Build the model once per data change and assign a new `PropertyViewModel` (`builder.build()`); keep it out of template getters.
- Guard with `@if (data)` while loading.
- Use `renderAsHtml(true)` only for trusted, sanitized content.
- Category/section ids must be unique and stable — expanded state and selected tab are tracked by id.
- All text (keys, titles, messages, action titles) comes from your app — pass translated strings.
- Localize built-in labels (toggle, actions, category list aria labels) by providing your own `PropertyViewStrings` in an ancestor injector.

## References

- API: `projects/addons/property-view/property-view.api.md`
- Demos: `projects/website/src/app/documentation/demos/property-view/`, `.storybook/stories/addons/`
