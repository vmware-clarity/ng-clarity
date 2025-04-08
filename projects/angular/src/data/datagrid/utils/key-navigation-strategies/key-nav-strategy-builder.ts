/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Keys } from '../../../../utils/enums/keys.enum';
import { KeyNavigationGridStrategyInterface } from '../../interfaces/key-nav-grid-strategy.interface';
import { CellCoordinates, KeyNavigationGridConfig } from '../key-navigation-grid.controller';
import { DefaultKeyNavigationStrategy } from './default';
import { ExpandedColumnsRowKeyNavigationStrategy } from './expanded-columns-row';
import { ExpandedDetailsRowKeyNavigationStrategy } from './expanded-details-row';
import { KeyNavigationUtils } from './key-nav-utils';

export class KeyNavigationStrategyBuilder {
  keyNavUtils: KeyNavigationUtils;
  private currentCellCoords: CellCoordinates;
  private strategy: KeyNavigationGridStrategyInterface;

  constructor(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    this.buildStrategy(host, rows, cells, config);
  }

  getNextItemCoordinate(e: KeyboardEvent) {
    const inlineStart = this.keyNavUtils.host.dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
    const inlineEnd = this.keyNavUtils.host.dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;

    switch (e.key) {
      case Keys.ArrowUp:
        return this.strategy.keyUp(this.currentCellCoords);
      case Keys.ArrowDown:
        return this.strategy.keyDown(this.currentCellCoords);
      case inlineStart:
        return this.strategy.keyLeft(this.currentCellCoords);
      case inlineEnd:
        return this.strategy.keyRight(this.currentCellCoords);
      case Keys.Home:
        return this.strategy.keyHome(this.currentCellCoords, e.ctrlKey);
      case Keys.End:
        return this.strategy.keyEnd(this.currentCellCoords, e.ctrlKey);
      case Keys.PageUp:
        return this.strategy.keyPageUp(this.currentCellCoords);
      case Keys.PageDown:
        return this.strategy.keyPageDown(this.currentCellCoords);
      default:
        return this.currentCellCoords;
    }
  }

  private buildStrategy(
    host: HTMLElement,
    rows: NodeListOf<HTMLElement>,
    cells: NodeListOf<HTMLElement>,
    config: KeyNavigationGridConfig
  ) {
    this.keyNavUtils = new KeyNavigationUtils(host, rows, cells, config);

    this.currentCellCoords = this.keyNavUtils.getCurrentCellCoordinates();

    //build strategy
    switch (true) {
      case this.keyNavUtils.isSingleCellExpandedRow(this.currentCellCoords.y):
        this.strategy = new ExpandedDetailsRowKeyNavigationStrategy(this.keyNavUtils);
        break;
      case this.keyNavUtils.isDetailsRow(this.currentCellCoords.y):
      case this.keyNavUtils.isExpandedRow(this.currentCellCoords.y):
        this.strategy = new ExpandedColumnsRowKeyNavigationStrategy(this.keyNavUtils);
        break;
      default:
        this.strategy = new DefaultKeyNavigationStrategy(this.keyNavUtils);
    }
  }
}
