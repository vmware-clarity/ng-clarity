/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrIcon, ClrLabel } from '@clr/angular';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-label',
  template: `
    @for (type of labelList; track type) {
      @if (cssLabel) {
        <span class="label" [ngClass]="labelClass(type)" [class.clickable]="clickable" [class.disabled]="disabled">
          <span class="text">{{ content }}</span>
          @if (badgeText) {
            <span class="badge">{{ badgeText }}</span>
          }
          @if (closeIcon) {
            <cds-icon shape="close"></cds-icon>
          }
        </span>
      } @else {
        <clr-label
          [clrColor]="type"
          [clrText]="content"
          [clrBadgeText]="badgeText"
          [clrClickable]="clickable"
          [clrDisabled]="disabled"
        >
          @if (showProjectedContent) {
            <span class="text">Projected {{ content }}</span>
          }
          @if (closeIcon) {
            <cds-icon shape="close"></cds-icon>
          }
        </clr-label>
      }
    }
  `,
  standalone: true,
  imports: [ClrIcon, ClrLabel, NgClass],
})
export class LabelStoryBookComponent extends RenderComponentStorybook {
  @Input() content = 'Hello World!';
  @Input() badgeText = '';
  @Input() cssLabel = true;
  @Input() clickable = false;
  @Input() disabled = false;
  @Input() closeIcon = false;
  @Input() showProjectedContent = false;
  @Input() labelTypes = [''];
  @Input() labelType = '';

  get labelList() {
    return this.labelType ? [this.labelType] : this.labelTypes;
  }

  labelClass(name: string) {
    return name ? `label-${name}` : '';
  }
}
