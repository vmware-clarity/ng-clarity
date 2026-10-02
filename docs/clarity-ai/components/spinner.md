# spinner — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/spinners`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrSpinnerModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-spinner`, `clr-spinner-component`, `clr-spinner-sizes`, `clr-spinner-types`
- Directives / inputs: `clrInline`, `clrInverse`, `clrMedium`, `clrSmall`
- CSS classes: `btn`, `btn-primary`, `spinner`, `spinner-box`, `spinner-inline`, `spinner-inverse`, `spinner-lg`, `spinner-md`, `spinner-sm`

## Examples

### spinner-component

```html
<h2 id="angular-component" cds-text="title" class="clr-mt-48px">Angular Spinner Component</h2>
<p cds-text="body" class="clr-mt-16px">
  Clarity provides a component to help with displaying a spinner for loading purposes. This component also helps with
  accessibility needs to announce loading tasks to a screen reader user.
</p>

<h3 data-toc-item id="angular-examples" cds-text="section" class="clr-mt-32px">Examples</h3>

<div class="clr-example squeeze">
  @if (!fetchingUserInformation) {
  <button (click)="toggleSpinner('fetchingUserInformation')" class="btn btn-primary">Fetch user information</button>
  } @if (fetchingUserInformation) {
  <clr-spinner>Loading data</clr-spinner>
  <br />
  <br />
  <button class="btn" (click)="toggleSpinner('fetchingUserInformation')">Cancel fetching user information</button>
  }
</div>

<h3 data-toc-item id="modify" cds-text="section" class="clr-mt-32px">Modifiers</h3>
<p cds-text="body" class="clr-mt-16px">
  Add modifiers like <code cds-text="code">clrInline</code> for Inline Spinners or
  <code cds-text="code">clrInverse</code> for spinners with dark background.
</p>
<p>
  If you need to make change on the size you could add <code cds-text="code">clrSmall</code> or
  <code cds-text="code">clrMedium</code>, the default size is auto set to <code cds-text="code">large</code>.
</p>

<div class="clr-example squeeze">
  @if (!downloadingFile) {
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/spinners/spinner-component.html_

### spinner-sizes

```html
<h4 cds-layout="m-b:md" cds-text="subsection" class="clr-mt-32px">Small</h4>
<app-animated-example [label]="'Small Spinner'">
  <span class="spinner spinner-sm"> Loading... </span>
</app-animated-example>

<h4 cds-layout="m-b:md" cds-text="subsection" class="clr-mt-32px">Medium</h4>
<app-animated-example [label]="'Medium Spinner'">
  <span class="spinner spinner-md"> Loading... </span>
</app-animated-example>

<h4 cds-layout="m-b:md" cds-text="subsection" class="clr-mt-32px">Large (default)</h4>
<app-animated-example [label]="'Large Spinner'">
  <div class="spinner spinner-lg">Loading...</div>
</app-animated-example>
```

_source: projects/website/src/app/documentation/demos/spinners/spinner-sizes.html_

### spinner-types

```html
<p cds-text="body" class="clr-mt-24px">
  Use the <code cds-text="code">.spinner</code> to create a default page spinner.
</p>
<div class="clr-mt-24px">
  <app-animated-example [label]="'Page Spinner'">
    <div class="spinner">Loading...</div>
  </app-animated-example>
  
</div>

<h4 cds-layout="m-b:md" cds-text="subsection" class="clr-mt-32px">Inline Spinners</h4>

<p cds-text="body" class="clr-mt-16px">
  Extend the <code cds-text="code">.spinner-inline</code> class with <code cds-text="code">.spinner</code> to create an
  inline spinner.
</p>
<div class="clr-mt-24px">
  <app-animated-example [label]="'Inline Spinner'">
    <span class="spinner spinner-inline"> Loading... </span>
    <span> Loading... </span>
  </app-animated-example>
  
</div>

<h4 cds-layout="m-b:md" cds-text="subsection" class="clr-mt-32px">Spinners on a dark background</h4>

<p cds-text="body" class="clr-mt-16px">
  Extend the <code cds-text="code">.spinner-inverse</code> class with <code cds-text="code">.spinner</code> to create a
  spinner for dark backgrounds.
</p>
<div class="clr-mt-24px">
  <app-animated-example class="dark" [label]="'Dark Spinner'">
    <span class="spinner spinner-inverse"> Loading... </span>
  </app-animated-example>
  
</div>
```

_source: projects/website/src/app/documentation/demos/spinners/spinner-types.html_

## More

- All documented examples: `spinner-component`, `spinner-sizes`, `spinner-types`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "spinner", features: [...] }`
