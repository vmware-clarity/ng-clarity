import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ColumnState } from '../interfaces/column-state.interface';
import { DatagridRenderOrganizer } from './render-organizer';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridCellRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DatagridCellRenderer, "clr-dg-cell", never, {}, {}, never, never, false, never>;
}
