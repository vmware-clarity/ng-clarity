# icons — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/icons`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrIconsModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-control-helper`, `clr-icon`, `clr-input-container`, `clr-select-container`, `clr-toggle-container`, `clr-toggle-wrapper`
- Directives / inputs: `clrForm`, `clrInput`, `clrInputPrefix`, `clrLayout`, `clrSelect`, `clrToggle`
- CSS classes: `clr-component-no-top-margin`, `clr-form-full-width`

## Examples

### icon-shapes

```html
<form
  class="clr-form-full-width no-padding sticky-form"
  clrForm
  clrLayout="vertical"
  [formGroup]="form"
  (keydown.enter)="$event.preventDefault()"
>
  <div class="clr-row">
    <div class="clr-col-12">
      <clr-input-container role="search">
        <label>Search</label>
        <clr-icon clrInputPrefix shape="search"></clr-icon>
        <input role="searchbox" placeholder="Search Term" autocomplete="off" clrInput formControlName="searchTerm" />
        <clr-control-helper class="clr-sr-only" style="display: none">
          Results will update below as you type in your search
        </clr-control-helper>
      </clr-input-container>
    </div>
  </div>
  <div class="clr-row clr-mt-32px">
    <div class="clr-col-1 preview-section clr-component-no-top-margin">
      <clr-toggle-container>
        <label id="label1">Preview as</label>
        <clr-toggle-wrapper class="clr-mt-8px">
          <input type="checkbox" aria-labelledby="label1 label2" clrToggle formControlName="solid" />
          <label id="label2">solid</label>
        </clr-toggle-wrapper>
      </clr-toggle-container>
    </div>
    <div class="clr-col-3 clr-ml-8px clr-component-no-top-margin">
      <clr-select-container>
        <label>Badge</label>
        <select class="clr-mt-8px" clrSelect formControlName="badge">
          <option value="">none</option>
          @for (item of iconStates.badged;
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/icons/icon-shapes/icon-shapes.component.html_

## More

- All documented examples: `icon-shapes`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "icons", features: [...] }`
