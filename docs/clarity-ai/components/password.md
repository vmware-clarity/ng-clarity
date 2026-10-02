# password — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/password`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrPasswordModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-control-error`, `clr-control-helper`, `clr-control-success`, `clr-password-container`
- Directives / inputs: `clrForm`, `clrIfError`, `clrLayout`, `clrPassword`
- CSS classes: `clr-control-container`, `clr-control-label`, `clr-error`, `clr-form`, `clr-form-control`, `clr-form-horizontal`, `clr-input`, `clr-input-wrapper`, `clr-subtext`, `clr-subtext-wrapper`, `clr-validate-icon`

## Examples

### ng

```html
<form clrForm>
  <clr-password-container>
    <label>Password</label>
    <input
      clrPassword
      autocomplete="current-password"
      placeholder="Password please!"
      name="password"
      [(ngModel)]="password"
    />
  </clr-password-container>
</form>
```

_source: projects/website/src/app/documentation/demos/password/ng/basic.html_

### ui

```html
<form class="clr-form clr-form-horizontal">
  <div class="clr-form-control">
    <label for="ui-basic" class="clr-control-label">Password</label>
    <div class="clr-control-container">
      <div class="clr-input-wrapper">
        <input
          type="password"
          autocomplete="current-password"
          id="ui-basic"
          placeholder="Password please!"
          class="clr-input"
        />
      </div>
    </div>
  </div>
</form>
```

_source: projects/website/src/app/documentation/demos/password/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "password", features: [...] }`
