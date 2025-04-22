import { KeyNavigationGridStrategyInterface } from '../../interfaces/key-nav-grid-strategy.interface';
import { CellCoordinates } from '../key-navigation-grid.controller';
import { KeyNavigationUtils } from '../key-navigation-utils';
export declare class DefaultKeyNavigationStrategy implements KeyNavigationGridStrategyInterface {
    protected utils: KeyNavigationUtils;
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
