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
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    panelClass: 'top-left',
  };

  static 'top-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    panelClass: 'top-middle',
  };

  static 'top-right': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'top-right',
  };

  static 'right-top': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    panelClass: 'right-top',
  };

  static 'right-middle': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    panelClass: 'right-middle',
  };

  static 'right-bottom': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
    panelClass: 'right-bottom',
  };

  static 'bottom-right': ConnectedPosition = {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: 'bottom-right',
  };

  static 'bottom-middle': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'bottom-middle',
  };

  static 'bottom-left': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    panelClass: 'bottom-left',
  };

  static 'left-bottom': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'left-bottom',
  };

  static 'left-middle': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    panelClass: 'left-middle',
  };

  static 'left-top': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'bottom',
    panelClass: 'left-top',
  };

  static 'left': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'top',
    panelClass: 'left',
  };

  static 'right': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'top',
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
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'bottom',
  };

  static 'middle-right': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    panelClass: 'middle-right',
  };

  static 'middle-bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    panelClass: 'middle-bottom',
  };

  static 'middle-left': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'center',
    panelClass: 'middle-left',
  };
}
