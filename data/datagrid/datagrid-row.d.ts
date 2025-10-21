import { AfterContentInit, AfterViewInit, ElementRef, EventEmitter, QueryList, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ClrExpandableAnimationDirective } from '../../utils/animations/expandable-animation/expandable-animation.directive';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridCell } from './datagrid-cell';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { SelectionType } from './enums/selection-type';
import { DetailService } from './providers/detail.service';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import * as i0 from "@angular/core";
export declare class ClrDatagridRow<T = any> implements AfterContentInit, AfterViewInit {
    selection: Selection<T>;
    rowActionService: RowActionService;
    globalExpandable: ExpandableRowsCount;
    expand: DatagridIfExpandService;
    detailService: DetailService;
    private displayMode;
    private vcr;
    el: ElementRef<HTMLElement>;
    commonStrings: ClrCommonStringsService;
    private items;
    private document;
    selectedChanged: EventEmitter<boolean>;
    expandedChange: EventEmitter<boolean>;
    detailDisabled: boolean;
    detailHidden: boolean;
    skeletonLoading: boolean;
    id: string;
    radioId: string;
    checkboxId: string;
    expandableId: string;
    replaced: boolean;
    displayCells: boolean;
    expandAnimationTrigger: boolean;
    SELECTION_TYPE: typeof SelectionType;
    /**
     * @internal
     */
    itemChanges: ReplaySubject<T>;
    /*****
     * property dgCells
     *
     * @description
     * A Query List of the ClrDatagrid cells in this row.
     *
     */
    dgCells: QueryList<ClrDatagridCell>;
    expandAnimation: ClrExpandableAnimationDirective;
    detailButton: ElementRef<HTMLButtonElement>;
    _stickyCells: ViewContainerRef;
    _scrollableCells: ViewContainerRef;
    _calculatedCells: ViewContainerRef;
    _fixedCellTemplate: TemplateRef<any>;
    private _item;
    private _selected;
    private _detailOpenLabel;
    private _detailCloseLabel;
    private _rowSelectionLabel;
    private wrappedInjector;
    private subscriptions;
    private _selectable;
    constructor(selection: Selection<T>, rowActionService: RowActionService, globalExpandable: ExpandableRowsCount, expand: DatagridIfExpandService, detailService: DetailService, displayMode: DisplayModeService, vcr: ViewContainerRef, renderer: Renderer2, el: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService, items: Items, document: any);
    /**
     * Model of the row, to use for selection
     */
    get item(): T;
    set item(item: T);
    get clrDgSelectable(): boolean | string;
    set clrDgSelectable(value: boolean | string);
    /**
     * Indicates if the row is selected
     */
    get selected(): boolean | string;
    set selected(value: boolean | string);
    get expanded(): boolean | string;
    set expanded(value: boolean | string);
    get clrDgDetailOpenLabel(): string;
    set clrDgDetailOpenLabel(label: string);
    get clrDgDetailCloseLabel(): string;
    set clrDgDetailCloseLabel(label: string);
    get clrDgRowSelectionLabel(): string;
    set clrDgRowSelectionLabel(label: string);
    get _view(): any;
    get trackBy(): import("./providers/items").ClrDatagridItemsTrackByFunction<any>;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    toggle(selected?: boolean): void;
    toggleExpand(): void;
    /**
     * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
     * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
     * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
     * selection browser functionality, which is inconsistently implemented in browsers anyway.
     */
    clearRanges(event: MouseEvent): void;
    /**
     * @deprecated related to clrDgRowSelection, which is deprecated
     */
    protected selectRow(selected: boolean, $event: any): void;
    private rangeSelect;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridRow<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridRow<any>, "clr-dg-row", never, { "detailDisabled": "clrDgDetailDisabled"; "detailHidden": "clrDgDetailHidden"; "skeletonLoading": "clrDgSkeletonLoading"; "item": "clrDgItem"; "clrDgSelectable": "clrDgSelectable"; "selected": "clrDgSelected"; "expanded": "clrDgExpanded"; "clrDgDetailOpenLabel": "clrDgDetailOpenLabel"; "clrDgDetailCloseLabel": "clrDgDetailCloseLabel"; "clrDgRowSelectionLabel": "clrDgRowSelectionLabel"; }, { "selectedChanged": "clrDgSelectedChange"; "expandedChange": "clrDgExpandedChange"; }, ["dgCells"], ["clr-dg-action-overflow", "clr-dg-cell", "clr-dg-row-detail"], false, never>;
}
