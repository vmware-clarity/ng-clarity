# Datagrid

## CSS Properties

| Property Name                                        | Description                                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| --clr-datagrid-font-color                            | The font color for the datagrid.                                              |
| --clr-datagrid-default-border-color                  | The default border color for the datagrid.                                    |
| --clr-datagrid-icon-color                            | The color for icons within the datagrid.                                      |
| --clr-datagrid-row-hover-color                       | The background color when hovering over a row in the datagrid.                |
| --clr-datagrid-row-hover-font-color                  | The font color when hovering over a row in the datagrid.                      |
| --clr-datagrid-action-toggle-color                   | The color for the action toggle within the datagrid.                          |
| --clr-datagrid-pagination-btn-color                  | The color for pagination buttons in the datagrid.                             |
| --clr-datagrid-pagination-btn-disabled-color         | The color for disabled pagination buttons in the datagrid.                    |
| --clr-datagrid-pagination-input-border-color         | The border color for the pagination input field in the datagrid.              |
| --clr-datagrid-pagination-input-border-focus-color   | The border color for the pagination input field when focused in the datagrid. |
| --clr-datagrid-popover-bg-color                      | The background color for popovers within the datagrid.                        |
| --clr-datagrid-popover-border-color                  | The border color for popovers within the datagrid.                            |
| --clr-datagrid-action-popover-hover-color            | The background color when hovering over an action popover in the datagrid.    |
| --clr-datagrid-row-selected                          | The font color for selected rows in the datagrid.                             |
| --clr-datagrid-column-switch-header-font-color       | The font color for column switch headers in the datagrid.                     |
| --clr-datagrid-column-switch-header-font-hover-color | The font color for column switch headers when hovered in the datagrid.        |
| --clr-datagrid-detail-caret-icon-open-bg-color       | The background color for the open detail caret icon in the datagrid.          |
| --clr-datagrid-detail-caret-icon-open-icon-color     | The icon color for the open detail caret icon in the datagrid.                |
| --clr-datagrid-placeholder-color                     | The color for placeholders in the datagrid.                                   |
| --clr-datagrid-loading-background                    | The background color for the loading state of the datagrid.                   |
| --clr-datagrid-column-toggle-border-color            | The border color for column toggle buttons in the datagrid.                   |
| --clr-datagrid-column-toggle-fill-color              | The fill color for column toggle buttons in the datagrid.                     |
| --clr-datagrid-column-toggle-text-color              | The text color for column toggle buttons in the datagrid.                     |
| --clr-datagrid-column-toggle-border-hover-color      | The border color for column toggle buttons when hovered in the datagrid.      |
| --clr-datagrid-column-toggle-fill-hover-color        | The fill color for column toggle buttons when hovered in the datagrid.        |
| --clr-datagrid-column-toggle-text-hover-color        | The text color for column toggle buttons when hovered in the datagrid.        |
| --clr-datagrid-column-toggle-border-active-color     | The border color for active column toggle buttons in the datagrid.            |
| --clr-datagrid-column-toggle-fill-active-color       | The fill color for active column toggle buttons in the datagrid.              |
| --clr-datagrid-column-toggle-text-active-color       | The text color for active column toggle buttons in the datagrid.              |
| clr-datagrid-popovers-box-shadow-color               | Not used.                                                                     |

## CSS Classes

| Class Name                            | Description                                                   |
| ------------------------------------- | ------------------------------------------------------------- |
| action-item                           | Action item within the datagrid's overflow container.         |
| clr-checkbox-wrapper                  | Wrapper for the selection checkbox.                           |
| clr-col-null                          | Prevents clr-col-\* classes inside clrForm wrapper.           |
| clr-control-label                     | Label for checkboxes, radio buttons, and caret buttons.       |
| clr-form-control-disabled             | Applied to disabled selection checkboxes/radio buttons.       |
| clr-radio-wrapper                     | Wrapper for the selection radio button.                       |
| clr-sr-only                           | Visually hidden for screen reader-only content.               |
| datagrid-action-overflow              | Overflow container for action items in the datagrid.          |
| datagrid-cell                         | Single cell within a row of the datagrid.                     |
| datagrid-checkbox-wrapper             | Wrapper for the selection checkbox.                           |
| datagrid-column                       | Column header within the datagrid.                            |
| datagrid-column-flex                  | Flex container for the column content.                        |
| datagrid-column-handle                | Button for resizing the column in the datagrid.               |
| datagrid-column-resize-tracker        | Visual indicator for column resizing.                         |
| datagrid-column-separator             | Separator between columns in the datagrid.                    |
| datagrid-container                    | Container for the datagrid if no row detail.                  |
| datagrid-detail-body                  | Container for the datagrid detail body.                       |
| datagrid-detail-header                | Container for the datagrid detail header.                     |
| datagrid-empty                        | Class to indicate an empty datagrid.                          |
| datagrid-expandable-caret             | Container for the expandable caret button.                    |
| datagrid-expandable-caret-button      | Expandable caret button within the expandable cell.           |
| datagrid-filter                       | Container for the filter popover.                             |
| datagrid-filter-close-wrapper         | Wrapper for the close button in the filter popover.           |
| datagrid-filter-open                  | Applied to the filter toggle button when open.                |
| datagrid-filter-toggle                | Toggle button for opening/closing the filter popover.         |
| datagrid-filtered                     | Applied to the filter toggle button when active.              |
| datagrid-fixed-column                 | Fixed column in the datagrid.                                 |
| datagrid-footer                       | Footer section of the datagrid.                               |
| datagrid-footer-description           | The description in the datagrid footer.                       |
| datagrid-footer-select                | Select checkbox in the datagrid footer.                       |
| datagrid-header                       | Header section of the datagrid.                               |
| datagrid-host.datagrid-calculate-mode | Applied to the datagrid host in calculation mode.             |
| datagrid-placeholder                  | Container for the datagrid placeholder.                       |
| datagrid-placeholder-container        | Container for the datagrid placeholder component.             |
| datagrid-placeholder-content          | Content in the datagrid placeholder.                          |
| datagrid-placeholder-image            | Image in the datagrid placeholder.                            |
| datagrid-row                          | Single row within the datagrid.                               |
| datagrid-row-actions                  | Container for the row actions.                                |
| datagrid-row-clickable                | Clickable behavior for rows in the datagrid.                  |
| datagrid-row-detail                   | Container for the row detail.                                 |
| datagrid-row-flex                     | Flex container for the row.                                   |
| datagrid-row-master                   | Master row within a hierarchy in the datagrid.                |
| datagrid-row-scrollable               | Scrollable container for the row.                             |
| datagrid-scrolling-cells              | Container for the scrolling cells within the row.             |
| datagrid-select                       | Container for the selection checkbox/radio buttons.           |
| datagrid-signpost-trigger             | Conditionally applied to the host element of ClrDatagridCell. |
| is-open                               | Applied to the detail caret button when detail row open.      |
| is-replaced                           | Applied to the scrollable container when row replaced.        |
| pagination                            | The pagination element.                                       |
| pagination-current                    | The current page input.                                       |
| pagination-description                | The description.                                              |
| pagination-description-compact        | The compact description in the detail view.                   |
| pagination-first                      | The first page button.                                        |
| pagination-last                       | The last page button.                                         |
| pagination-list                       | The pagination buttons.                                       |
| pagination-next                       | The next page button.                                         |
| pagination-previous                   | The previous page button.                                     |
| pagination-size                       | The page size element.                                        |
| sort-icon                             | The sort icon for sortable columns.                           |
