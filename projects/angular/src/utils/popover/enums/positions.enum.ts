/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAlignment } from './alignment.enum';
import { ClrAxis } from './axis.enum';
import { ClrSide } from './side.enum';

interface ClrPopoverPositionsInterface {
  axis: ClrAxis;
  side: ClrSide;
  anchor: ClrAlignment;
  content: ClrAlignment;
}

export interface ClrPopoverPositions {
  [key: string]: any;
}

export class ClrPopoverPositions {
  static 'top-right': ClrPopoverPositionsInterface = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.END,
    content: ClrAlignment.END,
  };

  static 'top-left': ClrPopoverPositionsInterface = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };

  static 'bottom-right': ClrPopoverPositionsInterface = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.END,
    content: ClrAlignment.END,
  };

  static 'bottom-left': ClrPopoverPositionsInterface = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };

  static 'right-top': ClrPopoverPositionsInterface = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.CENTER,
    content: ClrAlignment.END,
  };

  static 'right-bottom': ClrPopoverPositionsInterface = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };

  static 'left-top': ClrPopoverPositionsInterface = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.CENTER,
    content: ClrAlignment.END,
  };

  static 'left-bottom': ClrPopoverPositionsInterface = {
    axis: ClrAxis.HORIZONTAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };
}
