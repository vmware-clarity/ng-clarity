import { EventEmitter, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnState } from './interfaces/column-state.interface';
import { ColumnsService } from './providers/columns.service';
import * as i0 from "@angular/core";
export declare class ClrDatagridHideableColumn implements OnDestroy {
    private titleTemplateRef;
    private columnsService;
    private columnState;
    hiddenChange: EventEmitter<boolean>;
    /**
     *
     * @description
     * Used to initialize the column with either hidden or visible state.
     *
     */
    private _hidden;
    private subscriptions;
    constructor(titleTemplateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    /**
     *
     * @description
     * Setter fn for the @Input with the same name as this structural directive.
     * It allows the user to pre-configure the column's hide/show state. { hidden: true }
     * It's more verbose but has more Clarity.
     *
     * @example
     * *clrDgHideableColumn
     * *clrDgHideableColumn={hidden: false}
     * *clrDgHideableColumn={hidden: true}
     *
     */
    set clrDgHideableColumn(value: {
        hidden: boolean;
    } | string);
    set clrDgHidden(hidden: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridHideableColumn, [null, null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatagridHideableColumn, "[clrDgHideableColumn]", never, { "clrDgHideableColumn": "clrDgHideableColumn"; "clrDgHidden": "clrDgHidden"; }, { "hiddenChange": "clrDgHiddenChange"; }, never, never, false, never>;
}
