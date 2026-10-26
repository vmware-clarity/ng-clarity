/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ClrTreeNode } from '@clr/angular/data/tree-view';
import { ClrCommonStringsService, uniqueIdFactory } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFiltersTreeItem } from '../interfaces/advanced-filters-tree-item.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilterNode } from '../models/advanced-filter-node.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. One group of the tree, rendered recursively: its header (And/Or, Add filter, Add group, and remove or
 * Clear all) and its children.
 */
@Component({
  selector: 'clr-advanced-filters-group',
  templateUrl: './advanced-filters-group.html',
  standalone: false,
})
export class ClrAdvancedFiltersGroup implements OnChanges, OnDestroy, AdvancedFiltersTreeItem {
  @Input() group: ClrAdvancedFilterGroup;
  @Input() fields: ClrAdvancedFilterField[] = [];
  /**
   * 1 for the root.
   */
  @Input() level = 1;
  @Input() maxDepth = 3;

  /**
   * After each change the user makes in this group or below it.
   */
  @Output() edit = new EventEmitter<void>();
  /**
   * After the user removed this group.
   */
  @Output() removed = new EventEmitter<void>();

  readonly logic = ClrAdvancedFilterLogic;
  readonly id = uniqueIdFactory();

  @ViewChild(ClrTreeNode) private treeNode: ClrTreeNode<unknown>;
  @ViewChildren('child') private childItems: QueryList<AdvancedFiltersTreeItem>;

  private subscription: Subscription | undefined;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private changeDetector: ChangeDetectorRef,
    private liveAnnouncer: LiveAnnouncer,
    private injector: Injector
  ) {}

  get isRoot(): boolean {
    return this.level === 1;
  }

  /**
   * The children as they are shown: the filters first, then the groups, each in the order of the model. The model
   * keeps its own order.
   */
  get visibleChildren(): ClrAdvancedFilterNode[] {
    const children = this.group.children;
    return [
      ...children.filter(child => child instanceof ClrAdvancedFilter),
      ...children.filter(child => !(child instanceof ClrAdvancedFilter)),
    ];
  }

  get canAddGroup(): boolean {
    return this.level < this.maxDepth;
  }

  get ariaLabel(): string {
    const keys = this.commonStrings.keys;
    return this.group.logic === ClrAdvancedFilterLogic.OR
      ? keys.advancedFilterGroupAnyAriaLabel
      : keys.advancedFilterGroupAllAriaLabel;
  }

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.subscription = this.group?.changes.subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  focus(): void {
    this.treeNode?.focusTreeNode();
  }

  asGroup(node: ClrAdvancedFilterNode): ClrAdvancedFilterGroup | null {
    return node instanceof ClrAdvancedFilterGroup ? node : null;
  }

  asFilter(node: ClrAdvancedFilterNode): ClrAdvancedFilter | null {
    return node instanceof ClrAdvancedFilter ? node : null;
  }

  setLogic(logic: ClrAdvancedFilterLogic): void {
    if (this.group.logic !== logic) {
      this.group.logic = logic;
      this.edit.emit();
    }
  }

  addFilter(filter: ClrAdvancedFilter): void {
    this.group.addChild(filter);
    this.edit.emit();
  }

  addGroup(): void {
    if (!this.canAddGroup) {
      return;
    }
    this.group.addChild(new ClrAdvancedFilterGroup());
    this.liveAnnouncer.announce(this.commonStrings.keys.advancedFilterAnnounceGroupAdded);
    this.edit.emit();
  }

  remove(): void {
    this.group.remove();
    this.liveAnnouncer.announce(this.commonStrings.keys.advancedFilterAnnounceGroupRemoved);
    this.removed.emit();
    this.edit.emit();
  }

  clearAll(): void {
    this.group.clear();
    this.liveAnnouncer.announce(this.commonStrings.keys.advancedFilterAnnounceCleared);
    this.edit.emit();
  }

  /**
   * A filter was replaced by a new one, because its field changed: the focus goes to the new filter.
   */
  onChildReplaced(replacement: ClrAdvancedFilter): void {
    afterNextRender(() => this.childItems.toArray()[this.visibleChildren.indexOf(replacement)]?.focus(), {
      injector: this.injector,
    });
  }

  /**
   * Focus moves to the next sibling of the removed child, else to the previous one, else to this group. The index is
   * the position as shown.
   */
  onChildRemoved(index: number): void {
    afterNextRender(
      () => {
        const items = this.childItems.toArray();
        (items[index] ?? items[index - 1] ?? this).focus();
      },
      { injector: this.injector }
    );
  }
}
