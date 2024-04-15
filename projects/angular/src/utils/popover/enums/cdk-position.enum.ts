/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition } from '@angular/cdk/overlay';

export interface ClrCDKPopoverPositions {
  [key: string]: any;
}

export class ClrCDKPopoverPositions {
  static 'bottom-left': ConnectedPosition = {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -10,
    offsetY: 10,
  };

  static 'bottom-right': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 10,
    offsetY: 10,
  };

  static 'top-left': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -10,
    offsetY: -10,
  };

  static 'top-right': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 10,
    offsetY: -10,
  };

  static 'right-top': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 10,
    offsetY: -10,
  };

  static 'right-bottom': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 10,
    offsetY: 10,
  };

  static 'left-top': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -10,
    offsetY: -10,
  };

  static 'left-bottom': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -10,
    offsetY: 10,
  };

  static 'left': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
  };

  static 'right': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 25,
  };

  static 'top': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
  };

  static 'bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
  };

  static 'middle-right': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 25,
  };

  static 'right-middle': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 0,
  };

  static 'top-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -35,
  };

  static 'bottom-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
  };

  static 'middle-bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'bottom',
  };

  static 'left-middle': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
  };

  static 'middle-left': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
  };
}
