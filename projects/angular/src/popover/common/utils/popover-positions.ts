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
  ClrPopoverPosition.RIGHT, // default. must be at index 0
  ClrPopoverPosition.LEFT,
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.BOTTOM_LEFT,
  ClrPopoverPosition.TOP_RIGHT,
  ClrPopoverPosition.TOP_LEFT,
];

export const DROPDOWN_POSITIONS: ClrPopoverPosition[] = [
  ClrPopoverPosition.BOTTOM_LEFT, // default. must be at index 0
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.TOP_LEFT,
  ClrPopoverPosition.TOP_RIGHT,
  ClrPopoverPosition.RIGHT_TOP,
  ClrPopoverPosition.RIGHT_BOTTOM,
  ClrPopoverPosition.LEFT_TOP,
  ClrPopoverPosition.LEFT_BOTTOM,
];

export const SIGNPOST_POSITIONS: ClrPopoverPosition[] = [
  ClrPopoverPosition.RIGHT_MIDDLE, // default. must be at index 0
  ClrPopoverPosition.RIGHT_TOP,
  ClrPopoverPosition.RIGHT_BOTTOM,
  ClrPopoverPosition.TOP_RIGHT,
  ClrPopoverPosition.TOP_LEFT,
  ClrPopoverPosition.TOP_MIDDLE,
  ClrPopoverPosition.BOTTOM_RIGHT,
  ClrPopoverPosition.BOTTOM_MIDDLE,
  ClrPopoverPosition.BOTTOM_LEFT,
  ClrPopoverPosition.LEFT_BOTTOM,
  ClrPopoverPosition.LEFT_MIDDLE,
  ClrPopoverPosition.LEFT_TOP,
];

export function getPositionsArray(type: ClrPopoverType) {
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

const POPOVER_OFFSETS: Record<ClrPopoverType, number> = {
  [ClrPopoverType.SIGNPOST]: 16,
  [ClrPopoverType.TOOLTIP]: 21,
  [ClrPopoverType.DROPDOWN]: 2,
  [ClrPopoverType.DEFAULT]: 0,
};

function getOffset(key: ClrPopoverPosition, type: ClrPopoverType): Partial<ConnectedPosition> {
  const offset = POPOVER_OFFSETS[type] || 0;

  switch (key) {
    // TOP
    case ClrPopoverPosition.TOP_LEFT:
    case ClrPopoverPosition.TOP_MIDDLE:
    case ClrPopoverPosition.TOP_RIGHT:
      return {
        offsetY: -offset,
        offsetX: 0,
      } as ConnectedPosition;

    // LEFT
    case ClrPopoverPosition.LEFT_TOP:
    case ClrPopoverPosition.LEFT_MIDDLE:
    case ClrPopoverPosition.LEFT:
    case ClrPopoverPosition.LEFT_BOTTOM:
      return {
        offsetY: 0,
        offsetX: -offset,
      } as ConnectedPosition;

    // RIGHT
    case ClrPopoverPosition.RIGHT_TOP:
    case ClrPopoverPosition.RIGHT_MIDDLE:
    case ClrPopoverPosition.RIGHT:
    case ClrPopoverPosition.RIGHT_BOTTOM:
      return {
        offsetY: 0,
        offsetX: offset,
      } as ConnectedPosition;

    // BOTTOM and DEFAULT
    case ClrPopoverPosition.BOTTOM_RIGHT:
    case ClrPopoverPosition.BOTTOM_MIDDLE:
    case ClrPopoverPosition.BOTTOM_LEFT:
    default:
      return {
        offsetY: offset,
        offsetX: 0,
      } as ConnectedPosition;
  }
}

const STANDARD_ANCHORS = {
  // TOP
  [ClrPopoverPosition.TOP_RIGHT]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_LEFT },
  [ClrPopoverPosition.TOP_MIDDLE]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_CENTER },
  [ClrPopoverPosition.TOP_LEFT]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_RIGHT },

  // LEFT
  [ClrPopoverPosition.LEFT]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },
  [ClrPopoverPosition.LEFT_TOP]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_BOTTOM },
  [ClrPopoverPosition.LEFT_MIDDLE]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_CENTER },
  [ClrPopoverPosition.LEFT_BOTTOM]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },

  // RIGHT
  [ClrPopoverPosition.RIGHT]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },
  [ClrPopoverPosition.RIGHT_TOP]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_BOTTOM },
  [ClrPopoverPosition.RIGHT_MIDDLE]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_CENTER },
  [ClrPopoverPosition.RIGHT_BOTTOM]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },

  // BOTTOM
  [ClrPopoverPosition.BOTTOM_RIGHT]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_LEFT },
  [ClrPopoverPosition.BOTTOM_MIDDLE]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_CENTER },
  [ClrPopoverPosition.BOTTOM_LEFT]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_RIGHT },
};

const DROPDOWN_ANCHORS = {
  // TOP
  [ClrPopoverPosition.TOP_RIGHT]: { anchor: ClrPosition.TOP_RIGHT, content: ClrPosition.BOTTOM_RIGHT },
  [ClrPopoverPosition.TOP_LEFT]: { anchor: ClrPosition.TOP_LEFT, content: ClrPosition.BOTTOM_LEFT },

  // LEFT
  [ClrPopoverPosition.LEFT_TOP]: { anchor: ClrPosition.LEFT_TOP, content: ClrPosition.TOP_RIGHT },
  [ClrPopoverPosition.LEFT_BOTTOM]: { anchor: ClrPosition.LEFT_BOTTOM, content: ClrPosition.BOTTOM_RIGHT },

  // RIGHT
  [ClrPopoverPosition.RIGHT_TOP]: { anchor: ClrPosition.RIGHT_TOP, content: ClrPosition.LEFT_TOP },
  [ClrPopoverPosition.RIGHT_BOTTOM]: { anchor: ClrPosition.RIGHT_BOTTOM, content: ClrPosition.LEFT_BOTTOM },

  // BOTTOM
  [ClrPopoverPosition.BOTTOM_RIGHT]: { anchor: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_RIGHT },
  [ClrPopoverPosition.BOTTOM_LEFT]: { anchor: ClrPosition.BOTTOM_RIGHT, content: ClrPosition.TOP_LEFT },
};

export function mapPopoverKeyToPosition(key: ClrPopoverPosition, type: ClrPopoverType): ConnectedPosition {
  let offset = getOffset(key, type);

  const defaultPosition = { anchor: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_LEFT };
  const { anchor, content } =
    (type === ClrPopoverType.DROPDOWN ? DROPDOWN_ANCHORS[key] : STANDARD_ANCHORS[key]) ?? defaultPosition;

  return {
    ...getAnchorPosition(anchor),
    ...getContentPosition(content),
    ...offset,
    panelClass: key,
  } as ConnectedPosition;
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
