/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, OnInit } from '@angular/core';

import { ClrLabel } from '../common/label';
import { ControlIdService } from '../common/providers/control-id.service';

@Component({
  selector: 'clr-radio-wrapper',
  template: `
    <ng-content select="[clrRadio]"></ng-content>
    <ng-content select="label"></ng-content>
    @if (!label) {
    <label></label>
    }
  `,
  host: {
    '[class.clr-radio-wrapper]': 'true',
  },
  providers: [ControlIdService],
  standalone: false,
})
export class ClrRadioWrapper implements OnInit {
  @ContentChild(ClrLabel, { static: true }) label: ClrLabel;

  ngOnInit() {
    if (this.label) {
      this.label.disableGrid();
    }
  }
}
