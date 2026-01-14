/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';

import {
  ClrPopoverPosition,
  ClrPopoverType,
  getConnectedPositions,
  getPositionsArray,
} from '../../../../angular/src/popover/common/utils/popover-positions';
import { uniqueIdFactory } from '../../../../angular/src/utils/id-generator/id-generator.service';

@Component({
  selector: 'clr-popovers-demo',
  styleUrls: ['./popovers.demo.scss'],
  templateUrl: './popovers.demo.html',
  standalone: false,
})
export class PopoversDemo {
  clrPopoverType = ClrPopoverType;
  open = false;
  popoverId = uniqueIdFactory();
  contentPosition = ClrPopoverPosition.BOTTOM_LEFT;
  outsideClickToClose = true;
  scrollToClose = false;
  positions: ClrPopoverPosition[] = [];
  availablePositions: ConnectedPosition[] = [];

  private _type: ClrPopoverType;

  constructor() {
    this.type = ClrPopoverType.DROPDOWN;
  }

  get type() {
    return this._type;
  }
  set type(type: ClrPopoverType) {
    this._type = Number(type);

    this.positions = getPositionsArray(this._type);
    this.availablePositions = getConnectedPositions(this._type);
  }
}
