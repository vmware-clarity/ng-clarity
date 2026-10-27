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
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { AdvancedFilterPills } from './advanced-filter-pills';
import { ClrAdvancedFiltersPill } from './advanced-filters-pill';
import { ClrAdvancedFiltersPillAdd } from './advanced-filters-pill-add';
import { AdvancedFilterPillKind } from '../enums/advanced-filter-pill-kind.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';

/**
 * Internal. The pills layout: one pill per child of the root, `+ ADD FILTER`, and × to clear all. The root's logic is
 * not shown.
 */
@Component({
  selector: 'clr-advanced-filters-pills',
  template: `
    <div
      class="clr-advanced-filters-pills"
      role="group"
      [attr.aria-label]="commonStrings.keys.advancedFiltersAriaLabel"
    >
      @for (pill of pills; track pill.node.id; let index = $index) {
        <clr-advanced-filters-pill
          [pill]="pill"
          (edit)="edit.emit()"
          (removed)="onRemoved(index)"
        ></clr-advanced-filters-pill>
      }
      <clr-advanced-filters-pill-add
        [root]="root"
        [fields]="availableFields"
        (edit)="edit.emit()"
      ></clr-advanced-filters-pill-add>
      <clr-tooltip>
        <button
          type="button"
          class="btn btn-sm btn-link btn-icon clr-advanced-filters-clear-all"
          clrTooltipTrigger
          [attr.aria-label]="commonStrings.keys.advancedFilterClearAll"
          (click)="clearAll()"
        >
          <cds-icon shape="times"></cds-icon>
        </button>
        <clr-tooltip-content clrPosition="bottom-right" clrSize="sm">
          {{ commonStrings.keys.advancedFilterClearAll }}
        </clr-tooltip-content>
      </clr-tooltip>
    </div>
  `,
  standalone: false,
})
export class ClrAdvancedFiltersPills implements OnChanges, OnDestroy {
  @Input() root: ClrAdvancedFilterGroup;
  @Input() fields: ClrAdvancedFilterField[] = [];

  /**
   * After each change the user makes.
   */
  @Output() edit = new EventEmitter<void>();

  pills: AdvancedFilterPill[] = [];
  /**
   * The fields without a pill: Add filter offers only these.
   */
  availableFields: ClrAdvancedFilterField[] = [];

  @ViewChildren(ClrAdvancedFiltersPill) private pillItems: QueryList<ClrAdvancedFiltersPill>;
  @ViewChild(ClrAdvancedFiltersPillAdd) private addItem: ClrAdvancedFiltersPillAdd;

  private subscription: Subscription | undefined;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private pillRules: AdvancedFilterPills,
    private changeDetector: ChangeDetectorRef,
    private liveAnnouncer: LiveAnnouncer,
    private injector: Injector
  ) {}

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.subscription = this.root?.changes.subscribe(() => this.refresh());
    this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  clearAll(): void {
    this.root.clear();
    this.liveAnnouncer.announce(this.commonStrings.keys.advancedFilterAnnounceCleared);
    this.edit.emit();
  }

  /**
   * Focus moves to the next pill, else to the previous one, else to Add filter.
   */
  onRemoved(index: number): void {
    afterNextRender(
      () => {
        const items = this.pillItems.toArray();
        (items[index] ?? items[index - 1] ?? this.addItem).focus();
      },
      { injector: this.injector }
    );
  }

  private refresh(): void {
    this.pills = this.root ? this.pillRules.build(this.root, this.fields) : [];
    const used = new Set(
      this.pills.filter(pill => pill.kind === AdvancedFilterPillKind.FIELD).map(pill => pill.field.key)
    );
    this.availableFields = this.fields.filter(field => !used.has(field.key));
    this.changeDetector.markForCheck();
  }
}
