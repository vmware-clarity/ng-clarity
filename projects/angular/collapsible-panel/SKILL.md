---
name: clr-collapsible-panel
description: Base classes for building custom Clarity collapsible components from `@clr/angular/collapsible-panel` — the abstract `CollapsiblePanel`, `CollapsiblePanelService`, `CollapsiblePanelModel` / `CollapsiblePanelGroupModel` and the expand/collapse animations. Use when writing a custom expand/collapse panel group that `clr-accordion` or `clr-stepper` can't express.
---

# Clarity collapsible panel (base classes)

A lower-level building block: `ClrAccordionPanel` and `ClrStepperPanel` both extend `CollapsiblePanel`. It ships no component of its own — you write the panel template.

## When to use

- Sections that expand and collapse: use `clr-accordion` (skill `clr-accordion`).
- A step-by-step form flow: use `clr-stepper` (skill `clr-stepper`).
- Extend `CollapsiblePanel` only for a custom collapsible component neither can express. Reuse it rather than hand-rolling open state, ids and animations.

## Setup

```ts
import {
  CollapsiblePanel,
  CollapsiblePanelModel,
  CollapsiblePanelService,
  collapsiblePanelExpandAnimation,
} from '@clr/angular/collapsible-panel';
import { ClrIcon } from '@clr/angular/icon';
import { IfExpandService } from '@clr/angular/utils';
```

- The group component provides `CollapsiblePanelService` (one per group) and reports panel order with `updatePanelOrder(ids)`.
- Each panel component provides its own `IfExpandService`; the base constructor injects `CollapsiblePanelService`, `IfExpandService` and `ChangeDetectorRef`.
- `ClrIcon` is standalone. Everything is also re-exported from `@clr/angular`.

## The pattern

A subclass must implement `disabled` (getter), `getPanelStateClasses(panel)`, `getContentId(id)` and `getHeaderId(id)`, and redeclare `panelOpen` / `panelOpenChange` as `@Input()` / `@Output()` (the base declares them without decorators). Forward changes with `handlePanelInputChanges(changes)` in `ngOnChanges`. Template state comes from the `panel` observable (`CollapsiblePanelModel`: `open`, `disabled`, `templateId`, `index`).

```ts
import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
// plus the Clarity imports from Setup

@Component({
  selector: 'app-panel',
  imports: [AsyncPipe, NgClass, ClrIcon],
  template: `
    @if (panel | async; as panel) {
      <div [ngClass]="getPanelStateClasses(panel)">
        <div class="app-collapsible-header">
          <button
            type="button"
            class="app-collapsible-header-button"
            (click)="togglePanel()"
            [id]="getHeaderId(panel.templateId)"
            [disabled]="panel.disabled"
            [attr.aria-controls]="!panel.disabled && panel.open ? getContentId(panel.templateId) : null"
            [attr.aria-expanded]="panel.open"
          >
            <span class="app-collapsible-status">
              <clr-icon shape="angle" direction="right" class="app-collapsible-angle"></clr-icon>
            </span>
            <span class="app-collapsible-title"><ng-content select="[panelTitle]"></ng-content></span>
          </button>
        </div>
        <div
          @skipInitialRender
          role="region"
          class="app-collapsible-content-region"
          [id]="getContentId(panel.templateId)"
          [attr.aria-hidden]="!panel.open"
          [attr.aria-labelledby]="getHeaderId(panel.templateId)"
        >
          @if (panel.open) {
            <div @toggle (@toggle.done)="collapsePanelOnAnimationDone(panel)" class="app-collapsible-content">
              <div class="app-collapsible-inner-content"><ng-content></ng-content></div>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: collapsiblePanelExpandAnimation,
  providers: [IfExpandService],
  host: { '[class.app-collapsible-panel]': 'true' },
})
export class AppPanel extends CollapsiblePanel implements OnChanges {
  @Input() panelDisabled = false;
  @Input() override panelOpen = false;
  @Output() override panelOpenChange = new EventEmitter<boolean>();

  get disabled() {
    return this.panelDisabled;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handlePanelInputChanges(changes);
    if (this.panel && changes.panelDisabled) {
      this.panelService.disablePanel(this.id, changes.panelDisabled.currentValue);
    }
  }

  getPanelStateClasses(panel: CollapsiblePanelModel) {
    return panel.open ? 'app-collapsible-panel-open' : 'app-collapsible-panel-closed';
  }
  getContentId(id: string) {
    return `app-panel-content-${id}`;
  }
  getHeaderId(id: string) {
    return `app-panel-header-${id}`;
  }
}

@Component({
  selector: 'app-panel-group',
  template: `<ng-content></ng-content>`,
  providers: [CollapsiblePanelService],
})
export class AppPanelGroup implements AfterContentInit, OnDestroy {
  @ContentChildren(AppPanel) panels: QueryList<AppPanel>;
  private sub: Subscription;

  constructor(private panelService: CollapsiblePanelService) {}

  ngAfterContentInit() {
    this.sub = this.panels.changes
      .pipe(startWith(this.panels))
      .subscribe((panels: QueryList<AppPanel>) => this.panelService.updatePanelOrder(panels.map(p => p.id)));
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
```

```html
<app-panel-group>
  @for (item of items; track item.id) {
  <app-panel [(panelOpen)]="item.open">
    <span panelTitle>{{ item.title }}</span>
    {{ item.body }}
  </app-panel>
  }
</app-panel-group>
```

## Rules

- The base `CollapsiblePanelGroupModel` lets panels open independently (multi-open). For single-open, subclass it (override `togglePanel`) and a `CollapsiblePanelService` whose `panelGroup` is your model, provided as `{ provide: CollapsiblePanelService, useExisting: MyService }` — the accordion's `AccordionModel` / `AccordionService` do exactly this.
- Animations: `collapsiblePanelExpandAnimation` animates expand only; `collapsiblePanelAnimation` animates both directions (used by the stepper). Both register triggers `skipInitialRender` and `toggle`; build custom triggers from `panelExpandTransition`, `panelCollapseTransition` and `skipInitialRenderTrigger`.
- Always call `collapsePanelOnAnimationDone(panel)` on `@toggle.done`, so `*clrIfExpanded` content is torn down after collapse.
- Keep `CollapsiblePanelService` on the group, never on the panel — each panel would become its own group.
- A11y: the header is a real `<button type="button">` with `aria-expanded` and `aria-controls` (only while open and enabled); the content is `role="region"` with `aria-labelledby` the header id. Tab / Enter / Space come from the native button. Wrap the header in `role="heading"` + `aria-level` when it acts as a section heading (as `ClrAccordionPanel` does). No interactive elements inside the header button.
- Header/content ids must be unique: derive them from `panel.templateId`.
- Styling: the `{prefix}-*` classes in `STYLES.md` come from the SCSS mixin `collapsible-panel($prefix)` in `_mixins.collapsible-panel.scss`, shipped in `@clr/ui` as `@clr/ui/collapsible-panel/_mixins.collapsible-panel.scss` (the accordion passes `clr-accordion`). Include it with your own prefix (here `app-collapsible`) and theme it through the `--clr-collapsible-panel-*` custom properties listed in `STYLES.md`.

## References

- API: `projects/angular/collapsible-panel/collapsible-panel.api.md`
- Styles: `projects/angular/collapsible-panel/STYLES.md`
- Example: `.storybook/stories/collapsible-panel/collapsible-panel.storybook.component.ts`
- Reference implementations: `projects/angular/accordion/` (`accordion-panel.ts`, `providers/accordion.service.ts`) and `projects/angular/stepper/` (`stepper-panel.ts`)
