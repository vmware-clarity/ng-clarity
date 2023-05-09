/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { columnToggleTrackByFn } from './datagrid-column-toggle-trackby';
import { DatagridColumnChanges } from './enums/column-changes.enum';
import { ColumnState } from './interfaces/column-state.interface';
import { ColumnsService } from './providers/columns.service';

@Component({
  selector: 'clr-dg-column-toggle',
  template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle--action"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [attr.aria-controls]="popoverId"
      [attr.aria-owns]="popoverId"
      [attr.aria-expanded]="openState"
    >
      {{ commonStrings.keys.pickColumns }}
    </button>
    <div
      class="column-switch"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.showColumnsMenuDescription"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="openState; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
    >
      <div class="switch-header">
        <div class="clr-sr-only" tabindex="-1" #allSelected>{{ commonStrings.keys.allColumnsSelected }}</div>
        <h2>{{ commonStrings.keys.showColumns }}</h2>
        <button
          class="btn btn-sm btn-link toggle-switch-close-button"
          clrPopoverCloseButton
          type="button"
          [attr.aria-label]="commonStrings.keys.close"
        >
          <cds-icon shape="window-close" aria-hidden="true" [attr.title]="commonStrings.keys.close"></cds-icon>
          <span class="clr-sr-only">{{ commonStrings.keys.close }}</span>
        </button>
      </div>
      <ul class="switch-content list-unstyled">
        <li *ngFor="let columnState of hideableColumnStates; trackBy: trackByFn">
          <clr-checkbox-wrapper>
            <input
              clrCheckbox
              type="checkbox"
              [disabled]="hasOnlyOneVisibleColumn && !columnState.hidden"
              [ngModel]="!columnState.hidden"
              (ngModelChange)="toggleColumnState(columnState, !$event)"
            />
            <label>
              <ng-template [ngTemplateOutlet]="columnState.titleTemplateRef"></ng-template>
            </label>
          </clr-checkbox-wrapper>
        </li>
      </ul>
      <div class="switch-footer">
        <clr-dg-column-toggle-button (clrAllSelected)="allColumnsSelected()"></clr-dg-column-toggle-button>
      </div>
    </div>
  `,
  host: { '[class.column-switch-wrapper]': 'true', '[class.active]': 'openState' },
  hostDirectives: [ClrPopoverHostDirective],
})
export class ClrDatagridColumnToggle implements OnDestroy {
  popoverId = uniqueIdFactory();

  private _allColumnsVisible: boolean;
  private subscription: Subscription;

  // Smart Popover
  smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.BEFORE,
    anchor: ClrAlignment.START,
    content: ClrAlignment.START,
  };
  openState: boolean;

  @ViewChild('allSelected', { read: ElementRef })
  private allSelectedElement: ElementRef<HTMLElement>;

  get allColumnsVisible(): boolean {
    return this._allColumnsVisible;
  }

  set allColumnsVisible(value: boolean) {
    this._allColumnsVisible = value;
  }

  // Without tracking the checkboxes get rerendered on model update, which leads
  // to loss of focus after checkbox toggle.
  readonly trackByFn = columnToggleTrackByFn;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private columnsService: ColumnsService,
    popoverToggleService: ClrPopoverToggleService
  ) {
    this.subscription = popoverToggleService.openChange.subscribe(change => (this.openState = change));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get hideableColumnStates(): ColumnState[] {
    const hideables = this.columnsService.columns.filter(column => column.value.hideable);
    return hideables.map(column => column.value);
  }

  get hasOnlyOneVisibleColumn(): boolean {
    const nbNonHideableColumns = this.columnsService.columns.length - this.hideableColumnStates.length;
    // this should only return true when there is no non-hideable columns.
    return (
      nbNonHideableColumns === 0 && this.hideableColumnStates.filter(columnState => !columnState.hidden).length === 1
    );
  }

  toggleColumnState(columnState: ColumnState, event: boolean) {
    const columnToToggle = this.columnsService.columns.filter(column => column.value === columnState)[0];
    this.columnsService.emitStateChange(columnToToggle, {
      hidden: event,
      changes: [DatagridColumnChanges.HIDDEN],
    });
  }

  toggleSwitchPanel() {
    this.openState = !this.openState;
  }

  allColumnsSelected() {
    this.allSelectedElement.nativeElement.focus();
  }
}
