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

Components will need to provide either a [ConnectedPosition](https://material.angular.io/cdk/overlay/api#ConnectedPosition)
list (ordered from most to least preferred position) or a ClrPopoverPosition to describe the default/preferred position
(`contentPosition`). Optionally you can choose to add the scrollToClose and outsideClickToClose event listeners.
This is what it looks like from the implementing component perspective:

```html
<button class="btn" clrPopoverOpenCloseButton role="button" type="button" [attr.aria-owns]="popoverId" clrPopoverAnchor>
  <cds-icon shape="home"></cds-icon> Popover Anchor
</button>
<div
  [id]="popoverId"
  role="dialog"
  cdkTrapFocus
  *clrPopoverContent="openState at contentPosition; outsideClickToClose: true; scrollToClose: true"
>
  <header class="header-4" role="heading">
    Header
    <button role="button" class="btn btn-link" clrPopoverCloseButton>
      <cds-icon shape="window-close" size="36"></cds-icon>
    </button>
  </header>
  <section role="region">
    <!-- body -->
  </section>
  <footer>
    <!-- footer -->
  </footer>
</div>
```

Notice that the Popover Anchor element has two directives on it, the clrPopoverOpenCloseButton and the clrPopoverAnchor
directive that tells our popover complex which element is the anchor. Since the open/close button of a popover may not
be the element you want to anchor the popover adjacent to, separate directives are used.

The content div also has two directives on it. First, we use the existing focus trap to make sure the users focus
stays on the popover until they dismiss it. And, the workhorse of the ClrPopover utility the structural
directive \*clrPopoverContent which takes an input for open state, an input that takes an instance of
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

1.  **ClrAlignment**: this is the description of the where point of contact is on both the anchor and the content
    element when they are pushed together. START, MIDDLE, END.
2.  **ClrAxis**: This is a description of the orientation for the popover complex and \**the direction that anchor and
    content elements push into each other on. For example if ClrAxis is VERTICAL then pushing occurs along the *Y* axis. If
    ClrAxis is HORIZONTAL then pushing occurs along the *X\* axis.
3.  **ClrSide**: The location that content will orient to BEFORE or AFTER in relation to the anchor. When ClrAxis is
    VERTICAL, BEFORE is _above_ the anchor and AFTER is *below the anchor. When ClrAxis is HORIZONTAL, BEFORE is *left*
    of the anchor and AFTER is *right\* of the anchor.

### Interfaces

**ClrPopoverPosition**: An object that can describe the relationship between anchor to content positions. It
eliminates any invalid positions for content and based on the enum values it makes the math needed to determine howF
viewport violations are handled as simple as possible.
