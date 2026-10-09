---
name: appfx-a11y
description: Accessibility helpers from `@clr/addons/a11y` — tab overflow for `clr-tabs` (`appfxOverflowTabs`), stepper string overrides (`appfxOverrideClrStrings`), `<appfx-required-field-legend>` for forms, and zoom/reflow detection (`zoomLevelIndicator`, `ZoomLevelService`, `ZoomLevel`). Use when making Clarity tabs, steppers, forms, or layouts work at 200%/400% zoom or adding a required-field legend.
metadata:
  docs: /documentation/a11y
---

# AppFX a11y (`@clr/addons/a11y`)

## When to use

Small add-ons on top of plain Clarity components. Keep using the Clarity component itself and add the AppFX directive only when its behavior is needed.

## Setup

```ts
import { AppfxA11yModule } from '@clr/addons/a11y';

@Component({
  imports: [AppfxA11yModule], // provides ZoomLevelService
  // ...
})
```

Directives are NgModule-declared (not standalone). `A11yModule` is a deprecated alias.

## Tabs overflow

Moves tab links into an overflow menu when the width is too small.

```html
<clr-tabs appfxOverflowTabs>
  @for (tab of tabs; track tab.id) {
  <clr-tab>
    <button clrTabLink>{{ tab.title }}</button>
    <clr-tab-content>...</clr-tab-content>
  </clr-tab>
  }
</clr-tabs>
```

## Stepper string overrides

```html
<clr-stepper-panel formGroupName="name" [appfxOverrideClrStrings]="{ stepComplete: 'Done', stepError: 'Has errors' }">
  ...
</clr-stepper-panel>
```

Takes `Partial<ClrCommonStrings>` scoped to that panel.

## Required field legend

```html
<form clrForm [formGroup]="form">
  <appfx-required-field-legend></appfx-required-field-legend>
  <clr-input-container>
    <label class="clr-required-mark">Name</label>
    <input clrInput formControlName="name" required />
  </clr-input-container>
</form>
```

Text is localized via AppFX translate (sync with `AppfxTranslateService`).

## Zoom / reflow

`zoomLevelIndicator` adds `no-zoom`, `zoom2x` or `zoom4x` class to the host (400% ≈ <576px, 200% ≈ 576–1199px, none ≥1200px).

```html
<div class="vm-layout" zoomLevelIndicator>...</div>
```

```scss
.vm-layout {
  display: flex;
  &.zoom2x,
  &.zoom4x {
    flex-direction: column;
  }
}
```

In code:

```ts
private readonly zoomLevelService = inject(ZoomLevelService);

ngOnInit(): void {
  this.sub = this.zoomLevelService.onChange.subscribe(zoom => (this.stacked = zoom !== ZoomLevel.none));
}
```

`ElementResizeService.getResizeObservable(element)` emits on element resize; `a11ykeys` has `enter`, `arrowLeft`, `arrowRight` key names.

## Rules

- `ZoomLevelService` is provided by `AppfxA11yModule` — import the module (or provide the service) where you inject it.
- Unsubscribe from `onChange` in `ngOnDestroy`.
- Required fields still need `required` / validators and `clr-required-mark` on the label; the legend only explains the asterisk.

## References

- API: `projects/addons/a11y/a11y.api.md`
- Docs: `projects/addons/a11y/README.md`, demos in `projects/website/src/app/documentation/demos/a11y/`
