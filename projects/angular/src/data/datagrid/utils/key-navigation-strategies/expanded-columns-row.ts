/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';
import { ClrDefaultKeyNavigationStrategy } from './default';

export class ClrExpandedColumnsRowKeyNavigationStrategy extends ClrDefaultKeyNavigationStrategy {
  constructor(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    super(host, rows, cells, config);

    console.log('constructor ClrExpandedColumnsRowKeyNavigationStrategy');
  }

  keyUp(currentCellCoords: CellCoordinates) {
    console.log('keyUp ClrExpandedColumnsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyDown(currentCellCoords: CellCoordinates) {
    console.log('keyDown ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyLeft(currentCellCoords: CellCoordinates) {
    console.log('keyLeft ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyRight(currentCellCoords: CellCoordinates) {
    console.log('keyRight ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyEnd(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyEnd ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = ctrlKey
      ? this.createNextCellCoords(currentCellCoords)
      : this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyHome(currentCellCoords: CellCoordinates, ctrlKey: boolean) {
    console.log('keyHome ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = ctrlKey
      ? this.createNextCellCoords(currentCellCoords)
      : this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyPageUp(currentCellCoords: CellCoordinates) {
    console.log('keyPageUp ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }

  keyPageDown(currentCellCoords: CellCoordinates) {
    console.log('keyPageDown ClrExpandedDetailsRowKeyNavigationStrategy');

    const nextCellCoords = this.createNextCellCoords(currentCellCoords);

    return nextCellCoords;
  }
}
