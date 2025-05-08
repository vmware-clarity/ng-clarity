/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrIconModule } from '@clr/angular';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-label',
  template: `
    <ng-container *ngIf="clickable">
      <a href="javascript://" class="label clickable" *ngFor="let type of labelColorTypes" [class]="type">
        <span class="text">{{ content }}</span>
        <ng-container #components></ng-container>
      </a>
    </ng-container>
    <ng-container *ngIf="!clickable">
      <span class="label" *ngFor="let type of labelColorTypes" [class]="type">
        <span class="text">{{ content }}</span>
        <ng-container #components></ng-container>
        <cds-icon *ngIf="closeIcon" shape="close"></cds-icon>
      </span>
    </ng-container>
  `,
  standalone: true,
  imports: [NgFor, NgIf, ClrIconModule],
})
export class LabelStoryBookComponent extends RenderComponentStorybook {
  @Input() badgeContent = '';
  @Input() content = 'Hello World!';
  @Input() clickable = false;
  @Input() closeIcon = false;
  @Input() labelColorTypes = [''];
}
