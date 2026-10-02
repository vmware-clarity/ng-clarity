# button — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/buttons`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrButtonModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-icon`
- Directives / inputs: `clrLoading`
- CSS classes: `badge`, `badge-danger`, `badge-info`, `btn`, `btn-block`, `btn-danger`, `btn-danger-outline`, `btn-icon`, `btn-info`, `btn-info-outline`, `btn-inverse`, `btn-link`, `btn-outline`, `btn-primary`, `btn-primary-outline`, `btn-sm`, `btn-success`, `btn-success-outline`, `btn-warning`, `btn-warning-outline`

## Examples

### button-loading

```html
<div class="clr-example">
  <p cds-text="body" class="clr-mt-16px">
    Use the <code cds-text="code">clrLoading</code> directive to change the state of the spinner button. The directive
    can be set to one of the following values:
  </p>
  <ul class="list list-spacer">
    <li><code cds-text="code">ClrLoadingState.DEFAULT</code>: the default state of the button.</li>
    <li><code cds-text="code">ClrLoadingState.LOADING</code>: replaces the button text with a spinner.</li>
    <li>
      <code cds-text="code">ClrLoadingState.SUCCESS</code>: briefly shows a check mark, and automatically transition
      back to the <code cds-text="code">ClrLoadingState.DEFAULT</code> state.
    </li>
  </ul>
  <br />
  <button [clrLoading]="validateBtnState" class="btn btn-info-outline" (click)="validateDemo()">Validate</button>
  <button [clrLoading]="submitBtnState" type="submit" class="btn btn-success-outline" (click)="submitDemo()">
    Submit
  </button>

  
</div>
```

_source: projects/website/src/app/documentation/demos/buttons/button-loading.html_

### button-sizes

```html
<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Normal</h4>
<button class="btn">Regular</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>
<button class="btn" disabled>Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Small</h4>
<button class="btn btn-sm">Regular</button>
<button class="btn btn-primary btn-sm">Primary</button>
<button class="btn btn-success btn-sm">Success</button>
<button class="btn btn-info btn-sm">Info</button>
<button class="btn btn-warning btn-sm">Warning</button>
<button class="btn btn-danger btn-sm">Danger</button>
<button class="btn btn-sm" disabled>Disabled</button>
<button class="btn btn-sm btn-link">Regular</button>
<button class="btn btn-sm btn-link" disabled>Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Normal Flat Buttons</h4>
<button class="btn btn-link">Flat Regular</button>
<button class="btn btn-link" disabled>Flat Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Small Flat Buttons</h4>
<button class="btn btn-link btn-sm">Flat Regular</button>
<button class="btn btn-link btn-sm" disabled>Flat Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px cl
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/buttons/button-sizes.html_

### button-states

```html
<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Info, Success and Danger Outline Buttons</h4>
<button class="btn btn-info-outline">Info</button>
<button class="btn btn-success-outline">Success</button>
<button class="btn btn-danger-outline">Danger</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Success and Danger Solid Buttons</h4>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
```

_source: projects/website/src/app/documentation/demos/buttons/button-states.html_

### icon-buttons

```html
<div class="clr-mt-16px">
  <button type="button" class="btn btn-icon" aria-label="home">
    <clr-icon shape="home"></clr-icon>
  </button>
  <button type="button" class="btn btn-icon btn-primary" aria-label="settings">
    <clr-icon shape="cog"></clr-icon>
  </button>
  <button type="button" class="btn btn-icon btn-warning" aria-label="warning">
    <clr-icon shape="warning-standard"></clr-icon>
  </button>
  <button type="button" class="btn btn-icon btn-danger" aria-label="error">
    <clr-icon shape="error-standard"></clr-icon>
  </button>
  <button type="button" class="btn btn-icon btn-success" aria-label="done">
    <clr-icon shape="check"></clr-icon>
  </button>
  <button type="button" class="btn btn-icon" disabled aria-label="home">
    <clr-icon shape="home"></clr-icon>
  </button>
</div>
```

_source: projects/website/src/app/documentation/demos/buttons/icon-buttons.html_

### inverse-button

```html
<h4 cds-text="subsection" class="clr-mt-24px">Inverse Button</h4>
<div class="btn-example clr-mt-16px">
  <button type="submit" class="btn btn-inverse">Inverse</button>
  <button type="submit" class="btn btn-inverse" disabled>Disabled Inverse</button>
</div>
```

_source: projects/website/src/app/documentation/demos/buttons/inverse-button.html_

### real-button

```html
<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Solid Buttons</h4>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-danger" disabled>Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Outline Buttons</h4>
<button class="btn btn-outline">Regular</button>
<button class="btn btn-success-outline">Success-Outline</button>
<button class="btn btn-info-outline">Info</button>
<button class="btn btn-warning-outline">Warning</button>
<button class="btn btn-danger-outline">Danger</button>
<button class="btn btn-outline" disabled>Disabled</button>

<h4 cds-text="subsection" class="clr-mt-24px clr-mb-16px">Flat Buttons</h4>
<button class="btn btn-link">Regular</button>
<button class="btn btn-link" disabled>Disabled</button>
<button class="btn btn-sm btn-link">Regular</button>
<button class="btn btn-sm btn-link" disabled>Disabled</button>
```

_source: projects/website/src/app/documentation/demos/buttons/real-button.html_

## More

- All documented examples: `button-loading`, `button-sizes`, `button-states`, `icon-buttons`, `inverse-button`, `real-button`
- Full public API report: `projects/angular/button/button.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "button", features: [...] }`
