import { ElementRef } from '@angular/core';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridRenderOrganizer } from '../render/render-organizer';
import * as i0 from "@angular/core";
export declare class ColumnResizerService {
    private el;
    private domAdapter;
    private organizer;
    isWithinMaxResizeRange: boolean;
    private widthBeforeResize;
    private _resizedBy;
    constructor(el: ElementRef<HTMLElement>, domAdapter: DomAdapter, organizer: DatagridRenderOrganizer);
    get resizedBy(): number;
    get minColumnWidth(): number;
    get maxResizeRange(): number;
    get widthAfterResize(): number;
    startResize(): void;
    endResize(): void;
    calculateResize(resizedBy: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnResizerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnResizerService>;
}
