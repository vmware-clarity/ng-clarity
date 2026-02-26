# Collapsible Panel

## CSS Custom Properties

| CSS Custom Property                                         | Description                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| --clr-collapsible-panel-text-color                          | Text color of the panel header.                                 |
| --clr-collapsible-panel-text-color-hover                    | Text color of the panel header when hovered.                    |
| --clr-collapsible-panel-text-color-active                   | Text color of the panel header when active.                     |
| --clr-collapsible-panel-panel-disabled-color                | Text color of the panel header when disabled.                   |
| --clr-collapsible-panel-active-background-color             | Background color of the active (open) panel.                    |
| --clr-collapsible-panel-content-background-color            | Background color of the panel content area.                     |
| --clr-collapsible-panel-content-color                       | Text color of the panel content area.                           |
| --clr-collapsible-panel-content-font-size                   | Font size of the text in the panel content area.                |
| --clr-collapsible-panel-header-background-color             | Background color of the panel header.                           |
| --clr-collapsible-panel-header-disabled-background-color    | Background color of the panel header when disabled.             |
| --clr-collapsible-panel-header-hover-background-color       | Background color of the panel header on hover.                  |
| --clr-collapsible-panel-header-active-background-color      | Background color of the panel header when active.               |
| --clr-collapsible-panel-header-open-background-color        | Background color of the panel header when the panel is open.    |
| --clr-collapsible-panel-header-open-hover-background-color  | Background color of the panel header when open and hovered.     |
| --clr-collapsible-panel-header-open-active-background-color | Background color of the panel header when open and active.      |
| --clr-collapsible-panel-border-color                        | Color of the panel border.                                      |
| --clr-collapsible-panel-border-radius                       | Border radius of the panel.                                     |
| --clr-collapsible-panel-title-min-width                     | Minimum width of the panel title when a description is present. |

## CSS Classes

| Class Name                      | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| {prefix}-panel                  | Panel container element.                               |
| {prefix}-header                 | Header section of a panel.                             |
| {prefix}-header-button          | Clickable button within the panel header.              |
| {prefix}-status                 | Status indicator within the panel header.              |
| {prefix}-title                  | Title text within the panel header.                    |
| {prefix}-header-has-description | Panel header that includes a description.              |
| {prefix}-description            | Description text within the panel header.              |
| {prefix}-content                | Content section of a panel.                            |
| {prefix}-content-region         | Wrapper region for the panel content (animation host). |
| {prefix}-inner-content          | Inner content section within the panel content.        |
| {prefix}-angle                  | Chevron/angle indicator within the panel header.       |
| {prefix}-panel-open             | State class for an open/expanded panel.                |
| {prefix}-panel-disabled         | State class for a disabled panel.                      |
