# ClrPopover

The ClrPopover implementation is based on the Angular Overlay and Portals implementation provided in the Angular CDK.
The goal is to provide a straightforward utility to use within the Clarity library that allows for popover like elements
to use a consistent and straightforward API. It offloads all positioning and layering logic to the CDK, which is better
equipped and better tested to handle complex rendering situations of component libraries.

At it's most basic, the popover utility is implemented with a set of directives and a service to track, manage, and
subscribe to state change events. The `clrPopoverAnchor` directive is used on the element that should be used
as the element to anchor the content element to. The `*clrPopoverContent` structural directive, which allows renders
the view and hoists to an Overlay on the `body` element in a DomPortal. The `*clrPopoverContent` directive also
accepts arguments to configure the overlay, but the `ClrPopoverService` can also be used to configure and manage
the overlay state as well.

## EXAMPLE POPOVER

Components will need to provide either or both a [ConnectedPosition](https://material.angular.io/cdk/overlay/api#ConnectedPosition)
list (ordered from most to least preferred position) to `availablePositions` and/or a `ClrPopoverPosition` to `at` to describe the default/preferred `contentPosition`.
Optionally you can choose to add the `scrollToClose` and `outsideClickToClose` event listeners.

This is what it looks like from the implementing component perspective:

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

Notice that the Popover Anchor element has two directives on it, the `clrPopoverOpenCloseButton` and the `clrPopoverAnchor` directive that tells our popover complex which element is the anchor. Since the open/close button of a popover may not be the element you want to anchor the popover adjacent to, separate directives are used.

The content div also has two directives on it. First, we use the existing focus trap to make sure the users focus
stays on the popover until they dismiss it. And, the workhorse of the ClrPopover utility the structural
directive `*clrPopoverContent` which takes an input for open state, an input that takes an instance of
ClrPopoverPosition **for the content position**

## ARCHITECTURE

### Service

The **ClrPopoverService** manages the open/close state and changes for the popover and can take into account
the triggering event that started an open or close change. It also maintains the references to the various buttons
used for either anchoring or to ensure the appropriate element receives focus after opening or closing the popover.

### Directives

1.  **ClrPopoverAnchor**: This directive marks the element that is used as a popover trigger. It hands an
    ElementRef to the events service so it can be used for focus management. The element ref is also used by the
    positioning service whenever it needs to calculate the x/y offsets for positioning the content near the anchor onscreen.
2.  **ClrPopoverCloseButton**: Should only be used inside popover content containers. It will call the toggleWithEvent
    method on the toggle service **and, it will set the focus back on the anchor element**.
3.  **ClrPopoverOpenCloseButton**: Handles toggling the popover content open and closed with the popover toggle service.
4.  **ClrPopoverContent**: Structural directive that takes multiple inputs (open state, position object, click to
    close feature, and scroll to close feature).

### Enums

1.  **ClrPopoverType**: this is the description of the popover variations SIGNPOST, TOOLTIP, DROPDOWN and DEFAULT.
2.  **ClrPopoverPosition**: This is a description of the popover position around the anchor and the direction that anchor and content elements push into each other on. `[clrPosition]` input of component will use this as key. Examples: `top-left`, `bottom-right`.
3.  **ClrPosition**: this is the description of the where point of contact is on both the anchor and the content
    element when they are pushed together. There are 3 position per rectangular side.
