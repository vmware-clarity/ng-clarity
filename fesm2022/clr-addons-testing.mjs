import * as i0 from '@angular/core';
import { Component, EventEmitter, Output, Input, ViewContainerRef, ViewChild, Directive, Pipe } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ClrDatagrid } from '@clr/angular/data/datagrid';
import { FilterMode } from '@clr/addons/datagrid-filters';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockRequiredFieldLegendComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockRequiredFieldLegendComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockRequiredFieldLegendComponent, isStandalone: false, selector: "appfx-required-field-legend", ngImport: i0, template: ``, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockRequiredFieldLegendComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-required-field-legend',
                    standalone: false,
                    template: ``,
                }]
        }] });
class MockRequiredFieldLegendStandaloneComponent extends MockRequiredFieldLegendComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockRequiredFieldLegendStandaloneComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockRequiredFieldLegendStandaloneComponent, isStandalone: true, selector: "appfx-required-field-legend", usesInheritance: true, ngImport: i0, template: ``, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockRequiredFieldLegendStandaloneComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-required-field-legend',
                    standalone: true,
                    template: ``,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ZoomLevelServiceMock {
    constructor() {
        this.resizeSubject = new ReplaySubject(1);
        this.onChange = this.resizeSubject.asObservable();
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockAppfxDatagridComponent {
    constructor() {
        this.detailState = null;
        this.selectedItemsChange = new EventEmitter();
        this.gridItemsChange = new EventEmitter();
        this.selectionChange = new EventEmitter();
        this.searchTermChange = new EventEmitter();
        this.refreshGridData = new EventEmitter();
        this.refreshVirtualGridData = new EventEmitter();
        this.actionClick = new EventEmitter();
        this.rowActionMenuOpenChange = new EventEmitter();
        this.exportDataEvent = new EventEmitter();
        this.detailStateChange = new EventEmitter(true);
    }
    onModelChange() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockAppfxDatagridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockAppfxDatagridComponent, isStandalone: false, selector: "appfx-datagrid", inputs: { gridItems: "gridItems", columns: "columns", layoutModel: "layoutModel", footerModel: "footerModel", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", totalItems: "totalItems", selectionType: "selectionType", selectedItems: "selectedItems", datagridLabels: "datagridLabels", preSelectFirstItem: "preSelectFirstItem", rowSelectionMode: "rowSelectionMode", actionBarActions: "actionBarActions", showFooter: "showFooter", singleRowActions: "singleRowActions", noItemsFoundPlaceholder: "noItemsFoundPlaceholder", loading: "loading", serverDrivenDatagrid: "serverDrivenDatagrid", filterMode: "filterMode", listItemsCount: "listItemsCount", trackByGridItemProperty: "trackByGridItemProperty", isRowLocked: "isRowLocked", detailHeader: "detailHeader", detailBody: "detailBody", rowDetailContent: "rowDetailContent", rowsExpandedByDefault: "rowsExpandedByDefault", vscPersistDatagridSettings: "vscPersistDatagridSettings", detailState: "detailState", trackByFunction: "trackByFunction", virtualScrolling: "virtualScrolling", dataRange: "dataRange" }, outputs: { selectedItemsChange: "selectedItemsChange", gridItemsChange: "gridItemsChange", selectionChange: "selectionChange", searchTermChange: "searchTermChange", refreshGridData: "refreshGridData", refreshVirtualGridData: "refreshVirtualGridData", actionClick: "actionClick", rowActionMenuOpenChange: "rowActionMenuOpenChange", exportDataEvent: "exportDataEvent", detailStateChange: "detailStateChange" }, ngImport: i0, template: ``, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockAppfxDatagridComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid',
                    standalone: false,
                    template: ``,
                }]
        }], propDecorators: { gridItems: [{
                type: Input
            }], columns: [{
                type: Input
            }], layoutModel: [{
                type: Input
            }], footerModel: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], totalItems: [{
                type: Input
            }], selectionType: [{
                type: Input
            }], selectedItems: [{
                type: Input
            }], datagridLabels: [{
                type: Input
            }], preSelectFirstItem: [{
                type: Input
            }], rowSelectionMode: [{
                type: Input
            }], actionBarActions: [{
                type: Input
            }], showFooter: [{
                type: Input
            }], singleRowActions: [{
                type: Input
            }], noItemsFoundPlaceholder: [{
                type: Input
            }], loading: [{
                type: Input
            }], serverDrivenDatagrid: [{
                type: Input
            }], filterMode: [{
                type: Input
            }], listItemsCount: [{
                type: Input
            }], trackByGridItemProperty: [{
                type: Input
            }], isRowLocked: [{
                type: Input
            }], detailHeader: [{
                type: Input
            }], detailBody: [{
                type: Input
            }], rowDetailContent: [{
                type: Input
            }], rowsExpandedByDefault: [{
                type: Input
            }], vscPersistDatagridSettings: [{
                type: Input
            }], detailState: [{
                type: Input
            }], trackByFunction: [{
                type: Input
            }], virtualScrolling: [{
                type: Input
            }], dataRange: [{
                type: Input
            }], selectedItemsChange: [{
                type: Output
            }], gridItemsChange: [{
                type: Output
            }], selectionChange: [{
                type: Output
            }], searchTermChange: [{
                type: Output
            }], refreshGridData: [{
                type: Output
            }], refreshVirtualGridData: [{
                type: Output
            }], actionClick: [{
                type: Output
            }], rowActionMenuOpenChange: [{
                type: Output
            }], exportDataEvent: [{
                type: Output
            }], detailStateChange: [{
                type: Output
            }] } });
class MockStandaloneDatagridComponent extends MockAppfxDatagridComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockStandaloneDatagridComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockStandaloneDatagridComponent, isStandalone: true, selector: "appfx-datagrid", usesInheritance: true, ngImport: i0, template: ``, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockStandaloneDatagridComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid',
                    standalone: true,
                    template: ``,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDatagridActionBarComponent {
    constructor() {
        this.invokeAction = new EventEmitter();
    }
    onActionClick(action) {
        this.invokeAction.emit(action);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridActionBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: MockDatagridActionBarComponent, isStandalone: false, selector: "appfx-datagrid-action-bar", inputs: { actions: "actions" }, outputs: { invokeAction: "invokeAction" }, ngImport: i0, template: `
    @for (action of actions; track action) {
      <button
        (click)="onActionClick(action)"
        [title]="action.tooltip"
        [attr.data-test-id]="action.id"
        [disabled]="!action.enabled"
      >
        {{ action.label }}
      </button>
    }
  `, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridActionBarComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid-action-bar',
                    standalone: false,
                    template: `
    @for (action of actions; track action) {
      <button
        (click)="onActionClick(action)"
        [title]="action.tooltip"
        [attr.data-test-id]="action.id"
        [disabled]="!action.enabled"
      >
        {{ action.label }}
      </button>
    }
  `,
                }]
        }], propDecorators: { actions: [{
                type: Input
            }], invokeAction: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Component for unit testing purposes to provide a template for rendering datagrid cell content.
 */
class MockDatagridCellContainerComponent {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ngOnInit() {
        if (this.column.columnRenderer) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(this.column.columnRenderer);
            this.componentRef = this.container.createComponent(factory);
            this.instance = this.componentRef?.instance;
            this.instance.item = this.item;
            this.instance.column = this.column;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridCellContainerComponent, deps: [{ token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: MockDatagridCellContainerComponent, isStandalone: false, selector: "appfx-dg-cell-container", inputs: { column: "column", item: "item" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["cellContainer"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: `
    @if (!column.columnRenderer) {
      {{ item?.[column.field] }}
    }
    <ng-template #cellContainer></ng-template>
  `, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridCellContainerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-dg-cell-container',
                    standalone: false,
                    template: `
    @if (!column.columnRenderer) {
      {{ item?.[column.field] }}
    }
    <ng-template #cellContainer></ng-template>
  `,
                }]
        }], ctorParameters: () => [{ type: i0.ComponentFactoryResolver }], propDecorators: { column: [{
                type: Input
            }], item: [{
                type: Input
            }], container: [{
                type: ViewChild,
                args: ['cellContainer', { read: ViewContainerRef, static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDatagridColumnToggleComponent {
    showColumn() { }
    hideColumn() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridColumnToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockDatagridColumnToggleComponent, isStandalone: false, selector: "appfx-dg-column-toggle", inputs: { columns: "columns" }, ngImport: i0, template: ``, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridColumnToggleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-dg-column-toggle',
                    standalone: false,
                    template: ``,
                }]
        }], propDecorators: { columns: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDatagridPersistSettingsDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridPersistSettingsDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: MockDatagridPersistSettingsDirective, isStandalone: false, selector: "appfx-datagrid[appfxPersistDatagridSettings]", inputs: { appfxPersistDatagridSettings: "appfxPersistDatagridSettings", persistPageSize: "persistPageSize", persistSortOrder: "persistSortOrder" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridPersistSettingsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'appfx-datagrid[appfxPersistDatagridSettings]',
                    standalone: false,
                }]
        }], propDecorators: { appfxPersistDatagridSettings: [{
                type: Input
            }], persistPageSize: [{
                type: Input
            }], persistSortOrder: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDatagridPreserveSelectionDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridPreserveSelectionDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: MockDatagridPreserveSelectionDirective, isStandalone: false, selector: "[appfxPreserveSelection]", inputs: { preserveExistingSelection: "preserveExistingSelection" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridPreserveSelectionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[appfxPreserveSelection]',
                    standalone: false,
                }]
        }], propDecorators: { preserveExistingSelection: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class GridHelper {
    constructor(contextDebugElement, indexedEntry) {
        this.indexedEntry = indexedEntry;
        this.isExpandable = false;
        const gridMatches = contextDebugElement.queryAll(By.directive(ClrDatagrid));
        if (!gridMatches.length) {
            throw Error('No grid found by scoped context');
        }
        else if (gridMatches.length > 1 && indexedEntry === undefined) {
            throw Error(`${gridMatches.length} multiple grids under the passed context`);
        }
        else {
            this.componentDebugElement = gridMatches[indexedEntry || 0];
            this.component = this.componentDebugElement.injector.get(ClrDatagrid);
            this.gridElement = this.componentDebugElement.nativeElement;
            this.isExpandable = this.isRowDetailConfigured();
        }
    }
    /**
     * validate grid component that is undefined. If it is defined, its data items collection must be empty
     * @param gridParentDebugElement
     */
    static assertEmpty(gridParentDebugElement) {
        const matchedGrid = gridParentDebugElement.query(By.directive(ClrDatagrid));
        if (!matchedGrid) {
            expect(matchedGrid).toBeNull();
            return;
        }
        const clrGrid = matchedGrid.injector.get(ClrDatagrid);
        if (clrGrid) {
            expect(clrGrid.items.all.length).toBeFalsy();
        }
    }
    // many internal rendering changes occur throughout the Grid rendering pipeline. After sorting and filtering rows changes occur
    detectChanges(fixture) {
        fixture.detectChanges();
        this.component.resize();
        fixture.detectChanges();
    }
    getGridElement() {
        return this.gridElement;
    }
    getGridInternalInstance() {
        return this.component;
    }
    // team developers should annotate grids when multiple exist
    getTestId() {
        return this.getGridElement().dataset['testId'] || undefined;
    }
    // omits control columns such as selector and expandable row toggle
    getHeaders() {
        return Array.from(this.gridElement.querySelectorAll('.datagrid-table .datagrid-header clr-dg-column .datagrid-column-title')).map((element) => (element.textContent ? element.textContent.trim() : ''));
    }
    // omits control columns such as selector and expandable row toggle
    getHiddenHeaders() {
        return Array.from(this.gridElement.querySelectorAll('.datagrid-table .datagrid-header clr-dg-column.datagrid-hidden-column .datagrid-column-title')).map((element) => (element.textContent ? element.textContent.trim() : ''));
    }
    // testing utility logic to verify presence of label, optionally ensuring certain columns are not present
    assertHeaderLabels(includeLabelList, excludeLabelList) {
        const gridHeaderLabelList = this.getHeaders();
        // these columns are present
        if (Array.isArray(includeLabelList)) {
            gridHeaderLabelList.forEach((headerLabel, index) => {
                expect(headerLabel).toEqual(includeLabelList[index], `Cannot find "${headerLabel}" column.`);
            });
        }
        // these columns are not present ( in the DOM ). Currently ignores hidden attribute
        if (Array.isArray(excludeLabelList)) {
            excludeLabelList.forEach(undefinedLabel => {
                expect(gridHeaderLabelList.indexOf(undefinedLabel)).toBeLessThan(0, `There is a "${undefinedLabel}" column.`);
            });
        }
    }
    isRowDetailConfigured() {
        return !!this.gridElement.querySelector('.datagrid-table .datagrid-header .datagrid-column.datagrid-expandable-caret');
    }
    // omits control columns such as selector and expandable row toggle
    getHeaderElements() {
        return Array.from(this.gridElement.querySelectorAll('clr-dg-column')).map((element) => element);
    }
    // omits control columns such as selector and expandable row toggle
    getHeaderElementAt(headerIndex) {
        return this.getHeaderElements()[headerIndex] || undefined;
    }
    getSelectAllElement() {
        return this.gridElement.querySelector(".datagrid-table .datagrid-header .datagrid-column.datagrid-select input[type='checkbox']");
    }
    // only if column title is within a button, consider it as a column sort action
    isColumnSortable(header) {
        const columnIndex = Array.from(this.gridElement.querySelectorAll('.datagrid-table .datagrid-header button.datagrid-column-title'))
            .map((element) => (element.textContent ? element.textContent.trim() : ''))
            .indexOf(header);
        return columnIndex !== -1;
    }
    sortByColumn(header) {
        const headerElements = Array.from(this.gridElement.querySelectorAll('.datagrid-table .datagrid-header button.datagrid-column-title')).filter((element) => {
            return element.textContent && header === element.textContent.trim();
        });
        if (!headerElements || headerElements.length === 0) {
            return false;
        }
        const headerElement = headerElements[0];
        headerElement.click();
        return true;
    }
    sortByColumnIndex(colIndex) {
        const headerElement = this.getHeaderElementAt(colIndex);
        if (!headerElement) {
            throw Error(`The grid does not have column with index ${colIndex}`);
        }
        const columnSortButton = headerElement.querySelector('button.datagrid-column-title');
        if (!columnSortButton) {
            throw Error(`The column is not sortable at ${colIndex}`);
        }
        columnSortButton.click(); // toggle sort
        return true;
    }
    // open filter overlay from icon in the right corner of header cell
    openFilter(header) {
        const headerElement = this.getHeaderElements().find((element) => {
            const columnTitle = element.querySelector('.datagrid-column-title');
            return !!(columnTitle && columnTitle.textContent && columnTitle.textContent.trim() === header);
        });
        if (headerElement) {
            const filterButton = headerElement.querySelector('clr-dg-filter .datagrid-filter-toggle');
            if (filterButton) {
                filterButton.click();
            }
        }
    }
    // shut down filter overlay
    closeFilter() {
        const closeButton = document.body.querySelector('.datagrid-filter button.close');
        if (closeButton) {
            closeButton.click();
        }
    }
    openFilterByColumnIndex(colIndex) {
        const headerElements = this.getHeaderElements();
        if (!headerElements || headerElements.length - 1 < colIndex) {
            throw Error(`The grid does not have column with index ${colIndex}`);
        }
        const filterButton = headerElements[colIndex].querySelector('clr-dg-filter > .datagrid-filter-toggle');
        filterButton.click();
    }
    getFilterInput() {
        const inputElement = document.body.querySelector('.datagrid-filter input');
        return new FilterInputTestHelper(inputElement);
    }
    getRows() {
        const rowElements = this.gridElement.querySelectorAll('clr-dg-row');
        return Array.from(rowElements).map((element) => new GridRowTestHelper(this, element));
    }
    getFooter() {
        const footerElement = this.gridElement.querySelector('clr-dg-footer');
        return new GridFooterTestHelper(footerElement);
    }
    getPlaceholder() {
        const placeholderElement = this.gridElement.querySelector('clr-dg-placeholder');
        if (!placeholderElement) {
            throw Error('No placeholder located in grid');
        }
        return new GridPlaceholder(placeholderElement);
    }
    // visible in the grid on the current page only. to get the actual model of selected items only the component state can determine array
    getSelectedRows() {
        const rowElements = this.gridElement.querySelectorAll('clr-dg-row.datagrid-selected');
        return Array.from(rowElements).map((element) => new GridRowTestHelper(this, element));
    }
    // if datagrid supports row selection mode, force all "visible" rows in view to be checked
    selectAllRows() {
        const canPerform = this.component.selection.rowSelectionMode;
        if (canPerform) {
            this.component.selection.toggleAll();
        }
        return canPerform;
    }
    // if datagrid supports row selection mode, force all "visible" rows in view to be unchecked
    unselectAllRows() {
        const canPerform = this.component.selection.rowSelectionMode;
        if (canPerform) {
            this.component.selection.clearSelection();
        }
        return canPerform;
    }
    clickActionBarButton(label) {
        const btn = this.findActionBarButton(this.getButtonIdentifier(label));
        if (btn) {
            btn.click();
        }
        else {
            throw Error("The action button '" + label + "' does not exist");
        }
    }
    isActionBarButtonDisabled(label) {
        const btn = this.findActionBarButton(this.getButtonIdentifier(label));
        if (btn) {
            return btn.disabled;
        }
        else {
            throw Error("The action button '" + label + "' does not exist");
        }
    }
    getActionBarActionLabels(hasSpan) {
        const buttonElements = this.gridElement.querySelectorAll('clr-dg-action-bar button' + (hasSpan ? ' > span' : ''));
        return Array.from(buttonElements).map((element) => {
            return element && element.innerText ? element.innerText.trim() : '';
        });
    }
    isDataLoading() {
        return this.component.loading;
    }
    findActionBarButton(label) {
        const menuItems = this.gridElement.querySelectorAll('clr-dg-action-bar button');
        const matched = Array.from(menuItems)
            .map(e => (e.textContent ? e.textContent.trim() : ''))
            .indexOf(label);
        return matched >= 0 ? menuItems[matched] : undefined;
    }
    findFooterButton(label) {
        const buttons = this.gridElement.querySelectorAll('clr-dg-footer button');
        const matched = Array.from(buttons)
            .map(e => (e.textContent ? e.textContent.trim() : ''))
            .indexOf(label);
        return matched >= 0 ? buttons[matched] : undefined;
    }
    findFooterDropdownChildButton(label) {
        const buttons = document.querySelectorAll('clr-dropdown-menu button');
        const matched = Array.from(buttons)
            .map(e => (e.textContent ? e.textContent.trim() : ''))
            .indexOf(label);
        return matched >= 0 ? buttons[matched] : undefined;
    }
    /**
     * handle string and array-based i18n bundle-key structures
     */
    getButtonIdentifier(label) {
        if (typeof label === 'string') {
            return label;
        }
        else {
            throw Error('invalid i18n tuple argument');
        }
    }
}
class FilterInputTestHelper {
    constructor(inputElement) {
        this.inputElement = inputElement;
    }
    // presence (or not) of the filter control
    assert(validFlag) {
        if (validFlag) {
            expect(this.inputElement).not.toBeNull();
            expect(this.inputElement.disabled).toEqual(false);
        }
        else {
            expect(this.inputElement).toBeNull();
        }
    }
    inputText(text, triggerEvent) {
        let eventName = 'input';
        if (triggerEvent) {
            eventName = triggerEvent;
        }
        this.inputElement.value = text;
        this.inputElement.dispatchEvent(this.newEvent(eventName));
        // should sync grid??
    }
    // note: should leverage the DebugElement eventing system instead of DOM directly
    newEvent(eventName, bubbles = false, cancelable = false) {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(eventName, bubbles, cancelable, null);
        return evt;
    }
}
class GridFooterTestHelper {
    constructor(footerElement) {
        this.footerElement = footerElement;
    }
    getElement() {
        return this.footerElement;
    }
    getFooterText() {
        return this.footerElement && this.footerElement.textContent ? this.footerElement.textContent.trim() : '';
    }
    openShowHideColumnsMenu() {
        if (!this.footerElement) {
            return;
        }
        const showHideColumnButton = this.footerElement.querySelector('button[cdkOverlayOrigin]');
        showHideColumnButton.click();
    }
    clickShowHideColumnsItem(name) {
        this.getShowHideColumnsItems();
        const showHideColumnsItem = this.findShowHideColumnsItemByName(name);
        if (showHideColumnsItem) {
            showHideColumnsItem.click();
        }
    }
    findShowHideColumnsItemByName(name) {
        const checkBoxLabels = this.getShowHideColumnsItems();
        const labelIndex = checkBoxLabels
            .map((element) => (element.textContent ? element.textContent.trim() : ''))
            .indexOf(name);
        return labelIndex !== -1 ? checkBoxLabels[labelIndex] : null;
    }
    getShowHideColumnsItems() {
        if (!this.footerElement) {
            return [];
        }
        const checkBoxLabels = document.body.querySelectorAll('.column-switch  clr-checkbox-wrapper > label');
        return Array.from(checkBoxLabels);
    }
    clickPreviousPaginationButton() {
        if (!this.footerElement) {
            return;
        }
        const button = this.footerElement.querySelector('clr-dg-pagination  button.pagination-previous');
        if (button && !button.disabled) {
            button.click();
        }
    }
    clickNextPaginationButton() {
        if (!this.footerElement) {
            return;
        }
        const button = this.footerElement.querySelector('clr-dg-pagination  button.pagination-next');
        if (button && !button.disabled) {
            button.click();
        }
    }
    clickPaginationButton(label) {
        if (!this.footerElement) {
            return;
        }
        const paginationButtons = this.footerElement.querySelectorAll('clr-dg-pagination li button');
        const paginationButtonIndex = Array.from(paginationButtons)
            .map((element) => (element.textContent ? element.textContent.trim() : ''))
            .indexOf(label);
        if (paginationButtonIndex !== -1) {
            paginationButtons[paginationButtonIndex].click();
        }
    }
}
class GridRowTestHelper {
    constructor(grid, rowElement) {
        this.grid = grid;
        this.rowElement = rowElement;
    }
    // ignores control datagrid cells, which do not display data
    getCell(header) {
        const columnIndex = this.grid.getHeaders().indexOf(header);
        return this.getCellAt(columnIndex);
    }
    // ignores control datagrid cells, which do not display data
    getCellAt(index) {
        return new GridCellTestHelper(this.rowElement.querySelectorAll('clr-dg-cell').item(index));
    }
    getCellTextAt(index) {
        const cellText = this.rowElement
            .querySelectorAll('clr-dg-cell > span')
            .item(index).textContent;
        return cellText ? cellText.trim() : '';
    }
    getElement() {
        return this.rowElement;
    }
    isSelected() {
        return this.rowElement.classList.contains('datagrid-selected');
    }
    // testing utility logic to verify grid cell value (or substring ) match, and alternatively a negative (non-matching) way to exclude
    assertCellValues(includeValueList, excludeValueList) {
        // these cells are present for equality matching
        if (Array.isArray(includeValueList)) {
            includeValueList.forEach((cellValue, index) => {
                const gridCell = this.getCellAt(index);
                if (cellValue !== undefined) {
                    if (Array.isArray(cellValue)) {
                        // substring containment
                        expect(cellValue.reduce((matched, phrase) => matched && gridCell.getText().includes(phrase), true)).toBe(true);
                    }
                    else {
                        // scalar value
                        expect(gridCell.getText()).toEqual(String(cellValue));
                    }
                }
                else {
                    // undefined means the cell must not be present
                    if (Array.isArray(cellValue)) {
                        // substring containment (negated)
                        expect(cellValue.reduce((matched, phrase) => matched && gridCell.getText().includes(phrase), true)).toBe(false);
                    }
                    else {
                        expect(gridCell.getElement()).toBeNull(`There is no cell at position index ${index}.`);
                    }
                }
            });
        }
        // these cells do not match the actual value in the data cell
        if (Array.isArray(excludeValueList)) {
            excludeValueList.forEach((cellValue, index) => {
                const gridCell = this.getCellAt(index);
                if (cellValue !== undefined) {
                    expect(gridCell.getText()).not.toEqual(String(cellValue));
                }
                else {
                    // undefined means the cell must not be present
                    expect(gridCell.getElement()).not.toBeNull(`There is a no cell at position index ${index}.`);
                }
            });
        }
    }
    // find the row selector for single/multiple actions. Action performed programmatically on label ( despite it being empty )
    select() {
        const selectionElement = this.rowElement.querySelector('.datagrid-cell.datagrid-select .clr-control-label');
        if (!selectionElement) {
            throw Error('The row is not selectable.');
        }
        selectionElement.click();
    }
    /**
     * In case the row selection in the Clarity grid is enabled for multiple selection,
     * ex. [clrDgRowSelection]="true" clicking on the checkbox's input causes both the
     * events for the row selection and the checkbox to be triggered causing the select
     * and deselect of the element immediately one after the other
     */
    selectMultiWithRowSelectionEnabled() {
        const selectionElement = this.rowElement.querySelector('.datagrid-select.datagrid-cell > .clr-checkbox-wrapper');
        if (!selectionElement) {
            throw Error('The row is not selectable.');
        }
        selectionElement.click();
    }
    // clicking the row achieves what? focus
    click() {
        const selectionElement = this.rowElement.querySelector('div.datagrid-row-clickable');
        if (!selectionElement) {
            throw Error('The row is not clickable.');
        }
        selectionElement.click();
    }
    isRowClickable() {
        const selectionElement = this.rowElement.querySelector('div.datagrid-row-clickable');
        return !!selectionElement;
    }
    // check whether the row element has a nested input
    isSelectionAvailable() {
        const selectionInput = this.rowElement.querySelector('input');
        return selectionInput ? true : false;
    }
    // check whether the row element has a nested disabled input
    isSelectionDisabled() {
        const disabledSelectionInput = this.rowElement.querySelector('input[aria-disabled]');
        return disabledSelectionInput ? true : false;
    }
    expand() {
        const expandElement = this.rowElement.querySelector('.datagrid-expandable-caret > button.datagrid-expandable-caret-button');
        if (!expandElement) {
            throw Error('The row is not expandable.');
        }
        expandElement.click();
    }
    isRowExpandable() {
        return (this.rowElement.querySelectorAll('.datagrid-expandable-caret > button.datagrid-expandable-caret-button').length >
            0);
    }
    getSingleRowActionMenuButton() {
        return this.rowElement.querySelector('.datagrid-action-toggle > cds-icon');
    }
    openSingleRowActionMenu() {
        const menuItems = this.rowElement.querySelectorAll('clr-dg-action-overflow  button.datagrid-action-toggle');
        if (menuItems && menuItems.length > 0) {
            menuItems.item(0).click();
            return true;
        }
        return false;
    }
    // retrieve action menu item by name
    getSingleRowActionMenuItem(menuItemName) {
        const menuItems = document.querySelectorAll('div.datagrid-action-overflow button');
        const menuItemIndex = Array.from(menuItems)
            .map((element) => (element.textContent ? element.textContent.trim() : ''))
            .indexOf(menuItemName);
        if (menuItemIndex !== -1) {
            return menuItems[menuItemIndex];
        }
        return undefined;
    }
    clickOnSingleRowActionMenuItem(menuItemName) {
        const menuItem = this.getSingleRowActionMenuItem(menuItemName);
        if (menuItem) {
            menuItem.click();
        }
    }
    isRowSingleSelectable() {
        return (!!this.rowElement.querySelector('.datagrid-select.datagrid-cell > .clr-radio-wrapper') &&
            !!this.grid
                .getGridElement()
                .querySelector('.datagrid-table .datagrid-header > .datagrid-row .datagrid-select.datagrid-column > .datagrid-column-separator'));
    }
}
class GridCellTestHelper {
    constructor(cellElement) {
        this.cellElement = cellElement;
    }
    getElement() {
        return this.cellElement;
    }
    getText() {
        const cellElement = this.cellElement;
        return cellElement.innerText ? cellElement.innerText.trim() : '';
    }
    getChildElementText(selector) {
        const childElement = this.cellElement.querySelector(selector);
        if (childElement) {
            return childElement.innerText ? childElement.innerText.trim() : '';
        }
        return '';
    }
    // datagrid wrapper uses a custom cell objects to project client defined cell formatter
    // optionally query deeper into the custom cell component as defined by column registry
    getCellWrapperElement(selector) {
        const matchedElement = this.cellElement.querySelector('appfx-dg-cell-container');
        if (!matchedElement) {
            return null;
        }
        return selector ? matchedElement.querySelector(selector) : matchedElement;
    }
    // common icons follow the accepted practice of being wrapped in spanned element annotated with "object"
    getObjectIconElement() {
        return this.getElement().querySelector('span.object > i') || undefined;
    }
    // finds the first simple anchor link and fires a click event if found
    clickChildLink() {
        const selectionElement = this.cellElement.querySelector('A');
        if (!selectionElement) {
            throw Error('The cell is not clickable.');
        }
        else {
            selectionElement.click();
        }
    }
}
class GridPlaceholder {
    constructor(placeholderComponentElement) {
        this.placeholderComponentElement = placeholderComponentElement;
    }
    getElement() {
        return this.placeholderComponentElement;
    }
    getText() {
        return this.placeholderComponentElement ? this.placeholderComponentElement.textContent.trim() : undefined;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockIsRowSelectablePipe {
    transform(rowItem, isLocked, disabled) {
        return !isLocked?.(rowItem) || !!disabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockIsRowSelectablePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: MockIsRowSelectablePipe, isStandalone: false, name: "isRowSelectable" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockIsRowSelectablePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'isRowSelectable', standalone: false }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MockDatagridFiltersComponent {
    constructor() {
        this.filterMode = FilterMode.Quick;
        this.searchTermChange = new EventEmitter();
        this.propertyFiltersChange = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridFiltersComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockDatagridFiltersComponent, isStandalone: false, selector: "appfx-datagrid-filters", inputs: { filterMode: "filterMode", filterableProperties: "filterableProperties" }, outputs: { searchTermChange: "searchTermChange", propertyFiltersChange: "propertyFiltersChange" }, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridFiltersComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid-filters',
                    standalone: false,
                    template: '',
                }]
        }], propDecorators: { filterMode: [{
                type: Input
            }], filterableProperties: [{
                type: Input
            }], searchTermChange: [{
                type: Output
            }], propertyFiltersChange: [{
                type: Output
            }] } });
class MockDatagridFiltersStandaloneComponent extends MockDatagridFiltersComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridFiltersStandaloneComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MockDatagridFiltersStandaloneComponent, isStandalone: true, selector: "appfx-datagrid-filters", usesInheritance: true, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MockDatagridFiltersStandaloneComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-datagrid-filters',
                    standalone: true,
                    template: '',
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FilterInputTestHelper, GridCellTestHelper, GridFooterTestHelper, GridHelper, GridPlaceholder, GridRowTestHelper, MockAppfxDatagridComponent, MockDatagridActionBarComponent, MockDatagridCellContainerComponent, MockDatagridColumnToggleComponent, MockDatagridFiltersComponent, MockDatagridFiltersStandaloneComponent, MockDatagridPersistSettingsDirective, MockDatagridPreserveSelectionDirective, MockIsRowSelectablePipe, MockRequiredFieldLegendComponent, MockRequiredFieldLegendStandaloneComponent, MockStandaloneDatagridComponent, ZoomLevelServiceMock };
//# sourceMappingURL=clr-addons-testing.mjs.map
