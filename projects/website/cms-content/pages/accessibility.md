---
title: Accessibility
---

# Accessibility

<p class="component-summary">
  Clarity tries to cover as many best practices for accessibility out of the box. However, some
  things are too application-specific for Clarity to provide.
</p>

## ARIA Live Region

When content changes dynamically on the page outside of the current focus, a screen reader user
would not be aware of those changes. In these scenarios, the browser supports the `aria-live`
attribute to make important announcements. You might announce errors in a form, status updates for
long running tasks, or alert messages.

Individual components are not well-suited for handling `aria-live` announcements for various
reasons, especially components designed for reusability in any application. A couple reasons for
this is that individual components cannot know what an announcement's priority should be or if it
should delay an announcement because multiple things are happening at once. Please see the following
links for further information:

- W3C: <https://www.w3.org/TR/wai-aria-1.1/#aria-live>
- MDN: <https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live>

Therefore, applications should coordinate live announcements via a single `aria-live` region.
**To be extra clear, it is up to the application to make live announcements when it makes sense.**
Clarity components will not make any announcements out of the box. The one exception to this is
`clr-accordion` which announces error states, but that will likely be fixed in a future version of
Clarity.

There are limitations to how different screen readers and assistive technologies support `aria-live`.
We recommend using `LiveAnnouncer` from @angular/cdk to make live announcements in a fully
compatible way.

- Overview: <https://material.angular.io/cdk/a11y/overview#LiveAnnouncer>
- API docs: <https://material.angular.io/cdk/a11y/api#LiveAnnouncer>

## Autocomplete

The `autocomplete` attribute is an HTML attribute that can be used to give web applications more
control over how form fields are auto-completed by the browser. By setting the `autocomplete`
attribute to various values, web developers can determine whether a field should be auto-completed
and what types of data should be suggested. Please see the following links for further information:

- WHATWG: <https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete>
- W3C: <https://www.w3.org/WAI/WCAG21/Techniques/html/H98>
- MDN: <https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete>

The application projects the `input` element for the input container components `clr-date-container`,
`clr-password-container`, `clr-input-container`, and others from outside the component so
**it's up to the application to set `autocomplete` attribute and its value correctly.**
