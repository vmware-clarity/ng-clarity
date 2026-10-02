# select — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/select`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrSelectModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-alert`, `clr-alert-item`, `clr-control-error`, `clr-control-helper`, `clr-select-container`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrForm`, `clrLayout`, `clrSelect`
- CSS classes: `alert-text`, `clr-component-no-top-margin`, `clr-control-container`, `clr-control-label`, `clr-error`, `clr-focus`, `clr-form-control`, `clr-select`, `clr-select-wrapper`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-validate-icon`

## Examples

### ng

```html
<select clrSelect name="options" [(ngModel)]="selectedOption">
  <option value="one">One</option>
  <option value="two">Two</option>
  <option value="three">Three</option>
</select>
```

_source: projects/website/src/app/documentation/demos/select/ng/basic.html_

### ui

```html
<div class="clr-select-wrapper">
  <select id="select-basic" class="clr-select">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
</div>
```

_source: projects/website/src/app/documentation/demos/select/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "select", features: [...] }`
