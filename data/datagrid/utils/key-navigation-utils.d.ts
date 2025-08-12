import { CellCoordinates, KeyNavigationGridConfig } from './key-navigation-grid.controller';
export declare class KeyNavigationUtils {
    host: HTMLElement;
    config: KeyNavigationGridConfig;
    constructor(host: HTMLElement, config: KeyNavigationGridConfig);
    get grid(): Element;
    get rows(): NodeListOf<HTMLElement>;
    get cells(): NodeListOf<HTMLElement>;
    get currentCellCoordinates(): CellCoordinates;
    get averageRowHeight(): number;
    get itemsPerPage(): number;
    setAriaRowIndexTo(cellCoords: CellCoordinates): void;
    getNextItemCoordinate(e: KeyboardEvent): CellCoordinates;
    getCellsForRow(index: number): NodeListOf<Element>;
    isExpandedRow(index: number): boolean;
    isDetailsRow(index: number): boolean;
    isRowReplaced(index: number): boolean;
    isSingleCellExpandedRow(index: number): boolean;
    actionCellCount(index: number): number;
    actionCellsAsArray(index: number): Element[];
    isActionCell(cellCoords: CellCoordinates): boolean;
    createNextCellCoords(cellCoords: CellCoordinates): CellCoordinates;
    private getNavStrategy;
}
