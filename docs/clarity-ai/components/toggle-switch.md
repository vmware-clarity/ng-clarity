# toggle-switch — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/toggles`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrToggleSwitchModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-checkbox-container`, `clr-checkbox-wrapper`, `clr-control-error`, `clr-control-helper`, `clr-toggle-container`, `clr-toggle-wrapper`
- Directives / inputs: `clrCheckbox`, `clrForm`, `clrInline`, `clrLayout`, `clrToggle`
- CSS classes: `clr-component-no-top-margin`, `clr-control-container`, `clr-control-inline`, `clr-control-label`, `clr-error`, `clr-form-control`, `clr-form-control-disabled`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-toggle`, `clr-toggle-right`, `clr-toggle-wrapper`, `clr-validate-icon`

## Examples

### ng

```html
<input type="checkbox" clrToggle />
```

_source: projects/website/src/app/documentation/demos/toggles/ng/basic.html_

### ui

```html
<div class="clr-form-control">
  <div class="clr-control-container">
    <div class="clr-toggle-wrapper">
      <input type="checkbox" id="toggle1" name="toggle-basic" value="option1" class="clr-toggle" />
      <label for="toggle1">My choice</label>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/toggles/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "toggle-switch", features: [...] }`
