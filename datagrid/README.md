### Overview

AppFx Datagrid is a data-bound list control that displays items from an array-based source in the form of columns and rows.
The datagrid control allows users to select, sort and filter to quickly find or report on their business needs.
Dataset sizes can scale upward without impacting the UI performance.

### AppFx Datagrid

- **Reduced Markup:** AppFx Datagrid requires less markup compared to vanilla clr-datagrid, simplifying the development process and making the codebase cleaner.
- **Consistent UX:** It provides a common look and feel across grids, ensuring a consistent and user-friendly interface throughout your application.
- **Centralized Concerns:** Cross-cutting concerns such as filtering, column sorting, pagination, row actions, row item details, accessibility (A11y), localization (L10n), and zoom support (2x and 4x) are all handled in one place, streamlining development and ensuring uniform functionality.
- **Advanced Features:** It offers advanced features like advanced filters, export, selection persistence, and more, making it easier to implement complex datagrid functionality.
- **Easier Migration**: AppFx Datagrid simplifies the migration process for applications built on the Clarity design system, making it more straightforward to update your UI components.
- **Faster Development**: With its simplified markup and pre-built features, development becomes faster and more efficient, allowing you to deliver projects more quickly.
- **Low Maintenance Cost**: The centralized approach to handling common grid concerns reduces the maintenance overhead of your application, saving time and resources in the long run.

### Advanced Features

The component is built on top of the clr-datagrid component from Clarity and provides additional advanced features and customization that are very easy to enable.

#### Column reordering

The datagrid supports column reordering out of the box using the Angular CDK. This enables users to rearrange columns interactively.

![Column reorder example](assets/appfx/datagrid/column-reorder.gif)

#### Row Drag-and-drop

Row drag-and-drop functionality can be enabled supporting multiple items

![Drag and drop example](assets/appfx/datagrid/drag-and-drop.gif)

#### Action bar

The datagrid has a customizable responsive action bar component: `appfx-datagrid-action-bar`

![Action bar](assets/appfx/datagrid/action-bar.png)

#### Datagrid Filters

The datagrid integrates seamlessly with Advanced Filters, enabling users to create and manage complex filtering queries.

For detailed guidance, refer to the [Advanced Filters Doc] (@clr/addons/datagrid-filters/overview)

![Datagrid Filters example screen](assets/appfx/datagrid-advanced-filter-overview.png)

#### Datagrid settings persistence

The datagrid offers a common API `appfxDatagridPersistSettingsToken` for persisting settings such as column widths, page size, and column visibility.

#### Export

The datagrid provides export capabilities to facilitate data extraction and reporting.

#### Virtual Scrolling

The datagrid supports virtual scrolling for efficiently handling large datasets. Virtual scrolling only renders the rows that are currently visible in the viewport, significantly improving performance when working with large amounts of data.

Important limitations to consider for virtual scrolling:

- Fixed row height is required.
- Cell text is always truncated.
- Expandable rows are not supported.

### Component API

#### appfx-datagrid

AppFx Datagrid is built on top of the `clr-datagrid` component from Clarity and provides additional features and customization on top of the base ClrDatagrid.

Template `<T>` - The type of the data being displayed in the datagrid.
This allows the datagrid to enforce type safety for the items passed to it, ensuring
that the `gridItems` and other related inputs conform to a specific structure.

| Property                  | Type   | Data Type                                   | Description                                                                                                                                                                                                                    | Required |
| ------------------------- | ------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `gridItems`               | Input  | `T[]`                                       | The data source for the datagrid, represented as an array of objects, where each object corresponds to a row. Fields within each object map to columns as defined in each column's `field` property in the _ColumnDefinition_. | Yes      |
| `columns`                 | Input  | `ColumnDefinition<T>[]`                     | Array of column definitions configuring the appearance and behavior of each column in the datagrid. Each object in this array is a _ColumnDefinition_, requiring properties like `displayName` and `field`.                    | Yes      |
| `layoutModel`             | Input  | `GridLayoutModel`                           | Provides configurable options for customizing the visual appearance and behavior of the datagrid layout. See `GridLayoutModel` interface                                                                                       | No       |
| `footerModel`             | Input  | `GridFooterModel`                           | Provides configurable options for customizing the behavior and appearance of the datagrid footer. See `GridFooterModel` interface                                                                                              | No       |
| `pageSize`                | Input  | `number`                                    | Sets the number of items displayed per page in the datagrid. Defaults to showing all items if no page size is specified.                                                                                                       | No       |
| `pageSizeOptions`         | Input  | `number[]`                                  | Defines selectable page size options available in the grid footer, allowing users to control the number of items shown per page.                                                                                               | No       |
| `serverDrivenDatagrid`    | Input  | `boolean`                                   | Enables server-driven mode for the datagrid when set to `true`, requiring external management of pagination and filtering. Defaults to `false`, with client-side data handling.                                                | No       |
| `virtualScrolling`        | Input  | `boolean`                                   | Controls whether the datagrid uses virtual scrolling to render data. Note that `serverDrivenDatagrid` should also be set to enable virtual scrolling. Defaults to `false`.                                                     | No       |
| `loading`                 | Input  | `boolean`                                   | Displays a loading indicator overlay when set to `true`, preventing user interactions while data is loading. Defaults to `false`.                                                                                              | No       |
| `rowSelectionMode`        | Input  | `boolean`                                   | Enables row selection on click when `true`. If `SelectionType` is set to `NONE`, this setting is overridden and selection is disabled. Defaults to `true`.                                                                     | No       |
| `preSelectFirstItem`      | Input  | `boolean`                                   | Automatically selects the first item in the datagrid upon initialization if set to `true`. Defaults to `false`.                                                                                                                | No       |
| `filterMode`              | Input  | `FilterMode`                                | Specifies the type of global filter to enable. When filter is enabled, the component will emit the `searchTermChange` or `advancedFilterChange` event whenever the filter changes.                                             | No       |
| `singleRowActions`        | Input  | `ActionDefinition[]`                        | An array of action definitions for single row actions, allowing customized actions per row.                                                                                                                                    | No       |
| `actionBarActions`        | Input  | `ActionDefinition[]`                        | An array of action definitions for actions in the datagrid’s action bar.                                                                                                                                                       | No       |
| `totalItems`              | Input  | `number`                                    | Required for server-driven grids (`serverDrivenDatagrid = true`) to set the total item count. For client-driven grids, this is calculated internally and should not be set.                                                    | No       |
| `selectedItems`           | Input  | `T[]`                                       | An array of items to be pre-selected in the datagrid.                                                                                                                                                                          | No       |
| `selectionType`           | Input  | `SelectionType`                             | Specifies row selection behavior, accepting values from the _SelectionType_ enum. Defaults to `SelectionType.Single`.                                                                                                          | No       |
| `isRowLocked`             | Input  | `Function`                                  | A function that determines if a specific row is locked (disabled).                                                                                                                                                             | No       |
| `dragConfig`              | Input  | `DatagridDragConfig`                        | Configuration for enabling drag-and-drop functionality within the datagrid. To enable it, provide a valid configuration object implementing the `DatagridDragConfig` interface.                                                | No       |
| `rowDetailContent`        | Input  | `TemplateRef<unknown>`                      | Template for the content displayed when a row expands. Enables expandable row functionality.                                                                                                                                   | No       |
| `detailHeader`            | Input  | `TemplateRef<unknown>`                      | Reference to the template containing the content for the header displayed on top of the expanded row content.                                                                                                                  | No       |
| `detailBody`              | Input  | `TemplateRef<unknown>`                      | Reference to the template containing the expanded row content.                                                                                                                                                                 | No       |
| `dataRange`               | Input  | `ClrDatagridVirtualScrollRangeInterface<T>` | Input for providing data when virtual scrolling is enabled. Should be used instead of `gridItems` when virtual scrolling is enabled. Contains total count, skip value, and data array.                                         | No       |
| `gridItemsChange`         | Output | `EventEmitter<T[]>`                         | Emits the updated `gridItems` to the parent component when the grid data changes.                                                                                                                                              | No       |
| `selectedItemsChange`     | Output | `EventEmitter<T[]>`                         | Emits the updated `selectedItems` to the parent component when the selection changes.                                                                                                                                          | No       |
| `columnDefsChange`        | Output | `EventEmitter<T[]>`                         | Emits the updated `columns` to the parent component when the column definitions change.                                                                                                                                        | No       |
| `pageSizeChange`          | Output | `EventEmitter<number>`                      | Emits the updated `pageSize` to the parent component when the page size changes.                                                                                                                                               | No       |
| `actionClick`             | Output | `EventEmitter<ActionClickEvent>`            | Event emitter triggered when a single-row action or actionbar action is clicked. The emitted event contains information about the action that was clicked. See `ActionClickEvent` interface.                                   | No       |
| `rowActionMenuOpenChange` | Output | `EventEmitter<SingleRowActionOpen>`         | Event emitter triggered when the single-row action menu open state is change. The emitted event contains information about the action that was clicked. See `SingleRowActionOpen` interface.                                   | No       |
| `openContextMenu`         | Output | `EventEmitter<ContextMenuEvent>`            | Event emitter triggered when a right-click event is performed on a grid row.                                                                                                                                                   | No       |
| `searchTermChange`        | Output | `EventEmitter<string>`                      | Emits when quick filter criteria change.                                                                                                                                                                                       | No       |
| `advancedFilterChange`    | Output | `EventEmitter<PropertyFilter[]>`            | Emits when advanced filter criteria change.                                                                                                                                                                                    | No       |

#### `ColumnDefinition` interface

Defines a column in the Datagrid.

| Syntax                 | Type                                            | Description                                                                                | Required |
| ---------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | -------- |
| `uid`                  | `string`                                        | Unique identifier for the column, used for persistence.                                    | No       |
| `displayName`          | `string`                                        | Text displayed as the column header.                                                       | Yes      |
| `field`                | `string`                                        | The name of the property in the Datagrid data that this column represents.                 | Yes      |
| `hideable`             | `boolean`                                       | Determines whether the column can be hidden using the column toggle. Defaults to `true`.   | No       |
| `hidden`               | `boolean`                                       | Specifies whether the column is hidden when the Datagrid is rendered. Defaults to `false`. | No       |
| `stringFilter`         | `ClrDatagridStringFilterInterface<T>`           | Defines string filter for data in this column.                                             | No       |
| `filter`               | `Type<ColumnFilter<T>>`                         | A custom filter component for filtering data in this column.                               | No       |
| `defaultFilterValue`   | `any`                                           | Default filter value for the column's filter.                                              | No       |
| `columnRenderer`       | `Type<ColumnRenderer<T>>`                       | A custom component to render/display data in this column.                                  | No       |
| `columnRendererConfig` | `any`                                           | Additional key/value pair configuration options for the `columnRenderer`.                  | No       |
| `sortComparator`       | `ClrDatagridComparatorInterface<T>` \| `string` | Comparator that to be used when sorting data in this column.                               | No       |
| `defaultSortOrder`     | `ClrDatagridSortOrder`                          | Specifies the default sort order for the column.                                           | No       |
| `width`                | `string`                                        | Column width in pixels (e.g., '100px'). Auto-calculated if not set.                        | No       |
| `sortAndFilterByField` | `string`                                        | The field by which the column will be filtered and sorted.                                 | No       |

#### `GridLayoutModel` interface

| Syntax                  | Type      | Description                                                                                                                 | Required |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| `compact`               | `boolean` | Enables compact mode for the datagrid, reducing row height to create a denser layout. Defaults to `true` if not specified.  | No       |
| `disabled`              | `boolean` | Disables the datagrid, preventing all user interactions when set to `true`. Defaults to `false`, allowing full interaction. | No       |
| `stretchToParentHeight` | `boolean` | Adjusts the datagrid layout to stretch and fill 100% of the height of the parent container.                                 | No       |

#### `GridFooterModel` interface

| Syntax                   | Type                     | Description                                                                                                                                                                                                  | Required |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `showFooter`             | `boolean`                | Controls the visibility of the datagrid footer. Defaults to `true` if not specified.                                                                                                                         | No       |
| `hideColumnToggle`       | `boolean`                | Controls the visibility of the column toggle in the footer. Defaults to `false` visible column toggle.                                                                                                       | No       |
| `enableCustomExport`     | `boolean`                | Specifies whether the export button should be displayed in the datagrid. Enabling this option causes the component to emit the `onExportData` event, which can be used for implementing custom export logic. | No       |
| `clientSideExportConfig` | `ClientSideExportConfig` | Configuration for client-side data export behavior. This option allows to define settings such as the file name and export columns.                                                                          | No       |

#### `ClientSideExportConfig` interface

| Syntax              | Type                     | Description                                                                | Required |
| ------------------- | ------------------------ | -------------------------------------------------------------------------- | -------- |
| `exportedFileName`  | `string`                 | The file name where the content of datagrid will be exported in csv format | Yes      |
| `columnDefinitions` | `ExportColumnDefinition` | Defines a column structure for Export that will be used for data export.   | Yes      |

#### `DatagridDragConfig` interface

| Syntax      | Type                  | Description                                                                                                                                                                                                         | Required |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `fieldName` | `string`              | The name of the field whose value will be displayed as a ghost element while dragging. The ghost element is the visual representation of the dragged item that follows the cursor during a drag-and-drop operation. | Yes      |
| `dragGroup` | `ColumnDefinition<T>` | An optional identifier for grouping draggable elements.                                                                                                                                                             | No       |

#### `ColumnRenderer` interface

A `ColumnRenderer` is a custom component responsible for rendering data within a specific column of a Datagrid.

| Syntax     | Type                                              | Description                                                                                                      | Required |
| ---------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| `item`     | `T`                                               | The data item representing a row in the Datagrid.                                                                | Yes      |
| `column`   | `ColumnDefinition<T>`                             | The definition of the column being rendered, including metadata and configuration.                               | No       |
| `onChange` | `(item: T, column?: ColumnDefinition<T>) => void` | Lifecycle method called when the `item` or `column` properties change. Typically used to handle dynamic updates. | No       |

Example of custom column renderer

```typescript
@Component({
  selector: 'demo-text-renderer',
  template: `
    <cds-icon shape="exclamation-circle" class="is-error" size="24"></cds-icon>
    <span>{{ displayText }} cell custom HTML</span>
  `,
})
class DemoTextRendererComponent implements ColumnRenderer<unknown>, OnInit {
  protected displayText: string;
  public item: unknown;
  public column: ColumnDefinition<unknown>;

  public ngOnInit(): void {
    this.updateData();
  }

  public onChange(item: unknown, column: ColumnDefinition<unknown>): void {
    this.item = item;
    this.column = column;
    this.updateData();
  }

  private updateData(): void {
    this.displayText = this.item[this.column.field];
  }
}
```

#### `ActionDefinition` interface

| Syntax      | Type                 | Description                                                                                                                | Required |
| ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| `id`        | `string`             | Unique identifier for the action.                                                                                          | Yes      |
| `label`     | `T`                  | The label displayed for the action.                                                                                        | Yes      |
| `ariaLabel` | `string`             | Optional ARIA label for accessibility.                                                                                     | No       |
| `enabled`   | `boolean`            | Determines whether the action is enabled or not.                                                                           | Yes      |
| `tooltip`   | `T`                  | Optional tooltip text displayed when hovering over the action.                                                             | No       |
| `class`     | `string`             | Style class to be applied. Default style is `flatCompact` (`btn btn-sm btn-link`). Refer to `ActionBarLayout` for details. | No       |
| `isVisible` | `boolean`            | Indicates if the action button is visible above the grid. Otherwise, it will be placed within a dropdown.                  | No       |
| `children`  | `ActionDefinition[]` | Child actions to be displayed as dropdown items if the action is configured as a dropdown.                                 | No       |

#### `ActionClickEvent` interface

| Syntax    | Type               | Description                                                                                                                                                                  | Required |
| --------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `action`  | `ActionDefinition` | The action that was clicked.                                                                                                                                                 | Yes      |
| `context` | `T`                | Represents the action context. This can be an array of selected data grid items for action bar actions or the data grid item associated with the row for single row actions. | Yes      |

#### `SingleRowActionOpen` interface

| Syntax    | Type               | Description                                                                                        | Required |
| --------- | ------------------ | -------------------------------------------------------------------------------------------------- | -------- |
| `open`    | `boolean`          | Indicates whether the single row action menu is open or closed.                                    | Yes      |
| `actions` | `ActionDefinition` | The actions available in the single row action menu.                                               | Yes      |
| `context` | `T`                | The data grid item associated with the datagrid row where the single row menu is opened or closed. | Yes      |

### Example Code

```html
<appfx-datagrid [columns]="columns" [gridItems]="items"></appfx-datagrid>
```

```typescript

public gridItems: MyInterface[] = {
   { name: "Peter", color: "green" },
   { name: "Peter", color: "green" },
   { name: "Maria", color: "red" },
}

public columns: ColumnDefinition<MyInterface>[] = [
    {
       displayName: "Person name",
       field: "name"
    },
    {
        displayName: "Eye color",
        field: "color"
    },
]
```

#### Enable settings persistence feature

To enable the persistence of a datagrid state (including column order, column width, page size, and column visibility), the `appfxDatagridPersistSettingsToken` must be provided.

This requires a service implementing the `PersistDatagridSettingsService` interface, which defines the following methods:

```typescript
interface PersistDatagridSettingsService {
  getUserDataSync(key: string): any;
  setUserData(key: string, data: any): void;
}
```

You can register the persistence service with the following configuration:

```typescript
{
    provide: appfxDatagridPersistSettingsToken,
    useFactory: (service: PersistDatagridSettingsService) => service,
    deps: [PersistDatagridSettingsService],
}
```

Additionally, a unique identifier must be provided using the `appfxPersistDatagridSettings` directive.
This id distinguishes settings for different grids.

Here’s an example of its usage:

```html
<appfx-datagrid ... [appfxPersistDatagridSettings]="'datagrid-id"> </appfx-datagrid>
```
