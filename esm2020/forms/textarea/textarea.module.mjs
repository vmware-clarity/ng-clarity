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
import { ClrTextarea } from './textarea';
import { ClrTextareaContainer } from './textarea-container';
import * as i0 from "@angular/core";
export class ClrTextareaModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrTextareaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTextareaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrTextareaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrTextareaModule, declarations: [ClrTextarea, ClrTextareaContainer], imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrTextarea, ClrTextareaContainer] });
ClrTextareaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTextareaModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTextareaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [ClrTextarea, ClrTextareaContainer],
                    exports: [ClrCommonFormsModule, ClrTextarea, ClrTextareaContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dGFyZWEubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvdGV4dGFyZWEvdGV4dGFyZWEubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7O0FBTzVELE1BQU0sT0FBTyxpQkFBaUI7SUFDNUI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OzhHQUhVLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQUhiLFdBQVcsRUFBRSxvQkFBb0IsYUFEdEMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLGFBRTlELG9CQUFvQixFQUFFLFdBQVcsRUFBRSxvQkFBb0I7K0dBRXRELGlCQUFpQixZQUpsQixZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFFOUQsb0JBQW9COzJGQUVuQixpQkFBaUI7a0JBTDdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLENBQUM7b0JBQ3pFLFlBQVksRUFBRSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQztvQkFDakQsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixDQUFDO2lCQUNuRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbW1vbkZvcm1zTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyVGV4dGFyZWEgfSBmcm9tICcuL3RleHRhcmVhJztcbmltcG9ydCB7IENsclRleHRhcmVhQ29udGFpbmVyIH0gZnJvbSAnLi90ZXh0YXJlYS1jb250YWluZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyQ29tbW9uRm9ybXNNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJUZXh0YXJlYSwgQ2xyVGV4dGFyZWFDb250YWluZXJdLFxuICBleHBvcnRzOiBbQ2xyQ29tbW9uRm9ybXNNb2R1bGUsIENsclRleHRhcmVhLCBDbHJUZXh0YXJlYUNvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIENsclRleHRhcmVhTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgQ2xhcml0eUljb25zLmFkZEljb25zKGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiwgY2hlY2tDaXJjbGVJY29uKTtcbiAgfVxufVxuIl19