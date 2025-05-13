import { CellCoordinates } from '../key-navigation-grid.controller';
import { KeyNavigationUtils } from '../key-navigation-utils';
import { DefaultKeyNavigationStrategy } from './default';
export declare class ExpandedRowKeyNavigationStrategy extends DefaultKeyNavigationStrategy {
    constructor(utils: KeyNavigationUtils);
    keyUp(currentCellCoords: CellCoordinates): CellCoordinates;
    keyDown(currentCellCoords: CellCoordinates): CellCoordinates;
    keyLeft(currentCellCoords: CellCoordinates): CellCoordinates;
    keyRight(currentCellCoords: CellCoordinates): CellCoordinates;
    keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean): CellCoordinates;
    keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean): CellCoordinates;
    keyPageUp(currentCellCoords: CellCoordinates): CellCoordinates;
    keyPageDown(currentCellCoords: CellCoordinates): CellCoordinates;
}
