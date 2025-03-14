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
    private host;
    private config;
    private listenersAdded;
    private destroy$;
    private _activeCell;
    constructor(zone: NgZone);
    private get grid();
    private get rows();
    private get cells();
    ngOnDestroy(): void;
    addListeners(): void;
    initializeKeyGrid(host: HTMLElement): void;
    resetKeyGrid(): void;
    removeActiveCell(): void;
    getActiveCell(): HTMLElement;
    setActiveCell(activeCell: HTMLElement, { keepFocus }?: {
        keepFocus: boolean;
    }): void;
    private getNextForExpandedRowCoordinate;
    private getNextItemCoordinate;
    private getCalcVariables;
    private getCurrentCellCoordinates;
    private getCellsForRow;
    private isExpandedRow;
    private isDetailsRow;
    private isRowReplaced;
    private isSingleCellExpandedRow;
    private actionCellCount;
    private actionCellsAsArray;
    private isActionCell;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeyNavigationGridController, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<KeyNavigationGridController>;
}
