---
name: appfx-card-container
description: Lay out a dashboard of user-reorderable, show/hide-able cards with the AppFX card container (`<appfx-card-container>` from `@clr/addons/card-container`), driven by an `AppfxCard[]` config with grid unit sizing, drag-and-drop, zoom sizes, and persisted order. Use when adding or changing an `appfx-card-container`, `AppfxCard`, or `AppfxContainerPersistenceStore`.
metadata:
  docs: /documentation/card-container
---

# AppFX card container (`appfx-card-container`)

## When to use it vs Clarity `.card`

Plain Clarity `.card` markup in a layout is the default for showing cards. Use `appfx-card-container` when users must reorder cards (mouse or keyboard drag-and-drop), toggle card visibility from a settings menu, persist that layout, or get unit-based sizing that reflows at 200%/400% zoom. Leave existing Clarity card layouts alone unless asked to switch.

## Setup

```ts
import { AppfxCard, AppfxCardContainerModule } from '@clr/addons/card-container';

@Component({
  imports: [AppfxCardContainerModule],
  // ...
})
```

Components are NgModule-declared (not standalone).

## Usage

Each card is your own component, rendered dynamically; its template uses Clarity card structure.

```ts
@Component({
  selector: 'app-summary-card',
  template: `
    <div class="card">
      <div class="card-header">Summary</div>
      <div class="card-block">...</div>
      <div class="card-footer">
        <button type="button" class="btn btn-sm btn-link">View all</button>
      </div>
    </div>
  `,
})
export class SummaryCardComponent {
  @Input() vm?: Vm; // set from AppfxCard.context
}

cards: AppfxCard[] = [
  { id: 'summary', title: 'Summary', unitWidth: 2, unitHeight: 4, componentClass: SummaryCardComponent, context: { vm: this.vm } },
  { id: 'notes', title: 'Notes', componentClass: NotesCardComponent, canHide: false },
];
```

```html
<appfx-card-container [cards]="cards" [containerId]="'vm-summary'" [persistenceStore]="store"></appfx-card-container>
```

- `unitWidth` (default 1 = 258px) and `unitHeight` (default 5 = 58px units, 18px gutters); `-1` removes the fixed size. `cardZoomSizes` overrides sizes at zoom2x/zoom4x.
- `context` entries are set as inputs on the card component instance.
- `showCardContainerSettings` (default `true`) shows the show/hide menu; `dragDropEnabled` (default `true`) enables reordering.

## Persistence

```ts
store: AppfxContainerPersistenceStore = {
  retrieve: () => this.http.get<AppfxCardSettings[]>('/api/layout/vm-summary'),
  save: settings => this.http.put('/api/layout/vm-summary', settings).subscribe(),
};
```

`AppfxCardSettings` is `{ id, order, hidden }`.

## Rules

- Give every card a unique, stable `id` and each container a unique `containerId` — drag-and-drop is scoped to the container and saved settings are matched by card id.
- Add/remove cards by assigning a new array (`this.cards = [...this.cards, card]`); changes are diffed by item.
- Card components must render `.card` / `.card-block` (and optional `.card-header` / `.card-footer`) — sizing is applied to those classes.
- `title` is shown in the settings menu; pass translated text.

## References

- API: `projects/addons/card-container/card-container.api.md`
- Demos: `projects/website/src/app/documentation/demos/card-container/`, `.storybook/stories/addons/`
