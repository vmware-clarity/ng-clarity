import { CellCoordinates } from '../utils/key-navigation-grid.controller';
export interface KeyNavigationGridStrategyInterface {
    keyUp(cell: CellCoordinates): CellCoordinates;
    keyDown(cell: CellCoordinates): CellCoordinates;
    keyRight(cell: CellCoordinates): CellCoordinates;
    keyLeft(cell: CellCoordinates): CellCoordinates;
    keyEnd(cell: CellCoordinates, ctrlKey: boolean): CellCoordinates;
    keyHome(cell: CellCoordinates, ctrlKey: boolean): CellCoordinates;
    keyPageUp(cell: CellCoordinates): CellCoordinates;
    keyPageDown(cell: CellCoordinates): CellCoordinates;
}
