/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';
import * as i0 from "@angular/core";
export class ClrRangeModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrRangeModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrRangeModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeModule, declarations: [ClrRange, ClrRangeContainer], imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule], exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer] });
ClrRangeModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeModule, imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRangeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule],
                    declarations: [ClrRange, ClrRangeContainer],
                    exports: [ClrCommonFormsModule, ClrRange, ClrRangeContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcmFuZ2UvcmFuZ2UubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7QUFPdEQsTUFBTSxPQUFPLGNBQWM7SUFDekI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OzJHQUhVLGNBQWM7NEdBQWQsY0FBYyxpQkFIVixRQUFRLEVBQUUsaUJBQWlCLGFBRGhDLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsRUFBRSxhQUFhLGFBRXhFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxpQkFBaUI7NEdBRWhELGNBQWMsWUFKZixZQUFZLEVBQUUsb0JBQW9CLEVBQUUscUJBQXFCLEVBQUUsYUFBYSxFQUV4RSxvQkFBb0I7MkZBRW5CLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLGFBQWEsQ0FBQztvQkFDbkYsWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDO29CQUMzQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLENBQUM7aUJBQzdEIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckhvc3RXcmFwcGluZ01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2hvc3Qtd3JhcHBpbmcvaG9zdC13cmFwcGluZy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uRm9ybXNNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJSYW5nZSB9IGZyb20gJy4vcmFuZ2UnO1xuaW1wb3J0IHsgQ2xyUmFuZ2VDb250YWluZXIgfSBmcm9tICcuL3JhbmdlLWNvbnRhaW5lcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENsckNvbW1vbkZvcm1zTW9kdWxlLCBDbHJIb3N0V3JhcHBpbmdNb2R1bGUsIENsckljb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJSYW5nZSwgQ2xyUmFuZ2VDb250YWluZXJdLFxuICBleHBvcnRzOiBbQ2xyQ29tbW9uRm9ybXNNb2R1bGUsIENsclJhbmdlLCBDbHJSYW5nZUNvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIENsclJhbmdlTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgQ2xhcml0eUljb25zLmFkZEljb25zKGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiwgY2hlY2tDaXJjbGVJY29uKTtcbiAgfVxufVxuIl19