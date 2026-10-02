# forms — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/forms`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrFormsModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-alert`, `clr-alert-item`, `clr-control-container`, `clr-control-error`, `clr-control-helper`, `clr-icon`, `clr-input-container`, `clr-select-container`
- Directives / inputs: `clrAlertClosable`, `clrAlertLightweight`, `clrAlertType`, `clrControl`, `clrForm`, `clrIfError`, `clrInput`, `clrLabelSize`, `clrLayout`, `clrSelect`
- CSS classes: `alert`, `alert-icon`, `alert-icon-wrapper`, `alert-info`, `alert-item`, `alert-items`, `alert-text`, `btn`, `btn-primary`, `clr-control-container`, `clr-control-label`, `clr-error`, `clr-form`, `clr-form-compact`, `clr-form-control`, `clr-form-horizontal`, `clr-input`, `clr-input-wrapper`, `clr-required-mark`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-validate-icon`

## Examples

### ng

```html
<form clrForm>
  <clr-input-container>
    <label>Field 1 label</label>
    <input clrInput type="text" [(ngModel)]="model" name="example" required minlength="5" />
    <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
    <clr-control-error *clrIfError="'required'">Error message about being required</clr-control-error>
    <clr-control-error *clrIfError="'minlength'">Error message about requiring 5 characters</clr-control-error>
  </clr-input-container>
</form>
```

_source: projects/website/src/app/documentation/demos/forms/ng/errors.html_

### ui

```html
<form class="clr-form">
  <div class="clr-form-control">
    <label for="example" class="clr-control-label">Label</label>
    <div class="clr-control-container clr-error">
      <div class="clr-input-wrapper">
        <input type="text" id="example" placeholder="Example Input" class="clr-input" />
      </div>
      <span class="clr-subtext">Helper Text</span>
      <div class="clr-subtext-wrapper error">
        <cds-icon class="clr-validate-icon" shape="error-standard" status="danger"></cds-icon>
        <span class="clr-subtext">Error message</span>
      </div>
    </div>
  </div>
</form>
```

_source: projects/website/src/app/documentation/demos/forms/ui/errors.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "forms", features: [...] }`
