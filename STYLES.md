# Accordion

## CSS Custom Properties

| CSS Custom Property                                 | Description                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| --clr-accordion-text-color                          | Text color of the accordion component.                              |
| --clr-accordion-text-color-hover                    | Text color of the accordion header when hovered.                    |
| --clr-accordion-text-color-active                   | Text color of the accordion header when active.                     |
| --clr-accordion-text-color-selected                 | Text color of the accordion header when selected.                   |
| --clr-accordion-panel-disabled-color                | Text color of the accordion header when disabled.                   |
| --clr-accordion-active-background-color             | Background color of the active accordion panel.                     |
| --clr-accordion-content-background-color            | Background color of the accordion content area.                     |
| --clr-accordion-content-color                       | Color of the text in the accordion content area.                    |
| --clr-accordion-content-font-size                   | DEPRECATED Font size of the text in the accordion content area.     |
| --clr-accordion-header-background-color             | Background color of the accordion header.                           |
| --clr-accordion-header-disabled-background-color    | Background color of the accordion header when disabled.             |
| --clr-accordion-header-hover-background-color       | Background color of the accordion header on hover.                  |
| --clr-accordion-header-active-background-color      | Background color of the accordion header when active.               |
| --clr-accordion-header-open-hover-background-color  | Background color of the accordion header when opened and hovered.   |
| --clr-accordion-header-open-active-background-color | Background color of the accordion header when opened and :active.   |
| --clr-accordion-error-color                         | Color representing an error state in the accordion.                 |
| --clr-accordion-complete-color                      | Color representing a completed state in the accordion.              |
| --clr-accordion-border-color                        | Color of the accordion border.                                      |
| --clr-accordion-border-radius                       | Border radius of the accordion.                                     |
| --clr-accordion-border-left-color-complete          | Color of the left border in the accordion for the complete state.   |
| --clr-accordion-border-left-color-error             | Color of the left border in the accordion for the error state.      |
| --clr-accordion-header-left-indicator               | Left indicator style for the accordion header.                      |
| --clr-accordion-header-left-current-indicator       | Left indicator style for the accordion header when on current step. |
| --clr-accordion-step-title-min-width                | Sets the min-width for the step title.                              |

## CSS Classes

| Class Name                           | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| clr-accordion                        | Accordion component.                                  |
| clr-accordion-panel                  | Panel within the accordion.                           |
| clr-accordion-header                 | Header section of an accordion panel.                 |
| clr-accordion-number                 | Number or step indicator within the accordion.        |
| clr-accordion-header-button          | Clickable button within the accordion header.         |
| clr-accordion-status                 | Status indicator within the accordion header.         |
| clr-accordion-title                  | Title text within the accordion header.               |
| clr-accordion-header-has-description | Accordion header with a description.                  |
| clr-accordion-description            | Description text within the accordion header.         |
| clr-accordion-content                | Content section of an accordion panel.                |
| clr-accordion-content-region         | Content region section of an accordion panel.         |
| clr-accordion-inner-content          | Inner content section within the accordion content.   |
| clr-accordion-angle                  | Angle or arrow indicator within the accordion header. |
| clr-accordion-error-icon             | Error icon within the accordion header.               |
| clr-accordion-complete-icon          | Complete icon within the accordion header.            |
| clr-accordion-panel-open             | Open or expanded accordion panel.                     |
| clr-accordion-panel-complete         | Complete state of an accordion panel.                 |
| clr-accordion-panel-error            | Error state of an accordion panel.                    |
| clr-accordion-panel-disabled         | Disabled state of an accordion panel.                 |
| clr-stepper-forms                    | Stepper forms mode for the accordion.                 |
| clr-step-button                      | Step button within the accordion.                     |

# Alert

## CSS Custom Properties

| CSS Custom Property                            | Description                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| --clr-alert-action-color                       | Alerts action default font color                                  |
| --clr-alert-action-active-color                | Alerts action default font color on focus, hover, active          |
| --clr-alert-close-icon-color                   | Close icon default color                                          |
| --clr-alert-close-icon-hover-color             | Close icon default color on hover                                 |
| --clr-app-level-alert-color                    | Default font color for app level alerts                           |
| --clr-app-alert-close-icon-color               | Close icon default color for app level alerts                     |
| --clr-alert-borderradius                       | Border radius                                                     |
| --clr-alert-info-bg-color                      | Info alert background color                                       |
| --clr-alert-info-font-color                    | Info alert font color                                             |
| --clr-alert-info-border-color                  | Info alert border color                                           |
| --clr-alert-info-icon-color                    | Info alert icon color                                             |
| --clr-alert-info-action-color                  | Info alert action font color                                      |
| --clr-alert-info-action-active-color           | Info alert action font color on focus, hover, active              |
| --clr-alert-info-close-icon-color              | Info alert close icon color                                       |
| --clr-alert-info-close-icon-hover-color        | Info alert close icon color on hover                              |
| --clr-alert-success-bg-color                   | Success alert background color                                    |
| --clr-alert-success-font-color                 | Success alert font color                                          |
| --clr-alert-success-border-color               | Success alert border color                                        |
| --clr-alert-success-icon-color                 | Success alert icon color                                          |
| --clr-alert-success-action-color               | Success alert action font color                                   |
| --clr-alert-success-action-active-color        | Success alert action font color on focus, hover, active           |
| --clr-alert-success-close-icon-color           | Success alert close icon color                                    |
| --clr-alert-success-close-icon-hover-color     | Success alert close icon color on hover                           |
| --clr-alert-warning-bg-color                   | Warning alert background color                                    |
| --clr-alert-warning-font-color                 | Warning alert font color                                          |
| --clr-alert-warning-border-color               | Warning alert border color                                        |
| --clr-alert-warning-icon-color                 | Warning alert icon color                                          |
| --clr-alert-warning-action-color               | Warning alert action font color                                   |
| --clr-alert-warning-action-active-color        | Warning alert action font color on focus, hover, active           |
| --clr-alert-warning-close-icon-color           | Warning alert close icon color                                    |
| --clr-alert-warning-close-icon-hover-color     | Warning alert close icon color on hover                           |
| --clr-alert-danger-bg-color                    | Danger alert background color                                     |
| --clr-alert-danger-font-color                  | Danger alert font color                                           |
| --clr-alert-danger-border-color                | Danger alert border color                                         |
| --clr-alert-danger-icon-color                  | Danger alert icon color                                           |
| --clr-alert-danger-action-color                | Danger alert action font color                                    |
| --clr-alert-danger-action-active-color         | Danger alert action font color on focus, hover, active            |
| --clr-alert-danger-close-icon-color            | Danger alert close icon color                                     |
| --clr-alert-danger-close-icon-hover-color      | Danger alert close icon color on hover                            |
| --clr-alert-neutral-bg-color                   | Neutral alert background color                                    |
| --clr-alert-neutral-font-color                 | Neutral alert font color                                          |
| --clr-alert-neutral-border-color               | Neutral alert border color                                        |
| --clr-alert-neutral-icon-color                 | Neutral alert icon color                                          |
| --clr-alert-neutral-action-color               | Neutral alert action font color                                   |
| --clr-alert-neutral-action-active-color        | Neutral alert action font color on focus, hover, active           |
| --clr-alert-neutral-close-icon-color           | Neutral alert close icon color                                    |
| --clr-alert-neutral-close-icon-hover-color     | Neutral alert close icon color on hover                           |
| --clr-app-alert-info-bg-color                  | App level info alert background color                             |
| --clr-app-alert-info-font-color                | App level info alert font color                                   |
| --clr-app-alert-info-border-color              | App level info alert border color                                 |
| --clr-app-alert-info-icon-color                | App level info alert icon color                                   |
| --clr-app-alert-info-action-color              | App level info alert action font color                            |
| --clr-app-alert-info-action-active-color       | App level info alert action font color on focus, hover, active    |
| --clr-app-alert-info-close-icon-color          | App level info alert close icon color                             |
| --clr-app-alert-info-close-icon-hover-color    | App level info alert close icon color on hover                    |
| --clr-app-alert-warning-bg-color               | App level warning alert background color                          |
| --clr-app-alert-warning-border-color           | App level warning alert border color                              |
| --clr-app-alert-warning-icon-color             | App level warning alert icon color                                |
| --clr-app-alert-warning-font-color             | App level warning alert font color                                |
| --clr-app-alert-warning-action-color           | App level warning alert action font color                         |
| --clr-app-alert-warning-action-active-color    | App level warning alert action font color on focus, hover, active |
| --clr-app-alert-warning-close-icon-color       | App level warning alert close icon color                          |
| --clr-app-alert-warning-close-icon-hover-color | App level warning alert close icon color on hover                 |
| --clr-app-alert-danger-bg-color                | App level danger alert background color                           |
| --clr-app-alert-danger-border-color            | App level danger alert border color                               |
| --clr-app-alert-danger-icon-color              | App level danger alert icon color                                 |
| --clr-app-alert-danger-font-color              | App level danger alert font color                                 |
| --clr-app-alert-danger-action-color            | App level danger alert action font color                          |
| --clr-app-alert-danger-action-active-color     | App level danger alert action font color on focus, hover, active  |
| --clr-app-alert-danger-close-icon-color        | App level danger alert close icon color                           |
| --clr-app-alert-danger-close-icon-hover-color  | App level danger alert close icon color on hover                  |
| --clr-app-alert-success-border-color           | App level success alert border color                              |
| --clr-app-alert-success-bg-color               | App level success alert background color                          |
| --clr-app-alert-success-icon-color             | App level success alert icon color                                |
| --clr-app-alert-success-font-color             | App level success alert font color                                |
| --clr-app-alert-success-action-color           | App level success alert action font color                         |
| --clr-app-alert-success-action-active-color    | App level success alert action font color on focus, hover, active |
| --clr-app-alert-success-close-icon-color       | App level success alert close icon color                          |
| --clr-app-alert-success-close-icon-hover-color | App level success alert close icon color on hover                 |
| --clr-app-alert-neutral-border-color           | App level neutral alert border color                              |
| --clr-app-alert-neutral-bg-color               | App level neutral alert background color                          |
| --clr-app-alert-neutral-icon-color             | App level neutral alert icon color                                |
| --clr-app-alert-neutral-font-color             | App level neutral alert font color                                |
| --clr-app-alert-neutral-action-color           | App level neutral alert action font color                         |
| --clr-app-alert-neutral-action-active-color    | App level neutral alert action font color on focus, hover, active |
| --clr-app-alert-neutral-close-icon-color       | App level neutral alert close icon color                          |
| --clr-app-alert-neutral-close-icon-hover-color | App level neutral alert close icon color on hover                 |
| --clr-app-alert-pager-text-color               | Alert pager default font color                                    |
| --clr-app-alert-info-pager-bg-color            | Info alert pager font color                                       |
| --clr-app-alert-warning-pager-bg-color         | Warning alert pager font color                                    |
| --clr-app-alert-danger-pager-bg-color          | Danger alert pager font color                                     |
| --clr-app-alert-success-pager-bg-color         | Danger success pager font color                                   |
| --clr-app-alert-neutral-pager-bg-color         | Danger neutral pager font color                                   |
| --clr-lightweight-alert-info-icon-color        | Lightweight alert info icon color                                 |
| --clr-lightweight-alert-info-font-color        | Lightweight alert info font color                                 |
| --clr-lightweight-alert-warning-icon-color     | Lightweight alert warning icon color                              |
| --clr-lightweight-alert-warning-font-color     | Lightweight alert warning font color                              |
| --clr-lightweight-alert-danger-icon-color      | Lightweight alert danger icon color                               |
| --clr-lightweight-alert-danger-font-color      | Lightweight alert danger font color                               |
| --clr-lightweight-alert-success-icon-color     | Lightweight alert success icon color                              |
| --clr-lightweight-alert-success-font-color     | Lightweight alert success font color                              |
| --clr-lightweight-alert-neutral-icon-color     | Lightweight alert neutral icon color                              |
| --clr-lightweight-alert-neutral-font-color     | Lightweight alert neutral font color                              |

## CSS Classes

| Class name           | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| alert                | Main alert element                                                         |
| alert-info           | Addition to `alert` class to present it as info alert                      |
| alert-success        | Addition to `alert` class to present it as success alert                   |
| alert-warning        | Addition to `alert` class to present it as warning alert                   |
| alert-danger         | Addition to `alert` class to present it as danger alert                    |
| alert-neutral        | Addition to `alert` class to present it as neutral alert                   |
| alert-app-level      | Addition to `alert` class to present it as app-level alert                 |
| alert-items          | Wrapper for elements with class `alert-item`                               |
| alert-item           | Element for messages in alert                                              |
| alert-text           | Text inside alert items                                                    |
| alert-actions        | Wrapper for actions                                                        |
| alert-action         | Action element                                                             |
| close                | Close element `X`                                                          |
| alert-icon           | Icon used in alert items                                                   |
| alert-icon-wrapper   | Wrapper for icons                                                          |
| alert-sm             | Alert with a smaller size                                                  |
| alert-lightweight    | Light weight alert                                                         |
| alert-hidden         | Hide alert                                                                 |
| alerts               | Main alerts element \*should be used with `alert-info` or equivalent class |
| alerts-pager         | Alerts pager element                                                       |
| alerts-pager-button  | Pager button                                                               |
| alerts-pager-control | Pager controls wrapper                                                     |
| alerts-page-down     | Page down wrapper                                                          |
| alerts-page-up       | Page up wrapper                                                            |
| alerts-pager-text    | Page identifier in pager                                                   |
| alerts-spinner       | Using spinner instead of an icon                                           |

# Badge

## CSS Custom Properties

| CSS Custom Property             | Description                       |
| ------------------------------- | --------------------------------- |
| --clr-badge-background-color    | Background color                  |
| --clr-badge-color               | Font color                        |
| --clr-badge-info-bg-color       | Info badge background color       |
| --clr-badge-info-color          | Info badge text color             |
| --clr-badge-success-bg-color    | Success badge background color    |
| --clr-badge-success-color       | Success badge text color          |
| --clr-badge-warning-bg-color    | Warning badge background color    |
| --clr-badge-warning-color       | Warning badge text color          |
| --clr-badge-danger-bg-color     | Danger badge background color     |
| --clr-badge-danger-color        | Danger badge text color           |
| --clr-badge-gray-bg-color       | Gray badge background color       |
| --clr-badge-gray-color          | Gray badge text color             |
| --clr-badge-purple-bg-color     | Purple badge background color     |
| --clr-badge-purple-color        | Purple badge text color           |
| --clr-badge-blue-bg-color       | Blue badge background color       |
| --clr-badge-blue-color          | Blue badge text color             |
| --clr-badge-orange-bg-color     | Orange badge background color     |
| --clr-badge-orange-color        | Orange badge text color           |
| --clr-badge-light-blue-bg-color | Light-blue badge background color |
| --clr-badge-light-blue-color    | Light-blue badge text color       |

## CSS Classes

| Class name       | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| badge            | Main badge element. All of the following require this class as well |
| badge-info       | Info badge                                                          |
| badge-success    | Success badge                                                       |
| badge-danger     | Danger badge                                                        |
| badge-warning    | Warning badge                                                       |
| badge-gray       | Gray badge                                                          |
| badge-purple     | Purple badge                                                        |
| badge-blue       | Blue badge                                                          |
| badge-orange     | Orange badge                                                        |
| badge-light-blue | Light-blue badge                                                    |

# Breadcrumbs

## CSS Custom Properties

| CSS Custom Property         | Description             |
| --------------------------- | ----------------------- |
| --clr-breadcrumb-item-space | Breadcrumb item spacing |

## CSS Classes

| Class name            | Description               |
| --------------------- | ------------------------- |
| clr-breadcrumb        | Breadcrumb element        |
| clr-breadcrumb-menu   | Breadcrumb menu           |
| clr-breadcrumb-item   | Breadcrumb menu item      |
| clr-breadcrumb-expand | Breadcrumb expand control |

# Button

## CSS Custom Properties

| CSS Custom Property                             | Description                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| --clr-btn-vertical-margin                       | Button top and bottom margin                                               |
| --clr-btn-horizontal-margin                     | Button left and right margin                                               |
| --clr-btn-vertical-padding                      | Button top and bottom padding                                              |
| --clr-btn-horizontal-padding                    | Button left and right padding                                              |
| --clr-btn-padding                               | Button padding                                                             |
| --clr-btn-height                                | Button height                                                              |
| --clr-btn-height-sm                             | Small button height                                                        |
| --clr-btn-border-radius                         | Button border radius                                                       |
| --clr-btn-border-width                          | Button border width                                                        |
| --clr-btn-outline-bg-color                      | Base outline button background color                                       |
| --clr-btn-default-color                         | Default button text color                                                  |
| --clr-btn-default-bg-color                      | Default button background color                                            |
| --clr-btn-default-border-color                  | Default button border color                                                |
| --clr-btn-default-hover-color                   | Default button `:hover` text color                                         |
| --clr-btn-default-hover-bg-color                | Default button `:hover` background color                                   |
| --clr-btn-default-active-color                  | Default button `:active` text color                                        |
| --clr-btn-default-active-bg-color               | Default button `:active` background color                                  |
| --clr-btn-default-disabled-color                | Default button `disabled` text color                                       |
| --clr-btn-default-disabled-bg-color             | Default button `disabled` background color                                 |
| --clr-btn-default-disabled-border-color         | Default button `disabled` border color                                     |
| --clr-btn-default-outline-color                 | Default outline button text color                                          |
| --clr-btn-default-outline-bg-color              | Default outline button background color                                    |
| --clr-btn-default-outline-border-color          | Default outline button border color                                        |
| --clr-btn-default-outline-hover-color           | Default outline button `:hover` text color                                 |
| --clr-btn-default-outline-hover-bg-color        | Default outline button `:hover` background color                           |
| --clr-btn-default-outline-active-color          | Default outline button `:active` text color                                |
| --clr-btn-default-outline-active-bg-color       | Default outline button `:active` background color                          |
| --clr-btn-default-outline-disabled-color        | Default outline button `disabled` text color                               |
| --clr-btn-default-outline-disabled-bg-color     | Default outline button `disabled` background color                         |
| --clr-btn-default-outline-disabled-border-color | Default outline button `disabled` border color                             |
| --clr-btn-primary-color                         | Primary button text color                                                  |
| --clr-btn-primary-bg-color                      | Primary button background color                                            |
| --clr-btn-primary-border-color                  | Primary button border color                                                |
| --clr-btn-primary-hover-color                   | Primary button `:hover` text color                                         |
| --clr-btn-primary-hover-bg-color                | Primary button `:hover` background color                                   |
| --clr-btn-primary-active-color                  | Primary button `:active` text color                                        |
| --clr-btn-primary-active-bg-color               | Primary button `:active` background color                                  |
| --clr-btn-primary-disabled-color                | Primary button `disabled` text color                                       |
| --clr-btn-primary-disabled-bg-color             | Primary button `disabled` background color                                 |
| --clr-btn-primary-disabled-border-color         | Primary button `disabled` border color                                     |
| --clr-btn-primary-outline-color                 | Primary outline button text color                                          |
| --clr-btn-primary-outline-bg-color              | Primary outline button background color                                    |
| --clr-btn-primary-outline-border-color          | Primary outline button border color                                        |
| --clr-btn-primary-outline-hover-color           | Primary outline button `:hover` text color                                 |
| --clr-btn-primary-outline-hover-bg-color        | Primary outline button `:hover` background color                           |
| --clr-btn-primary-outline-active-color          | Primary outline button `:active` text color                                |
| --clr-btn-primary-outline-active-bg-color       | Primary outline button `:active` background color                          |
| --clr-btn-primary-outline-disabled-color        | Primary outline button `disabled` text color                               |
| --clr-btn-primary-outline-disabled-bg-color     | Primary outline button `disabled` background color                         |
| --clr-btn-primary-outline-disabled-border-color | Primary outline button `disabled` border color                             |
| --clr-btn-success-color                         | Success button text color                                                  |
| --clr-btn-success-bg-color                      | Success button background color                                            |
| --clr-btn-success-border-color                  | Success button border color                                                |
| --clr-btn-success-hover-color                   | Success button `:hover` text color                                         |
| --clr-btn-success-hover-bg-color                | Success button `:hover` background color                                   |
| --clr-btn-success-active-color                  | Success button `:active` text color                                        |
| --clr-btn-success-active-bg-color               | Success button `:active` background color                                  |
| --clr-btn-success-disabled-color                | Success button `disabled` text color                                       |
| --clr-btn-success-disabled-bg-color             | Success button `disabled` background color                                 |
| --clr-btn-success-disabled-border-color         | Success button `disabled` border color                                     |
| --clr-btn-success-outline-color                 | Success outline button text color                                          |
| --clr-btn-success-outline-bg-color              | Success outline button background color                                    |
| --clr-btn-success-outline-border-color          | Success outline button border color                                        |
| --clr-btn-success-outline-hover-color           | Success outline button `:hover` text color                                 |
| --clr-btn-success-outline-hover-bg-color        | Success outline button `:hover` background color                           |
| --clr-btn-success-outline-active-color          | Success outline button `:active` text color                                |
| --clr-btn-success-outline-active-bg-color       | Success outline button `:active` background color                          |
| --clr-btn-success-outline-disabled-color        | Success outline button `disabled` text color                               |
| --clr-btn-success-outline-disabled-bg-color     | Success outline button `disabled` background color                         |
| --clr-btn-success-outline-disabled-border-color | Success outline button `disabled` border color                             |
| --clr-btn-danger-color                          | Danger button text color                                                   |
| --clr-btn-danger-bg-color                       | Danger button background color                                             |
| --clr-btn-danger-border-color                   | Danger button border color                                                 |
| --clr-btn-danger-hover-color                    | Danger button `:hover` text color                                          |
| --clr-btn-danger-hover-bg-color                 | Danger button `:hover` background color                                    |
| --clr-btn-danger-active-color                   | Danger button `:active` text color                                         |
| --clr-btn-danger-active-bg-color                | Danger button `:active` background color                                   |
| --clr-btn-danger-disabled-color                 | Danger button `disabled` text color                                        |
| --clr-btn-danger-disabled-bg-color              | Danger button `disabled` background color                                  |
| --clr-btn-danger-disabled-border-color          | Danger button `disabled` border color                                      |
| --clr-btn-danger-outline-color                  | Danger outline button text color                                           |
| --clr-btn-danger-outline-bg-color               | Danger outline button background color                                     |
| --clr-btn-danger-outline-border-color           | Danger outline button border color                                         |
| --clr-btn-danger-outline-hover-color            | Danger outline button `:hover` text color                                  |
| --clr-btn-danger-outline-hover-bg-color         | Danger outline button `:hover` background color                            |
| --clr-btn-danger-outline-active-color           | Danger outline button `:active` text color                                 |
| --clr-btn-danger-outline-active-bg-color        | Danger outline button `:active` background color                           |
| --clr-btn-danger-outline-disabled-color         | Danger outline button `disabled` text color                                |
| --clr-btn-danger-outline-disabled-bg-color      | Danger outline button `disabled` background color                          |
| --clr-btn-danger-outline-disabled-border-color  | Danger outline button `disabled` border color                              |
| --clr-btn-warning-color                         | Warning button text color                                                  |
| --clr-btn-warning-bg-color                      | Warning button background color                                            |
| --clr-btn-warning-border-color                  | Warning button border color                                                |
| --clr-btn-warning-hover-color                   | Warning button `:hover` text color                                         |
| --clr-btn-warning-hover-bg-color                | Warning button `:hover` background color                                   |
| --clr-btn-warning-active-color                  | Warning button `:active` text color                                        |
| --clr-btn-warning-active-bg-color               | Warning button `:active` background color                                  |
| --clr-btn-warning-disabled-color                | Warning button `disabled` text color                                       |
| --clr-btn-warning-disabled-bg-color             | Warning button `disabled` background color                                 |
| --clr-btn-warning-disabled-border-color         | Warning button `disabled` border color                                     |
| --clr-btn-warning-outline-color                 | Warning outline button text color                                          |
| --clr-btn-warning-outline-bg-color              | Warning outline button background color                                    |
| --clr-btn-warning-outline-border-color          | Warning outline button border color                                        |
| --clr-btn-warning-outline-hover-color           | Warning outline button `:hover` text color                                 |
| --clr-btn-warning-outline-hover-bg-color        | Warning outline button `:hover` background color                           |
| --clr-btn-warning-outline-active-color          | Warning outline button `:active` text color                                |
| --clr-btn-warning-outline-active-bg-color       | Warning outline button `:active` background color                          |
| --clr-btn-warning-outline-disabled-color        | Warning outline button `disabled` text color                               |
| --clr-btn-warning-outline-disabled-bg-color     | Warning outline button `disabled` background color                         |
| --clr-btn-warning-outline-disabled-border-color | Warning outline button `disabled` border color                             |
| --clr-btn-neutral-color                         | Neutral button text color                                                  |
| --clr-btn-neutral-bg-color                      | Neutral button background color                                            |
| --clr-btn-neutral-border-color                  | Neutral button border color                                                |
| --clr-btn-neutral-hover-color                   | Neutral button `:hover` text color                                         |
| --clr-btn-neutral-hover-bg-color                | Neutral button `:hover` background color                                   |
| --clr-btn-neutral-active-color                  | Neutral button `:active` text color                                        |
| --clr-btn-neutral-active-bg-color               | Neutral button `:active` background color                                  |
| --clr-btn-neutral-disabled-color                | Neutral button `disabled` text color                                       |
| --clr-btn-neutral-disabled-bg-color             | Neutral button `disabled` background color                                 |
| --clr-btn-neutral-disabled-border-color         | Neutral button `disabled` border color                                     |
| --clr-btn-neutral-outline-color                 | Neutral outline button text color                                          |
| --clr-btn-neutral-outline-bg-color              | Neutral outline button background color                                    |
| --clr-btn-neutral-outline-border-color          | Neutral outline button border color                                        |
| --clr-btn-neutral-outline-hover-color           | Neutral outline button `:hover` text color                                 |
| --clr-btn-neutral-outline-hover-bg-color        | Neutral outline button `:hover` background color                           |
| --clr-btn-neutral-outline-active-color          | Neutral outline button `:active` text color                                |
| --clr-btn-neutral-outline-active-bg-color       | Neutral outline button `:active` background color                          |
| --clr-btn-neutral-outline-disabled-color        | Neutral outline button `disabled` text color                               |
| --clr-btn-neutral-outline-disabled-bg-color     | Neutral outline button `disabled` background color                         |
| --clr-btn-neutral-outline-disabled-border-color | Neutral outline button `disabled` border color                             |
| --clr-btn-link-color                            | Link button text color                                                     |
| --clr-btn-link-bg-color                         | Link button background color                                               |
| --clr-btn-link-border-color                     | Link button border color                                                   |
| --clr-btn-link-hover-color                      | Link button `:hover` text color                                            |
| --clr-btn-link-hover-bg-color                   | Link button `:hover` background color                                      |
| --clr-btn-link-active-color                     | Link button `:active` text color                                           |
| --clr-btn-link-active-bg-color                  | Link button `:active` background color                                     |
| --clr-btn-link-disabled-color                   | Link button `disabled` text color                                          |
| --clr-btn-link-disabled-bg-color                | Link button `disabled` background color                                    |
| --clr-btn-link-disabled-border-color            | Link button `disabled` border color                                        |
| --clr-btn-link-primary-color                    | Primary link button text color                                             |
| --clr-btn-link-primary-bg-color                 | Primary link button background color                                       |
| --clr-btn-link-primary-border-color             | Primary link button border color                                           |
| --clr-btn-link-primary-hover-color              | Primary link button `:hover` text color                                    |
| --clr-btn-link-primary-hover-bg-color           | Primary link button `:hover` background color                              |
| --clr-btn-link-primary-active-color             | Primary link button `:active` text color                                   |
| --clr-btn-link-primary-active-bg-color          | Primary link button `:active` background color                             |
| --clr-btn-link-primary-disabled-color           | Primary link button `disabled` text color                                  |
| --clr-btn-link-primary-disabled-bg-color        | Primary link button `disabled` background color                            |
| --clr-btn-link-primary-disabled-border-color    | Primary link button `disabled` border color                                |
| --clr-btn-link-success-color                    | Success link button text color                                             |
| --clr-btn-link-success-bg-color                 | Success link button background color                                       |
| --clr-btn-link-success-border-color             | Success link button border color                                           |
| --clr-btn-link-success-hover-color              | Success link button `:hover` text color                                    |
| --clr-btn-link-success-hover-bg-color           | Success link button `:hover` background color                              |
| --clr-btn-link-success-active-color             | Success link button `:active` text color                                   |
| --clr-btn-link-success-active-bg-color          | Success link button `:active` background color                             |
| --clr-btn-link-success-disabled-color           | Success link button `disabled` text color                                  |
| --clr-btn-link-success-disabled-bg-color        | Success link button `disabled` background color                            |
| --clr-btn-link-success-disabled-border-color    | Success link button `disabled` border color                                |
| --clr-btn-link-warning-color                    | Warning link button text color                                             |
| --clr-btn-link-warning-bg-color                 | Warning link button background color                                       |
| --clr-btn-link-warning-border-color             | Warning link button border color                                           |
| --clr-btn-link-warning-hover-color              | Warning link button `:hover` text color                                    |
| --clr-btn-link-warning-hover-bg-color           | Warning link button `:hover` background color                              |
| --clr-btn-link-warning-active-color             | Warning link button `:active` text color                                   |
| --clr-btn-link-warning-active-bg-color          | Warning link button `:active` background color                             |
| --clr-btn-link-warning-disabled-color           | Warning link button `disabled` text color                                  |
| --clr-btn-link-warning-disabled-bg-color        | Warning link button `disabled` background color                            |
| --clr-btn-link-warning-disabled-border-color    | Warning link button `disabled` border color                                |
| --clr-btn-link-danger-color                     | Danger link button text color                                              |
| --clr-btn-link-danger-bg-color                  | Danger link button background color                                        |
| --clr-btn-link-danger-border-color              | Danger link button border color                                            |
| --clr-btn-link-danger-hover-color               | Danger link button `:hover` text color                                     |
| --clr-btn-link-danger-hover-bg-color            | Danger link button `:hover` background color                               |
| --clr-btn-link-danger-active-color              | Danger link button `:active` text color                                    |
| --clr-btn-link-danger-active-bg-color           | Danger link button `:active` background color                              |
| --clr-btn-link-danger-disabled-color            | Danger link button `disabled` text color                                   |
| --clr-btn-link-danger-disabled-bg-color         | Danger link button `disabled` background color                             |
| --clr-btn-link-danger-disabled-border-color     | Danger link button `disabled` border color                                 |
| --clr-btn-inverse-color                         | Inverse button text color                                                  |
| --clr-btn-inverse-bg-color                      | Inverse button background color                                            |
| --clr-btn-inverse-border-color                  | Inverse button border color                                                |
| --clr-btn-inverse-hover-color                   | Inverse button `:hover` text color                                         |
| --clr-btn-inverse-hover-bg-color                | Inverse button `:hover` background color                                   |
| --clr-btn-inverse-active-color                  | Inverse button `:active` text color                                        |
| --clr-btn-inverse-active-bg-color               | Inverse button `:active` background color                                  |
| --clr-btn-inverse-disabled-color                | Inverse button `disabled` text color                                       |
| --clr-btn-inverse-disabled-bg-color             | Inverse button `disabled` background color                                 |
| --clr-btn-inverse-disabled-border-color         | Inverse button `disabled` border color                                     |
| --clr-btn-icon-disabled-color                   | Icon button `disabled` text color                                          |
| --clr-btn-group-focus-outline                   | `:focus` outline color of a checkbox or radio inside a button group button |
| --clr-btn-default-checked-color                 | Checked checkbox default button text color                                 |
| --clr-btn-default-checked-bg-color              | Checked checkbox default button background color                           |
| --clr-btn-default-outline-checked-color         | Checked checkbox default outline button text color                         |
| --clr-btn-default-outline-checked-bg-color      | Checked checkbox default outline button background color                   |
| --clr-btn-primary-checked-color                 | Checked checkbox primary button text color                                 |
| --clr-btn-primary-checked-bg-color              | Checked checkbox primary button background color                           |
| --clr-btn-success-checked-color                 | Checked checkbox success button text color                                 |
| --clr-btn-success-checked-bg-color              | Checked checkbox success button background color                           |
| --clr-btn-success-outline-checked-color         | Checked checkbox success outline button text color                         |
| --clr-btn-success-outline-checked-bg-color      | Checked checkbox success outline button background color                   |
| --clr-btn-danger-checked-color                  | Checked checkbox danger button text color                                  |
| --clr-btn-danger-checked-bg-color               | Checked checkbox danger button background color                            |
| --clr-btn-danger-outline-checked-color          | Checked checkbox danger outline button text color                          |
| --clr-btn-danger-outline-checked-bg-color       | Checked checkbox danger outline button background color                    |
| --clr-btn-warning-checked-color                 | Checked checkbox warning button text color                                 |
| --clr-btn-warning-checked-bg-color              | Checked checkbox warning button background color                           |
| --clr-btn-warning-outline-checked-color         | Checked checkbox warning outline button text color                         |
| --clr-btn-warning-outline-checked-bg-color      | Checked checkbox warning outline button background color                   |
| --clr-btn-link-checked-color                    | Checked checkbox link button text color                                    |
| --clr-btn-link-checked-bg-color                 | Checked checkbox link button background color                              |
| --clr-btn-inverse-checked-color                 | Checked checkbox inverse button text color                                 |
| --clr-btn-inverse-checked-bg-color              | Checked checkbox inverse button background color                           |

## CSS Classes

| Class name          | Description                                            |
| ------------------- | ------------------------------------------------------ |
| btn                 | Button All of the following require this class as well |
| btn-info            | Info button                                            |
| btn-primary         | Primary button                                         |
| btn-success         | Success button                                         |
| btn-warning         | Warning button                                         |
| btn-danger          | Danger button                                          |
| btn-neutral         | Neutral button                                         |
| btn-outline         | Outline button                                         |
| btn-info-outline    | Outline info button                                    |
| btn-success-outline | Outline success button                                 |
| btn-warning-outline | Outline warning button                                 |
| btn-danger-outline  | Outline danger button                                  |
| btn-neutral-outline | Outline neutral button                                 |
| btn-sm              | Small button                                           |
| btn-block           | Block, full-width button                               |
| btn-inverse         | Inverse button                                         |
| btn-icon            | Icon button                                            |
| btn-link            | Link button                                            |
| btn-link-primary    | Link primary button                                    |
| btn-link-success    | Link success button                                    |
| btn-link-warning    | Link warning button                                    |
| btn-link-danger     | Link danger button                                     |

# Button group

## CSS Classes

| Class name            | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| btn-group             | Button group element class.                                                                                |
| btn-group-overflow    | Overflow class for button group element.                                                                   |
| btn-link              | Used with `btn-group` for flat buttons group.                                                              |
| btn-icon-link         | Used with `btn-group` and `btn-link` for flat icon buttons group.                                          |
| clr-icon-title        | Button icon title. Visible inside a menu and hidden outside for a11y so it can be read from screen reader. |
| clr-button-group-menu | Internal class for button group menu content.                                                              |

# Card

## CSS Custom Properties

| CSS Custom Property                   | Description                                            |
| ------------------------------------- | ------------------------------------------------------ |
| --clr-card-bg-color                   | Card background color                                  |
| --clr-card-divider-color              | Card divider color                                     |
| --clr-card-title-color                | Card base title color                                  |
| --clr-card-title-font-weight          | Card thickness title                                   |
| --clr-card-border-width               | Card border width                                      |
| --clr-card-border-radius              | Card border radius                                     |
| --clr-card-border-color               | Card border color                                      |
| --clr-card-box-shadow-color           | Card background shadow color                           |
| --clr-card-clickable-border-color     | DEPRECATED in favor of `clr-card-box-shadow`           |
| --clr-card-clickable-box-shadow-color | DEPRECATED in favor of `clr-card-clickable-box-shadow` |
| clr-card-box-shadow                   | Card background shadow                                 |
| clr-card-clickable-box-shadow         | Clickable cards shadow                                 |
| clr-card-header-title-color           | Header title font color                                |
| clr-card-content-title-color          | Content title font color                               |
| clr-card-text-color                   | Card text font color                                   |

## CSS Classes

| Class                  | Description                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| card                   | A card presents high-level information and can guide the user toward related actions and details                              |
| clickable              | Adding the `.clickable` to a card class makes the entire card clickable, initiating a single action                           |
| card-img               | A `.card-img` can be placed anywhere in the card, or it can occupy the entire card                                            |
| card-header            | The card's heading element                                                                                                    |
| card-block             | The card's main content                                                                                                       |
| card-title             | A card block's heading element                                                                                                |
| card-text              | A card block's text content                                                                                                   |
| list                   | An ordered (`ol`) or unordered (`ul`) list within a card block                                                                |
| list-unstyled          | List with no markers within a card block                                                                                      |
| list-group             | Full-width list with dividers for each item within a card block                                                               |
| list-group-item        | Item within a list group                                                                                                      |
| card-divider           | Divider within card block                                                                                                     |
| card-media-block       | A card media block contains and image and description                                                                         |
| wrap                   | Adding the `wrap` class to a `.card-media-block` element causes the description to be below the image instead of to the right |
| card-media-image       | An `img` within a card media block                                                                                            |
| card-media-description | The description within a card media block. It can contain a title and text                                                    |
| card-media-title       | The title of a card media block description                                                                                   |
| card-media-text        | Text within a card media block description                                                                                    |
| card-footer            | The footer can contain two actions in form of a button or link. For more actions, use a dropdown                              |
| card-link              | A link within a card footer                                                                                                   |

# Checkbox

## CSS Custom Properties

| CSS Custom Property                             | Description                            |
| ----------------------------------------------- | -------------------------------------- |
| --clr-forms-checkbox-label-color                | Font color of checkbox label           |
| --clr-forms-checkbox-background-color           | Background color of checkbox           |
| --clr-forms-checkbox-indeterminate-border-color | Border color of indeterminate checkbox |
| --clr-forms-checkbox-mark-color                 | Color of checkbox mark                 |
| --clr-forms-checkbox-disabled-background-color  | Background color of disabled checkbox  |
| --clr-forms-checkbox-disabled-mark-color        | Color of disabled checkbox mark        |
| --clr-forms-checkbox-border-radius              | Border radius of checkbox              |

## CSS Classes

| Class name           | Description                              |
| -------------------- | ---------------------------------------- |
| clr-checkbox-wrapper | Wrapper class for the checkbox component |

# Combobox

## CSS Custom Properties

| CSS Custom Property                    | Description                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| --clr-combobox-border-color            | Combobox border color                                                  |
| --clr-combobox-border-radius           | Combobox corners radius                                                |
| --clr-combobox-input-background-color  | Combobox input background color                                        |
| --clr-combobox-pill-background-color   | Background color of the selected items pills in a multiselect combobox |
| --clr-combobox-pill-border-color       | Border color of the selected items pills in a multiselect combobox     |
| --clr-combobox-pill-border-radius      | Border radius of the selected items pills in a multiselect combobox    |
| --clr-combobox-pill-font-color         | Text color of the selected items pills in a multiselect combobox       |
| --clr-combobox-filter-highlight        | Combobox filter highlight color                                        |
| --clr-combobox-min-height              | Minimal height of the combobox                                         |
| --clr-combobox-min-width               | Minimal width of the combobox                                          |
| --clr-combobox-multi-min-width         | Minimal width of the multi-select combobox                             |
| --clr-combobox-font-size               | Combobox input font size                                               |
| --clr-combobox-font-weight             | Combobox input font weight                                             |
| --clr-combobox-text-color              | Text color for the combobox input                                      |
| --clr-combobox-trigger-padding-left    | Combobox trigger/caret left padding                                    |
| --clr-combobox-trigger-padding-right   | Combobox trigger/caret right padding                                   |
| --clr-combobox-trigger-font-color      | Combobox trigger/caret font color                                      |
| --clr-combobox-hover-background-color  | Background color when hovered or focused                               |
| --clr-combobox-active-background-color | Background color of the element selected by keyboard                   |
| --clr-combobox-pills                   | Combobox multiselect pills container                                   |
| --clr-combobox-pill-padding            | Combobox multiselect pills padding                                     |
| --clr-combobox-pill-height             | Height of the combobox pill element                                    |
| --clr-combobox-pill-remove-icon-color  | Color of the remove pill icon                                          |
| --clr-combobox-caret-icon-size         | Size of the combobox caret icon icon                                   |

## CSS Classes

| Class name                | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| clr-combobox              | Combobox element class                                |
| clr-combobox-container    | Container class for the combobox                      |
| clr-combobox-input        | Combobox input element                                |
| clr-combobox-options      | List of combobox options                              |
| clr-combobox-option       | An option form the combobox suggestion list           |
| clr-combobox-trigger      | Combobox trigger/caret button                         |
| label-combobox-pill       | Combobox selection pill element                       |
| clr-combobox-remove-btn   | Item remove button for multiselect combobox           |
| clr-combobox-pill-content | Content of the combobox selection pill element        |
| clr-combobox-disabled     | Disabled combobox indicator                           |
| clr-combobox-wrapper      | Internal wrapper class                                |
| clr-combobox-form-control | Internal class used for label positioning calculation |

# Datagrid

## CSS Properties

| Property Name                                        | Description                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| --clr-datagrid-font-color                            | Not used.                                                                               |
| --clr-datagrid-default-border-color                  | Default border color for datagrid detail pane.                                          |
| --clr-datagrid-icon-color                            | Default color for expandable, detail caret icons and action toggle icon.                |
| --clr-datagrid-row-hover-color                       | Background color for datagrid row on hover and active action items.                     |
| --clr-datagrid-row-hover-font-color                  | Font color for active action items. (unused, remove in v18)                             |
| --clr-datagrid-action-toggle-color                   | Datagrid action toggle icon color when active.                                          |
| --clr-datagrid-pagination-btn-color                  | Color for pagination buttons.                                                           |
| --clr-datagrid-pagination-btn-disabled-color         | Color for disabled pagination buttons.                                                  |
| --clr-datagrid-pagination-btn-disabled-opacity       | Opacity for disabled pagination buttons.                                                |
| --clr-datagrid-pagination-input-border-color         | Border color for the pagination input field.                                            |
| --clr-datagrid-pagination-input-border-focus-color   | Border color for the pagination input field when focused.                               |
| --clr-datagrid-popover-bg-color                      | Background color for popovers within the datagrid.                                      |
| --clr-datagrid-popover-border-color                  | Border color for popovers within the datagrid.                                          |
| --clr-datagrid-action-popover-hover-color            | Background color of action items on hover and focus. (unused, remove in v18)            |
| --clr-datagrid-row-selected                          | Font color for selected rows.                                                           |
| --clr-datagrid-row-selected-background-color         | Background color for selected rows.                                                     |
| --clr-datagrid-row-selected-active-background-color  | Background color for active on selected rows.                                           |
| --clr-datagrid-row-selected-hover-background-color   | Background color for hover on selected rows.                                            |
| --clr-datagrid-column-switch-header-font-color       | Font color for column switch header button icons.                                       |
| --clr-datagrid-column-switch-header-font-hover-color | Font color for column switch button icons on hover.                                     |
| --clr-datagrid-detail-caret-icon-open-bg-color       | Background color for opened detail caret button.                                        |
| --clr-datagrid-detail-caret-icon-open-icon-color     | Color of opened detail caret icon.                                                      |
| --clr-datagrid-loading-background                    | Background color for the loading state of the datagrid.                                 |
| --clr-datagrid-column-toggle-border-color            | Border color for column toggle buttons.                                                 |
| --clr-datagrid-column-toggle-fill-color              | Background color for column toggle buttons.                                             |
| --clr-datagrid-column-toggle-text-color              | Text color for column toggle buttons.                                                   |
| --clr-datagrid-column-toggle-border-hover-color      | Border color for column toggle buttons when hovered.                                    |
| --clr-datagrid-column-toggle-fill-hover-color        | Background color for column toggle buttons when hovered.                                |
| --clr-datagrid-column-toggle-text-hover-color        | Text color for column toggle buttons when hovered.                                      |
| --clr-datagrid-column-toggle-border-active-color     | Border color for active column toggle buttons.                                          |
| --clr-datagrid-column-toggle-fill-active-color       | Background color for active column toggle buttons.                                      |
| --clr-datagrid-column-toggle-text-active-color       | Text color for active column toggle buttons.                                            |
| --clr-datagrid-popovers-box-shadow-color             | Not used.                                                                               |
| --clr-datagrid-popover-font-color                    | Font color for popovers.                                                                |
| --clr-datagrid-detail-pane-content-padding           | Padding for detail panel content                                                        |
| --clr-datagrid-detail-pane-close-icon-size           | Width and Height for detail close icon                                                  |
| --clr-datagrid-detail-body-text-color                | Font color for detail body                                                              |
| --clr-datagrid-detail-header-title-color             | Font color for detail header title                                                      |
| --clr-datagrid-detail-pane-bg-color                  | Background color for detail panel                                                       |
| --clr-datagrid-detail-pane-border-color              | Border color for detail panel                                                           |
| --clr-datagrid-placeholder-color                     | Deprecated in v17 and will be removed in v18.Font color for empty datagrid placeholder. |
| --clr-datagrid-placeholder-font-size                 | Deprecated in v17 and will be removed in v18. Font size for empty datagrid placeholder. |
| --clr-datagrid-placeholder-font-weight               | Deprecated in v17 and will be removed in v18. Font weight for placeholder               |
| --clr-datagrid-placeholder-line-height               | Deprecated in v17 and will be removed in v18. Line height for placeholder               |
| --clr-datagrid-placeholder-letter-spacing            | Deprecated in v17 and will be removed in v18. Letter spacing for placeholder            |
| --clr-datagrid-placeholder-background-color          | Background color for placeholder                                                        |
| --clr-datagrid-column-separator-height               | Height for column separator                                                             |
| --clr-datagrid-filter-toggle-size                    | Width and Height for filter toggle button                                               |
| --clr-datagrid-row-active-color                      | Background color for active state on rows                                               |
| --clr-datagrid-fixed-column-size                     | Size for fixed columns inside datagrid                                                  |

## CSS Classes

| Class Name                       | Description                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| action-item                      | Action item within the datagrid's overflow container.                                          |
| clr-col-null                     | Prevents clr-col-\* classes inside clrForm wrapper.                                            |
| datagrid-action-overflow         | Overflow container for action items.                                                           |
| datagrid-cell                    | Single cell within a row of the datagrid.                                                      |
| datagrid-column                  | Main datagrid column element.                                                                  |
| datagrid-column-flex             | Flex container for the column content.                                                         |
| datagrid-column-handle           | Button for resizing the column.                                                                |
| datagrid-column-resize-tracker   | Visual indicator for column resizing.                                                          |
| datagrid-column-separator        | Separator between columns.                                                                     |
| datagrid-container               | Internal class set if there are no datagrid cells inside row detail.                           |
| datagrid-detail-body             | Main datagrid detail body element.                                                             |
| datagrid-detail-header           | Main datagrid detail header element.                                                           |
| datagrid-empty                   | Internal class set on datagrid placeholder if datagrid is empty.                               |
| datagrid-expandable-caret        | Container for the expandable rows caret button and for datagrid column header for carets.      |
| datagrid-expandable-caret-button | Expandable caret button within the expandable cell.                                            |
| datagrid-filter                  | Container for the filter popover.                                                              |
| datagrid-filter-close-wrapper    | Wrapper for the close button in the filter popover.                                            |
| datagrid-filter-open             | Applied to the filter toggle button when open.                                                 |
| datagrid-filter-toggle           | Toggle button for opening/closing the filter popover.                                          |
| datagrid-filtered                | Applied to the filter toggle button when active.                                               |
| datagrid-fixed-column            | Fixed column.                                                                                  |
| datagrid-footer                  | Main datagrid footer element.                                                                  |
| datagrid-footer-description      | Wrapper for datagrid footer content.                                                           |
| datagrid-footer-select           | Select checkbox in the footer.                                                                 |
| datagrid-header                  | Header section of the datagrid.                                                                |
| datagrid-calculate-mode          | Internal class used while datagrid is in calculation mode.                                     |
| datagrid-placeholder             | Container for the datagrid placeholder image and content.                                      |
| datagrid-placeholder-container   | Main datagrid placholder element.                                                              |
| datagrid-placeholder-content     | Wrapper for datagrid placeholder content.                                                      |
| datagrid-placeholder-image       | Image in the placeholder.                                                                      |
| datagrid-row                     | Main datagrid row element.                                                                     |
| datagrid-row-actions             | Container for the row actions.                                                                 |
| datagrid-row-clickable           | Internal class used for calculation mode and on wrapper element for the row in selection mode. |
| datagrid-row-detail              | Main datagrid row detail element.                                                              |
| datagrid-row-flex                | Internal class for adding flex layout to a row.                                                |
| datagrid-row-master              | Internal class used for calculcation mode and wrapper element for row content.                 |
| datagrid-row-scrollable          | Scrollable container for the row.                                                              |
| datagrid-scrolling-cells         | Container for the scrolling cells within the row.                                              |
| datagrid-select                  | Container for the selection checkbox/radio buttons.                                            |
| datagrid-signpost-trigger        | Internal class for datagrid cells if there are signposts in it.                                |
| is-open                          | Applied to the detail caret button when detail row open.                                       |
| is-replaced                      | Applied to the scrollable container when row replaced.                                         |
| pagination                       | Pagination element.                                                                            |
| pagination-current               | Current page input.                                                                            |
| pagination-description           | Pagination description.                                                                        |
| pagination-description-compact   | The compact description when detail view is opened.                                            |
| pagination-first                 | First page button.                                                                             |
| pagination-last                  | Last page button.                                                                              |
| pagination-list                  | Pagination buttons.                                                                            |
| pagination-next                  | Next page button.                                                                              |
| pagination-previous              | Previous page button.                                                                          |
| pagination-size                  | Wrapper for datagrid page size element.                                                        |
| sort-icon                        | Sort icon for sortable columns.                                                                |

# Datepicker

## CSS Custom Properties

| CSS Custom Property                               | Description                                     |
| ------------------------------------------------- | ----------------------------------------------- |
| --clr-calendar-background-color                   | Background color of the calendar                |
| --clr-calendar-border-color                       | Border color of the calendar                    |
| --clr-calendar-btn-color                          | Calendar Buttons color                          |
| --clr-calendar-btn-hover-focus-color              | Calendar Buttons hover and focus color          |
| --clr-calendar-picker-btn-font-size               | Font size for calendar month and year buttons   |
| --clr-calendar-picker-btn-font-weight             | Font weight for calendar month and year buttons |
| --clr-calendar-today-date-cell-color              | Font color for today date                       |
| --clr-calendar-today-date-cell-font-weight        | Font weight for today date                      |
| --clr-calendar-active-cell-background-color       | Active cell background color                    |
| --clr-calendar-active-cell-color                  | Active cell font color                          |
| --clr-calendar-active-focus-cell-background-color | Focused cell background color                   |
| --clr-calendar-container-height                   | Calendar container height                       |
| --clr-calendar-weekday-font-size                  | Calendar week day font size                     |
| --clr-calendar-picker-btn-font-size               | Calendar picker button font size                |
| --clr-calendar-picker-btn-font-weight             | Calendar picker button font weight              |

## CSS Classes

| Class name          | Description                                      |
| ------------------- | ------------------------------------------------ |
| datepicker          | Main date picker element                         |
| calendar-header     | Calendar header                                  |
| calendar-table      | Calendar table                                   |
| calendar-row        | Calendar row                                     |
| calendar-cell       | Calendar cell                                    |
| calendar-btn        | Calendar button                                  |
| calendar-pickers    | Month and year picker buttons wrapper            |
| calendar-switchers  | Month change and today buttons wrapper           |
| daypicker           | Main day picker element                          |
| day                 | Main element for day button                      |
| day-btn             | Day button inside calendar                       |
| weekday             | Weekday table heading                            |
| weekdays            | Weekdays table row wrapper                       |
| month               | Month buttons inside month picker                |
| monthpicker         | Main month picker element                        |
| monthpicker-trigger | Month picker button trigger                      |
| year                | Year buttons inside year picker                  |
| years               | Wrapper for year buttons inside year picker      |
| yearpicker          | Main year picker element                         |
| yearpicker-trigger  | Year picker button trigger                       |
| is-today            | Set on day button which is equal to current date |
| is-excluded         | Set on day button if the date is excluded        |
| is-selected         | Selected day button                              |
| is-disabled         | Disabled day button                              |
| switcher            | Switcher button                                  |
| year-switchers      | Wrapper for switcher buttons inside year picker  |

# Dropdown

## CSS Custom Properties

| CSS Custom Property                          | Description                                                    |
| -------------------------------------------- | -------------------------------------------------------------- |
| --clr-dropdown-active-text-color             | The text color of the active dropdown item.                    |
| --clr-dropdown-bg-color                      | The background color of the dropdown menu.                     |
| --clr-dropdown-border-color                  | The border color of the dropdown.                              |
| --clr-dropdown-divider-color                 | The color of the divider between dropdown items.               |
| --clr-dropdown-divider-border-width          | Width of the dropdown items separator.                         |
| --clr-dropdown-child-border-color            | The border color of child dropdown items.                      |
| --clr-dropdown-bg-hover-color                | Deprecated in favor of `--clr-dropdown-item-hover-bg-color`.   |
| --clr-dropdown-selection-color               | eprecated in favor of `--clr-dropdown-item-selected-bg-color`. |
| --clr-dropdown-text-color                    | The text color of the dropdown.                                |
| --clr-dropdown-header-color                  | The color of the dropdown menu header.                         |
| --clr-dropdown-header-font-weight            | Dropdown menu header font weight                               |
| --clr-dropdown-item-font-weight              | Dropdown menu item font weight                                 |
| --clr-dropdown-item-color                    | Text color of the dropdown item.                               |
| --clr-dropdown-item-bg-color                 | Background color of the dropdown item.                         |
| --clr-dropdown-item-hover-color              | Text `:hover` color of the dropdown item.                      |
| --clr-dropdown-item-hover-bg-color           | Background `:hover` color of the dropdown item.                |
| --clr-dropdown-item-active-color             | Text `:active` color of the dropdown item.                     |
| --clr-dropdown-item-active-bg-color          | Background `:active` color of the dropdown item.               |
| --clr-dropdown-item-selected-color           | Text `selected` color of the dropdown item.                    |
| --clr-dropdown-item-selected-bg-color        | Background `selected` color of the dropdown item.              |
| --clr-dropdown-item-selected-hover-bg-color  | Background `:hover` color of selected dropdown item.           |
| --clr-dropdown-item-selected-active-bg-color | Background `:active` color of selected dropdown item.          |
| --clr-dropdown-item-disabled-color           | Text color of `disabled` dropdown item.                        |
| --clr-dropdown-item-disabled-bg-color        | Background color of `disabled` dropdown item.                  |

## CSS Classes

| Class            | Description                                       |
| ---------------- | ------------------------------------------------- |
| dropdown         | The overall dropdown component.                   |
| dropdown-toggle  | The toggle element inside the dropdown component. |
| dropdown-menu    | The dropdown menu container.                      |
| dropdown-header  | The header element inside the dropdown menu.      |
| dropdown-item    | The individual items in the dropdown menu.        |
| expandable       | The expandable dropdown item.                     |
| dropdown-divider | The divider element in the dropdown menu.         |
| disabled         | Applies the disabled state to the dropdown item.  |

# File Input

## CSS Classes

| Class name                        | Description               |
| --------------------------------- | ------------------------- |
| clr-file-input-wrapper            | Wrapper for input element |
| clr-file-input                    | Native file input element |
| clr-file-input-browse-button      | Browse button             |
| clr-file-input-browse-button-text | Browse button text span   |
| clr-file-input-clear-button       | Clear files button        |

# Forms

## CSS Custom Properties

| CSS Custom Property                                          | Description                                           |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| --clr-form-disabled-background-color                         | Default background color for disabled forms           |
| --clr-forms-label-color                                      | Default font color of form labels                     |
| --clr-forms-text-color                                       | Default font color for input text                     |
| --clr-forms-invalid-color                                    | Invalid color for forms                               |
| --clr-forms-valid-color                                      | Valid color for forms                                 |
| --clr-forms-valid-text-color                                 | Font color for subtext in success control containers  |
| --clr-forms-subtext-color                                    | Default font color for subtext in control containers  |
| --clr-forms-placeholder-color                                | Font color for placeholders                           |
| --clr-forms-border-color                                     | Border color for form controls                        |
| --clr-forms-focused-color                                    | Focus color for forms                                 |
| --clr-forms-subtext-disabled-color                           | Font color for disabled subtext in control containers |
| --clr-forms-border-disabled-color                            | Border color for disabled form controls               |
| --clr-forms-text-disabled-color                              | Font color for disabled input text                    |
| --clr-forms-label-disabled-color                             | Font color for labels in disabled form controls       |
| --clr-forms-label-font-weight                                | Font weight for form labels                           |
| --clr-forms-textarea-background-color                        | Background color of textarea                          |
| --clr-forms-select-hover-background                          | Background and border color of select on hover        |
| --clr-forms-select-caret-hover-color                         | Color of select caret on hover                        |
| --clr-forms-select-caret-color                               | Color of select caret                                 |
| --clr-forms-select-option-color                              | Font color of select options                          |
| --clr-forms-select-multiple-background-color                 | Background color of multiple select                   |
| --clr-forms-select-multiple-border-color                     | Border color of multiple select                       |
| --clr-forms-select-multiple-option-color                     | Font color of options in multiple select              |
| --clr-forms-select-multiple-selected-option-background-color | Background color of selected multiple select option   |
| --clr-forms-checkbox-label-color                             | Font color of checkbox label                          |
| --clr-forms-checkbox-background-color                        | Background color of checkbox                          |
| --clr-forms-checkbox-indeterminate-border-color              | Border color of indeterminate checkbox                |
| --clr-forms-checkbox-mark-color                              | Color of checkbox mark                                |
| --clr-forms-checkbox-disabled-background-color               | Background color of disabled checkbox                 |
| --clr-forms-checkbox-disabled-mark-color                     | Color of disabled checkbox mark                       |
| --clr-forms-checkbox-border-radius                           | Border radius of checkbox                             |
| --clr-forms-radio-label-color                                | Font color of radio label                             |
| --clr-forms-radio-label-disabled-color                       | Font color of disabled radio label                    |
| --clr-forms-radio-disabled-background-color                  | Background color of disabled radio                    |
| --clr-forms-radio-disabled-mark-color                        | Color of disabled radio mark                          |
| --clr-forms-radio-selected-shadow                            | Shadow of selected radio                              |
| --clr-forms-radio-disabled-shadow                            | Shadow of disabled radio                              |
| --clr-forms-radio-focused-shadow                             | Shadow of focused radio                               |
| --clr-forms-range-progress-fill-color                        | Fill color of range progress                          |
| --clr-forms-range-track-color                                | Fill color of range track                             |
| --clr-forms-datalist-caret-color                             | Color of datalist caret                               |
| --clr-forms-datalist-caret-disabled-color                    | Color of disabled datalist caret                      |
| --clr-forms-datalist-caret-icon-size                         | Size of datalist caret                                |
| --clr-forms-input-group-icon-action-size                     | Size of action icon                                   |
| --clr-forms-input-group-icon-disabled-color                  | Color for action icons in disabled input              |

## CSS Classes

| Class name          | Description                                           |
| ------------------- | ----------------------------------------------------- |
| clr-form            | Main form element.                                    |
| clr-form-group      | Form group identifier.                                |
| clr-form-full-width | Make all controls to take 100% width of the container |
| clr-required-mark   | Add required mark on the right side.                  |

# Grid layout

## CSS Custom Properties

| CSS Custom Property          | Description                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| --clr-grid-gutter-width      | Grid gutter width                                                                      |
| --clr-grid-container-padding | Grid container padding size. ( Default value is half of --clr-grid-gutter-width)       |
| --clr-grid-column-padding    | Grid column padding size. ( Default value is half of --clr-grid-gutter-width)          |
| --clr-grid-row-margin        | Grid row margin size. ( Default value is half of --clr-grid-gutter-width and negative) |

## CSS Classes

| Class name                              | Description                                                                                                                                          |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| clr-container                           | Styles a wrapper for row and columns                                                                                                                 |
| clr-row                                 | Styles a flex row of columns                                                                                                                         |
| clr-justify-content-#{POSITION}         | Sets justify-content property to #{POSITION}, POSITION is one of 'start', 'center', 'end'                                                            |
| clr-justify-content-between             | Sets justify-content property to 'space-between'                                                                                                     |
| clr-justify-content-around              | Sets justify-content property to 'space-around'                                                                                                      |
| clr-align-items-start                   | Horizontally aligns items in a row towards the beginning                                                                                             |
| clr-align-items-center                  | Centers items horizontally in a row                                                                                                                  |
| clr-align-items-end                     | Aligns items in a row to the right end                                                                                                               |
| clr-align-items-baseline                | Aligns items in a row based on their baselines                                                                                                       |
| clr-align-items-stretch                 | Expands and evenly distributes items in a row                                                                                                        |
| clr-align-content-#{POSITION}           | Aligns content of multiline flex rows to #{POSITION}, POSITION is any of 'start', 'center', 'end'                                                    |
| clr-align-content-between               | Evenly distributes the space between the flex columns in a multiline container, leaving no space at the beginning or end of the container            |
| clr-align-content-around                | Evenly distributes the space around the flex columns in a multiline container, creating equal spacing between and around the lines                   |
| clr-align-content-stretch               | Stretches the flex columns in a multiline flex container, causing them to expand vertically and fill the available space                             |
| clr-break-row                           | Breaks the columns in a row with a new line                                                                                                          |
| clr-clearfix                            | Clears floated content within a container                                                                                                            |
| clr-no-gutters                          | Removes gaps between column content in a row                                                                                                         |
| clr-col                                 | Styles a column within a row                                                                                                                         |
| clr-col-#{SIZE}                         | Styles a column that spans to #{SIZE}/12 of the row's width, SIZE is an integer in the [1,12] interval                                               |
| clr-col-#{BREAKPOINT}                   | Styles a column within a screen with width >= than #{BREAKPOINT}, BREAKPOINT is anything among 'sm', 'md', 'lg', 'xl'                                |
| clr-col-#{BREAKPOINT}-#{SIZE}           | Styles a column that spans to SIZE/12 of the row's width for a row with width >= BREAKPOINT                                                          |
| clr-col-auto                            | Styles a column within a row to have auto width                                                                                                      |
| clr-col-#{BREAKPOINT}-auto              | Styles a column within a row to have auto width for a small, medium, large and extra large screen                                                    |
| clr-offset-#{OFFSET_SIZE}               | Sets left offset to #{OFFSET_SIZE}/12 of the row's width, OFFSET_SIZE is an integer in the [1,11] interval                                           |
| clr-offset-#{BREAKPOINT}-#{OFFSET_SIZE} | Sets the left offset of the column to #{OFFSET_SIZE}/12 for a screen larger than #{BREAKPOINT}                                                       |
| clr-order-first                         | Sets the order of the column as first                                                                                                                |
| clr-order-last                          | Sets the order of the column as last                                                                                                                 |
| clr-order-#{ORDER}                      | Sets the order of the column, ORDER is an integer in the interval [1,12]                                                                             |
| clr-order-#{BREAKPOINT}-#{ORDER}        | Sets the order of the column                                                                                                                         |
| clr-align-self-auto                     | Sets align-self property of a column to #{POSITION}, POSITION is one of 'auto', 'start', 'end', 'center', 'baseline', 'stretch'                      |
| clr-invisible                           | Sets the visibility of element to hidden                                                                                                             |
| clr-display-#{DISPLAY_VALUE}            | Sets the display property of an element to #{DISPLAY_VALUE}, DISPLAY_VALUE is one of 'block', 'inline-block', 'inline'                               |
| clr-align-#{POSITION}                   | Sets vertical-align to #{POSITION}, POSITION is one of 'baseline', 'top', 'middle', 'bottom', 'text-bottom', 'text-top'                              |
| clr-flex-#{DIRECTION}                   | Sets the flex-direction to #{DIRECTION} ('row', 'column', 'row-reverse' or 'column-reverse')                                                         |
| clr-flex-#{FLEX_WRAP_VALUE}             | Sets the flex-wrap to #{FLEX_WRAP_VALUE} ('wrap', 'nowrap', 'wrap-reverse')                                                                          |
| clr-flex-fill                           | Makes a flex item expand to fill any remaining space within a flex container, distributing the available space evenly among the flex items           |
| clr-#{FLEXIBILITY}-#{SIZE}              | Sets the flexibility (flex-grow or flex-shrink) to #{SIZE} (0 or 1)                                                                                  |
| clr-float-#{BREAKPOINT}-#{DIRECTION}    | Sets the float property to #{DIRECTION}('left', 'right' or 'none') for screens with width bigger than the #{BREAKPOINT} value for 'sm', 'md' or 'lg' |

## Screen width breakpoints

| Breakpoint | Description |
| ---------- | ----------- |
| sm         | >= 576px    |
| md         | >= 768px    |
| lg         | >= 992px    |
| xl         | >= 1200px   |

# Headers

## CSS Custom Properties

| CSS Custom Property                        | Description                                            |
| ------------------------------------------ | ------------------------------------------------------ |
| --clr-header-height                        | Header overall height                                  |
| --clr-header-bg-color                      | Header background color                                |
| --clr-header-divider-color                 | Color of the header divider                            |
| --clr-header-divider-opacity               | Opacity of the header divider                          |
| --clr-header-nav-opacity                   | Header nav item opacity                                |
| --clr-header-nav-hover-opacity             | Header nav item opacity on hover                       |
| --clr-header-2-bg-color                    | Second version of header background color              |
| --clr-header-3-bg-color                    | Third version of header background color               |
| --clr-header-4-bg-color                    | Fourth version of header background color              |
| --clr-header-5-bg-color                    | Fifth version of header background color               |
| --clr-header-6-bg-color                    | Sixth version of header background color               |
| --clr-header-7-bg-color                    | Seventh version of header background color             |
| --clr-header-8-bg-color                    | Eighth version of header background color              |
| --clr-header-font-color                    | Header text color                                      |
| --clr-header-font-color-hover              | Header hovered item color                              |
| --clr-header-title-color                   | Header branding title text color                       |
| --clr-header-title-font-weight             | Header branding title text fort weight                 |
| --clr-header-title-font-family             | Header branding title font family                      |
| --clr-header-nav-link-line-height          | Header navigation buttons line-height                  |
| --clr-header-nav-link-font-size            | Header navigation buttons font size                    |
| --clr-header-search-icon-size              | Header search icon size                                |
| --clr-header-search-margin-left            | Header search field left margin                        |
| --clr-header-search-margin-right           | Header search field right margin                       |
| --clr-header-search-gap                    | Gap between the subelements of the header search field |
| --clr-header-search-input-font-color       | Header search field text color                         |
| --clr-header-search-border-active          | Border of active/focused search field                  |
| --clr-header-search-border-hover           | Border of hovered search field                         |
| --clr-header-search-placeholder-text-color | Text color of the header search placeholder            |

## CSS Classes

| Class name               | Description                          |
| ------------------------ | ------------------------------------ |
| clr-header               | Application header element           |
| clr-header > search      | Header search field                  |
| header-hamburger-trigger | Hamburger icon for responsive header |
| header-actions           | Responsive header actions            |

# Input

## CSS Custom properties

| Class name                       | Description    |
| -------------------------------- | -------------- |
| --clr-forms-input-padding        | Input padding  |
| --clr-forms-input-wrapper-height | Wrapper height |

## CSS Classes

| Class name                  | Description                                                   |
| --------------------------- | ------------------------------------------------------------- |
| clr-input-wrapper           | Wrapper for input element                                     |
| clr-input                   | Main input element                                            |
| clr-input-group             | Wrapper for multiple form elements                            |
| clr-input-group-addon       | Input group addon (icon,text)                                 |
| clr-input-group-icon-action | Input group action. Used on button to add action on the input |

# Label

## CSS Properties

| CSS Property Name                | Description                            |
| -------------------------------- | -------------------------------------- |
| --clr-label-font-color-light     | Font color for light labels            |
| --clr-label-font-color-dark      | Font color for dark labels             |
| --clr-label-default-border-color | Default border color for labels        |
| --clr-label-bg-hover-color       | Background color on hover for labels   |
| --clr-label-gray-bg-color        | Background color for gray labels       |
| --clr-label-gray-color           | Font color for gray labels             |
| --clr-label-purple-bg-color      | Background color for purple labels     |
| --clr-label-purple-color         | Font color for purple labels           |
| --clr-label-blue-bg-color        | Background color for blue labels       |
| --clr-label-blue-color           | Font color for blue labels             |
| --clr-label-orange-bg-color      | Background color for orange labels     |
| --clr-label-orange-color         | Font color for orange labels           |
| --clr-label-light-blue-bg-color  | Background color for light blue labels |
| --clr-label-light-blue-color     | Font color for light blue labels       |
| --clr-label-info-bg-color        | Background color for info labels       |
| --clr-label-info-font-color      | Font color for info labels             |
| --clr-label-info-border-color    | Border color for info labels           |
| --clr-label-success-bg-color     | Background color for success labels    |
| --clr-label-success-font-color   | Font color for success labels          |
| --clr-label-success-border-color | Border color for success labels        |
| --clr-label-warning-bg-color     | Background color for warning labels    |
| --clr-label-warning-font-color   | Font color for warning labels          |
| --clr-label-warning-border-color | Border color for warning labels        |
| --clr-label-danger-bg-color      | Background color for danger labels     |
| --clr-label-danger-font-color    | Font color for danger labels           |
| --clr-label-danger-border-color  | Border color for danger labels         |

## Classes

| Class Name    | Description                     |
| ------------- | ------------------------------- |
| label         | Default label class             |
| label-<color> | Label class with specific color |
| clickable     | Clickable label class           |
| text          | Inner text class for the label  |

# Layout

## CSS Custom Properties

| CSS Custom Property         | Description                         |
| --------------------------- | ----------------------------------- |
| --clr-global-app-background | Global application background color |

## CSS Classes

| Class name        | Description                        |
| ----------------- | ---------------------------------- |
| main-container    | Main application container element |
| alert-app-level   | Application level alert slot       |
| header            | Application header                 |
| subnav, sub-nav   | Secondary top navigation container |
| content-container | Main content and nav container     |
| clr-vertical-nav  | Left navigation container          |
| content-area      | Pag content container              |

# Lists

## CSS Classes

| Class name    | Description                                           |
| ------------- | ----------------------------------------------------- |
| list          | Sets default sizes to list                            |
| compact       | Makes a list to use less space, used with .list       |
| list-unstyled | Removes default bullet styling of list items          |
| list-spacer   | Sets space before the list contents                   |
| list-group    | Removes bullets and reduces spacing used inside .card |

# Login

## CSS Custom Properties

| CSS Custom Property                  | Description                              |
| ------------------------------------ | ---------------------------------------- |
| --clr-login-title-color              | Color of the title                       |
| --clr-login-background-color         | Background color                         |
| --clr-login-background               | Background image                         |
| --clr-login-error-background-color   | Error message background color           |
| --clr-login-error-border-radius      | Error message border radius              |
| --clr-login-panel-line-color         | Color of the divider line                |
| --clr-login-panel-line-opacity       | Opacity to the divider line              |
| --clr-login-hint-color               | Font color of the hint                   |
| --clr-login-footer-gap               | Gap size for the footer                  |
| --clr-login-copyright-color          | Font color for the copyright thumbnail   |
| --clr-login-welcome-color            | Font color for welcome                   |
| --clr-login-error-icon-color         | Color for error icon                     |
| --clr-login-logo-color               | Color of VMware logo                     |
| --clr-login-trademark-color          | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-weight    | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-family    | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-font-size      | DEPRECATED in v17. to be removed in v18. |
| --clr-login-trademark-letter-spacing | DEPRECATED in v17. to be removed in v18. |

## CSS Classes

| Class         | Description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| login         | The login form is a predefined form for applications that require authentication |
| login-body    | Wrapper for login content                                                        |
| login-header  | Wrapper for login header elements                                                |
| login-footer  | Wrapper for login footer elements                                                |
| logo          | VMware logo                                                                      |
| actions       | Wrapper for header actions                                                       |
| copyright     | Copyright label                                                                  |
| login-wrapper | Wrapper element                                                                  |
| title         | The title `section` of the login form                                            |
| welcome       | The heading of the login form                                                    |
| hint          | Hint/helper text within the title of the login form                              |
| login-group   | Contains the login form controls                                                 |
| error         | Error messageThe error message is hidden by default                              |
| active        | Adding the `active` class to the `.error` element makes the error message appear |
| trademark     | DEPRECATED in v17. To be removed in v18.                                         |
| subtitle      | DEPRECATED in v17. To be removed in v18.                                         |

# Modal

## CSS Custom Properties

| CSS Custom Property              | Description                              |
| -------------------------------- | ---------------------------------------- |
| --clr-modal-close-color          | Fill color of modal close icon           |
| --clr-modal-bg-color             | Background color of modal                |
| --clr-modal-backdrop-color       | Color of modal backdrop                  |
| --clr-modal-border-radius        | Border radius of a modal                 |
| --clr-modal-title-color          | Font color of modal title                |
| --clr-modal-title-font-family    | Font family of modal title               |
| --clr-modal-title-font-weight    | Font weight of modal title               |
| --clr-modal-title-font-size      | Font size for modal title                |
| --clr-modal-title-line-height    | Line height for modal title              |
| --clr-modal-title-letter-spacing | Letter spacing for modal title           |
| --clr-modal-sm-width             | Width of the modal on small layout       |
| --clr-modal-md-width             | Width of the modal on medium layout      |
| --clr-modal-lg-width             | Width of the modal on large layout       |
| --clr-modal-xl-width             | Width of the modal on extra large layout |
| --clr-modal-content-box-shadow   | Shadow of modal content                  |

## CSS Classes

| Class name          | Description                                        |
| ------------------- | -------------------------------------------------- |
| modal               | Modal element class (positioning focused)          |
| modal-dialog        | Modal dialog box class                             |
| modal-sm            | Sets `modal-dialog` to use small width             |
| modal-lg            | Sets `modal-dialog` to use large width             |
| modal-xl            | Sets `modal-dialog` to use extra-large width       |
| modal-content       | Content class \*should be used in `modal-dialog`   |
| modal-header        | Header class                                       |
| modal-title         | Title class \*should be used inside `modal-header` |
| modal-title-wrapper | Title wrapper                                      |
| modal-body-wrapper  | Body wrapper                                       |
| modal-footer        | Footer wrapper                                     |
| modal-backdrop      | Backdrop class                                     |
| modal-nav           | Modal nav class used only in wizards               |

# Password

## CSS Custom Properties

| CSS Custom Property                          | Description                          |
| -------------------------------------------- | ------------------------------------ |
| --clr-forms-password-eye-icon-color          | Color of show/hide eye icon          |
| --clr-forms-password-disabled-eye-icon-color | Color of disabled show/hide eye icon |

# Progress bar

## CSS Custom Properties

| CSS Custom Property          | Description      |
| ---------------------------- | ---------------- |
| --clr-progress-default-color | Default color    |
| --clr-progress-alt-color-1   | Success color    |
| --clr-progress-alt-color-2   | Danger color     |
| --clr-progress-alt-color-3   | Warning color    |
| --clr-progress-bg-color      | Background color |
| --clr-progress-label-color   | Label color      |

## CSS Classes

| Class name      | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| progress        | Main progress bar element                                                |
| progress-static | Main static progress bar element                                         |
| progress-fade   | Fade out animation for progress bar                                      |
| progress-meter  | The bar element in a static progress bar                                 |
| progress-group  | Layout element for multiple progress bars                                |
| progress-block  | Layout element for progress bar groups                                   |
| flash           | Sets the bar color to success once value of 100 is reached               |
| flash-danger    | Sets the bar color to danger once value of 100 is reached                |
| labeled         | Used with `progress` to show display value next to the bar               |
| loop            | Loop animation for non-static progress bars                              |
| danger          | Combined with `progress loop` or `progress-static` to set progress color |
| warning         | Combined with `progress loop` or `progress-static` to set progress color |
| success         | Combined with `progress loop` or `progress-static` to set progress color |
| compact         | Used with `progress` or `progress-static` to minify the bar              |

# Radio

## CSS Custom Properties

| CSS Custom Properties                       | Description                                              |
| ------------------------------------------- | -------------------------------------------------------- |
| --clr-forms-radio-label-color               | Color of the label for radio buttons                     |
| --clr-forms-radio-disabled-background-color | Background color of disabled radio buttons               |
| --clr-forms-radio-disabled-mark-color       | Color of the mark (indicator) for disabled radio buttons |
| --clr-forms-radio-label-disabled-color      | Font color of disabled radio label                       |
| --clr-forms-radio-selected-shadow           | Shadow of selected radio                                 |
| --clr-forms-radio-disabled-shadow           | Shadow of disabled radio                                 |
| --clr-forms-radio-focused-shadow            | Shadow of focused radio                                  |

## CSS Classes

| Class             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| clr-radio-wrapper | The wrapper container for the radio button and its label |
| clr-control-label | The label element of the radio button                    |

# Range

## CSS Custom Properties

| CSS Custom Property                            | Description                                   |
| ---------------------------------------------- | --------------------------------------------- |
| --clr-forms-range-progress-fill-color          | The color of the range fill progress.         |
| --clr-forms-range-track-color                  | The background color of the range track.      |
| --clr-forms-range-track-border-color           | The border color of the range track.          |
| --clr-forms-range-thumb-height                 | The height and width of the range thumb.      |
| --clr-forms-range-track-height                 | The height of the range track.                |
| --clr-forms-range-track-border-radius          | The border radius of the range track.         |
| --clr-forms-range-progress-fill-color-disabled | The color of disabled range fill progress.    |
| --clr-forms-range-track-color-disabled         | The background color of disabled range track. |
| --clr-forms-range-track-border-color-disabled  | The border color of disabled range.           |

## CSS Classes

| Class Name        | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| clr-range-wrapper | Represents the wrapper element for the range input.         |
| fill-input        | Represents the progress bar element inside the range input. |
| clr-range         | Represents the range input element.                         |

# Select

## CSS Custom Properties

| CSS Custom Property                          | Description                                             |
| -------------------------------------------- | ------------------------------------------------------- |
| --clr-forms-select-option-color              | Text color used in the options of a single select       |
| --clr-forms-select-option-background-color   | Background color used in the options of a single select |
| --clr-forms-select-multiple-background-color | Background color used in a multiple select              |
| --clr-forms-select-multiple-border-color     | Border color used by multiple select options            |
| --clr-forms-select-multiple-option-color     | Text color used by the multiple select options          |
| --clr-forms-select-hover-background          | Background color used when select is hovered            |
| --clr-forms-select-hover-border-color        | Border color used when select is hovered                |
| --clr-forms-select-disabled-border-color     | Border color used when select is disabled               |
| --clr-forms-select-disabled-color            | Text color used when select option is disabled          |

## CSS Classes

| Class name              | Description                                    |
| ----------------------- | ---------------------------------------------- |
| clr-select              | Select element class                           |
| clr-multiselect-wrapper | Internal class that wraps the single selects   |
| clr-select-wrapper      | Internal class that wraps the multiple selects |

# Signpost

## CSS Custom Properties

| CSS Custom Property                     | Description                                                   |
| --------------------------------------- | ------------------------------------------------------------- |
| --clr-signpost-content-color            | Signpost content color.                                       |
| --clr-signpost-content-bg-color         | Signpost content background color.                            |
| --clr-signpost-content-border-color     | Signpost content border color.                                |
| --clr-signpost-content-border-color     | Signpost content border color.                                |
| --clr-signpost-action-color             | Signpost action color.                                        |
| --clr-signpost-action-hover-color       | Signpost action hover color.                                  |
| --clr-signpost-action-active-color      | Signpost action active color.                                 |
| --clr-signpost-pointer-border           | Signpost pointer border.                                      |
| --clr-signpost-pointer-invisible-border | Signpost pointer invisible border.                            |
| --clr-signpost-pointer-psuedo-border    | Deprecated in favor of `--clr-signpost-pointer-pseudo-border` |
| --clr-signpost-pointer-pseudo-border    | Signpost pointer pseudo border.                               |

## CSS Classes

| Class name              | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| signpost                | Signpost element class.                                       |
| signpost-content        | Content class for the signpost.                               |
| signpost-content-header | Content header class for the signpost.                        |
| signpost-content-body   | Content body class for the signpost.                          |
| signpost-trigger        | Internal class for opening the signpost.                      |
| signpost-wrap           | Internal wrapper class.                                       |
| signpost-action         | Internal action class. Used with content close action button. |

# Spinner

## CSS Custom Properties

| CSS Custom Property                 | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| --clr-spinner-default-size          | Size (diameter) of large spinner                 |
| --clr-spinner-medium-size           | Size of medium spinner                           |
| --clr-spinner-small-size            | Size of small spinner                            |
| --clr-spinner-margin-right          | Spacing between spinner and text next to it      |
| --clr-spinner-default-stroke-width  | Width (thickness) of stroke of large spinner     |
| --clr-spinner-medium-stroke-width   | Width of medium spinner                          |
| --clr-spinner-small-stroke-width    | Width of small spinner                           |
| --clr-spinner-fill-bg-color         | Spinner background color                         |
| --clr-spinner-fill-inverse-bg-color | Spinner background color for inversed background |
| --clr-spinner-fill-color            | Color of rotating part of spinner                |
| --clr-spinner-fill-inverse-color    | Spinner color for inversed background            |
| --clr-spinner-border-radius         | Spinner border radius                            |

## CSS Classes

| Class Name      | Description                           |
| --------------- | ------------------------------------- |
| spinner         | Default class for all spinners.       |
| spinner-inline  | Display the spinner inline.           |
| spinner-inverse | Display the spinner in inverse mode.  |
| spinner-sm      | Display the spinner with small size.  |
| spinner-md      | Display the spinner with medium size. |
| spinner-check   | Display a checkmark icon spinner.     |

# Stack view

## CSS Custom Properties

| CSS Custom Property                                                    | Description                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| --clr-stack-view-border-width                                          | Stack view border width                                         |
| --clr-stack-view-border-radius                                         | Border radius of stack view                                     |
| --clr-stack-view-border-color                                          | Border color of stack view                                      |
| --clr-stack-block-changed-border-top-color                             | Changed stack block border top color                            |
| --clr-stack-view-title-color                                           | Stack view title color                                          |
| --clr-stack-view-row-color                                             | Text and caret color of not expandable stack view row           |
| --clr-stack-view-row-bg-color                                          | Background color of not expandable stack view row               |
| --clr-stack-view-expandable-row-color                                  | Text and caret color of expandable stack view row               |
| --clr-stack-view-expandable-row-bg-color                               | Background color of expandable stack view row                   |
| --clr-stack-view-expandable-row-hover                                  | Text and caret `:hover` color of expandable stack view row      |
| --clr-stack-view-expandable-row-bg-hover                               | Background `:hover` color of expandable stack view row          |
| --clr-stack-view-expandable-row-active                                 | Text and caret` :active` color of expandable stack view row     |
| --clr-stack-view-expandable-row-bg-active                              | Background `:active` color of expandable stack view row         |
| --clr-stack-view-expanded-row-color                                    | Text and caret color of expanded stack view row                 |
| --clr-stack-view-expanded-row-bg-color                                 | Background color of expanded stack view row                     |
| --clr-stack-view-expanded-hover-row-bg-color                           | Background color of hover on expanded stack view row            |
| --clr-stack-view-expanded-active-row-bg-color                          | Background color of active on expanded stack view row           |
| --clr-stack-view-row-font-size                                         | Font size for stack view row                                    |
| --clr-stack-view-row-font-weight                                       | Font weight for stack view row                                  |
| --clr-stack-view-row-line-height                                       | Line height for stack view row                                  |
| --clr-stack-view-row-letter-spacing                                    | Letter spacing for stack view row                               |
| --clr-stack-view-stack-block-border-bottom                             | Deprecated. Use `--clr-stack-view-border-color` instead         |
| --clr-stack-view-stack-children-stack-block-border-bottom-color        | Deprecated. Use `--clr-stack-view-border-color` instead         |
| --clr-stack-view-stack-block-label-font-size                           | Deprecated in favor of `--clr-stack-view-row-font-size`         |
| --clr-stack-view-stack-block-label-font-weight                         | Deprecated in favor of `--clr-stack-view-row-font-weight`       |
| --clr-stack-view-stack-block-label-line-height                         | Deprecated in favor of `--clr-stack-view-row-line-height`       |
| --clr-stack-view-stack-block-label-letter-spacing                      | Deprecated in favor of `--clr-stack-view-row-letter-spacing`    |
| --clr-stack-view-color                                                 | Deprecated in favor of `--clr-stack-view-row-color`             |
| --clr-stack-view-bg-color                                              | Deprecated in favor of `--clr-stack-view-row-bg-color`          |
| --clr-stack-view-stack-block-label-text-color                          | DELETED. Replaced with `--clr-stack-view-row-color`             |
| --clr-stack-view-stack-block-label-and-content-bg-color                | DELETED. Replaced with `--clr-stack-view-row-bg-color`          |
| --clr-stack-view-stack-children-stack-block-label-and-content-bg-color | Deprecated in favor of `--clr-stack-view-row-bg-color`          |
| --clr-stack-view-stack-block-caret-color                               | Deprecated in favor of `--clr-stack-view-expandable-row-color`  |
| --clr-stack-view-stack-block-expanded-bg-color                         | Deprecated in favor of `--clr-stack-view-expanded-row-bg-color` |
| --clr-stack-view-stack-block-expandable-hover                          | Deprecated in favor of `--clr-stack-view-expandable-row-hover`  |
| --clr-stack-view-stack-block-content-text-color                        | DELETED. Replaced with `--clr-stack-view-row-color`             |
| --clr-stack-view-stack-block-expanded-text-color                       | Deprecated in favor of `--clr-stack-view-expanded-row-color`    |
| --clr-stack-view-font-size                                             | DELETED. Replaced with `--clr-stack-view-row-font-size`         |
| --clr-stack-view-font-weight                                           | DELETED. Replaced with `--clr-stack-view-row-font-weight`       |
| --clr-stack-view-line-height                                           | DELETED. Replaced with `--clr-stack-view-row-line-height`       |
| --clr-stack-view-letter-spacing                                        | DELETED. Replaced with `--clr-stack-view-row-letter-spacing`    |

## CSS Classes

| Class name             | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| stack-view             | Main stack view element                              |
| stack-header           | Main stack header element                            |
| stack-title            | Stack view header title                              |
| stack-actions          | Wrapper for stack view header actions                |
| stack-action           | Main header stack action class                       |
| stack-block            | Main stack block element                             |
| stack-block-changed    | Marks a stack block as changed                       |
| stack-block-label      | Wrapper for stack block label and content            |
| stack-view-key         | Stack block view key element                         |
| stack-block-content    | Stack block content element                          |
| stack-block-caret      | Stack block caret icon element                       |
| stack-children         | Wrapper for stack block child blocks                 |
| stack-block-expandable | Used with `stack-block` to add expandable caret icon |
| stack-block-expanded   | Stack block caret icon in expanded state             |

# Table

## CSS Custom Properties

| CSS Custom Property                    | Description                                               |
| -------------------------------------- | --------------------------------------------------------- |
| --clr-table-bgcolor                    | Background color of a table                               |
| --clr-table-margin                     | Margin of a table                                         |
| --clr-thead-bgcolor                    | Background color of table header                          |
| --clr-table-header-border-bottom-color | Not used                                                  |
| --clr-table-footer-border-top-color    | Not used in tables. Used for datagrid footer border color |
| --clr-table-border-color               | Border color of a table                                   |
| --clr-tablerow-bordercolor             | Border color for table rows                               |
| --clr-table-border-radius              | Border radius for а table                                 |
| --clr-table-borderwidth                | Border width for а table                                  |
| --clr-table-cornercellradius           | Border radius for corner cells                            |
| --clr-table-font-color                 | Font color for table rows                                 |
| --clr-thead-color                      | Font color for table header                               |

## CSS Classes

All other table classes like `table, thead, tbody, th, td` are not specific to Clarity so they are not included.

| Class name     | Description              |
| -------------- | ------------------------ |
| table-vertical | Vertical table           |
| table-noborder | Table with no borders    |
| table-compact  | Table with less paddings |

# Tabs

## CSS Custom Properties

| CSS Custom Property                       | Description                                      |
| ----------------------------------------- | ------------------------------------------------ |
| --clr-nav-link-color                      | Tabs nav link color                              |
| --clr-nav-link-active-color               | Tabs nav link active color                       |
| --clr-nav-hover-bg-color                  | Tabs nav hover background color                  |
| --clr-nav-active-bg-color                 | Tabs nav active background color                 |
| --clr-nav-selected-bg-color               | Tabs nav selected background color               |
| --clr-nav-selected-hover-bg-color         | Tabs nav hover background color on selected tab  |
| --clr-nav-selected-active-bg-color        | Tabs nav active background color on selected tab |
| --clr-nav-box-shadow-color                | Tabs nav box shadow color                        |
| --clr-vertical-nav-header-font-weight     | Vertical nav header font weight                  |
| --clr-nav-selected-hover-background-color | Tabs nav selected background color on hover      |

## CSS Classes

| Class name    | Description                                   |
| ------------- | --------------------------------------------- |
| tabs-overflow | Used to grouping tabs in overflow tab.        |
| tabs-vertical | Used to display tabs in vertical orientation. |
| tab-content   | Inner class for the content of the tab.       |

# Textarea

## CSS Custom Properties

| CSS Custom Property                      | Description                            |
| ---------------------------------------- | -------------------------------------- |
| --clr-forms-textarea-background-color    | Background color for textarea.         |
| --clr-forms-textarea-border-radius       | Border radius for textarea.            |
| --clr-forms-textarea-disabled-background | Background color of disabled textarea. |

## CSS Classes

| Class Name           | Description                    |
| -------------------- | ------------------------------ |
| clr-textarea-wrapper | Wrapper class for the textarea |
| clr-textarea         | Class for the textarea element |

# Timeline

## CSS Custom Properties

| CSS Custom Property                   | Description                           |
| ------------------------------------- | ------------------------------------- |
| --clr-timeline-line-color             | Timeline line color                   |
| --clr-timeline-step-header-color      | Timeline step header text color       |
| --clr-timeline-step-title-color       | Timeline step title text color        |
| --clr-timeline-step-description-color | Timeline step description text color  |
| --clr-timeline-incomplete-step-color  | Incomplete timeline step circle color |
| --clr-timeline-current-step-color     | Current timeline step circle color    |
| --clr-timeline-success-step-color     | Successful timeline step circle color |
| --clr-timeline-error-step-color       | Failed timeline step circle color     |
| --clr-timeline-step-title-font-weight | Timeline step title font weight       |

## CSS Classes

| Class name                    | Description                     |
| ----------------------------- | ------------------------------- |
| clr-timeline                  | Main Timeline element           |
| clr-timeline-step             | Timeline step element           |
| clr-timeline-step-header      | Timeline step header            |
| clr-timeline-step-body        | Timeline step body              |
| clr-timeline-step-title       | Timeline step title             |
| clr-timeline-step-description | Timeline step description       |
| clr-timeline-vertical         | Switches timeline vertical mode |

# Toggle

## CSS Custom Properties

| CSS Custom Property                           | Description                                           |
| --------------------------------------------- | ----------------------------------------------------- |
| --clr-toggle-bg-color-off                     | Background color for toggle that is off               |
| --clr-toggle-bg-color-on                      | Background color for toggle that is on                |
| --clr-toggle-handle-bg-color                  | Background color of the handle of the toggle          |
| --clr-toggle-disabled-default-border-color    | Border color for a disabled toggle                    |
| --clr-toggle-disabled-off-border-color        | Border color for disabled toggle that is off          |
| --clr-toggle-disabled-off-bg-color            | Background color for a disabled toggle that is off    |
| --clr-toggle-disabled-off-handle-border-color | Handle border color for a disabled toggle that is off |
| --clr-toggle-disabled-on-border-color         | Border color for disabled toggle that is on           |
| --clr-toggle-disabled-on-bg-color             | Background color for disabled toggle that is on       |
| --clr-toggle-disabled-on-handle-border-color  | Handle border color for disabled toggle that is on    |

## CSS Classes

| Class name         | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| clr-toggle-wrapper | Wrapper class for the toggle switch component                     |
| clr-toggle-right   | Class that aligns the toggle switch to the right in the container |

# Tooltip

## CSS Custom Properties

| CSS Custom Property            | Description                     |
| ------------------------------ | ------------------------------- |
| --clr-tooltip-background-color | Tooltip background color        |
| --clr-tooltip-border-radius    | Tooltip element corner radius   |
| --clr-tooltip-color            | Color of the tooltip text       |
| --clr-tooltip-font-weight      | Font weight of the tooltip text |

## CSS Classes

| Class name          | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| tooltip             | Main tooltip component element                                         |
| tooltip-content     | Tooltip content container                                              |
| tooltip-trigger     | Tooltip trigger element                                                |
| tooltip-#{POSITION} | Tooltip position identifier (top, bottom, left, right, top-left, etc.) |
| tooltip-#{SIZE}     | Tooltip size identifier (sizes: xs, sm, md, lg)                        |

# Tree view

## CSS Custom Properties

| CSS Custom Property                              | Description                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| --clr-tree-border-radius                         | Tree node content border radius                                           |
| --clr-tree-node-caret-link-hover-color           | Deprecated in v17 in favor of `--clr-tree-node-caret-hover-color`         |
| --clr-tree-node-caret-link-active-color          | Deprecated in v17 in favor of `--clr-tree-node-caret-active-color`        |
| --clr-tree-node-caret-link-disabled-color        | Deprecated in v17 in favor of `--clr-tree-node-caret-disabled-color`      |
| --clr-tree-link-hover-color                      | Deprecated in v17 in favor of `--clr-tree-node-content-bg-hover-color`    |
| --clr-tree-link-selection-color                  | Deprecated in v17 in favor of `--clr-tree-node-content-bg-selected-color` |
| --clr-tree-link-text-color                       | Deprecated in v17 in favor of `--clr-tree-node-content-color`             |
| --clr-tree-node-caret-color                      | Tree node caret color                                                     |
| --clr-tree-node-caret-hover-color                | Tree node caret hover color                                               |
| --clr-tree-node-caret-active-color               | Tree node caret active color                                              |
| --clr-tree-node-caret-disabled-color             | Tree node caret disabled color                                            |
| --clr-tree-node-content-text-only-color          | Tree node content text only color                                         |
| --clr-tree-node-content-color                    | Tree node content color                                                   |
| --clr-tree-node-content-bg-color                 | Tree node content background color                                        |
| --clr-tree-node-content-hover-color              | Tree node content hover color                                             |
| --clr-tree-node-content-bg-hover-color           | Tree node content background hover color                                  |
| --clr-tree-node-content-color                    | Tree node content selected color                                          |
| --clr-tree-node-content-bg-selected-color        | Tree node content background selected color                               |
| --clr-tree-node-content-bg-selected-hover-color  | Tree node content background hover color on selected                      |
| --clr-tree-node-content-bg-selected-active-color | Tree node content background active color on selected                     |
| --clr-tree-node-content-disabled-color           | Tree node content disabled color                                          |
| --clr-tree-node-content-bg-disabled-color        | Tree node content background disabled color                               |

## CSS Classes

| Class name                      | Description                                 |
| ------------------------------- | ------------------------------------------- |
| clr-tree-node                   | Main tree node element                      |
| clr-tree-node-content-container | Wrapper for tree content and caret elements |
| clr-treenode-content            | Content wrapper for tree node               |
| clr-treenode-caret              | Tree node caret button                      |
| clr-tree-node-caret-icon        | Tree node caret icon                        |
| clr-treenode-spinner-container  | Wrapper for tree node spinner               |
| clr-treenode-spinner            | Tree node spinner                           |
| clr-treenode-children           | Wrapper for nested child tree nodes         |
| clr-treenode-link               | Tree node link                              |

# Vertical Nav

## CSS Custom Properties

| CSS Custom Property                             | Description                               |
| ----------------------------------------------- | ----------------------------------------- |
| --clr-vertical-nav-icon-active-color            | Vertical nav active icon color            |
| --clr-vertical-nav-toggle-icon-color            | Vertical nav toggle icon color            |
| --clr-vertical-nav-item-color                   | Vertical nav item font color              |
| --clr-vertical-nav-item-active-color            | Vertical nav item active font color       |
| --clr-vertical-nav-bg-color                     | Vertical nav background color             |
| --clr-vertical-nav-selected-bg-color            | Vertical nav selected background color    |
| --clr-vertical-nav-hover-bg-color               | Vertical nav hover background color       |
| --clr-vertical-nav-trigger-divider-border-width | Vertical nav trigger divider border width |
| --clr-vertical-nav-trigger-divider-border-color | Vertical nav trigger divider border color |
| --clr-vertical-nav-active-bg-color              | Vertical nav active background color      |
| --clr-vertical-nav-active-color                 | Vertical nav active color                 |
| --clr-vertical-nav-toggle-icon-hover-color      | Vertical nav trigger icon hover color     |
| --clr-vertical-nav-toggle-icon-active-color     | Vertical nav trigger icon active color    |
| --clr-vertical-nav-toggle-icon-disabled-color   | Vertical nav trigger icon disabled color  |
| --clr-vertical-nav-item-padding                 | Vertical nav item padding                 |
| --clr-vertical-nav-item-child-padding           | Vertical nav sub items padding            |
| --clr-vertical-nav-item-height                  | Vertical nav item height                  |
| --clr-vertical-nav-toggle-button-size           | Vertical nav toggle buton size            |
| --clr-vertical-nav-header-padding               | Vertical nav header padding               |
| --clr-vertical-nav-item-active-font-weight      | Vertical nav item active font weight      |

## CSS Classes

| Class name             | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| clr-vertical-nav       | Vertical nav element                                            |
| nav-content            | Navigation content                                              |
| nav-divider            | Navigation content separator                                    |
| nav-trigger            | Navigation trigger button for collapse/expand state             |
| nav-trigger-icon       | Navigation trigger icon                                         |
| nav-trigger--bottom    | Move navigation trigger at the bottom                           |
| nav-group              | main vertical navigation group element                          |
| nav-group-content      | Wrapper for navigation group content                            |
| nav-group-text         | Navigation group content wrapper text                           |
| nav-group-children     | Wrapper for navigation group children elements                  |
| nav-group-trigger      | Navigation group trigger button for open/close group            |
| nav-group-trigger-icon | Navigation group trigger button icon                            |
| nav-btn                | Button to expand vertical nav when collapsed                    |
| has-icons              | Internal class showing if vertical nav has icons                |
| has-nav-groups         | Internal class showing if vertical nav has at least 1 nav group |

# Wizard

## CSS Custom Properties

| CSS Custom Property                            | Description                                                                               |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| --clr-wizard-footer-vertical-space             | Vertical spacing for footer buttons                                                       |
| --clr-wizard-main-bgcolor                      | Wizard background color                                                                   |
| --clr-wizard-stepnav-bgcolor                   | Wizard navigation background color                                                        |
| --clr-wizard-main-text-color                   | Wizard text color                                                                         |
| --clr-wizard-stepnav-text                      | Wizard navigation text color                                                              |
| --clr-wizard-stepnav-text-active               | Wizard navigation item color when active                                                  |
| --clr-wizard-stepnav-text-hover                | Wizard navigation item color when hovered                                                 |
| --clr-wizard-stepnav-text--active              | Wizard navigation item color when selected (misnamed)                                     |
| --clr-wizard-stepnav-text-disabled             | Wizard navigation item color when disabled                                                |
| --clr-wizard-title-text                        | Wizard title text color                                                                   |
| --clr-wizard-stepnav-border-size               | Wizard navigation border size                                                             |
| --clr-wizard-stepnav-item-border-color         | Wizard navigation border color                                                            |
| --clr-wizard-stepnav-item-border-color--active | Wizard navigation item complete border color (misnamed)                                   |
| --clr-wizard-stepnav-selected-border-color     | Wizard navigation border color of current not completed step                              |
| --clr-wizard-stepnav-active-bgcolor            | _Deprecated in v18_ Wizard navigation background color for the currently selected element |
| --clr-wizard-stepnav-selected-bgcolor          | Wizard navigation background color for the currently selected element                     |
| --clr-wizard-stepnav-selected-error-bgcolor    | Wizard navigation background color for the currently selected element if error            |
| --clr-wizard-stepnav-selected-hover-bgcolor    | Wizard navigation background color for the currently hovered selected element             |
| --clr-wizard-stepnav-selected-active-bgcolor   | Wizard navigation background color for the currently active selected element              |
| --clr-wizard-header-action-color               | Wizard header actions color                                                               |
| --clr-wizard-header-action-color--hovered      | Wizard header actions color on hover                                                      |
| --clr-wizard-border-radius                     | Wizard border radius                                                                      |
| --clr-wizard-stepnav-border-color              | Wizard navigation border color                                                            |
| --clr-wizard-box-shadow                        | Wizard highlight indication                                                               |
| --clr-wizard-stepnav-link-font-size            | Wizard navigation item font size                                                          |
| --clr-wizard-stepnav-link-line-height          | Wizard navigation item line height                                                        |
| --clr-wizard-stepnav-link-error-icon-color     | Wizard navigation item button error icon color                                            |
| --clr-wizard-stepnav-item-error-border-color   | Wizard navigation item error border color                                                 |
| --clr-wizard-stepnav-link-complete-icon-color  | Wizard navigation item button complete icon color                                         |
| --clr-wizard-footer-height                     | Wizard page footer height                                                                 |
| --clr-wizard-stepnav-link-active-bg-color      | Wizard navigation item button background color when active                                |
| --clr-wizard-stepnav-link-hover-bg-color       | Wizard navigation item button background color when hovered                               |
| --clr-wizard-title-font-size                   | Wizard title font size                                                                    |
| --clr-wizard-title-line-height                 | Wizard title line height                                                                  |
| --clr-wizard-content-background-color          | Wizard content background color                                                           |

## CSS Classes

| Class name                          | Description                                    |
| ----------------------------------- | ---------------------------------------------- |
| clr-wizard                          | Main wizard element                            |
| clr-wizard-content                  | Wizard content container                       |
| clr-wizard-page                     | Wizard page container                          |
| wizard-#{SIZE}                      | Wizard size; sizes: [md, lg, xl]               |
| clr-wizard-btn                      | Wizard control button                          |
| clr-wizard-title                    | Wizard title element                           |
| clr-wizard-header-action            | Wizard header action                           |
| clr-wizard-stepnav                  | Wizard navigation container                    |
| clr-wizard-stepnav-list             | Wizard navigation list                         |
| clr-wizard-stepnav-item             | Wizard navigation item                         |
| clr-wizard-stepnav-link             | Wizard navigation item link                    |
| clr-wizard-stepnav-link-icon        | Wizard navigation item icon wrapper            |
| clr-wizard-stepnav-item-page-number | Wizard navigation item page number             |
| clr-wizard-footer                   | Wizard footer                                  |
| clr-wizard-footer-buttons           | Wizard footer buttons container                |
| clr-wizard--no-title                | Remove wizard dialog title                     |
| clr-wizard--no-shadow               | Remove wizard dialog shadow                    |
| clr-wizard-stepnav-wrapper          | Internal wrapper for the wizard navigation     |
| clr-wizard-footer-buttons-wrapper   | Internal wrapper for the wizard footer buttons |
| clr-wizard-btn-wrapper              | Internal wrapper for wizard control buttons    |
