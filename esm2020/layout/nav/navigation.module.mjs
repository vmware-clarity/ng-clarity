/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrDropdownModule } from '../../popover/dropdown/dropdown.module';
import { ClrAriaCurrentLink } from './aria-current-link';
import { MainContainerWillyWonka } from './chocolate/main-container-willy-wonka';
import { NavDetectionOompaLoompa } from './chocolate/nav-detection-oompa-loompa';
import { ClrHeader } from './header';
import { ClrNavLevel } from './nav-level';
import * as i0 from "@angular/core";
export const CLR_NAVIGATION_DIRECTIVES = [
    ClrHeader,
    ClrNavLevel,
    ClrAriaCurrentLink,
    NavDetectionOompaLoompa,
    MainContainerWillyWonka,
];
export class ClrNavigationModule {
}
ClrNavigationModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNavigationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrNavigationModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrNavigationModule, declarations: [ClrHeader,
        ClrNavLevel,
        ClrAriaCurrentLink,
        NavDetectionOompaLoompa,
        MainContainerWillyWonka], imports: [CommonModule, ClrIconModule, ClrDropdownModule], exports: [ClrHeader,
        ClrNavLevel,
        ClrAriaCurrentLink,
        NavDetectionOompaLoompa,
        MainContainerWillyWonka] });
ClrNavigationModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNavigationModule, imports: [CommonModule, ClrIconModule, ClrDropdownModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNavigationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrDropdownModule],
                    declarations: [CLR_NAVIGATION_DIRECTIVES],
                    exports: [CLR_NAVIGATION_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvbmF2L25hdmlnYXRpb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3pELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFFMUMsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQWdCO0lBQ3BELFNBQVM7SUFDVCxXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLHVCQUF1QjtJQUN2Qix1QkFBdUI7Q0FDeEIsQ0FBQztBQU9GLE1BQU0sT0FBTyxtQkFBbUI7O2dIQUFuQixtQkFBbUI7aUhBQW5CLG1CQUFtQixpQkFaOUIsU0FBUztRQUNULFdBQVc7UUFDWCxrQkFBa0I7UUFDbEIsdUJBQXVCO1FBQ3ZCLHVCQUF1QixhQUliLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCLGFBUnhELFNBQVM7UUFDVCxXQUFXO1FBQ1gsa0JBQWtCO1FBQ2xCLHVCQUF1QjtRQUN2Qix1QkFBdUI7aUhBUVosbUJBQW1CLFlBSnBCLFlBQVksRUFBRSxhQUFhLEVBQUUsaUJBQWlCOzJGQUk3QyxtQkFBbUI7a0JBTC9CLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQztvQkFDekQsWUFBWSxFQUFFLENBQUMseUJBQXlCLENBQUM7b0JBQ3pDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixDQUFDO2lCQUNyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckRyb3Bkb3duTW9kdWxlIH0gZnJvbSAnLi4vLi4vcG9wb3Zlci9kcm9wZG93bi9kcm9wZG93bi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQXJpYUN1cnJlbnRMaW5rIH0gZnJvbSAnLi9hcmlhLWN1cnJlbnQtbGluayc7XG5pbXBvcnQgeyBNYWluQ29udGFpbmVyV2lsbHlXb25rYSB9IGZyb20gJy4vY2hvY29sYXRlL21haW4tY29udGFpbmVyLXdpbGx5LXdvbmthJztcbmltcG9ydCB7IE5hdkRldGVjdGlvbk9vbXBhTG9vbXBhIH0gZnJvbSAnLi9jaG9jb2xhdGUvbmF2LWRldGVjdGlvbi1vb21wYS1sb29tcGEnO1xuaW1wb3J0IHsgQ2xySGVhZGVyIH0gZnJvbSAnLi9oZWFkZXInO1xuaW1wb3J0IHsgQ2xyTmF2TGV2ZWwgfSBmcm9tICcuL25hdi1sZXZlbCc7XG5cbmV4cG9ydCBjb25zdCBDTFJfTkFWSUdBVElPTl9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcbiAgQ2xySGVhZGVyLFxuICBDbHJOYXZMZXZlbCxcbiAgQ2xyQXJpYUN1cnJlbnRMaW5rLFxuICBOYXZEZXRlY3Rpb25Pb21wYUxvb21wYSxcbiAgTWFpbkNvbnRhaW5lcldpbGx5V29ua2EsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJEcm9wZG93bk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9OQVZJR0FUSU9OX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX05BVklHQVRJT05fRElSRUNUSVZFU10sXG59KVxuZXhwb3J0IGNsYXNzIENsck5hdmlnYXRpb25Nb2R1bGUge31cbiJdfQ==