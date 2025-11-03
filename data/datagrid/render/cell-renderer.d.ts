import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { DatagridRenderOrganizer } from './render-organizer';
import { ColumnState } from '../interfaces/column-state.interface';
export declare class DatagridCellRenderer implements OnDestroy {
    private el;
    private renderer;
    private stateSubscription;
    private subscriptions;
    constructor(el: ElementRef<HTMLElement>, renderer: Renderer2, organizer: DatagridRenderOrganizer);
    ngOnDestroy(): void;
    resetState(state: ColumnState): void;
    setWidth(state: ColumnState): void;
    setHidden(state: ColumnState): void;
    private clearWidth;
}
