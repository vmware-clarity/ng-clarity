/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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
