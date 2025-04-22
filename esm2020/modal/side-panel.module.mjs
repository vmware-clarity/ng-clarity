/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../icon/icon.module';
import { CdkTrapFocusModule } from '../utils/cdk/cdk-trap-focus.module';
import { ClrModalModule } from './modal.module';
import { ClrSidePanel } from './side-panel';
import * as i0 from "@angular/core";
export const CLR_SIDEPANEL_DIRECTIVES = [ClrSidePanel];
export class ClrSidePanelModule {
}
ClrSidePanelModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrSidePanelModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanelModule, declarations: [ClrSidePanel], imports: [CommonModule, CdkTrapFocusModule, ClrIconModule, ClrModalModule], exports: [ClrSidePanel, ClrModalModule, ClrIconModule] });
ClrSidePanelModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanelModule, imports: [CommonModule, CdkTrapFocusModule, ClrIconModule, ClrModalModule, ClrModalModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSidePanelModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, CdkTrapFocusModule, ClrIconModule, ClrModalModule],
                    declarations: [CLR_SIDEPANEL_DIRECTIVES],
                    exports: [CLR_SIDEPANEL_DIRECTIVES, ClrModalModule, ClrIconModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS1wYW5lbC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9tb2RhbC9zaWRlLXBhbmVsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFFNUMsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFPcEUsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQVB1QixZQUFZLGFBR3RELFlBQVksRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsY0FBYyxhQUhyQixZQUFZLEVBSzVCLGNBQWMsRUFBRSxhQUFhO2dIQUV0RCxrQkFBa0IsWUFKbkIsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBRXJDLGNBQWMsRUFBRSxhQUFhOzJGQUV0RCxrQkFBa0I7a0JBTDlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUM7b0JBQzFFLFlBQVksRUFBRSxDQUFDLHdCQUF3QixDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDO2lCQUNuRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENka1RyYXBGb2N1c01vZHVsZSB9IGZyb20gJy4uL3V0aWxzL2Nkay9jZGstdHJhcC1mb2N1cy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyTW9kYWxNb2R1bGUgfSBmcm9tICcuL21vZGFsLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJTaWRlUGFuZWwgfSBmcm9tICcuL3NpZGUtcGFuZWwnO1xuXG5leHBvcnQgY29uc3QgQ0xSX1NJREVQQU5FTF9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtDbHJTaWRlUGFuZWxdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDZGtUcmFwRm9jdXNNb2R1bGUsIENsckljb25Nb2R1bGUsIENsck1vZGFsTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX1NJREVQQU5FTF9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0NMUl9TSURFUEFORUxfRElSRUNUSVZFUywgQ2xyTW9kYWxNb2R1bGUsIENsckljb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTaWRlUGFuZWxNb2R1bGUge31cbiJdfQ==