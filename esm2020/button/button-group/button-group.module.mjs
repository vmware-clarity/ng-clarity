/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { ClrButton } from './button';
import { ClrButtonGroup } from './button-group';
import * as i0 from "@angular/core";
export const CLR_BUTTON_GROUP_DIRECTIVES = [ClrButton, ClrButtonGroup];
export class ClrButtonGroupModule {
}
ClrButtonGroupModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrButtonGroupModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroupModule, declarations: [ClrButton, ClrButtonGroup], imports: [CommonModule, ClrIconModule, ClrPopoverModuleNext], exports: [ClrButton, ClrButtonGroup] });
ClrButtonGroupModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroupModule, imports: [CommonModule, ClrIconModule, ClrPopoverModuleNext] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrPopoverModuleNext],
                    declarations: [CLR_BUTTON_GROUP_DIRECTIVES],
                    exports: [CLR_BUTTON_GROUP_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWdyb3VwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2J1dHRvbi9idXR0b24tZ3JvdXAvYnV0dG9uLWdyb3VwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFaEQsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQWdCLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBT3BGLE1BQU0sT0FBTyxvQkFBb0I7O2lIQUFwQixvQkFBb0I7a0hBQXBCLG9CQUFvQixpQkFQd0IsU0FBUyxFQUFFLGNBQWMsYUFHdEUsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsYUFISixTQUFTLEVBQUUsY0FBYztrSEFPckUsb0JBQW9CLFlBSnJCLFlBQVksRUFBRSxhQUFhLEVBQUUsb0JBQW9COzJGQUloRCxvQkFBb0I7a0JBTGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztvQkFDNUQsWUFBWSxFQUFFLENBQUMsMkJBQTJCLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLDJCQUEyQixDQUFDO2lCQUN2QyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsclBvcG92ZXJNb2R1bGVOZXh0IH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJCdXR0b24gfSBmcm9tICcuL2J1dHRvbic7XG5pbXBvcnQgeyBDbHJCdXR0b25Hcm91cCB9IGZyb20gJy4vYnV0dG9uLWdyb3VwJztcblxuZXhwb3J0IGNvbnN0IENMUl9CVVRUT05fR1JPVVBfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbQ2xyQnV0dG9uLCBDbHJCdXR0b25Hcm91cF07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENsckljb25Nb2R1bGUsIENsclBvcG92ZXJNb2R1bGVOZXh0XSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX0JVVFRPTl9HUk9VUF9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0NMUl9CVVRUT05fR1JPVVBfRElSRUNUSVZFU10sXG59KVxuZXhwb3J0IGNsYXNzIENsckJ1dHRvbkdyb3VwTW9kdWxlIHt9XG4iXX0=