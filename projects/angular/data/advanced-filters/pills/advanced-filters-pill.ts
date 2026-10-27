/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { ClrBadgeColors } from '@clr/angular/emphasis/badge';
import { ClrLabelColors } from '@clr/angular/emphasis/label';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';
import { AdvancedFilterPillKind } from '../enums/advanced-filter-pill-kind.enum';
import { AdvancedFilterText } from '../filter/advanced-filter-text';
import { AdvancedFilterPillEdit } from '../interfaces/advanced-filter-pill-edit.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
import { AdvancedFiltersTreeItem } from '../interfaces/advanced-filters-tree-item.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';

/**
 * Internal. One pill of the pills layout: the field, its first condition and a badge with the number of the others,
 * for example `Name | Contains Alice +2`. Clicking it opens the pill popover; × removes the whole pill.
 *
 * A pill the layout cannot edit (a SUMMARY pill, or a second pill on the same field) can only be removed.
 */
@Component({
  selector: 'clr-advanced-filters-pill',
  template: `
    <clr-label class="clr-advanced-filters-pill" [clrColor]="color">
      @if (editable) {
        <button
          type="button"
          class="clr-advanced-filters-pill-edit"
          clrPopoverOrigin
          clrPopoverOpenCloseButton
          [attr.aria-label]="editAriaLabel"
          [attr.aria-expanded]="open"
          [attr.aria-controls]="popoverId"
        >
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </button>
      } @else {
        <!-- Focusable, so the reason shows on focus as well as on hover. -->
        <clr-tooltip>
          <span class="clr-advanced-filters-pill-edit" clrTooltipTrigger>
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </span>
          <clr-tooltip-content clrPosition="bottom-right" clrSize="md">{{ reason }}</clr-tooltip-content>
        </clr-tooltip>
      }
      <clr-tooltip>
        <button
          type="button"
          class="clr-advanced-filters-pill-remove"
          clrTooltipTrigger
          [attr.aria-label]="removeAriaLabel"
          (click)="remove()"
        >
          <cds-icon shape="times"></cds-icon>
        </button>
        <clr-tooltip-content clrPosition="bottom-right" clrSize="md">{{ removeAriaLabel }}</clr-tooltip-content>
      </clr-tooltip>
    </clr-label>

    <ng-template #content>
      @if (incomplete || pill.duplicate) {
        <cds-icon shape="exclamation-circle" status="danger"></cds-icon>
      }
      @if (pill.field) {
        <span class="clr-advanced-filters-pill-field">{{ pill.field.label }}</span>
        <span class="clr-advanced-filters-pill-condition">{{ condition }}</span>
        @if (pill.filters.length > 1) {
          <clr-badge [clrColor]="badgeColor">{{ more }}</clr-badge>
        }
      } @else {
        <span class="clr-advanced-filters-pill-condition">{{ summary }}</span>
      }
    </ng-template>

    @if (editable) {
      <div
        class="clr-advanced-filters-popover"
        role="dialog"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [id]="popoverId"
        [attr.aria-label]="commonStrings.keys.advancedFilterEditDialog"
        *clrPopoverContent="open; at: position; type: popoverType; outsideClickToClose: true; scrollToClose: false"
      >
        <clr-advanced-filters-pill-editor [pill]="pill" (apply)="apply($event)"></clr-advanced-filters-pill-editor>
      </div>
    }
  `,
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrAdvancedFiltersPill implements AdvancedFiltersTreeItem {
  @Input() pill: AdvancedFilterPill;

  /**
   * After each change the user makes to this pill.
   */
  @Output() edit = new EventEmitter<void>();
  /**
   * After the user removed this pill.
   */
  @Output() removed = new EventEmitter<void>();

  readonly popoverId = uniqueIdFactory();
  readonly position = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;
  readonly badgeColor = ClrBadgeColors.Info;

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

  /**
   * Only a FIELD pill that is the first of its field opens the popover.
   */
  get editable(): boolean {
    return this.pill.kind === AdvancedFilterPillKind.FIELD && !this.pill.duplicate;
  }

  /**
   * Info for a pill, danger for a second pill on the same field, none for a SUMMARY pill.
   */
  get color(): ClrLabelColors {
    if (this.pill.duplicate) {
      return ClrLabelColors.Danger;
    }
    return this.editable ? ClrLabelColors.Info : ClrLabelColors.None;
  }

  /**
   * The first condition, without the field: "Contains Alice".
   */
  get condition(): string {
    const [first] = this.pill.filters;
    return this.filterText.formatCondition(this.pill.field, first.operator, first.value);
  }

  /**
   * The badge: the number of the other conditions, "+2".
   */
  get more(): string {
    const count = String(this.pill.filters.length - 1);
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterPillMore, { COUNT: count });
  }

  /**
   * The text of a SUMMARY pill: "3 filters".
   */
  get summary(): string {
    const keys = this.commonStrings.keys;
    const count = this.pill.filters.length;
    return count === 1
      ? keys.advancedFilterPillSummaryOne
      : this.commonStrings.parse(keys.advancedFilterPillSummary, { COUNT: String(count) });
  }

  /**
   * A filter that code left incomplete with the `operator` setter.
   */
  get incomplete(): boolean {
    return this.pill.filters.some(filter => !!filter.error);
  }

  /**
   * Why a pill can only be removed.
   */
  get reason(): string {
    const keys = this.commonStrings.keys;
    return this.pill.duplicate ? keys.advancedFilterPillDuplicate : keys.advancedFilterPillReadOnly;
  }

  /**
   * The whole pill as text: every condition, joined by the group's logic.
   */
  get expression(): string {
    if (!this.pill.field) {
      return this.summary;
    }
    const texts = this.pill.filters.map(filter =>
      this.filterText.format(this.pill.field, filter.operator, filter.value)
    );
    const node = this.pill.node;
    return this.filterText.join(
      texts,
      node instanceof ClrAdvancedFilterGroup ? node.logic : ClrAdvancedFilterLogic.AND
    );
  }

  get editAriaLabel(): string {
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterEditFilter, { FILTER: this.expression });
  }

  get removeAriaLabel(): string {
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterRemoveFilter, { FILTER: this.expression });
  }

  /**
   * Focuses the pill, or its × when it cannot be edited.
   */
  focus(): void {
    this.element.nativeElement.querySelector<HTMLButtonElement>('button')?.focus();
  }

  apply(edit: AdvancedFilterPillEdit): void {
    this.close();
    this.pills.update(this.pill.node, edit);
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

  remove(): void {
    const text = this.expression;
    this.pill.node.remove();
    this.liveAnnouncer.announce(
      this.commonStrings.parse(this.commonStrings.keys.advancedFilterAnnounceRemoved, { FILTER: text })
    );
    this.removed.emit();
    this.edit.emit();
  }
}
