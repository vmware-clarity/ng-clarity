/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'appfx-datagrid-action-bar',
  standalone: false,
  template: `
    <button
      *ngFor="let action of actions"
      (click)="onActionClick(action)"
      [title]="action.tooltip"
      [attr.data-test-id]="action.id"
      [disabled]="!action.enabled"
    >
      {{ action.label }}
    </button>
  `,
})
export class MockDatagridActionBarComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() actions: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() invokeAction: EventEmitter<any> = new EventEmitter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionClick(action: any): void {
    this.invokeAction.emit(action);
  }
}
