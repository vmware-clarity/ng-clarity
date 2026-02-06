# ClrPopover Utilities

The `ClrPopover` implementation is a utility infrastructure based on the Angular Overlay and Portals implementation provided in the Angular CDK. It is not a standalone component, but a set of directives and services used to build Clarity overlay components like **Dropdowns**, **Signposts**, and **Tooltips**.

## Goal

The goal is to provide a straightforward utility within the Clarity library that allows for popover-like elements to use a consistent API. It offloads all positioning, z-indexing, and layering logic to the Angular CDK, which is better equipped to handle complex rendering situations.

## Architecture

At its most basic, the popover utility is implemented with a set of directives and a service to track, manage, and subscribe to state change events.

### Service: `ClrPopoverService`

The **`ClrPopoverService`** acts as the central state manager for a specific popover instance. It is **transient** and must be provided at the component level (e.g., inside `ClrDropdown`, `ClrSignpost`, or `ClrTooltip`) to ensure that each popover maintains its own isolated state.

The service is responsible for:

- **State Management**:
  - **`open`**: A boolean property to get or set the current visibility state of the popover. Setting this triggers the `openChange` observable.
  - **`position`**: Tracks the current `ClrPopoverPosition` (e.g., `bottom-left`), triggering the `getPositionChange()` stream when updated.
  - **`popoverType`**: Defines the type of popover (Tooltip, Signpost, etc.) to determine offset calculations.

- **Event Handling**:
  - **`toggleWithEvent(event: any)`**: A helper method used by triggers. It toggles the `open` state, stores the triggering event (to prevent conflicts like "click outside" closing immediately), and prevents default scrolling behavior for arrow keys.
  - **`openEvent`**: Stores the specific browser event that triggered the opening of the popover.

- **Focus & Anchor Management**:
  - **`anchorElementRef`**: Holds the `ElementRef` of the anchor/trigger element. This is used by the CDK to calculate where the overlay should appear.
  - **`closeButtonRef`**: Holds the `ElementRef` of the internal close button (if applicable).
  - **`focusAnchor()`**: A utility method to return focus to the anchor element (e.g., when the menu closes), ensuring accessibility compliance.
  - **`focusCloseButton()`**: Moves focus to the close button inside the content when appropriate.

- **Reactive Streams**:
  - **`openChange`**: Observable that emits whenever the open state changes.
  - **`popoverVisible`**: Observable used to coordinate when the DOM is actually ready/visible.
  - **`getEventChange()`**: Observable stream of the events that triggered state changes.

### Directives

1.  **`[clrPopoverAnchor]`**:

- Used on the element that serves as the reference point for positioning (the anchor).
- Passes an `ElementRef` to the service, which is used for focus management and positioning calculations.

2.  **`*clrPopoverContent`**:

- A structural directive that renders the view and hoists it to an Overlay on the `body` element using a `DomPortal`.
- Accepts configuration arguments for the overlay (open state, position, outside click behavior, scroll behavior).
- Manages "Click Outside" and "Scroll to Close" logic.

3.  **`[clrPopoverCloseButton]`**:

- Should only be used inside popover content containers.
- Calls the toggle method on the service and restores focus to the anchor element.

4.  **`[clrPopoverOpenCloseButton]`**:

- Handles toggling the popover content open and closed via the popover service.
- Typically used on triggers (e.g., the button that opens a menu).

### ClrPopoverContent Inputs

The `*clrPopoverContent` directive is the "workhorse" of the utility. It accepts several inputs to configure behavior:

- **`clrPopoverContent`** (boolean):
  - Controls the open/closed state of the popover. When true, the overlay is created and attached; when false, it is detached.
- **`clrPopoverContentAt`** (`ClrPopoverPosition | ConnectedPosition`):
  - Defines the preferred position of the content relative to the anchor (e.g., `top-right`, `bottom-left`). It sets the `preferredPosition` for the CDK overlay.
- **`clrPopoverContentAvailablePositions`** (`ConnectedPosition[]`):
  - A prioritized list of fallback positions the overlay can attempt to use if the preferred position does not fit within the viewport.
- **`clrPopoverContentType`** (`ClrPopoverType`):
  - Specifies the type of popover (e.g., `DROPDOWN`, `TOOLTIP`, `SIGNPOST`). This determines specific offsets and behavior variations associated with that type.
- **`clrPopoverContentOutsideClickToClose`** (boolean):
  - Determines if clicking outside the popover content should automatically close it. Defaults to `true`.
- **`clrPopoverContentScrollToClose`** (boolean):
  - Determines if scrolling the page should automatically close the popover. Defaults to `false`.

## Enums

1.  **`ClrPopoverType`**: Describes the popover variation: `SIGNPOST`, `TOOLTIP`, `DROPDOWN`, and `DEFAULT`.
2.  **`ClrPopoverPosition`**: Describes the popover position relative to the anchor (e.g., `top-left`, `bottom-right`).
3.  **`ClrPosition`**: Describes the specific point of contact on both the anchor and content elements.

---

## Usage Example

To use the popover utility, a host component must provide the `ClrPopoverService`. Components generally provide a `ClrPopoverPosition` via the `at` input to describe the preferred content position.

```html
<button class="btn" clrPopoverOpenCloseButton clrPopoverAnchor [attr.aria-owns]="popoverId">
  <cds-icon shape="home"></cds-icon> Popover Anchor
</button>
<div
  [id]="popoverId"
  role="dialog"
  cdkTrapFocus
  *clrPopoverContent="open;
    at: position; availablePositions: [...]; outsideClickToClose: true; scrollToClose: true"
>
  <div role="heading">
    Overlay Header
    <button class="btn btn-sm btn-outline-neutral btn-icon" clrPopoverCloseButton>
      <cds-icon shape="times"></cds-icon>
    </button>
  </div>
  <div>Overlay Content</div>
</div>
```
