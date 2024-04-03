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
  };

  static 'bottom-right': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  };

  static 'top-left': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
  };

  static 'top-right': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
  };

  static 'right-top': ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
  };

  static 'right-bottom': ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  };

  static 'left-top': ConnectedPosition = {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
  };

  static 'left-bottom': ConnectedPosition = {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  };

  static 'left': ConnectedPosition = {
    originX: 'end',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
  };

  static 'right': ConnectedPosition = {
    originX: 'start',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
  };

  static 'top': ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'top',
  };

  static 'bottom': ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'bottom',
  };
}
