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
    panelClass: 'bottom-left',
  };

  static 'bottom-right': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 10,
    offsetY: 10,
    panelClass: 'bottom-right',
  };

  static 'top-left': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -10,
    offsetY: -10,
    panelClass: 'top-left',
  };

  static 'top-right': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 10,
    offsetY: -10,
    panelClass: 'top-right',
  };

  static 'right-top': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 10,
    offsetY: -10,
    panelClass: 'right-top',
  };

  static 'right-bottom': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 10,
    offsetY: 10,
    panelClass: 'right-bottom',
  };

  static 'left-top': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -10,
    offsetY: -10,
    panelClass: 'left-top',
  };

  static 'left-bottom': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -10,
    offsetY: 10,
    panelClass: 'left-bottom',
  };

  static 'left': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
    panelClass: 'left',
  };

  static 'right': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 25,
    panelClass: 'right',
  };

  static 'top': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'top',
  };

  static 'bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'bottom',
  };

  static 'middle-right': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 25,
    panelClass: 'middle-right',
  };

  static 'right-middle': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 0,
    panelClass: 'right-middle',
  };

  static 'top-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -35,
    panelClass: 'top-middle',
  };

  static 'bottom-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'bottom-middle',
  };

  static 'middle-bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'bottom',
    panelClass: 'middle-bottom',
  };

  static 'left-middle': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
    panelClass: 'left-middle',
  };

  static 'middle-left': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -25,
    panelClass: 'middle-left',
  };
}
