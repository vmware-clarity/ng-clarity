/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPillEdit } from '../interfaces/advanced-filter-pill-edit.interface';
import { AdvancedFiltersTreeItem } from '../interfaces/advanced-filters-tree-item.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';

/**
 * Internal. The `+ ADD FILTER` button of the pills layout, and the pill popover it opens. It always adds to the root.
 */
@Component({
  selector: 'clr-advanced-filters-pill-add',
  template: `
    <button
      type="button"
      class="btn btn-sm btn-link clr-advanced-filters-add-filter"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      [disabled]="!fields.length"
      [attr.aria-expanded]="open"
      [attr.aria-controls]="popoverId"
    >
      <cds-icon shape="plus"></cds-icon>
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
      <clr-advanced-filters-pill-editor [fields]="fields" (apply)="apply($event)"></clr-advanced-filters-pill-editor>
    </div>
  `,
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrAdvancedFiltersPillAdd implements AdvancedFiltersTreeItem {
  @Input() root: ClrAdvancedFilterGroup;
  /**
   * The fields without a pill yet. The button is disabled when there are none.
   */
  @Input() fields: ClrAdvancedFilterField[] = [];

  /**
   * After the user added a pill.
   */
  @Output() edit = new EventEmitter<void>();

  readonly popoverId = uniqueIdFactory();
  readonly position = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    private filterText: AdvancedFilterText,
    private pills: AdvancedFilterPills,
    private liveAnnouncer: LiveAnnouncer,
    private element: ElementRef<HTMLElement>
  ) {}

  get open(): boolean {
    return this.popoverService.open;
  }

  focus(): void {
    this.element.nativeElement.querySelector<HTMLButtonElement>('button')?.focus();
  }

  apply(edit: AdvancedFilterPillEdit): void {
    this.close();
    this.pills.add(this.root, edit);
    const texts = edit.rows.map(row => this.filterText.format(edit.field, row.operator, row.value));
    this.liveAnnouncer.announce(
      this.commonStrings.parse(this.commonStrings.keys.advancedFilterAnnounceApplied, {
        FILTER: this.filterText.join(texts, edit.logic),
      })
    );
    this.edit.emit();
  }

  close(): void {
    this.popoverService.open = false;
    this.popoverService.focusOrigin();
  }
}
