# color — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/color`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrColorModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-color-interaction`, `clr-color-object-border`, `clr-color-palette`, `clr-color-palette-example-item`, `clr-color-status`, `clr-color-type`, `clr-color-utility`
- Directives / inputs: `clrAlertClosable`, `clrAlertClosedChange`, `clrAlertType`
- CSS classes: `alert-text`, `clr-palette-row`

## Examples

### color-interaction

```html
<h3 data-toc-item cds-text="section" id="color-system-interaction" class="clr-mt-32px">Interaction</h3>
<p cds-text="body" class="clr-mt-16px">
  Interaction styles define the look and feel of interactive elements within Clarity.
</p>

<h4 cds-text="body medium" class="clr-mt-16px">Objects - Hover / Active / Selected</h4>
<div class="clr-row">
  @for (item of colorInteraction.objectItems; track item) {
  <div class="clr-col-3">
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
  </div>
  }
</div>

<h4 cds-text="body medium" class="clr-mt-16px">Buttons - Hover / Active / Selected</h4>
<div class="clr-row">
  @for (colorVariants of colorInteraction.buttonItems; track colorVariants) {
  <div class="clr-col-3 clr-mb-24px">
    @for (item of colorVariants; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
  }
</div>
<div class="clr-row">
  <div class="clr-col-8">
    <div class="color-example-container">
      <app-themed-image
        [lightSrc]="'/assets/images/documentation/color/light-theme/accordion-panel-states.svg'"
        [darkSrc]="'/assets/images/documentation/color/dark-theme/accordion-panel-states.svg'"
        [imageAlt]="'Accordion example showing color states for expanded, disabled, collapsed.'"
        [imageStyle]="'max-width: 100%'"
      ></app-the
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/color/color-interaction/color-interaction.demo.html_

### color-object-border

```html
<h3 data-toc-item cds-text="section" id="color-system-objects-borders" class="clr-mt-32px">Objects and Borders</h3>
<div class="clr-row clr-mt-24px">
  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Application Background</h4>
    @for (item of colorObjectBorder.applicationBackground; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
    <h4 cds-text="body medium" class="clr-mt-16px">Object Borders</h4>
    @for (item of colorObjectBorder.objectBorders; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>

  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Hover / Active / Selected</h4>
    @for (item of colorObjectBorder.states; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>

  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Containers</h4>
    @for (item of colorObjectBorder.containers; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>

  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Shadows</h4>
    @for (item of colorObjectBorder.shadows; track item) {
    <app-color-example-item [text]="
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/color/color-object-border/color-object-border.demo.html_

### color-palette

```html
<h3 data-toc-item cds-text="section" id="color-system-global-palette" class="clr-mt-32px">Global Palette</h3>
<h4 cds-text="subsection" class="clr-mt-32px">Basic Colors</h4>
<p cds-text="body" class="clr-mt-16px">
  The complete palette has 13 saturated colors, 5 muted colors, a set of cool grays for construction of containers and
  type, and black and white. Each is described by its hue and a common name, which is then extended through a set of
  values for each. This set of colors is defined by Clarity at the system level. This means that when you refer to them
  in your application, you can assume consistency and trouble-free updates.
</p>
<div class="clr-palette-row clr-mt-24px">
  @for (color of paletteRow1Colors; track color) {
  <div class="color-palette-col">
    <h5 cds-text="body medium" class="clr-mt-16px capitalize">{{ color }}</h5>
    @for (colorCode of colorCodes; track colorCode) {
    <clr-color-palette-example-item [color]="color" [colorCode]="colorCode"></clr-color-palette-example-item>
    }
  </div>
  }
</div>

<div class="clr-palette-row clr-mt-32px">
  @for (color of paletteRow2Colors; track color) {
  <div class="color-palette-col">
    <h5 cds-text="body medium" class="clr-mt-16px capitalize">{{ color }}</h5>
    @for (colorCode of colorCodes; track colorCode) {
    <clr-color-palette-example-item [color]="color" [colorCode]="colorCode"></clr-color-pale
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/color/color-palette/color-palette.demo.html_

### color-status

```html
<h3 data-toc-item cds-text="section" id="color-system-status" class="clr-mt-32px">Status</h3>
<p cds-text="body" class="clr-mt-16px">
  Status is a method of visually coding a component to align with its intent or importance. Status colors are often
  referred to as stoplight or traffic light colors.
</p>
<p cds-text="body" class="clr-mt-16px">
  Clarity provides the following status types: Info, Success, Warning, and Danger. These are colors selected from the
  Blue, Green, Ochre, and Red sets in the Clarity globals.
</p>
<p cds-text="body" class="clr-mt-16px">
  Status colors selected from the global palette can be mapped to specific functions and meanings, which allows their
  usage consistently throughout your application.
</p>
<p cds-text="body" class="clr-mt-16px">
  Each status color normally has three values. This provides a consistent primary color and accounts for color shifts
  needed for dynamic states, and visual accents when a component needs more than a single shade. Warning and Danger have
  a 4th shade called dark to account for additional needs for these statuses
</p>
<p cds-text="body" class="clr-mt-16px">Status also includes a neutral state as well as disabled and an alt.</p>
<div class="clr-row clr-mt-24px">
  <div class="clr-col-3">
    <h4 cds-text="body medium">Info</h4>
    @for (item of colorStatus.info; track item) {
    <app-color-example-item [text]
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/color/color-status/color-status.demo.html_

### color-type

```html
<h3 data-toc-item cds-text="section" id="color-system-type" class="clr-mt-32px">Type</h3>
<p cds-text="body" class="clr-mt-16px">
  Headings are slightly lighter to balance their size and weight, copy is darker. Labels use full black for prominence.
  Secondary and tertiary colors are for type that is less important, such as helper and hint text. All type classes have
  default colors based on this guidance, but these may be overridden to suit the needs of your application.
</p>
<div class="clr-row">
  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Basic Type</h4>
    @for (item of colorType.basicType; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Outline Button Text</h4>
    @for (item of colorType.outlineButtonText; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
  <div class="clr-col-3">
    <h4 cds-text="body medium" class="clr-mt-16px">Links</h4>
    @for (item of colorType.links; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
</div>
<div class="clr-row clr-mt-24px">
  <div class="clr-col-8">
    <app-themed-image
      [lightSrc]="'/assets/image
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/color/color-type/color-type.demo.html_

### color-utility

```html
<h3 data-toc-item cds-text="section" id="color-system-utility" class="clr-mt-32px">Utility Colors</h3>
<div class="clr-row">
  @for (colorVariants of colorUtility; track colorVariants) {
  <div class="clr-col-3 clr-mt-24px">
    @for (item of colorVariants; track item) {
    <app-color-example-item [text]="item.text" [token]="item.color"></app-color-example-item>
    }
  </div>
  }
</div>
```

_source: projects/website/src/app/documentation/demos/color/color-utility/color-utility.demo.html_

## More

- All documented examples: `color-interaction`, `color-object-border`, `color-palette`, `color-status`, `color-type`, `color-utility`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "color", features: [...] }`
