/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon, eyeHideIcon, eyeIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrPassword } from './password';
import { ClrPasswordContainer } from './password-container';
import * as i0 from "@angular/core";
export class ClrPasswordModule {
    constructor() {
        ClarityIcons.addIcons(eyeHideIcon, eyeIcon, exclamationCircleIcon, checkCircleIcon);
    }
}
ClrPasswordModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrPasswordModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordModule, declarations: [ClrPassword, ClrPasswordContainer], imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer] });
ClrPasswordModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPasswordModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [ClrPassword, ClrPasswordContainer],
                    exports: [ClrCommonFormsModule, ClrPassword, ClrPasswordContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dvcmQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvcGFzc3dvcmQvcGFzc3dvcmQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1RyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7QUFPNUQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN0RixDQUFDOzs4R0FIVSxpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFIYixXQUFXLEVBQUUsb0JBQW9CLGFBRHRDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixhQUU5RCxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsb0JBQW9COytHQUV0RCxpQkFBaUIsWUFKbEIsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBRTlELG9CQUFvQjsyRkFFbkIsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixDQUFDO29CQUN6RSxZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUM7b0JBQ2pELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQztpQkFDbkUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjaGVja0NpcmNsZUljb24sIENsYXJpdHlJY29ucywgZXhjbGFtYXRpb25DaXJjbGVJY29uLCBleWVIaWRlSWNvbiwgZXllSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uRm9ybXNNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJQYXNzd29yZCB9IGZyb20gJy4vcGFzc3dvcmQnO1xuaW1wb3J0IHsgQ2xyUGFzc3dvcmRDb250YWluZXIgfSBmcm9tICcuL3Bhc3N3b3JkLWNvbnRhaW5lcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJDb21tb25Gb3Jtc01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NsclBhc3N3b3JkLCBDbHJQYXNzd29yZENvbnRhaW5lcl0sXG4gIGV4cG9ydHM6IFtDbHJDb21tb25Gb3Jtc01vZHVsZSwgQ2xyUGFzc3dvcmQsIENsclBhc3N3b3JkQ29udGFpbmVyXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyUGFzc3dvcmRNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXllSGlkZUljb24sIGV5ZUljb24sIGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiwgY2hlY2tDaXJjbGVJY29uKTtcbiAgfVxufVxuIl19