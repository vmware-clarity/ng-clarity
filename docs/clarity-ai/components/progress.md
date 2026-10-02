# progress — @clr/angular usage

> Generated from the live demos by `npm run generate:references`. Do not edit by hand.
> Source of truth: `projects/website/src/app/documentation/demos/progress-bars`

## Import

- Modules used in the demos: `ClarityModule`
- Granular module for a lean bundle: `ClrProgressModule` (confirm in the API report below)
- Consumer app code may be standalone + OnPush + Signals; Clarity APIs stay decorator-based; icons use `cds-icon`.

## API observed in the demos

- Elements: `clr-alert`, `clr-alert-item`, `clr-icon`, `clr-progress-bar`, `clr-vertical-nav`
- Directives / inputs: `clrAlertClosable`, `clrAlertSizeSmall`, `clrAlertType`, `clrColor`, `clrDisplayval`, `clrLabeled`, `clrLoop`, `clrMax`, `clrProgressBar`, `clrValue`
- CSS classes: `alert-text`, `btn`, `btn-link`, `btn-outline`, `card`, `card-block`, `card-footer`, `card-link`, `card-text`, `card-title`, `labeled`, `progress`, `progress-block`, `progress-group`, `progress-meter`, `progress-static`

## Examples

### progress-bar-animations

```html
@for (example of examples; track example) {
<div class="progbar-examples">
  <h4 class="clr-mt-32px" cds-text="subsection">{{ example.title }}</h4>
  <div [ngClass]="example.cssClassnames()" class="clr-mt-8px">
    <progress value="{{ example.value }}" max="100" [attr.data-displayval]="example.value + '%'"></progress>
    @if (example.isLabeled) {
    <span>{{ example.value }}%</span>
    }
  </div>
  <p><button class="btn btn-outline" (click)="example.start()">Show</button></p>
</div>
}
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-animations.html_

### progress-bar-cards

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col-12 clr-col-sm-4">
      <div class="card">
        <div class="card-block">
          <div class="progress top">
            <progress value="33" max="100"></progress>
          </div>
          <div class="card-title">Card title</div>
          <p class="card-text">Here is a progress bar at the very top of a card, above the header.</p>
        </div>
        <div class="card-footer">
          <a href="javascript://" class="card-link">Click</a>
        </div>
      </div>
    </div>
    <div class="clr-col-12 clr-col-sm-4">
      <div class="card">
        <div class="card-block">
          <div class="card-title">Card title</div>
          <p class="card-text">Here is a progress bar at the top of a card's footer, above the buttons.</p>
        </div>
        <div class="card-footer">
          <div class="progress">
            <progress value="77" max="100"></progress>
          </div>
          <a href="javascript://" class="card-link">Click</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-cards.html_

### progress-bar-colors

```html
@for (type of colorTypes; track type) {
<div class="progbar-examples">
  <h4 class="clr-mt-32px" cds-text="subsection">{{ type.title }}</h4>
  <div [ngClass]="type.cssClassnames()" class="clr-mt-8px">
    <progress value="{{ type.value }}" max="100" [attr.data-displayval]="type.value + '%'"></progress>
    {{ type.label }}
  </div>
  <div style="min-height: 1rem">
    @if (type.label === 'flash-danger' && type.isFinished()) {
    <span class="danger-text">
      <clr-icon shape="exclamation-circle" size="24"></clr-icon>
      Connection to database timed out.
      <a href="javascript://" class="btn btn-link" (click)="type.start()">Try again</a>
    </span>
    }
  </div>
  <p><button class="btn btn-outline" (click)="type.start()">Show</button></p>
</div>
}
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-colors.html_

### progress-bar-examples

```html
@for (example of examples; track example) {
<div class="progbar-examples">
  <h4 class="clr-mt-32px" cds-text="subsection">{{ example.title }}</h4>
  <div [ngClass]="example.cssClassnames()" class="clr-mt-8px">
    <progress value="{{ example.value }}" max="100" [attr.data-displayval]="example.value + '%'"></progress>
    @if (example.isLabeled) {
    <span>{{ example.value }}%</span>
    }
  </div>
  <p><button class="btn btn-outline" (click)="example.start()">Show</button></p>
</div>
}
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-examples.html_

### progress-bar-inline-cards

```html
<div class="clr-example">
  <div class="clr-row">
    <div class="clr-col-12 clr-col-sm-6">
      <div class="card">
        <div class="card-block">
          <div class="card-title">Card title</div>
          <p class="card-text">Here is a progress bar at the very top of a card.</p>
          <div class="progress-block">
            <label>Label</label>
            <div class="progress-static">
              <div class="progress-meter" [attr.data-value]="value1"></div>
            </div>
          </div>
          <div class="progress-block">
            <label>Longer Label</label>
            <div class="progress-static">
              <div class="progress-meter" [attr.data-value]="value2"></div>
            </div>
          </div>
          <div class="progress-block">
            <label>Really, Really, Really Long Label</label>
            <div class="progress success">
              <progress value="{{ value3 }}" max="100" [attr.data-displayval]="value3 + '%'"></progress>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="progress-static top">
            <div class="progress-meter" data-value="33"></div>
          </div>
          <a href="javascript://" class="card-link">Click</a>
        </div>
      </div>
    </div>
  </div>
</div>
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-inline-cards.html_

### progress-bar-inline

```html
<div class="progbar-examples">
  <h4 class="clr-mt-32px" cds-text="subsection">Inline Progress Bar</h4>
  <div class="progress-block">
    <label>Simple Layout</label>
    <div class="progress">
      <progress value="{{ inlineProgress }}" max="100" [attr.data-displayval]="inlineProgress + '%'"></progress>
    </div>
    <span>More text</span>
  </div>

  <div class="progress-block">
    <label>Complex Layout</label>
    <div class="progress-group">
      <div class="clr-row">
        <div class="clr-col-6">Left</div>
        <div class="clr-col-6 text-right">Right</div>
      </div>
      <div class="progress-static">
        <div
          class="progress-meter"
          [attr.data-value]="inlineStaticProgbarValue"
          [attr.data-displayval]="inlineStaticProgbarValue + '%'"
        ></div>
      </div>
      <div class="clr-row">
        <div class="clr-col-6">Left</div>
        <div class="clr-col-6 text-right">Right</div>
      </div>
    </div>
    <span>More text</span>
  </div>

  <h4 class="clr-mt-32px" cds-text="subsection">Labeled, Static Progress Bar</h4>
  <div class="progress-block">
    <label>Complex Layout</label>
    <div class="progress-group">
      <div class="clr-row">
        <div class="clr-col-6">Left</div>
        <div class="clr-col-6 text-right">Right</div>
      </div>
      <div class="progress-static labeled danger">
        <div
          c
<!-- …truncated… -->
```

_source: projects/website/src/app/documentation/demos/progress-bars/progress-bar-inline.html_

## More

- All documented examples: `progress-bar-animations`, `progress-bar-cards`, `progress-bar-colors`, `progress-bar-examples`, `progress-bar-inline-cards`, `progress-bar-inline`, `progress-bar-loop`, `progress-bar-static-cards`, `progress-bar-static`
- Full public API report: `projects/angular/clarity.api.md`
- Deep / live example: call the MCP tool `scaffold_clarity_component { componentName: "progress", features: [...] }`
