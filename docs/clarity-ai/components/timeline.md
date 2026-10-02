# timeline — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/timeline`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrTimelineModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-icon`, `clr-spinner`, `clr-tab`, `clr-tab-content`, `clr-tabs`, `clr-timeline`, `clr-timeline-component`, `clr-timeline-step`, `clr-timeline-step-description`, `clr-timeline-step-header`, `clr-timeline-step-title`
- Directives / inputs: `clrAlertClosable`, `clrAlertType`, `clrIfActive`, `clrLayout`, `clrMedium`, `clrState`, `clrTabLink`
- CSS classes: `alert-text`, `btn`, `btn-link`, `btn-sm`, `clr-align-middle`, `clr-timeline`, `clr-timeline-step`, `clr-timeline-step-body`, `clr-timeline-step-description`, `clr-timeline-step-header`, `clr-timeline-step-title`, `clr-timeline-vertical`, `spinner`, `spinner-inline`, `spinner-mr-0`, `spinner-sm`

## Examples

### timeline-component

```html
<h4 cds-text="subsection" class="clr-mt-32px">Timeline component <code cds-text="code">&lt;clr-timeline&gt;</code></h4>

<p cds-text="body" class="clr-mt-16px">
  The orientation is controlled by the <code cds-text="code">[clrLayout]</code> input. This input receives a
  <code cds-text="code">ClrTimelineLayout</code> enum value, which can be <code cds-text="code">HORIZONTAL</code> or
  <code cds-text="code">VERTICAL</code>.
</p>

<table class="table">
  <thead>
    <tr>
      <th class="left">Input/Output</th>
      <th class="left hidden-xs-down">Values</th>
      <th class="left hidden-xs-down">Default</th>
      <th class="left">Effect</th>
    </tr>
  </thead>
  <tbody>
    @for (prop of props; track prop) {
    <tr>
      <td class="left">
        <b cds-text="medium">{{ prop.name }}</b>
      </td>
      <td class="left hidden-xs-down">{{ prop.values }}</td>
      <td class="left hidden-xs-down">{{ prop.defaultValue }}</td>
      <td class="left">{{ prop.description }}</td>
    </tr>
    }
  </tbody>
</table>

<h4 cds-text="subsection" class="clr-mt-32px">
  TimelineStep component <code cds-text="code">&lt;clr-timeline-step&gt;</code>
</h4>

<p cds-text="body" class="clr-mt-16px">
  The icon shown in the step is controlled by the <code cds-text="code">[clrState]</code> input. This input receives a
  <code cds-text="code">ClrTimelineStepState</code> enum value, which can b
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/timeline/timeline-component.html_

### timeline-full-demo.component

```html
<div style="margin-top: 1rem">
  <clr-tabs>
    <clr-tab>
      <button clrTabLink>Clarity UI (Static Horizontal)</button>
      <clr-tab-content *clrIfActive>
        <h4 cds-text="subsection" class="clr-mt-32px">Horizontal Timeline</h4>
        <ul class="clr-timeline">
          <li class="clr-timeline-step disabled">
            <div class="clr-timeline-step-header">11:59 am</div>
            <clr-icon role="img" shape="circle" aria-label="Not started"></clr-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Add KMS</span>
              <span class="clr-timeline-step-description">Root CA certificate requested.</span>
            </div>
          </li>
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header">11:59 am</div>
            <clr-icon role="img" shape="dot-circle" aria-label="Current"></clr-icon>
            <div class="clr-timeline-step-body">
              <span class="clr-timeline-step-title">Add KMS</span>
              <span class="clr-timeline-step-description">
                Root CA certificate requested. Upload it to the KMS to complete the connection.
                <button class="btn btn-sm">Upload Certificate</button>
              </span>
            </div>
          </li>
          <li class="clr-timeline-step">
            <div class="clr-timeline-step-header"
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/timeline/timeline-full-demo.component.html_

## More

- All documented examples: `timeline-component`, `timeline-full-demo.component`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "timeline", features: [...] }`
