---
name: clr-popover
description: Clarity popover toolkit (`ClrPopoverModuleNext`, `clrPopoverOrigin`, `*clrPopoverContent`, `clrPopoverOpenCloseButton`, `clrPopoverCloseButton`, `ClrPopoverService`) from `@clr/angular` for building custom anchored overlays on the Angular CDK. Use when building a custom popover panel, a point-anchored context overlay via `openAtPoint()`, or an overlay that dropdown, signpost or tooltip cannot express.
metadata:
  docs: /documentation/popover
---

# Clarity popover toolkit

## When to use

- Action menu: use `clr-dropdown` (clr-dropdown skill). Rich help next to a field: `clr-signpost` (clr-signpost skill). Short hover hint: `clr-tooltip` (clr-tooltip skill).
- Use the toolkit only for a custom overlay those components can't express (e.g. a filter panel, a details card anchored to a button or a cursor point).
- It handles positioning, layering, outside click, Escape and focus return — don't hand-roll overlays with CDK `Overlay` or absolute positioning.

## Setup

```ts
import { A11yModule } from '@angular/cdk/a11y'; // for cdkTrapFocus
import { ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

@Component({
  selector: 'app-host-details',
  providers: [ClrPopoverService], // one instance per popover
  imports: [ClrPopoverModuleNext, A11yModule],
  templateUrl: './host-details.component.html',
})
export class HostDetailsComponent {
  open = false;
}
```

`ClrPopoverModuleNext` (NgModule) exports `clrPopoverOrigin`, `clrPopoverContent`, `clrPopoverOpenCloseButton`, `clrPopoverCloseButton` and `*clrIfOpen`. `ClrPopoverModule` only re-exports the dropdown, signpost and tooltip modules — it is the wrong import for a custom popover.

## Basic popover

```html
<button
  type="button"
  class="btn btn-outline"
  clrPopoverOrigin
  clrPopoverOpenCloseButton
  aria-haspopup="dialog"
  [attr.aria-expanded]="open"
  aria-controls="host-details"
  (clrPopoverOpenCloseChange)="open = $event"
>
  Host details
</button>
<div
  id="host-details"
  class="popover-panel"
  role="dialog"
  aria-labelledby="host-details-title"
  cdkTrapFocus
  *clrPopoverContent="open; at: 'bottom-left'; outsideClickToClose: true; scrollToClose: false"
>
  <h4 id="host-details-title">Server details</h4>
  <p>Status: Running</p>
  <button type="button" class="btn btn-sm btn-icon btn-link" clrPopoverCloseButton aria-label="Close">
    <clr-icon shape="times"></clr-icon>
  </button>
</div>
```

- `[clrPopoverOrigin]`: the anchor element; also where focus returns on close.
- `[clrPopoverOpenCloseButton]`: toggles the popover; emits `(clrPopoverOpenCloseChange)` with the new state.
- `[clrPopoverCloseButton]`: closes from inside the content and refocuses the origin; emits `(clrPopoverOnCloseChange)`.
- `*clrPopoverContent` is structural and renders into a CDK overlay on `body`. Microsyntax keys map to inputs:
  - `clrPopoverContent` (open state, boolean)
  - `at` → `clrPopoverContentAt`: a `ClrPopoverPosition` value such as `'bottom-left'`, `'top-middle'`, `'right-top'`, or a CDK `ConnectedPosition`
  - `availablePositions` → `clrPopoverContentAvailablePositions`: `ConnectedPosition[]` fallbacks tried in order
  - `type` → `clrPopoverContentType`: `ClrPopoverType` (`DEFAULT`, `DROPDOWN`, `SIGNPOST`, `TOOLTIP`), controls offsets
  - `outsideClickToClose` → `clrPopoverContentOutsideClickToClose` (default `true`)
  - `scrollToClose` → `clrPopoverContentScrollToClose` (default `false`)
- `*clrIfOpen` renders an element only while the popover provided above it is open; use `[(clrIfOpen)]` to bind the state.

## Reading and setting state

```ts
private popoverService = inject(ClrPopoverService);

ngOnInit() {
  this.popoverService.openChange.subscribe(isOpen => (this.open = isOpen));
}

close() {
  this.popoverService.open = false;
}
```

`popoverService.originElement` is the anchor `ElementRef` (or `null` when point-based); `popoverService.originPoint` is the `ClrPopoverPoint` (or `null` when element-based).

## Context popover at a point

```ts
onContextMenu(event: MouseEvent) {
  event.preventDefault();
  this.popoverService.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
}
```

```html
<div class="context-area" (contextmenu)="onContextMenu($event)">Right-click a host</div>
<div role="dialog" aria-label="Host actions" cdkTrapFocus *clrPopoverContent="open; at: 'bottom-left'">
  @for (action of actions; track action.id) {
  <button type="button" class="btn btn-sm btn-link" clrPopoverCloseButton (click)="action.run()">
    {{ action.label }}
  </button>
  }
</div>
```

For a plain action list at a point, prefer `ClrDropdown.openAtPoint()` (clr-dropdown skill), which adds menu keyboard navigation.

## Rules

- Provide `ClrPopoverService` in the `providers` of the component that hosts each popover; sharing one instance makes popovers open together.
- Put `clrPopoverOrigin` and `clrPopoverOpenCloseButton` on a real `<button type="button">`; icon-only origins and close buttons need an `aria-label`.
- Add the ARIA yourself — the toolkit sets none: a `role` on the content (`dialog`, or `menu` with `menuitem` children), `aria-labelledby`/`aria-label` on it, and `aria-expanded`, `aria-controls`, `aria-haspopup` on the origin.
- Interactive content: add `cdkTrapFocus` and a `clrPopoverCloseButton`. Escape and outside click close it and refocus the origin; point-based popovers have no origin to refocus.
- Use `ClrPopoverPosition` values for `at`; reach for raw `ConnectedPosition` only for `availablePositions` fallbacks.
- Icons are `<clr-icon>` (`ClrIcon` is standalone); register shapes with `ClarityIcons.addIcons(...)`.

## References

- API: `projects/angular/popover/popover.api.md`
- Toolkit internals: `projects/angular/popover/common/README.md`
- Docs demos: `projects/website/src/app/documentation/demos/popover/`
