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
import { ClrControl } from './control';
import { ClrControlContainer } from './control-container';
import { ClrControlError } from './error';
import { ClrForm } from './form';
import { ClrControlHelper } from './helper';
import { ClrIfError } from './if-control-state/if-error';
import { ClrIfSuccess } from './if-control-state/if-success';
import { ClrLabel } from './label';
import { ClrLayout } from './layout';
import { ClrControlSuccess } from './success';
import * as i0 from "@angular/core";
export class ClrCommonFormsModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrCommonFormsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrCommonFormsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonFormsModule, declarations: [ClrLabel,
        ClrControlError,
        ClrControlSuccess,
        ClrControlHelper,
        ClrIfError,
        ClrIfSuccess,
        ClrForm,
        ClrLayout,
        ClrControlContainer,
        ClrControl], imports: [CommonModule, ClrIconModule], exports: [ClrLabel,
        ClrControlError,
        ClrControlSuccess,
        ClrControlHelper,
        ClrIfError,
        ClrIfSuccess,
        ClrForm,
        ClrLayout,
        ClrControlContainer,
        ClrControl] });
ClrCommonFormsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonFormsModule, imports: [CommonModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCommonFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule],
                    declarations: [
                        ClrLabel,
                        ClrControlError,
                        ClrControlSuccess,
                        ClrControlHelper,
                        ClrIfError,
                        ClrIfSuccess,
                        ClrForm,
                        ClrLayout,
                        ClrControlContainer,
                        ClrControl,
                    ],
                    exports: [
                        ClrLabel,
                        ClrControlError,
                        ClrControlSuccess,
                        ClrControlHelper,
                        ClrIfError,
                        ClrIfSuccess,
                        ClrForm,
                        ClrLayout,
                        ClrControlContainer,
                        ClrControl,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2NvbW1vbi9jb21tb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN2QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNuQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUE2QjlDLE1BQU0sT0FBTyxvQkFBb0I7SUFDL0I7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7O2lIQUhVLG9CQUFvQjtrSEFBcEIsb0JBQW9CLGlCQXhCN0IsUUFBUTtRQUNSLGVBQWU7UUFDZixpQkFBaUI7UUFDakIsZ0JBQWdCO1FBQ2hCLFVBQVU7UUFDVixZQUFZO1FBQ1osT0FBTztRQUNQLFNBQVM7UUFDVCxtQkFBbUI7UUFDbkIsVUFBVSxhQVhGLFlBQVksRUFBRSxhQUFhLGFBY25DLFFBQVE7UUFDUixlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLGdCQUFnQjtRQUNoQixVQUFVO1FBQ1YsWUFBWTtRQUNaLE9BQU87UUFDUCxTQUFTO1FBQ1QsbUJBQW1CO1FBQ25CLFVBQVU7a0hBR0Qsb0JBQW9CLFlBMUJyQixZQUFZLEVBQUUsYUFBYTsyRkEwQjFCLG9CQUFvQjtrQkEzQmhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsWUFBWSxFQUFFO3dCQUNaLFFBQVE7d0JBQ1IsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLGdCQUFnQjt3QkFDaEIsVUFBVTt3QkFDVixZQUFZO3dCQUNaLE9BQU87d0JBQ1AsU0FBUzt3QkFDVCxtQkFBbUI7d0JBQ25CLFVBQVU7cUJBQ1g7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFFBQVE7d0JBQ1IsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLGdCQUFnQjt3QkFDaEIsVUFBVTt3QkFDVixZQUFZO3dCQUNaLE9BQU87d0JBQ1AsU0FBUzt3QkFDVCxtQkFBbUI7d0JBQ25CLFVBQVU7cUJBQ1g7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY2hlY2tDaXJjbGVJY29uLCBDbGFyaXR5SWNvbnMsIGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29udHJvbCB9IGZyb20gJy4vY29udHJvbCc7XG5pbXBvcnQgeyBDbHJDb250cm9sQ29udGFpbmVyIH0gZnJvbSAnLi9jb250cm9sLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBDbHJDb250cm9sRXJyb3IgfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7IENsckZvcm0gfSBmcm9tICcuL2Zvcm0nO1xuaW1wb3J0IHsgQ2xyQ29udHJvbEhlbHBlciB9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB7IENscklmRXJyb3IgfSBmcm9tICcuL2lmLWNvbnRyb2wtc3RhdGUvaWYtZXJyb3InO1xuaW1wb3J0IHsgQ2xySWZTdWNjZXNzIH0gZnJvbSAnLi9pZi1jb250cm9sLXN0YXRlL2lmLXN1Y2Nlc3MnO1xuaW1wb3J0IHsgQ2xyTGFiZWwgfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7IENsckxheW91dCB9IGZyb20gJy4vbGF5b3V0JztcbmltcG9ydCB7IENsckNvbnRyb2xTdWNjZXNzIH0gZnJvbSAnLi9zdWNjZXNzJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySWNvbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENsckxhYmVsLFxuICAgIENsckNvbnRyb2xFcnJvcixcbiAgICBDbHJDb250cm9sU3VjY2VzcyxcbiAgICBDbHJDb250cm9sSGVscGVyLFxuICAgIENscklmRXJyb3IsXG4gICAgQ2xySWZTdWNjZXNzLFxuICAgIENsckZvcm0sXG4gICAgQ2xyTGF5b3V0LFxuICAgIENsckNvbnRyb2xDb250YWluZXIsXG4gICAgQ2xyQ29udHJvbCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIENsckxhYmVsLFxuICAgIENsckNvbnRyb2xFcnJvcixcbiAgICBDbHJDb250cm9sU3VjY2VzcyxcbiAgICBDbHJDb250cm9sSGVscGVyLFxuICAgIENscklmRXJyb3IsXG4gICAgQ2xySWZTdWNjZXNzLFxuICAgIENsckZvcm0sXG4gICAgQ2xyTGF5b3V0LFxuICAgIENsckNvbnRyb2xDb250YWluZXIsXG4gICAgQ2xyQ29udHJvbCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ29tbW9uRm9ybXNNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXhjbGFtYXRpb25DaXJjbGVJY29uLCBjaGVja0NpcmNsZUljb24pO1xuICB9XG59XG4iXX0=