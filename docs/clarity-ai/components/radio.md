# radio — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/radio`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrRadioModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-control-error`, `clr-control-helper`, `clr-control-success`, `clr-radio-container`, `clr-radio-wrapper`, `clr-select-container`
- Directives / inputs: `clrForm`, `clrIfError`, `clrInline`, `clrLayout`, `clrRadio`, `clrSelect`
- CSS classes: `clr-component-no-top-margin`, `clr-control-container`, `clr-control-inline`, `clr-control-label`, `clr-error`, `clr-form-control`, `clr-form-control-disabled`, `clr-radio`, `clr-radio-wrapper`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-validate-icon`

## Examples

### ng

```html
<input type="radio" clrRadio value="option1" />
```

_source: projects/website/src/app/documentation/demos/radio/ng/basic.html_

### ui

```html
<div class="clr-radio-wrapper">
  <input type="radio" id="radio1" name="radio-basic" value="option1" class="clr-radio" />
  <label for="radio1" class="clr-control-label">My choice</label>
</div>
```

_source: projects/website/src/app/documentation/demos/radio/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "radio", features: [...] }`
