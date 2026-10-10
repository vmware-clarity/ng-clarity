/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ClrAlertModule, ClrDropdownModule, commonStringsDefault } from '@clr/angular';
import { ALERT_TYPES, AlertType } from '@clr/angular/emphasis/alert';
import { createArray } from 'helpers/common';
import { RenderComponentStorybook } from 'helpers/render-component';
@Component({
  selector: 'storybook-standard-alert',
  standalone: true,
  template: `
    @if (componentDescription) {
      <section [innerHTML]="componentDescription"></section>
    }
    @for (alert of alertTypes; track alert) {
      <div>
        <clr-alert
          [clrAlertClosable]="clrAlertClosable"
          [clrAlertIcon]="clrAlertIcon"
          [clrAlertLightweight]="clrAlertLightweight"
          [clrAlertSizeSmall]="clrAlertSizeSmall"
          [clrAlertType]="alert"
          [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
        >
          @for (_ of createArray(alertCount); track $index; let i = $index) {
            <clr-alert-item>
              <span class="alert-text">
                {{ content }} {{ i + 1 }}
                <ng-container #renderContainer></ng-container>
              </span>
              @if (showActions || showAction) {
                <div class="alert-actions">
                  @if (showActions) {
                    <clr-dropdown>
                      <button clrDropdownTrigger>
                        Actions
                        <cds-icon shape="angle" direction="down"></cds-icon>
                      </button>
                      <clr-dropdown-menu *clrIfOpen="openContextMenu" clrPosition="bottom-right">
                        <button clrDropdownItem>Shutdown</button>
                        <button clrDropdownItem>Delete</button>
                        <button clrDropdownItem>Reboot</button>
                      </clr-dropdown-menu>
                    </clr-dropdown>
                  }
                  @if (showAction) {
                    <a class="alert-action" href="javascript://">Ignore</a>
                  }
                  @if (showActionsButton) {
                    <button class="btn alert-action btn-sm">Fix</button>
                  }
                </div>
              }
            </clr-alert-item>
          }
        </clr-alert>
      </div>
    }
  `,
  imports: [ClrAlertModule, ClrDropdownModule],
})
export class StandardAlertStorybookComponent extends RenderComponentStorybook {
  @Input() componentDescription = null;
  @Input() clrAlertClosable = false;
  @Input() clrAlertIcon;
  @Input() clrAlertLightweight = false;
  @Input() clrAlertSizeSmall = false;
  @Input() clrCloseButtonAriaLabel = commonStringsDefault.alertCloseButtonAriaLabel;
  @Input() alertCount = 3;
  @Input() showAction = false;
  @Input() showActions = false;
  @Input() showActionsButton = false;
  @Input() content = 'Hello World!';
  @Input() alertTypes: AlertType[] = ALERT_TYPES;
  @Input() openContextMenu = false;
  createArray = createArray;
}
