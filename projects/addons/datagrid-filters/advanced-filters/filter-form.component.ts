/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';

/**
 * Reusable form component.
 *
 */
@Component({
  selector: 'appfx-filter-form',
  standalone: false,
  templateUrl: 'filter-form.component.html',
  styleUrls: ['../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFormComponent {
  /**
   * Hosting view form status
   */
  @Input() valid: boolean;

  /**
   * Event emitter to tell hosting view that cancel button was clicked
   */
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Event emitter to tell hosting view that apply button was clicked
   */
  @Output() apply: EventEmitter<void> = new EventEmitter<void>();

  constructor(public filterStrings: DatagridFiltersStrings) {}

  onApplyButtonClick(): void {
    this.apply.emit();
  }

  onCancelButtonClick(): void {
    this.cancel.emit();
  }
}
