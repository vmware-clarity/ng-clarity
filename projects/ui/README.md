## Installing Clarity UI [![npm version](https://badge.fury.io/js/%40clr%2Fui.svg)](https://badge.fury.io/js/%40clr%2Fui)

1.  Install Clarity UI package through npm:

    ```
    npm install @clr/ui
    ```

2.  Include clr-ui.min.css in your HTML file:

    ```
    <link rel="stylesheet" href="path/to/node_modules/@clr/ui/clr-ui.min.css">
    ```

3.  Write your HTML with the Clarity CSS class names and markup.

## Legacy Styles (pre-v16)

Clarity recently introduced the Clarity Design System within the @cds/core library. As of v16, the Clarity team has
migrated that system and styles to this and the @clr/angular package. This change came with UI changes that teams
may not be prepared to make without proper planning, so the Clarity team has retained the existing styles but that
has been moved to a legacy file that will be removed in v17 (~Jan-Feb/2024). To use those legacy styles, reference
the file from its new location.

    ```
    <link rel="stylesheet" href="path/to/node_modules/@clr/ui/legacy-clr-ui.min.css">
    ```

## Versioning

The version of this library is aligned to the version of @clr/angular, and does not independently follow semantic
versioning. While we strive to only introduce breaking changes in major versions, we may at times need to introduce
a breaking change in a minor version in order to maintain alignment with the @clr/angular library. For projects that
choose to use this package, we recommend pinning your project to a specific path version and treating each upgrade
as a potentially breaking change.
