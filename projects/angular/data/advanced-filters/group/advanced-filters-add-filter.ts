/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { AdvancedFilterEdit } from '../interfaces/advanced-filter-edit.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. The Add filter button of a group, and the popover it opens.
 */
@Component({
  selector: 'clr-advanced-filters-add-filter',
  template: `
    <button
      type="button"
      class="btn btn-sm btn-outline clr-advanced-filters-add-filter"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      [attr.aria-expanded]="open"
      [attr.aria-controls]="popoverId"
    >
      <cds-icon shape="filter"></cds-icon>
      {{ commonStrings.keys.advancedFilterAddFilter }}
    </button>
    <div
      class="clr-advanced-filters-popover"
      role="dialog"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
      [id]="popoverId"
      [attr.aria-label]="commonStrings.keys.advancedFilterAddFilter"
      *clrPopoverContent="open; at: position; type: popoverType; outsideClickToClose: true; scrollToClose: false"
    >
      <clr-advanced-filters-editor
        [fields]="fields"
        (apply)="apply($event)"
        (cancel)="close()"
      ></clr-advanced-filters-editor>
    </div>
  `,
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrAdvancedFiltersAddFilter {
  @Input() fields: ClrAdvancedFilterField[] = [];

  /**
   * A new, complete filter to add to the group.
   */
  @Output() add = new EventEmitter<ClrAdvancedFilter>();

  readonly popoverId = uniqueIdFactory();
  readonly position = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    private filterText: AdvancedFilterText,
    private liveAnnouncer: LiveAnnouncer
  ) {}

  get open(): boolean {
    return this.popoverService.open;
  }

  apply(edit: AdvancedFilterEdit): void {
    const filter = new ClrAdvancedFilter(edit.field, edit.operator, edit.value);
    this.close();
    this.add.emit(filter);
    this.liveAnnouncer.announce(
      this.commonStrings.parse(this.commonStrings.keys.advancedFilterAnnounceApplied, {
        FILTER: this.filterText.format(edit.field, edit.operator, edit.value),
      })
    );
  }

  close(): void {
    this.popoverService.open = false;
    this.popoverService.focusOrigin();
  }
}
