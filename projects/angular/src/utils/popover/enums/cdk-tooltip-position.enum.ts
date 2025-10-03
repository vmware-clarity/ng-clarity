/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition } from '@angular/cdk/overlay';

export interface ClrCDKPopoverPositions {
  [key: string]: any;
}

export class ClrCDKPopoverPositions {
  static 'top-left': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'top-left',
    offsetY: -21,
    offsetX: 0,
  };

  static 'top-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -21,
    offsetX: 0,
    panelClass: 'top-middle',
  };

  static 'top-right': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -21,
    offsetX: 0,
    panelClass: 'top-right',
  };

  static 'right-top': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: 0,
    offsetX: 21,
    panelClass: 'right-top',
  };

  static 'right-middle': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetY: 0,
    offsetX: 21,
    panelClass: 'right-middle',
  };

  static 'right-bottom': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 0,
    offsetX: 21,
    panelClass: 'right-bottom',
  };

  static 'bottom-right': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'bottom-right',
  };

  static 'bottom-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'bottom-middle',
  };

  static 'bottom-left': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'bottom-left',
  };

  static 'left-bottom': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 0,
    offsetX: -21,
    panelClass: 'left-bottom',
  };

  static 'left-middle': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetY: 0,
    offsetX: -21,
    panelClass: 'left-middle',
  };

  static 'left-top': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: 0,
    offsetX: -21,
    panelClass: 'left-top',
  };

  static 'left': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 0,
    offsetX: -21,
    panelClass: 'left',
  };

  static 'right': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 0,
    offsetX: 21,
    panelClass: 'right',
  };

  static 'top': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: -21,
    offsetX: 0,
    panelClass: 'top',
  };

  static 'bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'bottom',
  };

  static 'middle-right': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetY: 0,
    offsetX: -21,
    panelClass: 'middle-right',
  };

  static 'middle-bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'middle-bottom',
  };

  static 'middle-left': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'center',
    offsetY: 21,
    offsetX: 0,
    panelClass: 'middle-left',
  };
}
