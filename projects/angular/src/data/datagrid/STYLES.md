# Datagrid

## CSS Properties

| Property Name                                        | Description                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| --clr-datagrid-font-color                            | Not used.                                                                |
| --clr-datagrid-default-border-color                  | Default border color for datagrid detail pane.                           |
| --clr-datagrid-icon-color                            | Default color for expandable, detail caret icons and action toggle icon. |
| --clr-datagrid-row-hover-color                       | Background color for datagrid row on hover and active action items.      |
| --clr-datagrid-row-hover-font-color                  | Font color for active action items.                                      |
| --clr-datagrid-action-toggle-color                   | Datagrid action toggle icon color when active.                           |
| --clr-datagrid-pagination-btn-color                  | Color for pagination buttons.                                            |
| --clr-datagrid-pagination-btn-disabled-color         | Color for disabled pagination buttons.                                   |
| --clr-datagrid-pagination-input-border-color         | Border color for the pagination input field.                             |
| --clr-datagrid-pagination-input-border-focus-color   | Border color for the pagination input field when focused.                |
| --clr-datagrid-popover-bg-color                      | Background color for popovers within the datagrid.                       |
| --clr-datagrid-popover-border-color                  | Border color for popovers within the datagrid.                           |
| --clr-datagrid-action-popover-hover-color            | Background color of action items on hover and focus.                     |
| --clr-datagrid-row-selected                          | Font color for selected rows.                                            |
| --clr-datagrid-column-switch-header-font-color       | Font color for column switch header button icons.                        |
| --clr-datagrid-column-switch-header-font-hover-color | Font color for column switch button icons on hover.                      |
| --clr-datagrid-detail-caret-icon-open-bg-color       | Background color for opened detail caret button.                         |
| --clr-datagrid-detail-caret-icon-open-icon-color     | Color of opened detail caret icon.                                       |
| --clr-datagrid-placeholder-color                     | Font color for empty datagrid placeholder.                               |
| --clr-datagrid-loading-background                    | Background color for the loading state of the datagrid.                  |
| --clr-datagrid-column-toggle-border-color            | Border color for column toggle buttons.                                  |
| --clr-datagrid-column-toggle-fill-color              | Background color for column toggle buttons.                              |
| --clr-datagrid-column-toggle-text-color              | Text color for column toggle buttons.                                    |
| --clr-datagrid-column-toggle-border-hover-color      | Border color for column toggle buttons when hovered.                     |
| --clr-datagrid-column-toggle-fill-hover-color        | Background color for column toggle buttons when hovered.                 |
| --clr-datagrid-column-toggle-text-hover-color        | Text color for column toggle buttons when hovered.                       |
| --clr-datagrid-column-toggle-border-active-color     | Border color for active column toggle buttons.                           |
| --clr-datagrid-column-toggle-fill-active-color       | Background color for active column toggle buttons.                       |
| --clr-datagrid-column-toggle-text-active-color       | Text color for active column toggle buttons.                             |
| --clr-datagrid-popovers-box-shadow-color             | Not used.                                                                |

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
