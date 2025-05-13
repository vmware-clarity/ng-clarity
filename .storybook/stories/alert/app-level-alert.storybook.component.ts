/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrAlertModule, ClrIconModule } from '@clr/angular';
import { createArray } from 'helpers/common';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-app-level-alert',
  template: `
    <ng-container *ngIf="paginated; then paginatedTemplate; else defaultTemplate"></ng-container>
    <ng-template #paginatedTemplate>
      <clr-alerts>
        <clr-alert
          *ngFor="let alert of alertTypes"
          [clrAlertAppLevel]="true"
          [clrAlertClosable]="clrAlertClosable"
          [clrAlertIcon]="clrAlertIcon"
          [clrAlertType]="alert"
          [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
          (clrAlertClosedChange)="clrAlertClosedChange.emit($event)"
        >
          <clr-alert-item *ngFor="let _ of createArray(paginated ? 1 : alertCount); let i = index">
            <ng-container *ngTemplateOutlet="alertItemContent; context: { index: i }"></ng-container>
          </clr-alert-item>
        </clr-alert>
      </clr-alerts>
    </ng-template>
    <ng-template #defaultTemplate>
      <clr-alert
        *ngFor="let alert of alertTypes"
        [clrAlertAppLevel]="true"
        [clrAlertClosable]="clrAlertClosable"
        [clrAlertIcon]="clrAlertIcon"
        [clrAlertType]="alert"
        [clrCloseButtonAriaLabel]="clrCloseButtonAriaLabel"
        (clrAlertClosedChange)="clrAlertClosedChange.emit($event)"
      >
        <clr-alert-item *ngFor="let _ of createArray(paginated ? 1 : alertCount); let i = index">
          <ng-container *ngTemplateOutlet="alertItemContent; context: { index: i }"></ng-container>
        </clr-alert-item>
      </clr-alert>
    </ng-template>
    <ng-template #alertItemContent let-index="index">
      <span class="alert-text">
        {{ content }} {{ index + 1 }}
        <ng-container #components></ng-container>
        <a *ngIf="showAction" href="javascript://">
          <cds-icon shape="user"></cds-icon>
          Reset to green
        </a>
      </span>
      <div *ngIf="showActions" class="alert-actions">
        <button class="btn alert-action">Fix</button>
        <button class="btn alert-action">Ignore</button>
      </div>
    </ng-template>
  `,
  standalone: true,
  imports: [ClrAlertModule, ClrIconModule, NgFor, NgIf, NgTemplateOutlet],
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

  // The alert types can be provided via args or defaulted here.
  @Input() alertTypes: string[] = ['info', 'warning', 'danger', 'success', 'neutral'];

  @Output() clrAlertClosedChange: EventEmitter<boolean> = new EventEmitter();
}
