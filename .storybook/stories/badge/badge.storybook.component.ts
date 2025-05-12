/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-badge',
  template: `
    <ng-container *ngFor="let status of badgeType ? [badgeType] : badgeTypes">
      <span class="badge" [ngClass]="status">{{ context }}</span>
      <a *ngIf="showLinkBadge" href="#" class="badge" [ngClass]="status">{{ context }}</a>
    </ng-container>
  `,
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
})
export class BadgeStoryBookComponent {
  @Input() context = '42';
  @Input() showLinkBadge = true;
  @Input() badgeTypes: string[] = [''];
  @Input() badgeType = '';
}
