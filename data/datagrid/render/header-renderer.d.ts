import { ElementRef, EventEmitter, OnDestroy, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatagridRenderOrganizer } from './render-organizer';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { ColumnState } from '../interfaces/column-state.interface';
import { ColumnResizerService } from '../providers/column-resizer.service';
import { ColumnsService } from '../providers/columns.service';
export declare class DatagridHeaderRenderer implements OnDestroy {
    private el;
    private renderer;
    private domAdapter;
    private columnResizerService;
    private columnsService;
    private columnState;
    resizeEmitter: EventEmitter<number>;
    /**
     * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
     */
    private widthSet;
    private autoSet;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer, domAdapter: DomAdapter, columnResizerService: ColumnResizerService, columnsService: ColumnsService, columnState: BehaviorSubject<ColumnState>);
    ngOnDestroy(): void;
    getColumnWidthState(): Partial<ColumnState>;
    setColumnState(index: number): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
    private detectStrictWidth;
    private computeWidth;
}
