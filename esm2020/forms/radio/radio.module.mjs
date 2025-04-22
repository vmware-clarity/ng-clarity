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
import { ClrRadio } from './radio';
import { ClrRadioContainer } from './radio-container';
import { ClrRadioWrapper } from './radio-wrapper';
import * as i0 from "@angular/core";
export class ClrRadioModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrRadioModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrRadioModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioModule, declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper], imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule], exports: [ClrCommonFormsModule, ClrRadio, ClrRadioContainer, ClrRadioWrapper] });
ClrRadioModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioModule, imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadioModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrCommonFormsModule, ClrHostWrappingModule, ClrIconModule],
                    declarations: [ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                    exports: [ClrCommonFormsModule, ClrRadio, ClrRadioContainer, ClrRadioWrapper],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcmFkaW8vcmFkaW8ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBT2xELE1BQU0sT0FBTyxjQUFjO0lBQ3pCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNoRSxDQUFDOzsyR0FIVSxjQUFjOzRHQUFkLGNBQWMsaUJBSFYsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsYUFEakQsWUFBWSxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLGFBQWEsYUFFeEUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWU7NEdBRWpFLGNBQWMsWUFKZixZQUFZLEVBQUUsb0JBQW9CLEVBQUUscUJBQXFCLEVBQUUsYUFBYSxFQUV4RSxvQkFBb0I7MkZBRW5CLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLGFBQWEsQ0FBQztvQkFDbkYsWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQztvQkFDNUQsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQztpQkFDOUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY2hlY2tDaXJjbGVJY29uLCBDbGFyaXR5SWNvbnMsIGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xySG9zdFdyYXBwaW5nTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwaW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb21tb25Gb3Jtc01vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENsclJhZGlvIH0gZnJvbSAnLi9yYWRpbyc7XG5pbXBvcnQgeyBDbHJSYWRpb0NvbnRhaW5lciB9IGZyb20gJy4vcmFkaW8tY29udGFpbmVyJztcbmltcG9ydCB7IENsclJhZGlvV3JhcHBlciB9IGZyb20gJy4vcmFkaW8td3JhcHBlcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENsckNvbW1vbkZvcm1zTW9kdWxlLCBDbHJIb3N0V3JhcHBpbmdNb2R1bGUsIENsckljb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJSYWRpbywgQ2xyUmFkaW9Db250YWluZXIsIENsclJhZGlvV3JhcHBlcl0sXG4gIGV4cG9ydHM6IFtDbHJDb21tb25Gb3Jtc01vZHVsZSwgQ2xyUmFkaW8sIENsclJhZGlvQ29udGFpbmVyLCBDbHJSYWRpb1dyYXBwZXJdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJSYWRpb01vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhleGNsYW1hdGlvbkNpcmNsZUljb24sIGNoZWNrQ2lyY2xlSWNvbik7XG4gIH1cbn1cbiJdfQ==