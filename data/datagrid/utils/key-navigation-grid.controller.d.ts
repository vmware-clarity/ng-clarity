import { EventEmitter, NgZone, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare function getTabbableItems(el: HTMLElement): HTMLElement[];
export interface KeyNavigationGridConfig {
    keyGrid: string;
    keyGridRows: string;
    keyGridCells: string;
}
export interface CellCoordinates {
    x: number;
    y: number;
    ariaRowIndex?: string;
}
export declare class KeyNavigationGridController implements OnDestroy {
    private zone;
    nextCellCoordsEmitter: EventEmitter<CellCoordinates>;
    skipItemFocus: boolean;
    preventScrollOnFocus: boolean;
    config: KeyNavigationGridConfig;
    private keyNavUtils;
    private listenersAdded;
    private destroy$;
    constructor(zone: NgZone);
    ngOnDestroy(): void;
    addListeners(): void;
    initializeKeyGrid(host: HTMLElement): void;
    resetKeyGrid(): void;
    setActiveCell(activeCell: HTMLElement): void;
    focusElement(activeCell: HTMLElement, options?: FocusOptions): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyNavigationGridController, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyNavigationGridController>;
}
