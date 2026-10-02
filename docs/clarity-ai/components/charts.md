# charts — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/charts`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrChartsModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: _(none observed)_
- Directives / inputs: _(none observed)_
- CSS classes: _(none observed)_

## Examples

### accessibility

```html
<p class="component-summary">
  Ensuring that your data visualizations are accessible is crucial for inclusivity. Here you can find some guidelines
  and best practices.
</p>

<h2 id="patterns-and-textures" cds-text="title" cds-layout="m-t:xxl">Use Patterns and Textures</h2>

<p cds-text="body" cds-layout="m-t:md">
  Color blindness affects a significant portion of the population, making it difficult for these individuals to
  distinguish between certain colors. By incorporating patterns and textures, you can ensure that your visualizations
  are accessible to everyone, regardless of their ability to perceive color.
</p>

<h3 cds-text="section" cds-layout="m-t:lg">Application</h3>

<p cds-text="body" cds-layout="m-t:md">
  Apply patterns or textures to different data points in charts to differentiate between categories, series, or data
  sets.
</p>

<h3 cds-text="section" cds-layout="m-t:lg">Dual Encoding</h3>

<p cds-text="body" cds-layout="m-t:md">
  Use both color and pattern to encode information. This ensures that even if color perception is impaired, the patterns
  can still convey the necessary distinctions.
</p>

<h3 cds-text="section" cds-layout="m-t:lg">Examples</h3>

<div cds-layout="m-t:sm grid cols@sm:6 gap:lg">
  @for (example of patternsTexturesExamples; track example) {
  <app-do-dont [type]="example.type" [heading]="example.heading" [headingLevel]="4" [caption]
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/charts/accessibility/charts-accessibility.html_

### colors

```html
<h2 id="usage-of-colors" cds-text="title" cds-layout="m-t:xxl">Usage of Colors</h2>

<p cds-text="body" cds-layout="m-t:md">
  These color palettes are available in the Clarity Components v17 library as tokens. Ensure your project uses the
  latest Clarity version to access these palettes. To future-proof and ensure automatic updates, leverage the
  <code cds-text="code">--cds-alias-viz-</code> alias tokens.
</p>

<app-charts-colors-categorical></app-charts-colors-categorical>

<app-charts-colors-sequential></app-charts-colors-sequential>

<app-charts-colors-diverging></app-charts-colors-diverging>

<app-charts-colors-severity></app-charts-colors-severity>
```

_source: projects/website/src/app/documentation/demos/charts/colors/charts-colors.html_

### overview

```html
<app-themed-image
  class="component-banner-image"
  [lightSrc]="'/assets/images/documentation/charts/light-theme/charts-overview-banner.svg'"
  [darkSrc]="'/assets/images/documentation/charts/dark-theme/charts-overview-banner.svg'"
  [imageAlt]="''"
  [imageStyle]="'max-width: 100%'"
>
</app-themed-image>

<h2 id="data-visualization" cds-text="title" cds-layout="m-t:xxl">Data Visualization</h2>

<p cds-text="body" cds-layout="m-t:md">
  Data visualization, often called charts, is the presentation of data in a graphical format. It helps communicate
  complex ideas in a clear and understandable way.
</p>

<p cds-text="body" cds-layout="m-t:md">We visualize data to:</p>
<ul cds-text="body" cds-layout="m-t:md m-l:xs">
  <li><strong cds-text="medium">Explain</strong>: answer a question in a visual format</li>
  <li><strong cds-text="medium">Explore</strong>: find patterns, trends and insights in data</li>
  <li><strong cds-text="medium">Monitor</strong>: check performance and focus on leading indicators</li>
</ul>

<h2 id="chart-anatomy" cds-text="title" cds-layout="m-t:xxl">Chart Anatomy</h2>

<p cds-text="body" cds-layout="m-t:md">
  Understanding the components of a chart is crucial for creating effective data visualizations. Here are the key
  elements to consider:
</p>

<h3 id="chart-anatomy-title" cds-text="section" cds-layout="m-t:lg" data-toc-item>Title</h3>

<div cds-layou
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/charts/overview/charts-overview.html_

## More

- All documented examples: `accessibility`, `colors`, `overview`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "charts", features: [...] }`
