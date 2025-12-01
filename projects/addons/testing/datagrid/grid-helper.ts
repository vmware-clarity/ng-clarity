/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrDatagrid } from '@clr/angular';

export class GridHelper {
  isExpandable = false;
  private gridElement: HTMLElement;
  private component: ClrDatagrid;
  private componentDebugElement: DebugElement; // retain for deep introspection

  constructor(contextDebugElement: DebugElement, public indexedEntry?: number) {
    const gridMatches = contextDebugElement.queryAll(By.directive(ClrDatagrid));

    if (!gridMatches.length) {
      throw Error('No grid found by scoped context');
    } else if (gridMatches.length > 1 && indexedEntry === undefined) {
      throw Error(`${gridMatches.length} multiple grids under the passed context`);
    } else {
      this.componentDebugElement = gridMatches[indexedEntry || 0];
      this.component = this.componentDebugElement.injector.get<ClrDatagrid>(ClrDatagrid);
      this.gridElement = this.componentDebugElement.nativeElement;
      this.isExpandable = this.isRowDetailConfigured();
    }
  }

  /**
   * validate grid component that is undefined. If it is defined, its data items collection must be empty
   * @param gridParentDebugElement
   */
  static assertEmpty(gridParentDebugElement: DebugElement): void {
    const matchedGrid = gridParentDebugElement.query(By.directive(ClrDatagrid));
    if (!matchedGrid) {
      expect(matchedGrid).toBeNull();
      return;
    }

    const clrGrid = matchedGrid.injector.get<ClrDatagrid>(ClrDatagrid);
    if (clrGrid) {
      expect(clrGrid.items.all.length).toBeFalsy();
    }
  }

  // many internal rendering changes occur throughout the Grid rendering pipeline. After sorting and filtering rows changes occur
  detectChanges(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
    this.component.resize();
    fixture.detectChanges();
  }

  getGridElement(): HTMLElement {
    return this.gridElement;
  }

  getGridInternalInstance(): ClrDatagrid {
    return this.component;
  }

  // team developers should annotate grids when multiple exist
  getTestId(): string | undefined {
    return this.getGridElement().dataset['testId'] || undefined;
  }

  // omits control columns such as selector and expandable row toggle
  getHeaders(): string[] {
    return Array.from(
      this.gridElement.querySelectorAll(
        '.datagrid-table .datagrid-header clr-dg-column .datagrid-column-title'
      ) as NodeListOf<HTMLElement>
    ).map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''));
  }

  // omits control columns such as selector and expandable row toggle
  getHiddenHeaders(): string[] {
    return Array.from(
      this.gridElement.querySelectorAll(
        '.datagrid-table .datagrid-header clr-dg-column.datagrid-hidden-column .datagrid-column-title'
      ) as NodeListOf<HTMLElement>
    ).map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''));
  }

  // testing utility logic to verify presence of label, optionally ensuring certain columns are not present
  assertHeaderLabels(includeLabelList: Array<string>, excludeLabelList?: Array<string>) {
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

  isRowDetailConfigured(): boolean {
    return !!this.gridElement.querySelector(
      '.datagrid-table .datagrid-header .datagrid-column.datagrid-expandable-caret'
    );
  }

  // omits control columns such as selector and expandable row toggle
  getHeaderElements(): HTMLElement[] {
    return Array.from(this.gridElement.querySelectorAll('clr-dg-column') as NodeListOf<HTMLElement>).map(
      (element: HTMLElement) => element
    );
  }

  // omits control columns such as selector and expandable row toggle
  getHeaderElementAt(headerIndex: number): HTMLElement | undefined {
    return this.getHeaderElements()[headerIndex] || undefined;
  }

  getSelectAllElement(): HTMLElement | null {
    return this.gridElement.querySelector(
      ".datagrid-table .datagrid-header .datagrid-column.datagrid-select input[type='checkbox']"
    );
  }

  // only if column title is within a button, consider it as a column sort action
  isColumnSortable(header: string): boolean {
    const columnIndex: number = Array.from(
      this.gridElement.querySelectorAll(
        '.datagrid-table .datagrid-header button.datagrid-column-title'
      ) as NodeListOf<HTMLElement>
    )
      .map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''))
      .indexOf(header);

    return columnIndex !== -1;
  }

  sortByColumn(header: string): boolean {
    const headerElements = Array.from(
      this.gridElement.querySelectorAll(
        '.datagrid-table .datagrid-header button.datagrid-column-title'
      ) as NodeListOf<HTMLButtonElement>
    ).filter((element: HTMLElement) => {
      return element.textContent && header === element.textContent.trim();
    });

    if (!headerElements || headerElements.length === 0) {
      return false;
    }
    const headerElement = headerElements[0] as HTMLElement;
    headerElement.click();
    return true;
  }

  sortByColumnIndex(colIndex: number): boolean {
    const headerElement = this.getHeaderElementAt(colIndex);

    if (!headerElement) {
      throw Error(`The grid does not have column with index ${colIndex}`);
    }

    const columnSortButton = headerElement.querySelector<HTMLButtonElement>('button.datagrid-column-title');

    if (!columnSortButton) {
      throw Error(`The column is not sortable at ${colIndex}`);
    }

    columnSortButton.click(); // toggle sort
    return true;
  }

  // open filter overlay from icon in the right corner of header cell
  openFilter(header: string): void {
    const headerElement: HTMLElement = <HTMLElement>this.getHeaderElements().find((element: HTMLElement) => {
      const columnTitle: HTMLElement = <HTMLElement>element.querySelector('.datagrid-column-title');
      return !!(columnTitle && columnTitle.textContent && columnTitle.textContent.trim() === header);
    });

    if (headerElement) {
      const filterButton = headerElement.querySelector<HTMLButtonElement>('clr-dg-filter .datagrid-filter-toggle');
      if (filterButton) {
        filterButton.click();
      }
    }
  }

  // shut down filter overlay
  closeFilter(): void {
    const closeButton = document.body.querySelector<HTMLButtonElement>('.datagrid-filter button.close');
    if (closeButton) {
      closeButton.click();
    }
  }

  openFilterByColumnIndex(colIndex: number): void {
    const headerElements: HTMLElement[] = this.getHeaderElements();

    if (!headerElements || headerElements.length - 1 < colIndex) {
      throw Error(`The grid does not have column with index ${colIndex}`);
    }

    const filterButton: HTMLElement = headerElements[colIndex].querySelector(
      'clr-dg-filter > .datagrid-filter-toggle'
    ) as HTMLElement;
    filterButton.click();
  }

  getFilterInput(): FilterInputTestHelper {
    const inputElement: HTMLInputElement = document.body.querySelector('.datagrid-filter input') as HTMLInputElement;
    return new FilterInputTestHelper(inputElement);
  }

  getRows(): GridRowTestHelper[] {
    const rowElements: NodeListOf<HTMLElement> = this.gridElement.querySelectorAll('clr-dg-row');
    return Array.from(rowElements).map((element: HTMLElement) => new GridRowTestHelper(this, element));
  }

  getFooter(): GridFooterTestHelper {
    const footerElement: HTMLElement | null = this.gridElement.querySelector('clr-dg-footer');
    return new GridFooterTestHelper(footerElement);
  }

  getPlaceholder(): GridPlaceholder {
    const placeholderElement = this.gridElement.querySelector<HTMLElement>('clr-dg-placeholder');
    if (!placeholderElement) {
      throw Error('No placeholder located in grid');
    }
    return new GridPlaceholder(placeholderElement);
  }

  // visible in the grid on the current page only. to get the actual model of selected items only the component state can determine array
  getSelectedRows(): GridRowTestHelper[] {
    const rowElements: NodeListOf<HTMLElement> = this.gridElement.querySelectorAll('clr-dg-row.datagrid-selected');
    return Array.from(rowElements).map((element: HTMLElement) => new GridRowTestHelper(this, element));
  }

  // if datagrid supports row selection mode, force all "visible" rows in view to be checked
  selectAllRows(): boolean {
    const canPerform = this.component.selection.rowSelectionMode;
    if (canPerform) {
      this.component.selection.toggleAll();
    }
    return canPerform;
  }

  // if datagrid supports row selection mode, force all "visible" rows in view to be unchecked
  unselectAllRows(): boolean {
    const canPerform = this.component.selection.rowSelectionMode;
    if (canPerform) {
      this.component.selection.clearSelection();
    }
    return canPerform;
  }

  clickActionBarButton(label: string): void {
    const btn = this.findActionBarButton(this.getButtonIdentifier(label));
    if (btn) {
      btn.click();
    } else {
      throw Error("The action button '" + label + "' does not exist");
    }
  }

  isActionBarButtonDisabled(label: string): boolean {
    const btn = this.findActionBarButton(this.getButtonIdentifier(label));
    if (btn) {
      return btn.disabled;
    } else {
      throw Error("The action button '" + label + "' does not exist");
    }
  }

  getActionBarActionLabels(hasSpan?: boolean): Array<string> {
    const buttonElements: NodeListOf<HTMLButtonElement> = this.gridElement.querySelectorAll(
      'clr-dg-action-bar button' + (hasSpan ? ' > span' : '')
    );
    return Array.from(buttonElements).map((element: HTMLElement) => {
      return element && element.innerText ? element.innerText.trim() : '';
    });
  }

  isDataLoading(): boolean {
    return this.component.loading;
  }

  findActionBarButton(label: string): HTMLButtonElement | undefined {
    const menuItems = this.gridElement.querySelectorAll<HTMLButtonElement>('clr-dg-action-bar button');

    const matched = Array.from(menuItems)
      .map(e => (e.textContent ? e.textContent.trim() : ''))
      .indexOf(label);
    return matched >= 0 ? menuItems[matched] : undefined;
  }

  /**
   * handle string and array-based i18n bundle-key structures
   */
  private getButtonIdentifier(label: string): string {
    if (typeof label === 'string') {
      return label;
    } else {
      throw Error('invalid i18n tuple argument');
    }
  }
}

export class FilterInputTestHelper {
  constructor(private inputElement: HTMLInputElement) {}

  // presence (or not) of the filter control
  assert(validFlag: boolean): void {
    if (validFlag) {
      expect(this.inputElement).not.toBeNull();
      expect(this.inputElement.disabled).toEqual(false);
    } else {
      expect(this.inputElement).toBeNull();
    }
  }

  inputText(text: string, triggerEvent?: string) {
    let eventName = 'input';
    if (triggerEvent) {
      eventName = triggerEvent;
    }

    this.inputElement.value = text;
    this.inputElement.dispatchEvent(this.newEvent(eventName));
    // should sync grid??
  }

  // note: should leverage the DebugElement eventing system instead of DOM directly
  private newEvent(eventName: string, bubbles = false, cancelable = false) {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
  }
}

export class GridFooterTestHelper {
  constructor(private footerElement: HTMLElement | null) {}

  getElement(): HTMLElement {
    return this.footerElement as HTMLElement;
  }

  getFooterText(): string {
    return this.footerElement && this.footerElement.textContent ? this.footerElement.textContent.trim() : '';
  }

  openShowHideColumnsMenu(): void {
    if (!this.footerElement) {
      return;
    }
    const showHideColumnButton: HTMLElement = this.footerElement.querySelector(
      'button[cdkOverlayOrigin]'
    ) as HTMLElement;
    showHideColumnButton.click();
  }

  clickShowHideColumnsItem(name: string): void {
    this.getShowHideColumnsItems();
    const showHideColumnsItem: any = this.findShowHideColumnsItemByName(name);
    if (showHideColumnsItem) {
      showHideColumnsItem.click();
    }
  }

  findShowHideColumnsItemByName(name: string): any {
    const checkBoxLabels: any[] = this.getShowHideColumnsItems();
    const labelIndex: number = checkBoxLabels
      .map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''))
      .indexOf(name);

    return labelIndex !== -1 ? checkBoxLabels[labelIndex] : null;
  }

  getShowHideColumnsItems(): any[] {
    if (!this.footerElement) {
      return [];
    }
    const checkBoxLabels: any = document.body.querySelectorAll('.column-switch  clr-checkbox-wrapper > label');
    return Array.from(checkBoxLabels);
  }

  clickPreviousPaginationButton(): void {
    if (!this.footerElement) {
      return;
    }
    const button = this.footerElement.querySelector<HTMLButtonElement>('clr-dg-pagination  button.pagination-previous');
    if (button && !button.disabled) {
      button.click();
    }
  }

  clickNextPaginationButton(): void {
    if (!this.footerElement) {
      return;
    }
    const button = this.footerElement.querySelector<HTMLButtonElement>('clr-dg-pagination  button.pagination-next');
    if (button && !button.disabled) {
      button.click();
    }
  }

  clickPaginationButton(label: string): void {
    if (!this.footerElement) {
      return;
    }
    const paginationButtons: NodeListOf<HTMLButtonElement> =
      this.footerElement.querySelectorAll('clr-dg-pagination li button');
    const paginationButtonIndex: number = Array.from(paginationButtons)
      .map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''))
      .indexOf(label);
    if (paginationButtonIndex !== -1) {
      paginationButtons[paginationButtonIndex].click();
    }
  }
}

export class GridRowTestHelper {
  constructor(private grid: GridHelper, private rowElement: HTMLElement) {}

  // ignores control datagrid cells, which do not display data
  getCell(header: string): GridCellTestHelper {
    const columnIndex = this.grid.getHeaders().indexOf(header);
    return this.getCellAt(columnIndex);
  }

  // ignores control datagrid cells, which do not display data
  getCellAt(index: number): GridCellTestHelper {
    return new GridCellTestHelper(this.rowElement.querySelectorAll<HTMLElement>('clr-dg-cell').item(index));
  }

  getCellTextAt(index: number): string {
    const cellText: string | null = this.rowElement
      .querySelectorAll<HTMLElement>('clr-dg-cell > span')
      .item(index).textContent;
    return cellText ? cellText.trim() : '';
  }

  getElement(): HTMLElement {
    return this.rowElement as HTMLElement;
  }

  isSelected(): boolean {
    return this.rowElement.classList.contains('datagrid-selected');
  }

  // testing utility logic to verify grid cell value (or substring ) match, and alternatively a negative (non-matching) way to exclude
  assertCellValues(
    includeValueList: Array<string | number | Array<string> | undefined>,
    excludeValueList?: Array<string | number | Array<string> | undefined>
  ): void {
    // these cells are present for equality matching
    if (Array.isArray(includeValueList)) {
      includeValueList.forEach((cellValue, index) => {
        const gridCell = this.getCellAt(index);
        if (cellValue !== undefined) {
          if (Array.isArray(cellValue)) {
            // substring containment
            expect(
              (cellValue as Array<any>).reduce(
                (matched, phrase) => matched && gridCell.getText().includes(phrase),
                true
              )
            ).toBe(true);
          } else {
            // scalar value
            expect(gridCell.getText()).toEqual(String(cellValue));
          }
        } else {
          // undefined means the cell must not be present
          if (Array.isArray(cellValue)) {
            // substring containment (negated)
            expect(
              (cellValue as Array<any>).reduce(
                (matched, phrase) => matched && gridCell.getText().includes(phrase),
                true
              )
            ).toBe(false);
          } else {
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
        } else {
          // undefined means the cell must not be present
          expect(gridCell.getElement()).not.toBeNull(`There is a no cell at position index ${index}.`);
        }
      });
    }
  }

  // find the row selector for single/multiple actions. Action performed programmatically on label ( despite it being empty )
  select(): void {
    const selectionElement = this.rowElement.querySelector<HTMLLabelElement>(
      '.datagrid-cell.datagrid-select .clr-control-label'
    );
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
  selectMultiWithRowSelectionEnabled(): void {
    const selectionElement: HTMLElement | null = this.rowElement.querySelector(
      '.datagrid-select.datagrid-cell > .clr-checkbox-wrapper'
    );
    if (!selectionElement) {
      throw Error('The row is not selectable.');
    }
    (selectionElement as HTMLElement).click();
  }

  // clicking the row achieves what? focus
  click(): void {
    const selectionElement: HTMLElement | null = this.rowElement.querySelector('div.datagrid-row-clickable');

    if (!selectionElement) {
      throw Error('The row is not clickable.');
    }
    (selectionElement as HTMLElement).click();
  }

  isRowClickable(): boolean {
    const selectionElement: HTMLElement | null = this.rowElement.querySelector('div.datagrid-row-clickable');
    return !!selectionElement;
  }

  // check whether the row element has a nested input
  isSelectionAvailable(): boolean {
    const selectionInput: HTMLElement | null = this.rowElement.querySelector('input');
    return selectionInput ? true : false;
  }

  // check whether the row element has a nested disabled input
  isSelectionDisabled(): boolean {
    const disabledSelectionInput: HTMLElement | null = this.rowElement.querySelector('input[aria-disabled]');
    return disabledSelectionInput ? true : false;
  }

  expand(): void {
    const expandElement: HTMLElement | null = this.rowElement.querySelector(
      '.datagrid-expandable-caret > button.datagrid-expandable-caret-button'
    );
    if (!expandElement) {
      throw Error('The row is not expandable.');
    }
    (expandElement as HTMLElement).click();
  }

  isRowExpandable(): boolean {
    return (
      this.rowElement.querySelectorAll('.datagrid-expandable-caret > button.datagrid-expandable-caret-button').length >
      0
    );
  }

  getSingleRowActionMenuButton(): HTMLElement {
    return this.rowElement.querySelector('.datagrid-action-toggle > cds-icon') as HTMLElement;
  }

  openSingleRowActionMenu(): boolean {
    const menuItems = this.rowElement.querySelectorAll('clr-dg-action-overflow  button.datagrid-action-toggle');
    if (menuItems && menuItems.length > 0) {
      (menuItems.item(0) as HTMLButtonElement).click();
      return true;
    }

    return false;
  }

  // retrieve action menu item by name
  getSingleRowActionMenuItem(menuItemName: string): HTMLButtonElement | undefined {
    const menuItems: NodeListOf<HTMLButtonElement> = document.querySelectorAll('div.datagrid-action-overflow button');
    const menuItemIndex: number = Array.from(menuItems)
      .map((element: HTMLElement) => (element.textContent ? element.textContent.trim() : ''))
      .indexOf(menuItemName);
    if (menuItemIndex !== -1) {
      return menuItems[menuItemIndex];
    }

    return undefined;
  }

  clickOnSingleRowActionMenuItem(menuItemName: string): void {
    const menuItem = this.getSingleRowActionMenuItem(menuItemName);
    if (menuItem) {
      menuItem.click();
    }
  }

  isRowSingleSelectable(): boolean {
    return (
      !!this.rowElement.querySelector('.datagrid-select.datagrid-cell > .clr-radio-wrapper') &&
      !!this.grid
        .getGridElement()
        .querySelector(
          '.datagrid-table .datagrid-header > .datagrid-row .datagrid-select.datagrid-column > .datagrid-column-separator'
        )
    );
  }
}

export class GridCellTestHelper {
  constructor(private cellElement: HTMLElement) {}

  getElement(): HTMLElement {
    return this.cellElement;
  }

  getText(): string {
    const cellElement = this.cellElement as HTMLElement;
    return cellElement.innerText ? cellElement.innerText.trim() : '';
  }

  getChildElementText(selector: string): string {
    const childElement: HTMLElement | null = this.cellElement.querySelector(selector) as HTMLElement;
    if (childElement) {
      return childElement.innerText ? childElement.innerText.trim() : '';
    }
    return '';
  }

  // datagrid wrapper uses a custom cell objects to project client defined cell formatter
  // optionally query deeper into the custom cell component as defined by column registry
  getCellWrapperElement(selector?: string): HTMLElement | null {
    const matchedElement = this.cellElement.querySelector<HTMLElement>('appfx-dg-cell-container');
    if (!matchedElement) {
      return null;
    }

    return selector ? matchedElement.querySelector(selector) : matchedElement;
  }

  // common icons follow the accepted practice of being wrapped in spanned element annotated with "object"
  getObjectIconElement(): HTMLElement | undefined {
    return this.getElement().querySelector<HTMLElement>('span.object > i') || undefined;
  }

  // finds the first simple anchor link and fires a click event if found
  clickChildLink(): void {
    const selectionElement = this.cellElement.querySelector<HTMLAnchorElement>('A');

    if (!selectionElement) {
      throw Error('The cell is not clickable.');
    } else {
      selectionElement.click();
    }
  }

  /* future work: add reference to custom object */
}

export class GridPlaceholder {
  constructor(private placeholderComponentElement: HTMLElement) {}

  getElement(): HTMLElement {
    return this.placeholderComponentElement as HTMLElement;
  }

  getText(): string | undefined {
    return this.placeholderComponentElement ? this.placeholderComponentElement.textContent.trim() : undefined;
  }
}
