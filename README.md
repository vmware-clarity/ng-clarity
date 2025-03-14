## Installing Clarity UI [![npm version](https://badge.fury.io/js/%40clr%2Fui.svg)](https://badge.fury.io/js/%40clr%2Fui)

1.  Install Clarity UI package through npm:

    ```
    npm install @clr/ui
    ```

2.  Include @cds/core/global.min.css, @cds/core/styles/theme.dark.min.css, and clr-ui.min.css in your HTML file and add the cds-theme attribute to your body tag:

    ```
    <link rel="stylesheet" href="path/to/node_modules/@cds/core/global.min.css">
    <link rel="stylesheet" href="path/to/node_modules/@cds/core/styles/theme.dark.min.css">
    <link rel="stylesheet" href="path/to/node_modules/@clr/ui/clr-ui.min.css">
    ```

3.  Add the `cds-theme="light"` (or `cds-theme="dark"` for dark theme) to the body tag:

    ```
    <body cds-theme"light">
    ```

4.  Write your HTML with the Clarity CSS class names and markup.

## Versioning

The version of this library is aligned to the version of @clr/angular, and does not independently follow semantic
versioning. While we strive to only introduce breaking changes in major versions, we may at times need to introduce
a breaking change in a minor version in order to maintain alignment with the @clr/angular library. For projects that
choose to use this package, we recommend pinning your project to a specific path version and treating each upgrade
as a potentially breaking change.
