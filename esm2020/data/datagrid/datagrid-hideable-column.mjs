/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Inject, Input, Optional, Output, } from '@angular/core';
import { DatagridColumnChanges } from './enums/column-changes.enum';
import { COLUMN_STATE } from './providers/column-state.provider';
import * as i0 from "@angular/core";
import * as i1 from "./providers/columns.service";
import * as i2 from "rxjs";
/**
 *
 * @description
 * A structural directive meant to be used inside a clr-dg-column component.
 *
 * <clr-dg-column>
 *       <ng-container *clrDgHideableColumn="{ hidden: true }">
 *           User ID
 *       </ng-container>
 *   </clr-dg-column>
 *
 * It sets up state and properties so that columns can be manges for hide/show by a service and an internal
 * datagrid toggle component.
 *
 */
export class ClrDatagridHideableColumn {
    constructor(titleTemplateRef, viewContainerRef, columnsService, columnState) {
        this.titleTemplateRef = titleTemplateRef;
        this.columnsService = columnsService;
        this.columnState = columnState;
        this.hiddenChange = new EventEmitter();
        this.subscriptions = [];
        viewContainerRef.createEmbeddedView(titleTemplateRef);
        if (!columnState) {
            throw new Error('The *clrDgHideableColumn directive can only be used inside of a clr-dg-column component.');
        }
    }
    /**
     *
     * @description
     * Setter fn for the @Input with the same name as this structural directive.
     * It allows the user to pre-configure the column's hide/show state. { hidden: true }
     * It's more verbose but has more Clarity.
     *
     * @example
     * *clrDgHideableColumn
     * *clrDgHideableColumn={hidden: false}
     * *clrDgHideableColumn={hidden: true}
     *
     */
    set clrDgHideableColumn(value) {
        if (typeof value === 'string') {
            this.clrDgHidden = false;
            return;
        }
        this.clrDgHidden = value && value.hidden ? value.hidden : false;
    }
    set clrDgHidden(hidden) {
        this._hidden = hidden ? hidden : false;
        this.columnsService.emitStateChange(this.columnState, {
            hidden: this._hidden,
            changes: [DatagridColumnChanges.HIDDEN],
        });
    }
    ngOnInit() {
        this.columnsService.emitStateChange(this.columnState, {
            hideable: true,
            titleTemplateRef: this.titleTemplateRef,
            hidden: this._hidden,
            changes: [DatagridColumnChanges.HIDDEN],
        });
        this.subscriptions.push(this.columnState.subscribe((state) => {
            if (state.changes && state.changes.indexOf(DatagridColumnChanges.HIDDEN) > -1) {
                this.hiddenChange.emit(state.hidden); // Can emit through @Output when desugared syntax is used
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrDatagridHideableColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridHideableColumn, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i1.ColumnsService }, { token: COLUMN_STATE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridHideableColumn.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridHideableColumn, selector: "[clrDgHideableColumn]", inputs: { clrDgHideableColumn: "clrDgHideableColumn", clrDgHidden: "clrDgHidden" }, outputs: { hiddenChange: "clrDgHiddenChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridHideableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDgHideableColumn]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i1.ColumnsService }, { type: i2.BehaviorSubject, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [COLUMN_STATE]
                }] }]; }, propDecorators: { hiddenChange: [{
                type: Output,
                args: ['clrDgHiddenChange']
            }], clrDgHideableColumn: [{
                type: Input,
                args: ['clrDgHideableColumn']
            }], clrDgHidden: [{
                type: Input,
                args: ['clrDgHidden']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtaGlkZWFibGUtY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1oaWRlYWJsZS1jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEdBR1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1DQUFtQyxDQUFDOzs7O0FBT2pFOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxPQUFPLHlCQUF5QjtJQWFwQyxZQUNVLGdCQUFrQyxFQUMxQyxnQkFBa0MsRUFDMUIsY0FBOEIsRUFHOUIsV0FBeUM7UUFMekMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUVsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFHOUIsZ0JBQVcsR0FBWCxXQUFXLENBQThCO1FBbEJ0QixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFVaEUsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBVXpDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFdEQsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLDBGQUEwRixDQUFDLENBQUM7U0FDN0c7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsSUFDSSxtQkFBbUIsQ0FBQyxLQUFtQztRQUN6RCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDbEUsQ0FBQztJQUVELElBQ0ksV0FBVyxDQUFDLE1BQWU7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEQsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQztTQUN4QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEQsUUFBUSxFQUFFLElBQUk7WUFDZCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNwQixPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBa0IsRUFBRSxFQUFFO1lBQ2hELElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDN0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMseURBQXlEO2FBQ2hHO1FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDOztzSEE5RVUseUJBQXlCLDJHQWtCMUIsWUFBWTswR0FsQlgseUJBQXlCOzJGQUF6Qix5QkFBeUI7a0JBbkJyQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1QkFBdUI7aUJBQ2xDOzswQkFrQ0ksUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQyxZQUFZOzRDQWpCTyxZQUFZO3NCQUF4QyxNQUFNO3VCQUFDLG1CQUFtQjtnQkF5Q3ZCLG1CQUFtQjtzQkFEdEIsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBVXhCLFdBQVc7c0JBRGQsS0FBSzt1QkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEYXRhZ3JpZENvbHVtbkNoYW5nZXMgfSBmcm9tICcuL2VudW1zL2NvbHVtbi1jaGFuZ2VzLmVudW0nO1xuaW1wb3J0IHsgQ29sdW1uU3RhdGUgfSBmcm9tICcuL2ludGVyZmFjZXMvY29sdW1uLXN0YXRlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDT0xVTU5fU1RBVEUgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW4tc3RhdGUucHJvdmlkZXInO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyRGdIaWRlYWJsZUNvbHVtbl0nLFxufSlcblxuLyoqXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIHN0cnVjdHVyYWwgZGlyZWN0aXZlIG1lYW50IHRvIGJlIHVzZWQgaW5zaWRlIGEgY2xyLWRnLWNvbHVtbiBjb21wb25lbnQuXG4gKlxuICogPGNsci1kZy1jb2x1bW4+XG4gKiAgICAgICA8bmctY29udGFpbmVyICpjbHJEZ0hpZGVhYmxlQ29sdW1uPVwieyBoaWRkZW46IHRydWUgfVwiPlxuICogICAgICAgICAgIFVzZXIgSURcbiAqICAgICAgIDwvbmctY29udGFpbmVyPlxuICogICA8L2Nsci1kZy1jb2x1bW4+XG4gKlxuICogSXQgc2V0cyB1cCBzdGF0ZSBhbmQgcHJvcGVydGllcyBzbyB0aGF0IGNvbHVtbnMgY2FuIGJlIG1hbmdlcyBmb3IgaGlkZS9zaG93IGJ5IGEgc2VydmljZSBhbmQgYW4gaW50ZXJuYWxcbiAqIGRhdGFncmlkIHRvZ2dsZSBjb21wb25lbnQuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRIaWRlYWJsZUNvbHVtbiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ2NsckRnSGlkZGVuQ2hhbmdlJykgaGlkZGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVXNlZCB0byBpbml0aWFsaXplIHRoZSBjb2x1bW4gd2l0aCBlaXRoZXIgaGlkZGVuIG9yIHZpc2libGUgc3RhdGUuXG4gICAqXG4gICAqL1xuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgdGl0bGVUZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChDT0xVTU5fU1RBVEUpXG4gICAgcHJpdmF0ZSBjb2x1bW5TdGF0ZTogQmVoYXZpb3JTdWJqZWN0PENvbHVtblN0YXRlPlxuICApIHtcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyh0aXRsZVRlbXBsYXRlUmVmKTtcblxuICAgIGlmICghY29sdW1uU3RhdGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlICpjbHJEZ0hpZGVhYmxlQ29sdW1uIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIGluc2lkZSBvZiBhIGNsci1kZy1jb2x1bW4gY29tcG9uZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0dGVyIGZuIGZvciB0aGUgQElucHV0IHdpdGggdGhlIHNhbWUgbmFtZSBhcyB0aGlzIHN0cnVjdHVyYWwgZGlyZWN0aXZlLlxuICAgKiBJdCBhbGxvd3MgdGhlIHVzZXIgdG8gcHJlLWNvbmZpZ3VyZSB0aGUgY29sdW1uJ3MgaGlkZS9zaG93IHN0YXRlLiB7IGhpZGRlbjogdHJ1ZSB9XG4gICAqIEl0J3MgbW9yZSB2ZXJib3NlIGJ1dCBoYXMgbW9yZSBDbGFyaXR5LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAqY2xyRGdIaWRlYWJsZUNvbHVtblxuICAgKiAqY2xyRGdIaWRlYWJsZUNvbHVtbj17aGlkZGVuOiBmYWxzZX1cbiAgICogKmNsckRnSGlkZWFibGVDb2x1bW49e2hpZGRlbjogdHJ1ZX1cbiAgICpcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdIaWRlYWJsZUNvbHVtbicpXG4gIHNldCBjbHJEZ0hpZGVhYmxlQ29sdW1uKHZhbHVlOiB7IGhpZGRlbjogYm9vbGVhbiB9IHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuY2xyRGdIaWRkZW4gPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jbHJEZ0hpZGRlbiA9IHZhbHVlICYmIHZhbHVlLmhpZGRlbiA/IHZhbHVlLmhpZGRlbiA6IGZhbHNlO1xuICB9XG5cbiAgQElucHV0KCdjbHJEZ0hpZGRlbicpXG4gIHNldCBjbHJEZ0hpZGRlbihoaWRkZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBoaWRkZW4gPyBoaWRkZW4gOiBmYWxzZTtcbiAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmVtaXRTdGF0ZUNoYW5nZSh0aGlzLmNvbHVtblN0YXRlLCB7XG4gICAgICBoaWRkZW46IHRoaXMuX2hpZGRlbixcbiAgICAgIGNoYW5nZXM6IFtEYXRhZ3JpZENvbHVtbkNoYW5nZXMuSElEREVOXSxcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuZW1pdFN0YXRlQ2hhbmdlKHRoaXMuY29sdW1uU3RhdGUsIHtcbiAgICAgIGhpZGVhYmxlOiB0cnVlLFxuICAgICAgdGl0bGVUZW1wbGF0ZVJlZjogdGhpcy50aXRsZVRlbXBsYXRlUmVmLFxuICAgICAgaGlkZGVuOiB0aGlzLl9oaWRkZW4sXG4gICAgICBjaGFuZ2VzOiBbRGF0YWdyaWRDb2x1bW5DaGFuZ2VzLkhJRERFTl0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuY29sdW1uU3RhdGUuc3Vic2NyaWJlKChzdGF0ZTogQ29sdW1uU3RhdGUpID0+IHtcbiAgICAgICAgaWYgKHN0YXRlLmNoYW5nZXMgJiYgc3RhdGUuY2hhbmdlcy5pbmRleE9mKERhdGFncmlkQ29sdW1uQ2hhbmdlcy5ISURERU4pID4gLTEpIHtcbiAgICAgICAgICB0aGlzLmhpZGRlbkNoYW5nZS5lbWl0KHN0YXRlLmhpZGRlbik7IC8vIENhbiBlbWl0IHRocm91Z2ggQE91dHB1dCB3aGVuIGRlc3VnYXJlZCBzeW50YXggaXMgdXNlZFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=