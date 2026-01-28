/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrBadge } from '@clr/angular';

@Component({
  selector: 'storybook-badge',
  template: `
    @for (status of badgeList; track status) {
      @if (cssBadge) {
        <span class="badge" [ngClass]="badgeClass(status)">{{ context }}</span>
        @if (showLinkBadge) {
          <a href="#" class="badge" [ngClass]="badgeClass(status)">{{ context }}</a>
        }
      } @else {
        <clr-badge [clrType]="outlined ? 'outlined' : 'solid'" [clrColor]="status">{{ context }}</clr-badge>
      }
    }
  `,
  standalone: true,
  imports: [NgClass, ClrBadge],
})
export class BadgeStoryBookComponent {
  @Input() context = '42';
  @Input() showLinkBadge = true;
  @Input() outlined = false;
  @Input() cssBadge = true;
  @Input() badgeTypes: string[] = [''];
  @Input() badgeType = '';

  get badgeList() {
    return this.badgeType ? [this.badgeType] : this.badgeTypes;
  }

  badgeClass(name: string) {
    return `badge-${name} ${this.outlined ? 'badge-outlined' : ''}`;
  }
}
