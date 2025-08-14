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
import { ClrInputModule } from '../input/input.module';
import { ClrDatalist } from './datalist';
import { ClrDatalistContainer } from './datalist-container';
import { ClrDatalistInput } from './datalist-input';
import * as i0 from "@angular/core";
export class ClrDatalistModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrDatalistModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrDatalistModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistModule, declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer], imports: [CommonModule, ClrInputModule, ClrIconModule], exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer] });
ClrDatalistModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistModule, imports: [CommonModule, ClrInputModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatalistModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrInputModule, ClrIconModule],
                    declarations: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
                    exports: [ClrDatalist, ClrDatalistInput, ClrDatalistContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWxpc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0YWxpc3QvZGF0YWxpc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7O0FBT3BELE1BQU0sT0FBTyxpQkFBaUI7SUFDNUI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OzhHQUhVLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQUhiLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsYUFEeEQsWUFBWSxFQUFFLGNBQWMsRUFBRSxhQUFhLGFBRTNDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0I7K0dBRWxELGlCQUFpQixZQUpsQixZQUFZLEVBQUUsY0FBYyxFQUFFLGFBQWE7MkZBSTFDLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQztvQkFDdEQsWUFBWSxFQUFFLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDO29CQUNuRSxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUM7aUJBQy9EIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENscklucHV0TW9kdWxlIH0gZnJvbSAnLi4vaW5wdXQvaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IENsckRhdGFsaXN0IH0gZnJvbSAnLi9kYXRhbGlzdCc7XG5pbXBvcnQgeyBDbHJEYXRhbGlzdENvbnRhaW5lciB9IGZyb20gJy4vZGF0YWxpc3QtY29udGFpbmVyJztcbmltcG9ydCB7IENsckRhdGFsaXN0SW5wdXQgfSBmcm9tICcuL2RhdGFsaXN0LWlucHV0JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySW5wdXRNb2R1bGUsIENsckljb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDbHJEYXRhbGlzdCwgQ2xyRGF0YWxpc3RJbnB1dCwgQ2xyRGF0YWxpc3RDb250YWluZXJdLFxuICBleHBvcnRzOiBbQ2xyRGF0YWxpc3QsIENsckRhdGFsaXN0SW5wdXQsIENsckRhdGFsaXN0Q29udGFpbmVyXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWxpc3RNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXhjbGFtYXRpb25DaXJjbGVJY29uLCBjaGVja0NpcmNsZUljb24pO1xuICB9XG59XG4iXX0=