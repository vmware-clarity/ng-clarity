# Accordion - Style API

## CSS Variables

| CSS Variable Name                              | Description                                                                    |
|------------------------------------------------|--------------------------------------------------------------------------------|
| --clr-accordion-text-color                     | Changes the text color used by the title and icon of the component.            |
| --clr-accordion-active-background-color        | Changes the background color of the header element when open.                  |
| --clr-accordion-content-background-color       | Changes the background color of the accordion content when open.               |
| --clr-accordion-header-background-color        | Changes the background color of the accordion panel header when closed.        |
| --clr-accordion-header-hover-background-color  | Changes the background color of the accordion panel header on mouse hover.     |
| --clr-accordion-border-radius                  | Changes the border radius of the accordion.                                    |
| --clr-accordion-border-color                   | Changes the border color of the accordion.                                     |
| --clr-accordion-header-font-size               | Changes the font size of the accordion panel header.                           |
| --clr-accordion-header-button-font-size        | Changes the font size of the accordion header button.                          |
| --clr-accordion-title-font-size                | Changes font size of the accordion title.                                      |
| --clr-accordion-title-font-weight              | Changes the font weight of accordion title.                                    |
| --clr-accordion-error-color                    | Changes the text color when error occurs in the accordion.                     |
| --clr-accordion-complete-color                 | Changes the color of the stepper complete icon when a step is complete.        |
| --clr-accordion-header-left-indicator          | Changes the box-shadow of the left indicator.                                  |
| --clr-accordion-header-left-complete-indicator | Changes the box-shadow of the left indicator when a step is complete.          |
| --clr-accordion-header-left-error-indicator    | Changes the box-shadow of the left indicator when a step is in an error state. |
| --clr-accordion-border-left-width              | Changes the width of the left indicator.                                       |
| --clr-accordion-border-left-color              | Changes the color of the left indicator                                        |
| --clr-accordion-border-left-color-complete     | Changes the color of the left indicator when a step is complete.               |
| --clr-accordion-border-left-color-error        | Changes the color of the left indicator when a step is in an error state.      |


## Class names

| Class name                           | Description                                                                      |
|--------------------------------------|----------------------------------------------------------------------------------|
| clr-accordion                        | Top level class that wraps the component.                                        |
| clr-accordion-panel                  | Provides an expandable details-summary view.                                     |
| clr-accordion-panel-open             | State modifier and associated styles for the accordion with the panel open.      |
| clr-accordion-content                | Outer class that wraps content within an expanded accordion panel                |
| clr-accordion-header                 | Class used for the accordion header                                              |
| clr-accordion-header-button          | Class used to wrap the clickable area of the header element                      |
| clr-accordion-inner-content          | Inner class for content within an expanded accordion panel                       |
| clr-accordion-status                 | Used to style/position the arrow/angle within the header element                 |
| clr-accordion-title                  | Class used to wrap the title text within the header button                       |
| clr-accordion-angle                  | Styles the status icon used in the header button.                                |
| clr-accordion-panel-inactive         | Used to disable the header button click when using the accordion as a stepper.   |
| clr-accordion-panel-complete         | State modifier and associated styles for the accordion step in a complete state. |
| clr-accordion-panel-error            | State modifier and associated styles for the accordion step in an error state.   |     
| clr-accordion-number                 | Used to style the numbered steps when using the accordion as a stepper           |
| clr-accordion-error-icon             | Used to style the error icon when using the accordion as a stepper               |
| clr-accordion-complete-icon          | Used to style the complete icon when using the accordion as a stepper            |
| clr-accordion-header-has-description | Class to indicate the header contains a clr-accordion-description element.       |
| clr-accordion-description            | Wrapper class for a header description, when the accordion is used as a stepper. |

