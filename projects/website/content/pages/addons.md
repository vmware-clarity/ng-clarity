---
title: Addons
leftAlignTables: true
---

# Addons

<p class="component-summary">
  Addons are ready-made features built on top of the Clarity components. They live in the optional
  <code cds-text="code">&#64;clr/addons</code> package, so applications that don't need them keep a lean bundle.
</p>

## Components or Addons?

Clarity components are the building blocks of the design system: buttons,
datagrids, wizards, tabs and so on. You compose them in your templates and wire up the behavior yourself.

Addons take care of that wiring for common, larger use cases. For example, the
[Advanced Wizard](/documentation/advanced-wizard) uses the [Wizard](/documentation/wizard) component
and adds data loading between steps, validation, error handling and a summary page. The
[Advanced Datagrid](/documentation/advanced-datagrid) uses the [Datagrid](/documentation/datagrid)
component and is configured with column definitions instead of markup.

|                | Components                                                   | Addons                                                |
| :------------- | :----------------------------------------------------------- | :---------------------------------------------------- |
| Package        | `@clr/angular` (and `@clr/ui` for styles)                    | `@clr/addons`                                         |
| Selector       | `clr-*`, for example `clr-wizard`                            | `appfx-*`, for example `appfx-wizard`                 |
| What you get   | Building blocks with full control over markup and behavior   | Complete features with built-in, opinionated behavior |
| When to use it | Your use case doesn't fit an addon, or you need full control | An addon matches your use case and you want less code |

Some addons share a name with the component they build on. Those addons are named **Advanced**, for
example **Advanced Wizard** next to the **Wizard** component, and their pages show an **Addon** label.

## Installation

Addons need `@clr/angular` installed and set up first. See the [developing guide](/pages/developing).
Then install the addons package:

```bash
npm install @clr/addons --save
```

The [Certificate Viewer](/documentation/certificate-viewer) also needs its optional peer dependencies:

```bash
npm install pkijs asn1js --save
```

## Usage

Each addon has its own entry point. Import what you need from `@clr/addons/<addon>`; the package root
exports nothing, so unused addons stay out of your bundle.

```typescript
import { NgModule } from '@angular/core';
import { AppfxWizardModule } from '@clr/addons/wizard';

@NgModule({
  imports: [AppfxWizardModule],
})
export class MyModule {}
```

Addons ship with English strings. To show them in another language, sync your application's locale
with `AppfxTranslateService`. See [Translate](/documentation/translate).

## Available Addons

### Workflows

The workflow addons share one engine from `@clr/addons/var`, so the same steps and models can be
shown as a wizard, a stepper, tabs or a dialog.

| Addon                                               | Entry point           | Built on                          |
| :-------------------------------------------------- | :-------------------- | :-------------------------------- |
| [Advanced Wizard](/documentation/advanced-wizard)   | `@clr/addons/wizard`  | [Wizard](/documentation/wizard)   |
| [Advanced Stepper](/documentation/advanced-stepper) | `@clr/addons/stepper` | [Stepper](/documentation/stepper) |
| [Advanced Tabs](/documentation/advanced-tabs)       | `@clr/addons/tabs`    | [Tabs](/documentation/tabs)       |
| [Multi-Page Dialog](/documentation/dialog)          | `@clr/addons/dialog`  | [Modal](/documentation/modal)     |

### Data

| Addon                                                   | Entry point                                            | Built on                            |
| :------------------------------------------------------ | :----------------------------------------------------- | :---------------------------------- |
| [Advanced Datagrid](/documentation/advanced-datagrid)   | `@clr/addons/datagrid`, `@clr/addons/datagrid-filters` | [Datagrid](/documentation/datagrid) |
| [Property View](/documentation/property-view)           | `@clr/addons/property-view`                            |                                     |
| [Card Container](/documentation/card-container)         | `@clr/addons/card-container`                           |                                     |
| [Certificate Viewer](/documentation/certificate-viewer) | `@clr/addons/certificate-viewer`                       |                                     |

### Utilities

| Addon                                          | Entry point                 | Built on                            |
| :--------------------------------------------- | :-------------------------- | :---------------------------------- |
| [Accessibility Utilities](/documentation/a11y) | `@clr/addons/a11y`          |                                     |
| [Drag and Drop](/documentation/drag-and-drop)  | `@clr/addons/drag-and-drop` |                                     |
| [Menu](/documentation/menu)                    | `@clr/addons/menu`          | [Dropdown](/documentation/dropdown) |
| [Theme Builder](/documentation/theme-builder)  | `@clr/addons/theme-builder` |                                     |
| [Translate](/documentation/translate)          | `@clr/addons/translate`     |                                     |
