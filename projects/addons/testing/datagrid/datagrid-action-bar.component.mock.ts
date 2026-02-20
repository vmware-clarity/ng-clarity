/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionDefinition } from '@clr/addons/datagrid';

@Component({
  selector: 'appfx-datagrid-action-bar',
  standalone: false,
  template: `
    @for (action of actions; track action) {
      <button
        (click)="onActionClick(action)"
        [title]="action.tooltip"
        [attr.data-test-id]="action.id"
        [disabled]="!action.enabled"
      >
        {{ action.label }}
      </button>
    }
  `,
})
export class MockDatagridActionBarComponent {
  @Input() actions: ActionDefinition[];

  @Output() invokeAction: EventEmitter<ActionDefinition> = new EventEmitter();

  onActionClick(action: ActionDefinition): void {
    this.invokeAction.emit(action);
  }
}
