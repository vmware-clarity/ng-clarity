/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, Input } from '@angular/core';
import { ClrDatagridCell } from './datagrid-cell';
import { SelectionType } from './enums/selection-type';
import * as i0 from "@angular/core";
import * as i1 from "./providers/selection";
import * as i2 from "./providers/row-action-service";
import * as i3 from "./datagrid-if-expanded.service";
import * as i4 from "./providers/global-expandable-rows";
import * as i5 from "../../utils/i18n/common-strings.service";
import * as i6 from "@angular/common";
import * as i7 from "./datagrid-cell";
import * as i8 from "./render/cell-renderer";
/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
export class ClrDatagridRowDetail {
    constructor(selection, rowActionService, expand, expandableRows, commonStrings) {
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.expand = expand;
        this.expandableRows = expandableRows;
        this.commonStrings = commonStrings;
        this.replacedRow = false;
        /* reference to the enum so that template can access it */
        this.SELECTION_TYPE = SelectionType;
        this.subscriptions = [];
    }
    set replace(value) {
        this.expand.setReplace(!!value);
    }
    get beginningOfExpandableContentAriaText() {
        return (this._beginningOfExpandableContentAriaText ||
            `${this.commonStrings.keys.datagridExpandableBeginningOf} ${this.commonStrings.keys.datagridExpandableRowContent}`);
    }
    get endOfExpandableContentAriaText() {
        return (this._endOfExpandableContentAriaText ||
            `${this.commonStrings.keys.datagridExpandableEndOf} ${this.commonStrings.keys.datagridExpandableRowContent}`);
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.expand.replace.subscribe(replaceChange => {
            this.replacedRow = replaceChange;
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrDatagridRowDetail.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridRowDetail, deps: [{ token: i1.Selection }, { token: i2.RowActionService }, { token: i3.DatagridIfExpandService }, { token: i4.ExpandableRowsCount }, { token: i5.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridRowDetail.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridRowDetail, selector: "clr-dg-row-detail", inputs: { _beginningOfExpandableContentAriaText: ["clrRowDetailBeginningAriaText", "_beginningOfExpandableContentAriaText"], _endOfExpandableContentAriaText: ["clrRowDetailEndAriaText", "_endOfExpandableContentAriaText"], replace: ["clrDgReplace", "replace"] }, host: { attributes: { "role": "row" }, properties: { "class.datagrid-row-flex": "true", "class.datagrid-row-detail": "true", "attr.id": "expand.expandableId" } }, queries: [{ propertyName: "cells", predicate: ClrDatagridCell }], ngImport: i0, template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <ng-container *ngIf="this.cells?.length > 0" [ngTemplateOutlet]="noCells"></ng-container>

    <ng-container *ngIf="this.cells?.length === 0">
      <clr-dg-cell class="datagrid-container">
        <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      </clr-dg-cell>
    </ng-container>

    <ng-template #noCells>
      <ng-content></ng-content>
    </ng-template>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i7.ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "directive", type: i8.DatagridCellRenderer, selector: "clr-dg-cell" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridRowDetail, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-row-detail',
                    template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <ng-container *ngIf="this.cells?.length > 0" [ngTemplateOutlet]="noCells"></ng-container>

    <ng-container *ngIf="this.cells?.length === 0">
      <clr-dg-cell class="datagrid-container">
        <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      </clr-dg-cell>
    </ng-container>

    <ng-template #noCells>
      <ng-content></ng-content>
    </ng-template>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
                    host: {
                        '[class.datagrid-row-flex]': 'true',
                        '[class.datagrid-row-detail]': 'true',
                        '[attr.id]': 'expand.expandableId',
                        role: 'row',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.Selection }, { type: i2.RowActionService }, { type: i3.DatagridIfExpandService }, { type: i4.ExpandableRowsCount }, { type: i5.ClrCommonStringsService }]; }, propDecorators: { _beginningOfExpandableContentAriaText: [{
                type: Input,
                args: ['clrRowDetailBeginningAriaText']
            }], _endOfExpandableContentAriaText: [{
                type: Input,
                args: ['clrRowDetailEndAriaText']
            }], cells: [{
                type: ContentChildren,
                args: [ClrDatagridCell]
            }], replace: [{
                type: Input,
                args: ['clrDgReplace']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcm93LWRldGFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtcm93LWRldGFpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBb0IsU0FBUyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQXdCLE1BQU0sZUFBZSxDQUFDO0FBSTFHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7Ozs7Ozs7Ozs7QUFLdkQ7OztHQUdHO0FBNEJILE1BQU0sT0FBTyxvQkFBb0I7SUFhL0IsWUFDUyxTQUFvQixFQUNwQixnQkFBa0MsRUFDbEMsTUFBK0IsRUFDL0IsY0FBbUMsRUFDbkMsYUFBc0M7UUFKdEMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFdBQU0sR0FBTixNQUFNLENBQXlCO1FBQy9CLG1CQUFjLEdBQWQsY0FBYyxDQUFxQjtRQUNuQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFkL0MsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFFcEIsMERBQTBEO1FBQzFELG1CQUFjLEdBQUcsYUFBYSxDQUFDO1FBSXZCLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQVF4QyxDQUFDO0lBRUosSUFDSSxPQUFPLENBQUMsS0FBYztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksb0NBQW9DO1FBQ3RDLE9BQU8sQ0FDTCxJQUFJLENBQUMscUNBQXFDO1lBQzFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FDbkgsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLDhCQUE4QjtRQUNoQyxPQUFPLENBQ0wsSUFBSSxDQUFDLCtCQUErQjtZQUNwQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHVCQUF1QixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQzdHLENBQUM7SUFDSixDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDOztpSEFsRFUsb0JBQW9CO3FHQUFwQixvQkFBb0Isd2ZBU2QsZUFBZSw2QkFsQ3RCOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDsyRkFRVSxvQkFBb0I7a0JBM0JoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQlQ7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLDJCQUEyQixFQUFFLE1BQU07d0JBQ25DLDZCQUE2QixFQUFFLE1BQU07d0JBQ3JDLFdBQVcsRUFBRSxxQkFBcUI7d0JBQ2xDLElBQUksRUFBRSxLQUFLO3FCQUNaO2lCQUNGOzZPQUV5QyxxQ0FBcUM7c0JBQTVFLEtBQUs7dUJBQUMsK0JBQStCO2dCQUNKLCtCQUErQjtzQkFBaEUsS0FBSzt1QkFBQyx5QkFBeUI7Z0JBT0UsS0FBSztzQkFBdEMsZUFBZTt1QkFBQyxlQUFlO2dCQWE1QixPQUFPO3NCQURWLEtBQUs7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIElucHV0LCBPbkRlc3Ryb3ksIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkQ2VsbCB9IGZyb20gJy4vZGF0YWdyaWQtY2VsbCc7XG5pbXBvcnQgeyBEYXRhZ3JpZElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4vZGF0YWdyaWQtaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBFeHBhbmRhYmxlUm93c0NvdW50IH0gZnJvbSAnLi9wcm92aWRlcnMvZ2xvYmFsLWV4cGFuZGFibGUtcm93cyc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5cbi8qKlxuICogR2VuZXJpYyBibGFuZCBjb250YWluZXIgc2VydmluZyB2YXJpb3VzIHB1cnBvc2VzIGZvciBEYXRhZ3JpZC5cbiAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIGhlbHAgc3BhbiBhIHRleHQgb3ZlciBtdWx0aXBsZSByb3dzIGluIGRldGFpbCB2aWV3LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctcm93LWRldGFpbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImNsci1zci1vbmx5XCI+XG4gICAgICB7eyBiZWdpbm5pbmdPZkV4cGFuZGFibGVDb250ZW50QXJpYVRleHQgfX1cbiAgICAgIHt7IGNvbW1vblN0cmluZ3Mua2V5cy5kYXRhZ3JpZEV4cGFuZGFibGVSb3dzSGVscGVyVGV4dCB9fVxuICAgIDwvZGl2PlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJ0aGlzLmNlbGxzPy5sZW5ndGggPiAwXCIgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9DZWxsc1wiPjwvbmctY29udGFpbmVyPlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRoaXMuY2VsbHM/Lmxlbmd0aCA9PT0gMFwiPlxuICAgICAgPGNsci1kZy1jZWxsIGNsYXNzPVwiZGF0YWdyaWQtY29udGFpbmVyXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwibm9DZWxsc1wiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9jbHItZGctY2VsbD5cbiAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgIDxuZy10ZW1wbGF0ZSAjbm9DZWxscz5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGVuZE9mRXhwYW5kYWJsZUNvbnRlbnRBcmlhVGV4dCB9fTwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ctZmxleF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1yb3ctZGV0YWlsXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuaWRdJzogJ2V4cGFuZC5leHBhbmRhYmxlSWQnLFxuICAgIHJvbGU6ICdyb3cnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFJvd0RldGFpbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyUm93RGV0YWlsQmVnaW5uaW5nQXJpYVRleHQnKSBfYmVnaW5uaW5nT2ZFeHBhbmRhYmxlQ29udGVudEFyaWFUZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgnY2xyUm93RGV0YWlsRW5kQXJpYVRleHQnKSBfZW5kT2ZFeHBhbmRhYmxlQ29udGVudEFyaWFUZXh0OiBzdHJpbmc7XG5cbiAgcmVwbGFjZWRSb3cgPSBmYWxzZTtcblxuICAvKiByZWZlcmVuY2UgdG8gdGhlIGVudW0gc28gdGhhdCB0ZW1wbGF0ZSBjYW4gYWNjZXNzIGl0ICovXG4gIFNFTEVDVElPTl9UWVBFID0gU2VsZWN0aW9uVHlwZTtcblxuICBAQ29udGVudENoaWxkcmVuKENsckRhdGFncmlkQ2VsbCkgY2VsbHM6IFF1ZXJ5TGlzdDxDbHJEYXRhZ3JpZENlbGw+O1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBTZWxlY3Rpb24sXG4gICAgcHVibGljIHJvd0FjdGlvblNlcnZpY2U6IFJvd0FjdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGV4cGFuZDogRGF0YWdyaWRJZkV4cGFuZFNlcnZpY2UsXG4gICAgcHVibGljIGV4cGFuZGFibGVSb3dzOiBFeHBhbmRhYmxlUm93c0NvdW50LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHt9XG5cbiAgQElucHV0KCdjbHJEZ1JlcGxhY2UnKVxuICBzZXQgcmVwbGFjZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZXhwYW5kLnNldFJlcGxhY2UoISF2YWx1ZSk7XG4gIH1cblxuICBnZXQgYmVnaW5uaW5nT2ZFeHBhbmRhYmxlQ29udGVudEFyaWFUZXh0KCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9iZWdpbm5pbmdPZkV4cGFuZGFibGVDb250ZW50QXJpYVRleHQgfHxcbiAgICAgIGAke3RoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGFncmlkRXhwYW5kYWJsZUJlZ2lubmluZ09mfSAke3RoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGFncmlkRXhwYW5kYWJsZVJvd0NvbnRlbnR9YFxuICAgICk7XG4gIH1cblxuICBnZXQgZW5kT2ZFeHBhbmRhYmxlQ29udGVudEFyaWFUZXh0KCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9lbmRPZkV4cGFuZGFibGVDb250ZW50QXJpYVRleHQgfHxcbiAgICAgIGAke3RoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGFncmlkRXhwYW5kYWJsZUVuZE9mfSAke3RoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGFncmlkRXhwYW5kYWJsZVJvd0NvbnRlbnR9YFxuICAgICk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmV4cGFuZC5yZXBsYWNlLnN1YnNjcmliZShyZXBsYWNlQ2hhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZXBsYWNlZFJvdyA9IHJlcGxhY2VDaGFuZ2U7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=