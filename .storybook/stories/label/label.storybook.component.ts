/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrIconModule, ClrTag } from '@clr/angular';

import { RenderComponentStorybook } from '../../helpers/render-component';

@Component({
  selector: 'storybook-label',
  template: `
    @for (type of labelList; track type) {
      @if (cssLabel) {
        <span class="label" [ngClass]="labelClass(type)" [class.clickable]="clickable">
          <span class="text">{{ content }}</span>
          @if (closeIcon) {
            <cds-icon shape="close"></cds-icon>
          }
        </span>
      } @else {
        <clr-label
          [clrColor]="type"
          [clrBadgeContent]="badgeContent"
          [clrClickable]="clickable"
          [clrClosable]="closeIcon"
        >
          {{ content }}
        </clr-label>
      }
    }
  `,
  standalone: true,
  imports: [ClrIconModule, ClrTag, NgClass],
})
export class LabelStoryBookComponent extends RenderComponentStorybook {
  @Input() content = 'Hello World!';
  @Input() badgeContent = '42';
  @Input() cssLabel = true;
  @Input() clickable = false;
  @Input() closeIcon = false;
  @Input() labelTypes = [''];
  @Input() labelType = '';

  get labelList() {
    return this.labelType ? [this.labelType] : this.labelTypes;
  }

  labelClass(name: string) {
    return `label-${name}`;
  }
}
