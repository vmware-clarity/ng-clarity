# typography — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/typography`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTypographyModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-color-type`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`
- CSS classes: `clr-lh-16px`, `clr-lh-24px`

## Examples

### color-type

```html
<div class="clr-row">
  <div class="clr-col-6 clr-col-md-3 clr-mt-24px">
    <h3 cds-text="subsection">Basic Type</h3>
    @for (item of colorType.basicType; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
  <div class="clr-col-6 clr-col-md-3 clr-mt-24px">
    <h3 cds-text="subsection">Links</h3>
    @for (item of colorType.links; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/typography/color-type/color-type.demo.html_

## More

- All documented examples: `color-type`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "typography", features: [...] }`
