# textarea — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/textarea`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTextareaModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `cds-icon`, `clr-control-error`, `clr-control-helper`, `clr-textarea-container`
- Directives / inputs: `clrForm`, `clrIfError`, `clrLayout`, `clrTextarea`
- CSS classes: `clr-component-no-top-margin`, `clr-control-container`, `clr-control-label`, `clr-error`, `clr-focus`, `clr-form`, `clr-form-control`, `clr-form-horizontal`, `clr-subtext`, `clr-subtext-wrapper`, `clr-success`, `clr-textarea`, `clr-textarea-wrapper`, `clr-validate-icon`

## Examples

### ng

```html
<form clrForm>
  <clr-textarea-container>
    <label>Description</label>
    <textarea clrTextarea [(ngModel)]="description" name="description" required></textarea>
  </clr-textarea-container>
</form>
```

_source: projects/website/src/app/documentation/demos/textarea/ng/basic.html_

### ui

```html
<form class="clr-form clr-form-horizontal">
  <div class="clr-form-control">
    <label for="textarea-basic" class="clr-control-label">Description</label>
    <div class="clr-control-container">
      <div class="clr-textarea-wrapper">
        <textarea id="textarea-basic" class="clr-textarea"></textarea>
      </div>
    </div>
  </div>
</form>
```

_source: projects/website/src/app/documentation/demos/textarea/ui/basic.html_

## More

- All documented examples: `ng`, `ui`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "textarea", features: [...] }`
