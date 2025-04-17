/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: '[clrModalHost]',
  host: { '[class.clr-modal-host]': 'true' },
  template: `
    <div *ngIf="scrollable" class="clr-modal-host-scrollable">
      <ng-container *ngTemplateOutlet="modalContent"></ng-container>
    </div>

    <ng-container *ngIf="!scrollable" [ngTemplateOutlet]="modalContent"></ng-container>

    <ng-template #modalContent>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class ClrModalHostComponent {
  scrollable = true;
}
