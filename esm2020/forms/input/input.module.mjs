/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrInput } from './input';
import { ClrInputContainer } from './input-container';
import * as i0 from "@angular/core";
export class ClrInputModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon // caret
        );
    }
}
ClrInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrInputModule, declarations: [ClrInput, ClrInputContainer], imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrInput, ClrInputContainer] });
ClrInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInputModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [ClrInput, ClrInputContainer],
                    exports: [ClrCommonFormsModule, ClrInput, ClrInputContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvaW5wdXQvaW5wdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7O0FBT3RELE1BQU0sT0FBTyxjQUFjO0lBQ3pCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FDbkIscUJBQXFCLEVBQ3JCLGVBQWUsQ0FBQyxRQUFRO1NBQ3pCLENBQUM7SUFDSixDQUFDOzsyR0FOVSxjQUFjOzRHQUFkLGNBQWMsaUJBSFYsUUFBUSxFQUFFLGlCQUFpQixhQURoQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsYUFFOUQsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQjs0R0FFaEQsY0FBYyxZQUpmLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUU5RCxvQkFBb0I7MkZBRW5CLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLENBQUM7b0JBQ3pFLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQztvQkFDM0MsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDO2lCQUM3RCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbW1vbkZvcm1zTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xySW5wdXQgfSBmcm9tICcuL2lucHV0JztcbmltcG9ydCB7IENscklucHV0Q29udGFpbmVyIH0gZnJvbSAnLi9pbnB1dC1jb250YWluZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyQ29tbW9uRm9ybXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJJbnB1dCwgQ2xySW5wdXRDb250YWluZXJdLFxuICBleHBvcnRzOiBbQ2xyQ29tbW9uRm9ybXNNb2R1bGUsIENscklucHV0LCBDbHJJbnB1dENvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIENscklucHV0TW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgQ2xhcml0eUljb25zLmFkZEljb25zKFxuICAgICAgZXhjbGFtYXRpb25DaXJjbGVJY29uLFxuICAgICAgY2hlY2tDaXJjbGVJY29uIC8vIGNhcmV0XG4gICAgKTtcbiAgfVxufVxuIl19