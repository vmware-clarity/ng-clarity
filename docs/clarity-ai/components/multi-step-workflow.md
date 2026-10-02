# multi-step-workflow — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/multi-step-workflow`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrMultiStepWorkflowModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: _(none observed)_
- Directives / inputs: _(none observed)_
- CSS classes: _(none observed)_

## Examples

### component-table

```html
<table class="table" cds-text="body">
  <thead>
    <tr>
      <th class="left"></th>
      <th class="left">Use When..</th>
      <th class="left">Don’t use when..</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Wizard</td>
      <td class="left">
        <ul class="list">
          <li>Self-sufficient workflows (no need to access other parts of the app)</li>
          <li>The user needs to be taken back to the original context after the wizard</li>
          <li>3-10 steps</li>
        </ul>
      </td>
      <td class="left">
        <ul class="list">
          <li>Very long step content that requires scrolling</li>
          <li>Certain steps require additional horizontal panel</li>
          <li>Additional popup cannot be avoided</li>
          <li>The user needs to leave half way and resume</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td class="left">Stepper</td>
      <td class="left">
        <ul class="list">
          <li>Requires the full content area to show information</li>
          <li>Needs a preview or summary of each steps</li>
          <li>2+ steps</li>
        </ul>
      </td>
      <td class="left">
        <ul class="list">
          <li>When certain steps are so long that they bury the steps below</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td class="left">Timeline</td>
      <td class="left">
        <ul cla
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/multi-step-workflow/component-table.html_

## More

- All documented examples: `component-table`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "multi-step-workflow", features: [...] }`
