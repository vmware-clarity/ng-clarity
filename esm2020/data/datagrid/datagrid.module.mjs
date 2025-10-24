/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { angleDoubleIcon, arrowIcon, ClarityIcons, ellipsisVerticalIcon, filterGridCircleIcon, filterGridIcon, stepForward2Icon, timesIcon, viewColumnsIcon, windowCloseIcon, } from '@cds/core/icon';
import { ClrFormsModule } from '../../forms/forms.module';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrSpinnerModule } from '../../progress/spinner/spinner.module';
import { ClrExpandableAnimationModule } from '../../utils/animations/expandable-animation/expandable-animation.module';
import { CdkDragModule } from '../../utils/cdk/cdk-drag.module';
import { CdkTrapFocusModule } from '../../utils/cdk/cdk-trap-focus.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrKeyFocusModule } from '../../utils/focus/key-focus/key-focus.module';
import { ClrLoadingModule } from '../../utils/loading/loading.module';
import { ClrOutsideClickModule } from '../../utils/outside-click/outside-click.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { DatagridNumericFilter } from './built-in/filters/datagrid-numeric-filter';
import { DatagridStringFilter } from './built-in/filters/datagrid-string-filter';
import { ActionableOompaLoompa } from './chocolate/actionable-oompa-loompa';
import { DatagridWillyWonka } from './chocolate/datagrid-willy-wonka';
import { ExpandableOompaLoompa } from './chocolate/expandable-oompa-loompa';
import { ClrDatagrid } from './datagrid';
import { ClrDatagridActionBar } from './datagrid-action-bar';
import { ClrDatagridActionOverflow } from './datagrid-action-overflow';
import { ClrDatagridCell } from './datagrid-cell';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridColumnSeparator } from './datagrid-column-separator';
import { ClrDatagridColumnToggle } from './datagrid-column-toggle';
import { ClrDatagridColumnToggleButton } from './datagrid-column-toggle-button';
import { ClrDatagridDetail } from './datagrid-detail';
import { ClrDatagridDetailBody } from './datagrid-detail-body';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DatagridDetailRegisterer } from './datagrid-detail-registerer';
import { ClrDatagridFilter } from './datagrid-filter';
import { ClrDatagridFooter } from './datagrid-footer';
import { ClrDatagridHideableColumn } from './datagrid-hideable-column';
import { ClrIfDetail } from './datagrid-if-detail';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPageSize } from './datagrid-page-size';
import { ClrDatagridPagination } from './datagrid-pagination';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridRowDetail } from './datagrid-row-detail';
import { ClrDatagridSelectionCellDirective } from './datagrid-selection-cell.directive';
import { ClrDatagridSingleSelectionValueAccessor } from './datagrid-single-selection.directive';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DatagridCellRenderer } from './render/cell-renderer';
import { DatagridHeaderRenderer } from './render/header-renderer';
import { DatagridMainRenderer } from './render/main-renderer';
import { DatagridRowDetailRenderer } from './render/row-detail-renderer';
import { DatagridRowRenderer } from './render/row-renderer';
import { WrappedCell } from './wrapped-cell';
import { WrappedColumn } from './wrapped-column';
import { WrappedRow } from './wrapped-row';
import * as i0 from "@angular/core";
export const CLR_DATAGRID_DIRECTIVES = [
    // Core
    ClrDatagrid,
    ClrDatagridActionBar,
    ClrDatagridActionOverflow,
    ClrDatagridCell,
    ClrDatagridColumn,
    ClrDatagridColumnSeparator,
    ClrDatagridDetail,
    ClrDatagridDetailBody,
    ClrDatagridDetailHeader,
    ClrDatagridFilter,
    ClrDatagridFooter,
    ClrDatagridHideableColumn,
    ClrDatagridItems,
    ClrDatagridPageSize,
    ClrDatagridPagination,
    ClrDatagridPlaceholder,
    ClrDatagridRow,
    ClrDatagridRowDetail,
    ClrDatagridSelectionCellDirective,
    ClrDatagridVirtualScrollDirective,
    ClrIfDetail,
    DatagridDetailRegisterer,
    WrappedCell,
    WrappedColumn,
    WrappedRow,
    ClrDatagridSingleSelectionValueAccessor,
    // Renderers
    DatagridCellRenderer,
    DatagridHeaderRenderer,
    DatagridMainRenderer,
    DatagridRowDetailRenderer,
    DatagridRowRenderer,
    // Chocolate
    ActionableOompaLoompa,
    DatagridWillyWonka,
    ExpandableOompaLoompa,
    // Built-in shortcuts
    DatagridNumericFilter,
    DatagridStringFilter,
];
const CLR_DATAGRID_INTERNAL_DIRECTIVES = [ClrDatagridColumnToggle, ClrDatagridColumnToggleButton];
export class ClrDatagridModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisVerticalIcon, viewColumnsIcon, windowCloseIcon, arrowIcon, timesIcon, stepForward2Icon, angleDoubleIcon, filterGridCircleIcon, filterGridIcon);
    }
}
ClrDatagridModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrDatagridModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridModule, declarations: [
        // Core
        ClrDatagrid,
        ClrDatagridActionBar,
        ClrDatagridActionOverflow,
        ClrDatagridCell,
        ClrDatagridColumn,
        ClrDatagridColumnSeparator,
        ClrDatagridDetail,
        ClrDatagridDetailBody,
        ClrDatagridDetailHeader,
        ClrDatagridFilter,
        ClrDatagridFooter,
        ClrDatagridHideableColumn,
        ClrDatagridItems,
        ClrDatagridPageSize,
        ClrDatagridPagination,
        ClrDatagridPlaceholder,
        ClrDatagridRow,
        ClrDatagridRowDetail,
        ClrDatagridSelectionCellDirective,
        ClrDatagridVirtualScrollDirective,
        ClrIfDetail,
        DatagridDetailRegisterer,
        WrappedCell,
        WrappedColumn,
        WrappedRow,
        ClrDatagridSingleSelectionValueAccessor,
        // Renderers
        DatagridCellRenderer,
        DatagridHeaderRenderer,
        DatagridMainRenderer,
        DatagridRowDetailRenderer,
        DatagridRowRenderer,
        // Chocolate
        ActionableOompaLoompa,
        DatagridWillyWonka,
        ExpandableOompaLoompa,
        // Built-in shortcuts
        DatagridNumericFilter,
        DatagridStringFilter, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton], imports: [CommonModule,
        CdkDragModule,
        CdkTrapFocusModule,
        ClrIconModule,
        ClrFormsModule,
        FormsModule,
        ClrLoadingModule,
        ClrConditionalModule,
        ClrOutsideClickModule,
        ClrExpandableAnimationModule,
        ClrSpinnerModule,
        ClrPopoverModuleNext,
        ClrKeyFocusModule], exports: [
        // Core
        ClrDatagrid,
        ClrDatagridActionBar,
        ClrDatagridActionOverflow,
        ClrDatagridCell,
        ClrDatagridColumn,
        ClrDatagridColumnSeparator,
        ClrDatagridDetail,
        ClrDatagridDetailBody,
        ClrDatagridDetailHeader,
        ClrDatagridFilter,
        ClrDatagridFooter,
        ClrDatagridHideableColumn,
        ClrDatagridItems,
        ClrDatagridPageSize,
        ClrDatagridPagination,
        ClrDatagridPlaceholder,
        ClrDatagridRow,
        ClrDatagridRowDetail,
        ClrDatagridSelectionCellDirective,
        ClrDatagridVirtualScrollDirective,
        ClrIfDetail,
        DatagridDetailRegisterer,
        WrappedCell,
        WrappedColumn,
        WrappedRow,
        ClrDatagridSingleSelectionValueAccessor,
        // Renderers
        DatagridCellRenderer,
        DatagridHeaderRenderer,
        DatagridMainRenderer,
        DatagridRowDetailRenderer,
        DatagridRowRenderer,
        // Chocolate
        ActionableOompaLoompa,
        DatagridWillyWonka,
        ExpandableOompaLoompa,
        // Built-in shortcuts
        DatagridNumericFilter,
        DatagridStringFilter] });
ClrDatagridModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridModule, imports: [CommonModule,
        CdkDragModule,
        CdkTrapFocusModule,
        ClrIconModule,
        ClrFormsModule,
        FormsModule,
        ClrLoadingModule,
        ClrConditionalModule,
        ClrOutsideClickModule,
        ClrExpandableAnimationModule,
        ClrSpinnerModule,
        ClrPopoverModuleNext,
        ClrKeyFocusModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        CdkDragModule,
                        CdkTrapFocusModule,
                        ClrIconModule,
                        ClrFormsModule,
                        FormsModule,
                        ClrLoadingModule,
                        ClrConditionalModule,
                        ClrOutsideClickModule,
                        ClrExpandableAnimationModule,
                        ClrSpinnerModule,
                        ClrPopoverModuleNext,
                        ClrKeyFocusModule,
                    ],
                    declarations: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_INTERNAL_DIRECTIVES],
                    exports: [CLR_DATAGRID_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsWUFBWSxFQUNaLG9CQUFvQixFQUNwQixvQkFBb0IsRUFDcEIsY0FBYyxFQUNkLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsZUFBZSxFQUNmLGVBQWUsR0FDaEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHlFQUF5RSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUNqRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFP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O1FBQ1oscUJBQXFCO1FBQ3JCLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFFckIscUJBQXFCO1FBQ3JCLHFCQUFxQjtRQUNyQixvQkFBb0I7K0dBd0JULGlCQUFpQixZQWpCMUIsWUFBWTtRQUNaLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsYUFBYTtRQUNiLGNBQWM7UUFDZCxXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQixxQkFBcUI7UUFDckIsNEJBQTRCO1FBQzVCLGdCQUFnQjtRQUNoQixvQkFBb0I7UUFDcEIsaUJBQWlCOzJGQUtSLGlCQUFpQjtrQkFuQjdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixrQkFBa0I7d0JBQ2xCLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxXQUFXO3dCQUNYLGdCQUFnQjt3QkFDaEIsb0JBQW9CO3dCQUNwQixxQkFBcUI7d0JBQ3JCLDRCQUE0Qjt3QkFDNUIsZ0JBQWdCO3dCQUNoQixvQkFBb0I7d0JBQ3BCLGlCQUFpQjtxQkFDbEI7b0JBQ0QsWUFBWSxFQUFFLENBQUMsdUJBQXVCLEVBQUUsZ0NBQWdDLENBQUM7b0JBQ3pFLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUNuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIGFuZ2xlRG91YmxlSWNvbixcbiAgYXJyb3dJY29uLFxuICBDbGFyaXR5SWNvbnMsXG4gIGVsbGlwc2lzVmVydGljYWxJY29uLFxuICBmaWx0ZXJHcmlkQ2lyY2xlSWNvbixcbiAgZmlsdGVyR3JpZEljb24sXG4gIHN0ZXBGb3J3YXJkMkljb24sXG4gIHRpbWVzSWNvbixcbiAgdmlld0NvbHVtbnNJY29uLFxuICB3aW5kb3dDbG9zZUljb24sXG59IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xyRm9ybXNNb2R1bGUgfSBmcm9tICcuLi8uLi9mb3Jtcy9mb3Jtcy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyU3Bpbm5lck1vZHVsZSB9IGZyb20gJy4uLy4uL3Byb2dyZXNzL3NwaW5uZXIvc3Bpbm5lci5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbk1vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2FuaW1hdGlvbnMvZXhwYW5kYWJsZS1hbmltYXRpb24vZXhwYW5kYWJsZS1hbmltYXRpb24ubW9kdWxlJztcbmltcG9ydCB7IENka0RyYWdNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9jZGsvY2RrLWRyYWcubW9kdWxlJztcbmltcG9ydCB7IENka1RyYXBGb2N1c01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2Nkay9jZGstdHJhcC1mb2N1cy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29uZGl0aW9uYWxNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9jb25kaXRpb25hbC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyS2V5Rm9jdXNNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMva2V5LWZvY3VzLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJMb2FkaW5nTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJPdXRzaWRlQ2xpY2tNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9vdXRzaWRlLWNsaWNrL291dHNpZGUtY2xpY2subW9kdWxlJztcbmltcG9ydCB7IENsclBvcG92ZXJNb2R1bGVOZXh0IH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZE51bWVyaWNGaWx0ZXIgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtbnVtZXJpYy1maWx0ZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRTdHJpbmdGaWx0ZXIgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtc3RyaW5nLWZpbHRlcic7XG5pbXBvcnQgeyBBY3Rpb25hYmxlT29tcGFMb29tcGEgfSBmcm9tICcuL2Nob2NvbGF0ZS9hY3Rpb25hYmxlLW9vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFdpbGx5V29ua2EgfSBmcm9tICcuL2Nob2NvbGF0ZS9kYXRhZ3JpZC13aWxseS13b25rYSc7XG5pbXBvcnQgeyBFeHBhbmRhYmxlT29tcGFMb29tcGEgfSBmcm9tICcuL2Nob2NvbGF0ZS9leHBhbmRhYmxlLW9vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRBY3Rpb25CYXIgfSBmcm9tICcuL2RhdGFncmlkLWFjdGlvbi1iYXInO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRBY3Rpb25PdmVyZmxvdyB9IGZyb20gJy4vZGF0YWdyaWQtYWN0aW9uLW92ZXJmbG93JztcbmltcG9ydCB7IENsckRhdGFncmlkQ2VsbCB9IGZyb20gJy4vZGF0YWdyaWQtY2VsbCc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENvbHVtbiB9IGZyb20gJy4vZGF0YWdyaWQtY29sdW1uJztcbmltcG9ydCB7IENsckRhdGFncmlkQ29sdW1uU2VwYXJhdG9yIH0gZnJvbSAnLi9kYXRhZ3JpZC1jb2x1bW4tc2VwYXJhdG9yJztcbmltcG9ydCB7IENsckRhdGFncmlkQ29sdW1uVG9nZ2xlIH0gZnJvbSAnLi9kYXRhZ3JpZC1jb2x1bW4tdG9nZ2xlJztcbmltcG9ydCB7IENsckRhdGFncmlkQ29sdW1uVG9nZ2xlQnV0dG9uIH0gZnJvbSAnLi9kYXRhZ3JpZC1jb2x1bW4tdG9nZ2xlLWJ1dHRvbic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZERldGFpbCB9IGZyb20gJy4vZGF0YWdyaWQtZGV0YWlsJztcbmltcG9ydCB7IENsckRhdGFncmlkRGV0YWlsQm9keSB9IGZyb20gJy4vZGF0YWdyaWQtZGV0YWlsLWJvZHknO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXIgfSBmcm9tICcuL2RhdGFncmlkLWRldGFpbC1oZWFkZXInO1xuaW1wb3J0IHsgRGF0YWdyaWREZXRhaWxSZWdpc3RlcmVyIH0gZnJvbSAnLi9kYXRhZ3JpZC1kZXRhaWwtcmVnaXN0ZXJlcic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZEZpbHRlciB9IGZyb20gJy4vZGF0YWdyaWQtZmlsdGVyJztcbmltcG9ydCB7IENsckRhdGFncmlkRm9vdGVyIH0gZnJvbSAnLi9kYXRhZ3JpZC1mb290ZXInO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRIaWRlYWJsZUNvbHVtbiB9IGZyb20gJy4vZGF0YWdyaWQtaGlkZWFibGUtY29sdW1uJztcbmltcG9ydCB7IENscklmRGV0YWlsIH0gZnJvbSAnLi9kYXRhZ3JpZC1pZi1kZXRhaWwnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRJdGVtcyB9IGZyb20gJy4vZGF0YWdyaWQtaXRlbXMnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRQYWdlU2l6ZSB9IGZyb20gJy4vZGF0YWdyaWQtcGFnZS1zaXplJztcbmltcG9ydCB7IENsckRhdGFncmlkUGFnaW5hdGlvbiB9IGZyb20gJy4vZGF0YWdyaWQtcGFnaW5hdGlvbic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyIH0gZnJvbSAnLi9kYXRhZ3JpZC1wbGFjZWhvbGRlcic7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFJvdyB9IGZyb20gJy4vZGF0YWdyaWQtcm93JztcbmltcG9ydCB7IENsckRhdGFncmlkUm93RGV0YWlsIH0gZnJvbSAnLi9kYXRhZ3JpZC1yb3ctZGV0YWlsJztcbmltcG9ydCB7IENsckRhdGFncmlkU2VsZWN0aW9uQ2VsbERpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YWdyaWQtc2VsZWN0aW9uLWNlbGwuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsckRhdGFncmlkU2luZ2xlU2VsZWN0aW9uVmFsdWVBY2Nlc3NvciB9IGZyb20gJy4vZGF0YWdyaWQtc2luZ2xlLXNlbGVjdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YWdyaWRDZWxsUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlci9jZWxsLXJlbmRlcmVyJztcbmltcG9ydCB7IERhdGFncmlkSGVhZGVyUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlci9oZWFkZXItcmVuZGVyZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRNYWluUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlci9tYWluLXJlbmRlcmVyJztcbmltcG9ydCB7IERhdGFncmlkUm93RGV0YWlsUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlci9yb3ctZGV0YWlsLXJlbmRlcmVyJztcbmltcG9ydCB7IERhdGFncmlkUm93UmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlci9yb3ctcmVuZGVyZXInO1xuaW1wb3J0IHsgV3JhcHBlZENlbGwgfSBmcm9tICcuL3dyYXBwZWQtY2VsbCc7XG5pbXBvcnQgeyBXcmFwcGVkQ29sdW1uIH0gZnJvbSAnLi93cmFwcGVkLWNvbHVtbic7XG5pbXBvcnQgeyBXcmFwcGVkUm93IH0gZnJvbSAnLi93cmFwcGVkLXJvdyc7XG5cbmV4cG9ydCBjb25zdCBDTFJfREFUQUdSSURfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbXG4gIC8vIENvcmVcbiAgQ2xyRGF0YWdyaWQsXG4gIENsckRhdGFncmlkQWN0aW9uQmFyLFxuICBDbHJEYXRhZ3JpZEFjdGlvbk92ZXJmbG93LFxuICBDbHJEYXRhZ3JpZENlbGwsXG4gIENsckRhdGFncmlkQ29sdW1uLFxuICBDbHJEYXRhZ3JpZENvbHVtblNlcGFyYXRvcixcbiAgQ2xyRGF0YWdyaWREZXRhaWwsXG4gIENsckRhdGFncmlkRGV0YWlsQm9keSxcbiAgQ2xyRGF0YWdyaWREZXRhaWxIZWFkZXIsXG4gIENsckRhdGFncmlkRmlsdGVyLFxuICBDbHJEYXRhZ3JpZEZvb3RlcixcbiAgQ2xyRGF0YWdyaWRIaWRlYWJsZUNvbHVtbixcbiAgQ2xyRGF0YWdyaWRJdGVtcyxcbiAgQ2xyRGF0YWdyaWRQYWdlU2l6ZSxcbiAgQ2xyRGF0YWdyaWRQYWdpbmF0aW9uLFxuICBDbHJEYXRhZ3JpZFBsYWNlaG9sZGVyLFxuICBDbHJEYXRhZ3JpZFJvdyxcbiAgQ2xyRGF0YWdyaWRSb3dEZXRhaWwsXG4gIENsckRhdGFncmlkU2VsZWN0aW9uQ2VsbERpcmVjdGl2ZSxcbiAgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlLFxuICBDbHJJZkRldGFpbCxcbiAgRGF0YWdyaWREZXRhaWxSZWdpc3RlcmVyLFxuICBXcmFwcGVkQ2VsbCxcbiAgV3JhcHBlZENvbHVtbixcbiAgV3JhcHBlZFJvdyxcbiAgQ2xyRGF0YWdyaWRTaW5nbGVTZWxlY3Rpb25WYWx1ZUFjY2Vzc29yLFxuXG4gIC8vIFJlbmRlcmVyc1xuICBEYXRhZ3JpZENlbGxSZW5kZXJlcixcbiAgRGF0YWdyaWRIZWFkZXJSZW5kZXJlcixcbiAgRGF0YWdyaWRNYWluUmVuZGVyZXIsXG4gIERhdGFncmlkUm93RGV0YWlsUmVuZGVyZXIsXG4gIERhdGFncmlkUm93UmVuZGVyZXIsXG5cbiAgLy8gQ2hvY29sYXRlXG4gIEFjdGlvbmFibGVPb21wYUxvb21wYSxcbiAgRGF0YWdyaWRXaWxseVdvbmthLFxuICBFeHBhbmRhYmxlT29tcGFMb29tcGEsXG5cbiAgLy8gQnVpbHQtaW4gc2hvcnRjdXRzXG4gIERhdGFncmlkTnVtZXJpY0ZpbHRlcixcbiAgRGF0YWdyaWRTdHJpbmdGaWx0ZXIsXG5dO1xuXG5jb25zdCBDTFJfREFUQUdSSURfSU5URVJOQUxfRElSRUNUSVZFUyA9IFtDbHJEYXRhZ3JpZENvbHVtblRvZ2dsZSwgQ2xyRGF0YWdyaWRDb2x1bW5Ub2dnbGVCdXR0b25dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIENka0RyYWdNb2R1bGUsXG4gICAgQ2RrVHJhcEZvY3VzTW9kdWxlLFxuICAgIENsckljb25Nb2R1bGUsXG4gICAgQ2xyRm9ybXNNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgQ2xyTG9hZGluZ01vZHVsZSxcbiAgICBDbHJDb25kaXRpb25hbE1vZHVsZSxcbiAgICBDbHJPdXRzaWRlQ2xpY2tNb2R1bGUsXG4gICAgQ2xyRXhwYW5kYWJsZUFuaW1hdGlvbk1vZHVsZSxcbiAgICBDbHJTcGlubmVyTW9kdWxlLFxuICAgIENsclBvcG92ZXJNb2R1bGVOZXh0LFxuICAgIENscktleUZvY3VzTW9kdWxlLFxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtDTFJfREFUQUdSSURfRElSRUNUSVZFUywgQ0xSX0RBVEFHUklEX0lOVEVSTkFMX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX0RBVEFHUklEX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhcbiAgICAgIGVsbGlwc2lzVmVydGljYWxJY29uLFxuICAgICAgdmlld0NvbHVtbnNJY29uLFxuICAgICAgd2luZG93Q2xvc2VJY29uLFxuICAgICAgYXJyb3dJY29uLFxuICAgICAgdGltZXNJY29uLFxuICAgICAgc3RlcEZvcndhcmQySWNvbixcbiAgICAgIGFuZ2xlRG91YmxlSWNvbixcbiAgICAgIGZpbHRlckdyaWRDaXJjbGVJY29uLFxuICAgICAgZmlsdGVyR3JpZEljb25cbiAgICApO1xuICB9XG59XG4iXX0=