/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'clr-alert-item',
  template: `
    <cds-alert [closable]="closable">
      <ng-content></ng-content>
      <cds-alert-actions>
        <ng-content select=".alert-actions"></ng-content>
      </cds-alert-actions>
    </cds-alert>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      clr-alert-item .alert-actions {
        font-size: var(--cds-global-typography-font-size-4) !important;
      }

      clr-alert-item .alert-actions {
        display: flex;
        gap: var(--cds-global-layout-space-xs);
      }

      /* to prevent breaking API change */
      .alert-action {
        color: var(--color);
        border-color: currentColor;
        padding: var(--cds-global-space-4);
        margin: 0;
        height: auto;
        line-height: 1em;
      }

      .alert-action:hover {
        color: var(--color);
        border-color: currentColor;
      }
    `,
  ],
})
export class ClrAlertItem {
  @Input() closable = false;

  @Output() private closeChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(private hostElement: ElementRef) {}

  ngAfterContentInit() {
    this.hostElement.nativeElement.addEventListener('closeChange', () => this.closeChange.emit(true));
  }
}
