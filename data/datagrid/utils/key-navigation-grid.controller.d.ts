import { NgZone, OnDestroy } from '@angular/core';
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
}
export declare class KeyNavigationGridController implements OnDestroy {
    private zone;
    skipItemFocus: boolean;
    private keyNavUtils;
    private config;
    private listenersAdded;
    private destroy$;
    private _activeCell;
    constructor(zone: NgZone);
    ngOnDestroy(): void;
    addListeners(): void;
    initializeKeyGrid(host: HTMLElement): void;
    resetKeyGrid(): void;
    removeActiveCell(): void;
    getActiveCell(): HTMLElement;
    setActiveCell(activeCell: HTMLElement, { keepFocus }?: {
        keepFocus: boolean;
    }): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyNavigationGridController, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyNavigationGridController>;
}
