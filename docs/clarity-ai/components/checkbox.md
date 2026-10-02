# checkbox — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/checkboxes`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrCheckboxModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-checkbox-container`, `clr-checkbox-wrapper`, `clr-control-error`, `clr-control-helper`, `clr-control-success`, `clr-icon`
- Directives / inputs: `clrCheckbox`, `clrForm`, `clrIfError`, `clrInline`, `clrLayout`, `clrToggle`
- CSS classes: `btn`, `btn-sm`, `clr-checkbox`, `clr-checkbox-wrapper`, `clr-code`, `clr-control-container`, `clr-control-inline`, `clr-control-label`, `clr-error`, `clr-form-control`, `clr-form-control-disabled`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-validate-icon`

## Examples

### ng

```html
<input type="checkbox" clrCheckbox />
```

_source: projects/website/src/app/documentation/demos/checkboxes/ng/basic.html_

### ui

```html
<div class="clr-form-control">
  <div class="clr-control-container">
    <div class="clr-checkbox-wrapper">
      <input clrcheckbox="" name="test2" type="checkbox" value="option1" id="clr-form-control-1" />
      <label class="clr-control-label" for="clr-form-control-1">My Choice</label>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/checkboxes/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "checkbox", features: [...] }`
