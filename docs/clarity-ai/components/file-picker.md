# file-picker — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/file-picker`

## Import

- Modules used in the demos: `ClrFileInputModule`
- Granular module for a lean bundle: `ClrFilePickerModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: _(none observed)_
- Directives / inputs: _(none observed)_
- CSS classes: _(none observed)_

## Examples

### api

```html
<app-file-picker-api-angular></app-file-picker-api-angular>

<app-style-docs styleDocsKey="File Input"></app-style-docs>
```

_source: projects/website/src/app/documentation/demos/file-picker/api/file-picker-api.html_

### code

```html
<app-file-picker-code-basic-example></app-file-picker-code-basic-example>

<app-file-picker-code-disabled-example></app-file-picker-code-disabled-example>

<app-file-picker-code-validation-example></app-file-picker-code-validation-example>

<app-file-picker-code-value-accessor-example></app-file-picker-code-value-accessor-example>

<app-file-picker-code-custom-button-label-example></app-file-picker-code-custom-button-label-example>

<app-file-picker-code-advanced-example></app-file-picker-code-advanced-example>
```

_source: projects/website/src/app/documentation/demos/file-picker/code/file-picker-code.html_

### overview

```html
<app-file-picker-overview-usage></app-file-picker-overview-usage>

<app-file-picker-overview-states></app-file-picker-overview-states>

<app-file-picker-overview-layouts></app-file-picker-overview-layouts>
```

_source: projects/website/src/app/documentation/demos/file-picker/overview/file-picker-overview.html_

## More

- All documented examples: `api`, `code`, `overview`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "file-picker", features: [...] }`
