/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-badge',
  template: `
    <div style="margin-top: 5px" *ngFor="let status of modifierClasses">
      <span class="badge" [ngClass]="status">{{ context }}</span>
      <a href="#" class="badge" [ngClass]="status">{{ context }}</a>
    </div>
  `,
})
export class BadgeStoryBookComponent {
  @Input() context = '42';
  modifierClasses: string[] = ['', 'badge-info', 'badge-success', 'badge-warning', 'badge-danger', 'badge-purple'];
}
