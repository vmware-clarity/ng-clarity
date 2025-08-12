/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { columnToggleTrackByFn } from './datagrid-column-toggle-trackby';
import { DatagridColumnChanges } from './enums/column-changes.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "./providers/columns.service";
import * as i3 from "../../utils/popover/providers/popover-toggle.service";
import * as i4 from "../../utils/popover/popover-host.directive";
import * as i5 from "@angular/common";
import * as i6 from "../../utils/cdk/cdk-trap-focus.module";
import * as i7 from "../../icon/icon";
import * as i8 from "../../forms/common/label";
import * as i9 from "../../forms/checkbox/checkbox";
import * as i10 from "../../forms/checkbox/checkbox-wrapper";
import * as i11 from "@angular/forms";
import * as i12 from "../../utils/popover/popover-anchor";
import * as i13 from "../../utils/popover/popover-close-button";
import * as i14 from "../../utils/popover/popover-open-close-button";
import * as i15 from "../../utils/popover/popover-content";
import * as i16 from "./datagrid-column-toggle-button";
export class ClrDatagridColumnToggle {
    constructor(commonStrings, columnsService, popoverToggleService) {
        this.commonStrings = commonStrings;
        this.columnsService = columnsService;
        this.popoverId = uniqueIdFactory();
        this.openState = false;
        // Smart Popover
        this.smartPosition = {
            axis: ClrAxis.VERTICAL,
            side: ClrSide.BEFORE,
            anchor: ClrAlignment.START,
            content: ClrAlignment.START,
        };
        // Without tracking the checkboxes get rerendered on model update, which leads
        // to loss of focus after checkbox toggle.
        this.trackByFn = columnToggleTrackByFn;
        this.subscription = popoverToggleService.openChange.subscribe(change => (this.openState = change));
    }
    get allColumnsVisible() {
        return this._allColumnsVisible;
    }
    set allColumnsVisible(value) {
        this._allColumnsVisible = value;
    }
    get hideableColumnStates() {
        const hideables = this.columnsService.columns.filter(column => column.value.hideable);
        return hideables.map(column => column.value);
    }
    get hasOnlyOneVisibleColumn() {
        const nbNonHideableColumns = this.columnsService.columns.length - this.hideableColumnStates.length;
        // this should only return true when there is no non-hideable columns.
        return (nbNonHideableColumns === 0 && this.hideableColumnStates.filter(columnState => !columnState.hidden).length === 1);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    toggleColumnState(columnState, event) {
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
ClrDatagridColumnToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnToggle, deps: [{ token: i1.ClrCommonStringsService }, { token: i2.ColumnsService }, { token: i3.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridColumnToggle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridColumnToggle, selector: "clr-dg-column-toggle", host: { properties: { "class.column-switch-wrapper": "true", "class.active": "openState" } }, viewQueries: [{ propertyName: "allSelectedElement", first: true, predicate: ["allSelected"], descendants: true, read: ElementRef }], hostDirectives: [{ directive: i4.ClrPopoverHostDirective }], ngImport: i0, template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle--action"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="openState"
      [attr.aria-haspopup]="'menu'"
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i8.ClrLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i9.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i10.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "directive", type: i11.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i11.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i11.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i12.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i13.ClrPopoverCloseButton, selector: "[clrPopoverCloseButton]", outputs: ["clrPopoverOnCloseChange"] }, { kind: "directive", type: i14.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i15.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "component", type: i16.ClrDatagridColumnToggleButton, selector: "clr-dg-column-toggle-button", outputs: ["clrAllSelected"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumnToggle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-toggle',
                    template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle--action"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="openState"
      [attr.aria-haspopup]="'menu'"
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
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }, { type: i2.ColumnsService }, { type: i3.ClrPopoverToggleService }]; }, propDecorators: { allSelectedElement: [{
                type: ViewChild,
                args: ['allSelected', { read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtY29sdW1uLXRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFhLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUk1RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFFckYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDekUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdFcEUsTUFBTSxPQUFPLHVCQUF1QjtJQXFCbEMsWUFDUyxhQUFzQyxFQUNyQyxjQUE4QixFQUN0QyxvQkFBNkM7UUFGdEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3JDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQXRCeEMsY0FBUyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBQzlCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsZ0JBQWdCO1FBQ2hCLGtCQUFhLEdBQXVCO1lBQ2xDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUTtZQUN0QixJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU07WUFDcEIsTUFBTSxFQUFFLFlBQVksQ0FBQyxLQUFLO1lBQzFCLE9BQU8sRUFBRSxZQUFZ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cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJBbGlnbm1lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2FsaWdubWVudC5lbnVtJztcbmltcG9ydCB7IENsckF4aXMgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2F4aXMuZW51bSc7XG5pbXBvcnQgeyBDbHJTaWRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9zaWRlLmVudW0nO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBjb2x1bW5Ub2dnbGVUcmFja0J5Rm4gfSBmcm9tICcuL2RhdGFncmlkLWNvbHVtbi10b2dnbGUtdHJhY2tieSc7XG5pbXBvcnQgeyBEYXRhZ3JpZENvbHVtbkNoYW5nZXMgfSBmcm9tICcuL2VudW1zL2NvbHVtbi1jaGFuZ2VzLmVudW0nO1xuaW1wb3J0IHsgQ29sdW1uU3RhdGUgfSBmcm9tICcuL2ludGVyZmFjZXMvY29sdW1uLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kZy1jb2x1bW4tdG9nZ2xlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YnV0dG9uXG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgY2xhc3M9XCJidG4gYnRuLXNtIGNvbHVtbi10b2dnbGUtLWFjdGlvblwiXG4gICAgICBjbHJQb3BvdmVyQW5jaG9yXG4gICAgICBjbHJQb3BvdmVyT3BlbkNsb3NlQnV0dG9uXG4gICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cInBvcG92ZXJJZFwiXG4gICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm9wZW5TdGF0ZVwiXG4gICAgICBbYXR0ci5hcmlhLWhhc3BvcHVwXT1cIidtZW51J1wiXG4gICAgPlxuICAgICAge3sgY29tbW9uU3RyaW5ncy5rZXlzLnBpY2tDb2x1bW5zIH19XG4gICAgPC9idXR0b24+XG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJjb2x1bW4tc3dpdGNoXCJcbiAgICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuc2hvd0NvbHVtbnNNZW51RGVzY3JpcHRpb25cIlxuICAgICAgW2lkXT1cInBvcG92ZXJJZFwiXG4gICAgICBjZGtUcmFwRm9jdXNcbiAgICAgICpjbHJQb3BvdmVyQ29udGVudD1cIm9wZW5TdGF0ZTsgYXQ6IHNtYXJ0UG9zaXRpb247IG91dHNpZGVDbGlja1RvQ2xvc2U6IHRydWU7IHNjcm9sbFRvQ2xvc2U6IHRydWVcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2gtaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiIHRhYmluZGV4PVwiLTFcIiAjYWxsU2VsZWN0ZWQ+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmFsbENvbHVtbnNTZWxlY3RlZCB9fTwvZGl2PlxuICAgICAgICA8aDI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLnNob3dDb2x1bW5zIH19PC9oMj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tbGluayB0b2dnbGUtc3dpdGNoLWNsb3NlLWJ1dHRvblwiXG4gICAgICAgICAgY2xyUG9wb3ZlckNsb3NlQnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwid2luZG93LWNsb3NlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmNsb3NlIH19PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHVsIGNsYXNzPVwic3dpdGNoLWNvbnRlbnQgbGlzdC11bnN0eWxlZFwiPlxuICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGNvbHVtblN0YXRlIG9mIGhpZGVhYmxlQ29sdW1uU3RhdGVzOyB0cmFja0J5OiB0cmFja0J5Rm5cIj5cbiAgICAgICAgICA8Y2xyLWNoZWNrYm94LXdyYXBwZXI+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgY2xyQ2hlY2tib3hcbiAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImhhc09ubHlPbmVWaXNpYmxlQ29sdW1uICYmICFjb2x1bW5TdGF0ZS5oaWRkZW5cIlxuICAgICAgICAgICAgICBbbmdNb2RlbF09XCIhY29sdW1uU3RhdGUuaGlkZGVuXCJcbiAgICAgICAgICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwidG9nZ2xlQ29sdW1uU3RhdGUoY29sdW1uU3RhdGUsICEkZXZlbnQpXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJjb2x1bW5TdGF0ZS50aXRsZVRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9jbHItY2hlY2tib3gtd3JhcHBlcj5cbiAgICAgICAgPC9saT5cbiAgICAgIDwvdWw+XG4gICAgICA8ZGl2IGNsYXNzPVwic3dpdGNoLWZvb3RlclwiPlxuICAgICAgICA8Y2xyLWRnLWNvbHVtbi10b2dnbGUtYnV0dG9uIChjbHJBbGxTZWxlY3RlZCk9XCJhbGxDb2x1bW5zU2VsZWN0ZWQoKVwiPjwvY2xyLWRnLWNvbHVtbi10b2dnbGUtYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jb2x1bW4tc3dpdGNoLXdyYXBwZXJdJzogJ3RydWUnLCAnW2NsYXNzLmFjdGl2ZV0nOiAnb3BlblN0YXRlJyB9LFxuICBob3N0RGlyZWN0aXZlczogW0NsclBvcG92ZXJIb3N0RGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRDb2x1bW5Ub2dnbGUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwb3BvdmVySWQgPSB1bmlxdWVJZEZhY3RvcnkoKTtcbiAgb3BlblN0YXRlID0gZmFsc2U7XG5cbiAgLy8gU21hcnQgUG9wb3ZlclxuICBzbWFydFBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24gPSB7XG4gICAgYXhpczogQ2xyQXhpcy5WRVJUSUNBTCxcbiAgICBzaWRlOiBDbHJTaWRlLkJFRk9SRSxcbiAgICBhbmNob3I6IENsckFsaWdubWVudC5TVEFSVCxcbiAgICBjb250ZW50OiBDbHJBbGlnbm1lbnQuU1RBUlQsXG4gIH07XG5cbiAgLy8gV2l0aG91dCB0cmFja2luZyB0aGUgY2hlY2tib3hlcyBnZXQgcmVyZW5kZXJlZCBvbiBtb2RlbCB1cGRhdGUsIHdoaWNoIGxlYWRzXG4gIC8vIHRvIGxvc3Mgb2YgZm9jdXMgYWZ0ZXIgY2hlY2tib3ggdG9nZ2xlLlxuICByZWFkb25seSB0cmFja0J5Rm4gPSBjb2x1bW5Ub2dnbGVUcmFja0J5Rm47XG5cbiAgcHJpdmF0ZSBfYWxsQ29sdW1uc1Zpc2libGU6IGJvb2xlYW47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQFZpZXdDaGlsZCgnYWxsU2VsZWN0ZWQnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgcHJpdmF0ZSBhbGxTZWxlY3RlZEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwb3BvdmVyVG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBwb3BvdmVyVG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShjaGFuZ2UgPT4gKHRoaXMub3BlblN0YXRlID0gY2hhbmdlKSk7XG4gIH1cblxuICBnZXQgYWxsQ29sdW1uc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FsbENvbHVtbnNWaXNpYmxlO1xuICB9XG4gIHNldCBhbGxDb2x1bW5zVmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2FsbENvbHVtbnNWaXNpYmxlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaGlkZWFibGVDb2x1bW5TdGF0ZXMoKTogQ29sdW1uU3RhdGVbXSB7XG4gICAgY29uc3QgaGlkZWFibGVzID0gdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmZpbHRlcihjb2x1bW4gPT4gY29sdW1uLnZhbHVlLmhpZGVhYmxlKTtcbiAgICByZXR1cm4gaGlkZWFibGVzLm1hcChjb2x1bW4gPT4gY29sdW1uLnZhbHVlKTtcbiAgfVxuXG4gIGdldCBoYXNPbmx5T25lVmlzaWJsZUNvbHVtbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYk5vbkhpZGVhYmxlQ29sdW1ucyA9IHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1ucy5sZW5ndGggLSB0aGlzLmhpZGVhYmxlQ29sdW1uU3RhdGVzLmxlbmd0aDtcbiAgICAvLyB0aGlzIHNob3VsZCBvbmx5IHJldHVybiB0cnVlIHdoZW4gdGhlcmUgaXMgbm8gbm9uLWhpZGVhYmxlIGNvbHVtbnMuXG4gICAgcmV0dXJuIChcbiAgICAgIG5iTm9uSGlkZWFibGVDb2x1bW5zID09PSAwICYmIHRoaXMuaGlkZWFibGVDb2x1bW5TdGF0ZXMuZmlsdGVyKGNvbHVtblN0YXRlID0+ICFjb2x1bW5TdGF0ZS5oaWRkZW4pLmxlbmd0aCA9PT0gMVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgdG9nZ2xlQ29sdW1uU3RhdGUoY29sdW1uU3RhdGU6IENvbHVtblN0YXRlLCBldmVudDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNvbHVtblRvVG9nZ2xlID0gdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zLmZpbHRlcihjb2x1bW4gPT4gY29sdW1uLnZhbHVlID09PSBjb2x1bW5TdGF0ZSlbMF07XG4gICAgdGhpcy5jb2x1bW5zU2VydmljZS5lbWl0U3RhdGVDaGFuZ2UoY29sdW1uVG9Ub2dnbGUsIHtcbiAgICAgIGhpZGRlbjogZXZlbnQsXG4gICAgICBjaGFuZ2VzOiBbRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLkhJRERFTl0sXG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVTd2l0Y2hQYW5lbCgpIHtcbiAgICB0aGlzLm9wZW5TdGF0ZSA9ICF0aGlzLm9wZW5TdGF0ZTtcbiAgfVxuXG4gIGFsbENvbHVtbnNTZWxlY3RlZCgpIHtcbiAgICB0aGlzLmFsbFNlbGVjdGVkRWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cbn1cbiJdfQ==