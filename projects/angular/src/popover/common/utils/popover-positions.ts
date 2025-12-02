/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition } from '@angular/cdk/overlay';

import { ClrPosition } from '../../../utils/enums/position.enum';

export enum ClrPopoverType {
  SIGNPOST,
  TOOLTIP,
  DROPDOWN,
  DEFAULT,
}

export enum ClrPopoverPosition {
  TOP_RIGHT = 'top-right',
  TOP_MIDDLE = 'top-middle',
  TOP_LEFT = 'top-left',
  RIGHT = 'right',
  RIGHT_TOP = 'right-top',
  RIGHT_MIDDLE = 'right-middle',
  RIGHT_BOTTOM = 'right-bottom',
  LEFT = 'left',
  LEFT_TOP = 'left-top',
  LEFT_MIDDLE = 'left-middle',
  LEFT_BOTTOM = 'left-bottom',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_MIDDLE = 'bottom-middle',
  BOTTOM_LEFT = 'bottom-left',
}

export const TOOLTIP_POSITIONS: ClrPopoverPosition[] = [
  ClrPopoverPosition.RIGHT,
  ClrPopoverPosition.LEFT,
  ClrPopoverPosition.BOTTOM_LEFT,
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.TOP_LEFT,
  ClrPopoverPosition.TOP_RIGHT,
];

export const DROPDOWN_POSITIONS: ClrPopoverPosition[] = [
  ClrPopoverPosition.BOTTOM_LEFT,
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.TOP_LEFT,
  ClrPopoverPosition.TOP_RIGHT,
  ClrPopoverPosition.LEFT_BOTTOM,
  ClrPopoverPosition.LEFT_TOP,
  ClrPopoverPosition.RIGHT_BOTTOM,
  ClrPopoverPosition.RIGHT_TOP,
];

export const SIGNPOST_POSITIONS: ClrPopoverPosition[] = [
  ClrPopoverPosition.RIGHT_MIDDLE, // default. must be at index 0
  ClrPopoverPosition.TOP_LEFT,
  ClrPopoverPosition.TOP_MIDDLE,
  ClrPopoverPosition.TOP_RIGHT,
  ClrPopoverPosition.RIGHT_TOP,
  ClrPopoverPosition.RIGHT_BOTTOM,
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.BOTTOM_MIDDLE,
  ClrPopoverPosition.BOTTOM_LEFT,
  ClrPopoverPosition.LEFT_BOTTOM,
  ClrPopoverPosition.LEFT_MIDDLE,
  ClrPopoverPosition.LEFT_TOP,
];

function getPositionsArray(type: ClrPopoverType) {
  switch (type) {
    case ClrPopoverType.TOOLTIP:
      return TOOLTIP_POSITIONS;
    case ClrPopoverType.DROPDOWN:
      return DROPDOWN_POSITIONS;
    case ClrPopoverType.SIGNPOST:
    case ClrPopoverType.DEFAULT:
    default:
      return SIGNPOST_POSITIONS;
  }
}

export function getConnectedPositions(type: ClrPopoverType): ConnectedPosition[] {
  const result: ConnectedPosition[] = [];

  getPositionsArray(type).forEach(position => {
    result.push(mapPopoverKeyToPosition(position, type));
  });

  return result;
}

function getOffset(type: ClrPopoverType) {
  switch (type) {
    case ClrPopoverType.SIGNPOST:
      return 16;
    case ClrPopoverType.TOOLTIP:
      return 21;
    case ClrPopoverType.DROPDOWN:
      return 2;
    case ClrPopoverType.DEFAULT:
    default:
      return 0;
  }
}

export function mapPopoverKeyToPosition(key: ClrPopoverPosition, type: ClrPopoverType): ConnectedPosition {
  let offset = getOffset(type);

  switch (key) {
    // TOP LEFT
    case ClrPopoverPosition.TOP_LEFT:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.TOP_LEFT : ClrPosition.TOP_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.BOTTOM_LEFT : ClrPosition.BOTTOM_RIGHT),
        panelClass: key,
        offsetY: -offset,
        offsetX: 0,
      } as ConnectedPosition;

    // TOP CENTER (middle)
    case ClrPopoverPosition.TOP_MIDDLE:
      return {
        ...getAnchorPosition(ClrPosition.TOP_CENTER),
        ...getContentPosition(ClrPosition.BOTTOM_CENTER),
        panelClass: key,
        offsetY: -offset,
        offsetX: 0,
      } as ConnectedPosition;

    // TOP RIGHT
    case ClrPopoverPosition.TOP_RIGHT:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.TOP_RIGHT : ClrPosition.TOP_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.BOTTOM_RIGHT : ClrPosition.BOTTOM_LEFT),
        panelClass: key,
        offsetY: -offset,
        offsetX: 0,
      } as ConnectedPosition;

    // LEFT TOP
    case ClrPopoverPosition.LEFT_TOP:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.LEFT_TOP : ClrPosition.LEFT_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.TOP_RIGHT : ClrPosition.RIGHT_BOTTOM),
        panelClass: key,
        offsetY: 0,
        offsetX: -offset,
      } as ConnectedPosition;

    // LEFT CENTER (middle)
    case ClrPopoverPosition.LEFT_MIDDLE:
      return {
        ...getAnchorPosition(ClrPosition.LEFT_CENTER),
        ...getContentPosition(ClrPosition.RIGHT_CENTER),
        panelClass: key,
        offsetY: 0,
        offsetX: -offset,
      } as ConnectedPosition;

    // LEFT BOTTOM
    case ClrPopoverPosition.LEFT:
    case ClrPopoverPosition.LEFT_BOTTOM:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.LEFT_BOTTOM : ClrPosition.LEFT_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.BOTTOM_RIGHT : ClrPosition.RIGHT_TOP),
        panelClass: key,
        offsetY: 0,
        offsetX: -offset,
      } as ConnectedPosition;

    // RIGHT TOP
    case ClrPopoverPosition.RIGHT_TOP:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.RIGHT_TOP : ClrPosition.RIGHT_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.LEFT_TOP : ClrPosition.LEFT_BOTTOM),
        panelClass: key,
        offsetY: 0,
        offsetX: offset,
      } as ConnectedPosition;

    // RIGHT CENTER (middle)
    case ClrPopoverPosition.RIGHT_MIDDLE:
      return {
        ...getAnchorPosition(ClrPosition.RIGHT_CENTER),
        ...getContentPosition(ClrPosition.LEFT_CENTER),
        panelClass: key,
        offsetY: 0,
        offsetX: offset,
      } as ConnectedPosition;

    // RIGHT BOTTOM
    case ClrPopoverPosition.RIGHT:
    case ClrPopoverPosition.RIGHT_BOTTOM:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.RIGHT_BOTTOM : ClrPosition.RIGHT_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.LEFT_BOTTOM : ClrPosition.LEFT_TOP),
        panelClass: key,
        offsetY: 0,
        offsetX: offset,
      } as ConnectedPosition;

    // BOTTOM RIGHT
    case ClrPopoverPosition.BOTTOM_RIGHT:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.BOTTOM_LEFT : ClrPosition.BOTTOM_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.TOP_RIGHT : ClrPosition.TOP_LEFT),
        panelClass: key,
        offsetY: offset,
        offsetX: 0,
      } as ConnectedPosition;

    // BOTTOM CENTER (middle)
    case ClrPopoverPosition.BOTTOM_MIDDLE:
      return {
        ...getAnchorPosition(ClrPosition.BOTTOM_CENTER),
        ...getContentPosition(ClrPosition.TOP_CENTER),
        panelClass: key,
        offsetY: offset,
        offsetX: 0,
      } as ConnectedPosition;

    // BOTTOM LEFT
    case ClrPopoverPosition.BOTTOM_LEFT:
      return {
        ...getAnchorPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.BOTTOM_RIGHT : ClrPosition.BOTTOM_CENTER),
        ...getContentPosition(type === ClrPopoverType.DROPDOWN ? ClrPosition.TOP_LEFT : ClrPosition.TOP_RIGHT),
        panelClass: key,
        offsetY: offset,
        offsetX: 0,
      } as ConnectedPosition;
    default:
      return {
        ...getAnchorPosition(ClrPosition.BOTTOM_LEFT),
        ...getContentPosition(ClrPosition.TOP_LEFT),
        offsetY: offset,
        offsetX: 0,
      } as ConnectedPosition;
  }
}

export function getAnchorPosition(key: ClrPosition): Partial<ConnectedPosition> {
  switch (key) {
    // TOP Positions
    case ClrPosition.TOP_LEFT:
      return {
        originX: 'start',
        originY: 'top',
      };
    case ClrPosition.TOP_CENTER:
      return {
        originX: 'center',
        originY: 'top',
      };
    case ClrPosition.TOP_RIGHT:
      return {
        originX: 'end',
        originY: 'top',
      };
    // LEFT Positions
    case ClrPosition.LEFT_TOP:
      return {
        originX: 'start',
        originY: 'top',
      };
    case ClrPosition.LEFT_CENTER:
      return {
        originX: 'start',
        originY: 'center',
      };
    case ClrPosition.LEFT_BOTTOM:
      return {
        originX: 'start',
        originY: 'bottom',
      };
    // RIGHT Positions
    case ClrPosition.RIGHT_TOP:
      return {
        originX: 'end',
        originY: 'top',
      };
    case ClrPosition.RIGHT_CENTER:
      return {
        originX: 'end',
        originY: 'center',
      };
    case ClrPosition.RIGHT_BOTTOM:
      return {
        originX: 'end',
        originY: 'bottom',
      };
    // BOTTOM positions and default
    case ClrPosition.BOTTOM_LEFT:
      return {
        originX: 'end',
        originY: 'bottom',
      };
    case ClrPosition.BOTTOM_CENTER:
      return {
        originX: 'center',
        originY: 'bottom',
      };
    case ClrPosition.BOTTOM_RIGHT:
    default:
      return {
        originX: 'start',
        originY: 'bottom',
      };
  }
}

export function getContentPosition(key: ClrPosition): Partial<ConnectedPosition> {
  switch (key) {
    // TOP Positions
    case ClrPosition.TOP_LEFT:
      return {
        overlayX: 'start',
        overlayY: 'top',
      };
    case ClrPosition.TOP_CENTER:
      return {
        overlayX: 'center',
        overlayY: 'top',
      };
    case ClrPosition.TOP_RIGHT:
      return {
        overlayX: 'end',
        overlayY: 'top',
      };
    // LEFT Positions
    case ClrPosition.LEFT_TOP:
      return {
        overlayX: 'start',
        overlayY: 'top',
      };
    case ClrPosition.LEFT_CENTER:
      return {
        overlayX: 'start',
        overlayY: 'center',
      };
    case ClrPosition.LEFT_BOTTOM:
      return {
        overlayX: 'start',
        overlayY: 'bottom',
      };
    // RIGHT Positions
    case ClrPosition.RIGHT_TOP:
      return {
        overlayX: 'end',
        overlayY: 'top',
      };
    case ClrPosition.RIGHT_CENTER:
      return {
        overlayX: 'end',
        overlayY: 'center',
      };
    case ClrPosition.RIGHT_BOTTOM:
      return {
        overlayX: 'end',
        overlayY: 'bottom',
      };
    // BOTTOM positions and default
    case ClrPosition.BOTTOM_LEFT:
      return {
        overlayX: 'start',
        overlayY: 'bottom',
      };
    case ClrPosition.BOTTOM_CENTER:
      return {
        overlayX: 'center',
        overlayY: 'bottom',
      };
    case ClrPosition.BOTTOM_RIGHT:
    default:
      return {
        overlayX: 'end',
        overlayY: 'bottom',
      };
  }
}
