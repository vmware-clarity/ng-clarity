import { CellCoordinates } from '../key-navigation-grid.controller';
import { KeyNavigationUtils } from '../key-navigation-utils';
import { ExpandedRowKeyNavigationStrategy } from './expanded-row';
export declare class ExpandedColumnsRowKeyNavigationStrategy extends ExpandedRowKeyNavigationStrategy {
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
