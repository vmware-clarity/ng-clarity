/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { getButtonClass } from 'helpers/button-class.helper';
import { createArray } from 'helpers/common';

@Component({
  selector: 'storybook-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.maxWidth.px]="maxWidth" class="card" [ngClass]="{ clickable: clickable }">
      <div *ngIf="hasImage" class="card-img">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='36' viewBox='0 0 36 36' width='36'%3E%3Cg fill='none' fill-rule='evenodd' transform='translate(0 4.544118)'%3E%3Cpath d='m24.7018129.03888403 11.2778281 6.67879663-.0181821 13.56348904-11.259646 6.6606051-6.6844666-3.9709902 11.6514714-6.541272v-5.8973849l-4.7471673-2.60470586-6.8895427-3.93711399' fill='%230095d3'/%3E%3Cpath d='m11.3313965.03888403-11.277828 6.67879663.01818205 13.56348904 11.25964595 6.6606051 6.6852924-3.9717138-10.66220196-6.5405484v-5.8973849l10.67797726-6.54221107' fill='%23f38b00'/%3E%3Cpath d='m18.017374 22.9708988-6.5183252-3.998915 6.5222007-3.8447451 6.9298332 3.951391' fill='%23004b70'/%3E%3Cpath d='m18.0314053 3.98921729-6.5046536 3.98442963 6.5172421 3.88418548 6.8619013-3.93951296' fill='%2398441e'/%3E%3C/g%3E%3C/svg%3E"
        />
      </div>
      <h3 *ngIf="header" class="card-header">{{ header }}</h3>
      <div class="card-block">
        <h4 *ngIf="title" class="card-title">{{ title }}</h4>
        <div *ngIf="content" class="card-text">
          {{ content }}
        </div>
      </div>
      <ul *ngIf="itemCount" class="list-group">
        <li *ngFor="let _ of createArray(itemCount); let i = index" class="list-group-item">Item {{ i + 1 }}</li>
      </ul>
      <div *ngIf="actionCount" class="card-footer">
        <button *ngFor="let _ of createArray(actionCount); let i = index" class="btn btn-sm {{ buttonClass }}">
          Action {{ i + 1 }}
        </button>
      </div>
    </div>
  `,
})
export class CardStorybookComponent {
  createArray = createArray;
  getButtonClass = getButtonClass;

  @Input() maxWidth = 400;
  @Input() itemCount = 4;
  @Input() actionCount = 4;
  @Input() header = 'Header';
  @Input() title = 'Title';
  @Input() content = 'Hello World!';
  @Input() buttonStyle = 'outline';
  @Input() clickable = true;
  @Input() hasImage = true;

  get buttonClass() {
    return getButtonClass({ buttonStyle: this.buttonStyle, buttonType: 'primary', btnSmallSize: true });
  }
}
