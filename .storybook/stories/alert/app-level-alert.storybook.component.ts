/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrAlertModule, ClrDropdownModule, ClrIcon } from '@clr/angular';
import { AlertType } from '@clr/angular/emphasis/alert';
import { createArray } from 'helpers/common';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-app-level-alert',
  template: `
    @if (paginated) {
      <clr-alerts>
        @for (alert of alertTypes; track alert) {
          <clr-alert
            [clrAlertAppLevel]="true"
            [clrAlertClosable]="clrAlertClosable"
            [clrAlertIcon]="clrAlertIcon"
            [clrAlertType]="alert"
            [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
            (clrAlertClosedChange)="clrAlertClosedChange.emit($event)"
          >
            @for (_ of createArray(paginated ? 1 : alertCount); track $index; let i = $index) {
              <clr-alert-item>
                <ng-container *ngTemplateOutlet="alertItemContent; context: { index: i }"></ng-container>
              </clr-alert-item>
            }
          </clr-alert>
        }
      </clr-alerts>
    } @else {
      @for (alert of alertTypes; track alert) {
        <clr-alert
          [clrAlertAppLevel]="true"
          [clrAlertClosable]="clrAlertClosable"
          [clrAlertIcon]="clrAlertIcon"
          [clrAlertType]="alert"
          [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
          (clrAlertClosedChange)="clrAlertClosedChange.emit($event)"
        >
          @for (_ of createArray(paginated ? 1 : alertCount); track $index; let i = $index) {
            <clr-alert-item>
              <ng-container *ngTemplateOutlet="alertItemContent; context: { index: i }"></ng-container>
            </clr-alert-item>
          }
        </clr-alert>
      }
    }
    <ng-template #alertItemContent let-index="index">
      <span class="alert-text">
        {{ content }} {{ index + 1 }}
        <ng-container #renderContainer></ng-container>
        @if (showAction) {
          <a href="javascript://">
            <cds-icon shape="user"></cds-icon>
            Reset to green
          </a>
        }
      </span>
      @if (showActions) {
        <div class="alert-actions">
          <button class="btn alert-action">Fix</button>
          <button class="btn alert-action">Ignore</button>
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
        </div>
      }
    </ng-template>
  `,
  standalone: true,
  imports: [ClrAlertModule, ClrIcon, NgTemplateOutlet, ClrDropdownModule],
})
export class AppLevelAlertStorybookComponent extends RenderComponentStorybook {
  // Story inputs matching the original story args
  @Input() clrAlertIcon = null;
  @Input() clrCloseButtonAriaLabel = 'Close alert';
  @Input() clrAlertClosable = false;
  @Input() alertCount = 3;
  @Input() content = 'Hello World!';
  @Input() showAction = false;
  @Input() showActions = false;
  @Input() paginated = false;
  createArray = createArray;

  @Input() alertTypes: AlertType[] = ['info', 'warning', 'danger', 'success', 'neutral'];

  @Output() clrAlertClosedChange: EventEmitter<boolean> = new EventEmitter();
}
