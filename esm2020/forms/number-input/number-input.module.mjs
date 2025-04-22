/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon, minusIcon, plusIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrNumberInput } from './number-input';
import { ClrNumberInputContainer } from './number-input-container';
import * as i0 from "@angular/core";
export class ClrNumberInputModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, minusIcon, plusIcon);
    }
}
ClrNumberInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrNumberInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputModule, declarations: [ClrNumberInput, ClrNumberInputContainer], imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrNumberInput, ClrNumberInputContainer] });
ClrNumberInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [ClrNumberInput, ClrNumberInputContainer],
                    exports: [ClrCommonFormsModule, ClrNumberInput, ClrNumberInputContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL251bWJlci1pbnB1dC9udW1iZXItaW5wdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQU9uRSxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7O2lIQUhVLG9CQUFvQjtrSEFBcEIsb0JBQW9CLGlCQUhoQixjQUFjLEVBQUUsdUJBQXVCLGFBRDVDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixhQUU5RCxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsdUJBQXVCO2tIQUU1RCxvQkFBb0IsWUFKckIsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBRTlELG9CQUFvQjsyRkFFbkIsb0JBQW9CO2tCQUxoQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixDQUFDO29CQUN6RSxZQUFZLEVBQUUsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUM7b0JBQ3ZELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLGNBQWMsRUFBRSx1QkFBdUIsQ0FBQztpQkFDekUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjaGVja0NpcmNsZUljb24sIENsYXJpdHlJY29ucywgZXhjbGFtYXRpb25DaXJjbGVJY29uLCBtaW51c0ljb24sIHBsdXNJY29uIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb21tb25Gb3Jtc01vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENsck51bWJlcklucHV0IH0gZnJvbSAnLi9udW1iZXItaW5wdXQnO1xuaW1wb3J0IHsgQ2xyTnVtYmVySW5wdXRDb250YWluZXIgfSBmcm9tICcuL251bWJlci1pbnB1dC1jb250YWluZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyQ29tbW9uRm9ybXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJOdW1iZXJJbnB1dCwgQ2xyTnVtYmVySW5wdXRDb250YWluZXJdLFxuICBleHBvcnRzOiBbQ2xyQ29tbW9uRm9ybXNNb2R1bGUsIENsck51bWJlcklucHV0LCBDbHJOdW1iZXJJbnB1dENvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIENsck51bWJlcklucHV0TW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgQ2xhcml0eUljb25zLmFkZEljb25zKGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiwgY2hlY2tDaXJjbGVJY29uLCBtaW51c0ljb24sIHBsdXNJY29uKTtcbiAgfVxufVxuIl19