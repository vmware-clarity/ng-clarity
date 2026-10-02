# input — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/input`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrInputModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-alert`, `clr-alert-item`, `clr-control-error`, `clr-control-helper`, `clr-icon`, `clr-input-container`, `clr-number-input-container`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrForm`, `clrInput`, `clrInputPrefix`, `clrInputSuffix`, `clrLabelSize`, `clrLayout`, `clrNumberInput`
- CSS classes: `alert-text`, `clr-control-container`, `clr-control-label`, `clr-error`, `clr-focus`, `clr-form`, `clr-form-control`, `clr-form-control-disabled`, `clr-input`, `clr-input-margin`, `clr-input-wrapper`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-textarea`, `clr-textarea-wrapper`, `clr-validate-icon`

## Examples

### ng

```html
<form clrForm>
  <input clrInput placeholder="My input" name="input" [(ngModel)]="input" />
</form>
```

_source: projects/website/src/app/documentation/demos/input/ng/basic.html_

### ui

```html
<form class="clr-form">
  <input type="text" id="basic" placeholder="Enter value here" class="clr-input" />
</form>
```

_source: projects/website/src/app/documentation/demos/input/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "input", features: [...] }`
