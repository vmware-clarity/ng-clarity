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
import { ClrCheckbox } from './checkbox';
import { ClrCheckboxContainer } from './checkbox-container';
import { ClrCheckboxWrapper } from './checkbox-wrapper';
import * as i0 from "@angular/core";
export class ClrCheckboxModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrCheckboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrCheckboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxModule, declarations: [ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper], imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule], exports: [ClrCommonFormsModule, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper] });
ClrCheckboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxModule, imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrHostWrappingModule],
                    declarations: [ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper],
                    exports: [ClrCommonFormsModule, ClrCheckbox, ClrCheckboxContainer, ClrCheckboxWrapper],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY2hlY2tib3gvY2hlY2tib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFPeEQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDaEUsQ0FBQzs7OEdBSFUsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBSGIsV0FBVyxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixhQUQxRCxZQUFZLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixhQUV4RSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCOytHQUUxRSxpQkFBaUIsWUFKbEIsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsRUFFeEUsb0JBQW9COzJGQUVuQixpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQztvQkFDbkYsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLG9CQUFvQixFQUFFLGtCQUFrQixDQUFDO29CQUNyRSxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUM7aUJBQ3ZGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckhvc3RXcmFwcGluZ01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2hvc3Qtd3JhcHBpbmcvaG9zdC13cmFwcGluZy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uRm9ybXNNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDaGVja2JveCB9IGZyb20gJy4vY2hlY2tib3gnO1xuaW1wb3J0IHsgQ2xyQ2hlY2tib3hDb250YWluZXIgfSBmcm9tICcuL2NoZWNrYm94LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBDbHJDaGVja2JveFdyYXBwZXIgfSBmcm9tICcuL2NoZWNrYm94LXdyYXBwZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJDb21tb25Gb3Jtc01vZHVsZSwgQ2xySG9zdFdyYXBwaW5nTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ2xyQ2hlY2tib3gsIENsckNoZWNrYm94Q29udGFpbmVyLCBDbHJDaGVja2JveFdyYXBwZXJdLFxuICBleHBvcnRzOiBbQ2xyQ29tbW9uRm9ybXNNb2R1bGUsIENsckNoZWNrYm94LCBDbHJDaGVja2JveENvbnRhaW5lciwgQ2xyQ2hlY2tib3hXcmFwcGVyXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ2hlY2tib3hNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXhjbGFtYXRpb25DaXJjbGVJY29uLCBjaGVja0NpcmNsZUljb24pO1xuICB9XG59XG4iXX0=