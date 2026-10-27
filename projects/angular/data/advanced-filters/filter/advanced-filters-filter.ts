/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ClrTreeNode } from '@clr/angular/data/tree-view';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { AdvancedFilterText } from './advanced-filter-text';
import { AdvancedFilterEdit } from '../interfaces/advanced-filter-edit.interface';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFiltersTreeItem } from '../interfaces/advanced-filters-tree-item.interface';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. One filter of the tree, shown as text. Clicking it, or Enter or Space on its node, opens the edit popover.
 */
@Component({
  selector: 'clr-advanced-filters-filter',
  template: `
    <clr-tree-node>
      @if (filter.error) {
        <!-- Outside the link: the tooltip brings its own popover, and the link already opens the edit popover. -->
        <clr-tooltip class="clr-advanced-filters-incomplete-icon">
          <cds-icon
            clrTooltipTrigger
            shape="exclamation-circle"
            status="danger"
            [attr.aria-label]="commonStrings.keys.advancedFilterIncomplete"
            (keydown)="$event.stopPropagation()"
          ></cds-icon>
          <clr-tooltip-content clrPosition="top-right" clrSize="sm">
            {{ commonStrings.keys.advancedFilterIncomplete }}
          </clr-tooltip-content>
        </clr-tooltip>
      }
      <button
        type="button"
        class="clr-treenode-link clr-advanced-filters-filter-text"
        clrPopoverOrigin
        clrPopoverOpenCloseButton
        [class.clr-advanced-filters-incomplete]="!!filter.error"
        [attr.aria-label]="editAriaLabel"
        [attr.aria-expanded]="open"
        [attr.aria-controls]="popoverId"
      >
        {{ text }}
      </button>
      <clr-tooltip>
        <button
          type="button"
          class="btn btn-sm btn-danger btn-icon clr-advanced-filters-remove"
          clrTooltipTrigger
          [attr.aria-label]="removeAriaLabel"
          (keydown)="$event.stopPropagation()"
          (click)="remove()"
        >
          <cds-icon shape="times"></cds-icon>
        </button>
        <clr-tooltip-content clrPosition="top-right" clrSize="md">{{ removeAriaLabel }}</clr-tooltip-content>
      </clr-tooltip>
      <div
        class="clr-advanced-filters-popover"
        role="dialog"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [id]="popoverId"
        [attr.aria-label]="commonStrings.keys.advancedFilterEditDialog"
        *clrPopoverContent="open; at: position; type: popoverType; outsideClickToClose: true; scrollToClose: false"
      >
        <clr-advanced-filters-editor
          [fields]="fields"
          [filter]="filter"
          (apply)="apply($event)"
          (cancel)="close()"
        ></clr-advanced-filters-editor>
      </div>
    </clr-tree-node>
  `,
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrAdvancedFiltersFilter implements OnChanges, OnDestroy, AdvancedFiltersTreeItem {
  @Input() filter: ClrAdvancedFilter;
  @Input() fields: ClrAdvancedFilterField[] = [];

  /**
   * After each change the user makes to this filter.
   */
  @Output() edit = new EventEmitter<void>();
  /**
   * After the user removed this filter.
   */
  @Output() removed = new EventEmitter<void>();
  /**
   * With the new filter, after the user changed the field: a filter keeps its field, so it was replaced.
   */
  @Output() replaced = new EventEmitter<ClrAdvancedFilter>();

  readonly popoverId = uniqueIdFactory();
  readonly position = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;

  @ViewChild(ClrTreeNode) private treeNode: ClrTreeNode<unknown>;

  private subscription: Subscription | undefined;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private popoverService: ClrPopoverService,
    private filterText: AdvancedFilterText,
    private changeDetector: ChangeDetectorRef,
    private liveAnnouncer: LiveAnnouncer
  ) {}

  get open(): boolean {
    return this.popoverService.open;
  }

  /**
   * The definition among the component's fields with the filter's key, which carries the built-in validator, else
   * the filter's own definition.
   */
  get field(): ClrAdvancedFilterField {
    return this.fields.find(field => field.key === this.filter.field.key) ?? this.filter.field;
  }

  get text(): string {
    return this.filterText.format(this.field, this.filter.operator, this.filter.value);
  }

  get editAriaLabel(): string {
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterEditFilter, { FILTER: this.text });
  }

  get removeAriaLabel(): string {
    return this.commonStrings.parse(this.commonStrings.keys.advancedFilterRemoveFilter, { FILTER: this.text });
  }

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.subscription = this.filter?.changes.subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  focus(): void {
    this.treeNode?.focusTreeNode();
  }

  /**
   * The same field edits this filter. Another field replaces it with a new filter at the same position, because the
   * field of a filter never changes.
   */
  apply(edit: AdvancedFilterEdit): void {
    this.close();
    if (edit.field.key === this.filter.field.key) {
      this.filter.set(edit.operator, edit.value);
    } else {
      const parent = this.filter.parent;
      const replacement = new ClrAdvancedFilter(edit.field, edit.operator, edit.value);
      if (parent) {
        parent.addChild(replacement, parent.children.indexOf(this.filter));
      }
      this.filter.remove();
      this.replaced.emit(replacement);
    }
    this.liveAnnouncer.announce(
      this.commonStrings.parse(this.commonStrings.keys.advancedFilterAnnounceApplied, {
        FILTER: this.filterText.format(edit.field, edit.operator, edit.value),
      })
    );
    this.edit.emit();
  }

  close(): void {
    this.popoverService.open = false;
    this.popoverService.focusOrigin();
  }

  remove(): void {
    const text = this.text;
    this.filter.remove();
    this.liveAnnouncer.announce(
      this.commonStrings.parse(this.commonStrings.keys.advancedFilterAnnounceRemoved, { FILTER: text })
    );
    this.removed.emit();
    this.edit.emit();
  }
}
