/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrAlertModule, ClrDropdownModule, commonStringsDefault } from '@clr/angular';
import { createArray } from 'helpers/common';

import { ALERT_TYPES } from '../../../projects/angular/src/emphasis/alert/utils/alert-types';

@Component({
  selector: 'storybook-standard-alert',
  standalone: true,
  template: `
    <div *ngFor="let alert of ALERT_TYPES" style="margin-top: 5px">
      <clr-alert
        [clrAlertClosable]="clrAlertClosable"
        [clrAlertIcon]="clrAlertIcon"
        [clrAlertLightweight]="clrAlertLightweight"
        [clrAlertSizeSmall]="clrAlertSizeSmall"
        [clrAlertType]="alert"
        [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
      >
        <clr-alert-item *ngFor="let _ of createArray(alertCount); let i = index">
          <span class="alert-text">{{ content }} {{ i + 1 }}</span>
          <div *ngIf="showActions" class="alert-actions">
            <clr-dropdown>
              <button clrDropdownTrigger>
                Actions
                <cds-icon shape="angle" direction="down"></cds-icon>
              </button>
              <clr-dropdown-menu clrPosition="bottom-right">
                <button clrDropdownItem>Shutdown</button>
                <button clrDropdownItem>Delete</button>
                <button clrDropdownItem>Reboot</button>
              </clr-dropdown-menu>
            </clr-dropdown>
            <a class="alert-action" href="javascript://">Ignore</a>
          </div>
        </clr-alert-item>
      </clr-alert>
    </div>
  `,
  imports: [NgFor, NgIf, ClrAlertModule, ClrDropdownModule],
})
export class StandardAlertStorybookComponent {
  @Input() clrAlertClosable = false;
  @Input() clrAlertIcon;
  @Input() clrAlertLightweight = false;
  @Input() clrAlertSizeSmall = false;
  @Input() clrCloseButtonAriaLabel = commonStringsDefault.alertCloseButtonAriaLabel;
  @Input() alertCount = 3;
  @Input() showActions = false;
  @Input() content = 'Hello World!';
  ALERT_TYPES = ALERT_TYPES;
  createArray = createArray;
}
