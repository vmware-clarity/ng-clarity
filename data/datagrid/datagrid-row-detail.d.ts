import { AfterContentInit, OnDestroy, QueryList } from '@angular/core';
import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { SelectionType } from './enums/selection-type';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
export declare class ClrDatagridRowDetail implements AfterContentInit, OnDestroy {
    selection: Selection;
    rowActionService: RowActionService;
    expand: DatagridIfExpandService;
    expandableRows: ExpandableRowsCount;
    commonStrings: ClrCommonStringsService;
    _beginningOfExpandableContentAriaText: string;
    _endOfExpandableContentAriaText: string;
    replacedRow: boolean;
    SELECTION_TYPE: typeof SelectionType;
    cells: QueryList<ClrDatagridCell>;
    private subscriptions;
    constructor(selection: Selection, rowActionService: RowActionService, expand: DatagridIfExpandService, expandableRows: ExpandableRowsCount, commonStrings: ClrCommonStringsService);
    set replace(value: boolean);
    get beginningOfExpandableContentAriaText(): string;
    get endOfExpandableContentAriaText(): string;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
