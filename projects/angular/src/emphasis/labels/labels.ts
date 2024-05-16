/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'clr-labels',
  templateUrl: './labels.html',
  styleUrls: ['./_labels.clarity.scss'],
})
export class ClrLabels {
  @Input() content: string;
  @Input() badgeContent: string;
  @Input() labelType: string;
  @Input() clickable: boolean;
  @Input() closeIcon: boolean;
  @Output('clrLabelsClosedChange') _closedChanged = new EventEmitter<boolean>(false);
  closed = false;
  close() {
    this.closed = true;
    this._closedChanged.emit(true);
  }
}
