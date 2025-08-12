/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, Input } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ResponsiveNavCodes } from './responsive-nav-codes';
import * as i0 from "@angular/core";
import * as i1 from "./providers/responsive-navigation.service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "@angular/common";
export class ClrHeader {
    constructor(responsiveNavService, commonStrings) {
        this.responsiveNavService = responsiveNavService;
        this.commonStrings = commonStrings;
        this.role = 'banner';
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
        this.openNavLevel = null;
        this.responsiveNavCodes = ResponsiveNavCodes;
        this._subscription = responsiveNavService.registeredNavs.subscribe({
            next: (navLevelList) => {
                this.initializeNavTriggers(navLevelList);
            },
        });
        this._subscription.add(responsiveNavService.navControl
            .pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE || controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL))
            .subscribe(() => {
            this.openNavLevel = null;
        }));
    }
    get responsiveNavCommonString() {
        const myCommonStrings = this.commonStrings.keys;
        if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_1) {
            return myCommonStrings.responsiveNavToggleOpen;
        }
        else {
            return myCommonStrings.responsiveNavToggleClose;
        }
    }
    get responsiveOverflowCommonString() {
        const myCommonStrings = this.commonStrings.keys;
        if (this.openNavLevel !== this.responsiveNavCodes.NAV_LEVEL_2) {
            return myCommonStrings.responsiveNavOverflowOpen;
        }
        else {
            return myCommonStrings.responsiveNavOverflowClose;
        }
    }
    // reset triggers. handles cases when an application has different nav levels on different pages.
    resetNavTriggers() {
        this.isNavLevel1OnPage = false;
        this.isNavLevel2OnPage = false;
    }
    // decides which triggers to show on the header
    initializeNavTriggers(navList) {
        this.resetNavTriggers();
        if (navList.length > 2) {
            console.error('More than 2 Nav Levels detected.');
            return;
        }
        navList.forEach(navLevel => {
            if (navLevel === ResponsiveNavCodes.NAV_LEVEL_1) {
                this.isNavLevel1OnPage = true;
            }
            else if (navLevel === ResponsiveNavCodes.NAV_LEVEL_2) {
                this.isNavLevel2OnPage = true;
            }
        });
    }
    // closes the nav that is open
    closeOpenNav() {
        this.responsiveNavService.closeAllNavs();
    }
    /**
     * @deprecated Will be removed in with @clr/angular v15.0.0
     *
     * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
     */
    toggleNav(navLevel) {
        if (this.openNavLevel === navLevel) {
            this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, navLevel);
            return;
        }
        this.openNav(navLevel);
    }
    openNav(navLevel) {
        this.openNavLevel = navLevel;
        this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, navLevel);
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
ClrHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrHeader, deps: [{ token: i1.ResponsiveNavigationService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrHeader, selector: "clr-header", inputs: { role: "role" }, host: { properties: { "class.header": "true", "attr.role": "this.role" } }, ngImport: i0, template: `
    <button
      type="button"
      *ngIf="isNavLevel1OnPage"
      class="header-hamburger-trigger"
      [attr.aria-label]="responsiveNavCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
    >
      <span></span>
    </button>
    <ng-content></ng-content>
    <button
      type="button"
      *ngIf="isNavLevel2OnPage"
      class="header-overflow-trigger"
      [attr.aria-label]="responsiveOverflowCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
    >
      <span></span>
    </button>
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-header',
                    template: `
    <button
      type="button"
      *ngIf="isNavLevel1OnPage"
      class="header-hamburger-trigger"
      [attr.aria-label]="responsiveNavCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_1)"
    >
      <span></span>
    </button>
    <ng-content></ng-content>
    <button
      type="button"
      *ngIf="isNavLevel2OnPage"
      class="header-overflow-trigger"
      [attr.aria-label]="responsiveOverflowCommonString"
      (click)="openNav(responsiveNavCodes.NAV_LEVEL_2)"
    >
      <span></span>
    </button>
    <div class="header-backdrop" (click)="closeOpenNav()"></div>
  `,
                    host: { '[class.header]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i1.ResponsiveNavigationService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { role: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.role']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L25hdi9oZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFekUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXhDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7OztBQTRCNUQsTUFBTSxPQUFPLFNBQVM7SUFTcEIsWUFDVSxvQkFBaUQsRUFDbEQsYUFBc0M7UUFEckMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUE2QjtRQUNsRCxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFWWixTQUFJLEdBQUcsUUFBUSxDQUFDO1FBRW5ELHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMxQixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsaUJBQVksR0FBVyxJQUFJLENBQUM7UUFDNUIsdUJBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFPdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQ2pFLElBQUksRUFBRSxDQUFDLFlBQXNCLEVBQUUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNDLENBQUM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsb0JBQW9CLENBQUMsVUFBVTthQUM1QixJQUFJLENBQ0gsTUFBTSxDQUNKLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQ2xCLFdBQVcsS0FBSyxrQkFBa0IsQ0FBQyxTQUFTLElBQUksV0FBVyxLQUFLLGtCQUFrQixDQUFDLGFBQWEsQ0FD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Szs7c0JBQUksV0FBVzt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZU5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcmVzcG9uc2l2ZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZU5hdkNvZGVzIH0gZnJvbSAnLi9yZXNwb25zaXZlLW5hdi1jb2Rlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1oZWFkZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgKm5nSWY9XCJpc05hdkxldmVsMU9uUGFnZVwiXG4gICAgICBjbGFzcz1cImhlYWRlci1oYW1idXJnZXItdHJpZ2dlclwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInJlc3BvbnNpdmVOYXZDb21tb25TdHJpbmdcIlxuICAgICAgKGNsaWNrKT1cIm9wZW5OYXYocmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9MRVZFTF8xKVwiXG4gICAgPlxuICAgICAgPHNwYW4+PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8YnV0dG9uXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICpuZ0lmPVwiaXNOYXZMZXZlbDJPblBhZ2VcIlxuICAgICAgY2xhc3M9XCJoZWFkZXItb3ZlcmZsb3ctdHJpZ2dlclwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInJlc3BvbnNpdmVPdmVyZmxvd0NvbW1vblN0cmluZ1wiXG4gICAgICAoY2xpY2spPVwib3Blbk5hdihyZXNwb25zaXZlTmF2Q29kZXMuTkFWX0xFVkVMXzIpXCJcbiAgICA+XG4gICAgICA8c3Bhbj48L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICAgPGRpdiBjbGFzcz1cImhlYWRlci1iYWNrZHJvcFwiIChjbGljayk9XCJjbG9zZU9wZW5OYXYoKVwiPjwvZGl2PlxuICBgLFxuICBob3N0OiB7ICdbY2xhc3MuaGVhZGVyXSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJIZWFkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpIHJvbGUgPSAnYmFubmVyJztcblxuICBpc05hdkxldmVsMU9uUGFnZSA9IGZhbHNlO1xuICBpc05hdkxldmVsMk9uUGFnZSA9IGZhbHNlO1xuICBvcGVuTmF2TGV2ZWw6IG51bWJlciA9IG51bGw7XG4gIHJlc3BvbnNpdmVOYXZDb2RlcyA9IFJlc3BvbnNpdmVOYXZDb2RlcztcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZXNwb25zaXZlTmF2U2VydmljZTogUmVzcG9uc2l2ZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSByZXNwb25zaXZlTmF2U2VydmljZS5yZWdpc3RlcmVkTmF2cy5zdWJzY3JpYmUoe1xuICAgICAgbmV4dDogKG5hdkxldmVsTGlzdDogbnVtYmVyW10pID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplTmF2VHJpZ2dlcnMobmF2TGV2ZWxMaXN0KTtcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgcmVzcG9uc2l2ZU5hdlNlcnZpY2UubmF2Q29udHJvbFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgICAoeyBjb250cm9sQ29kZSB9KSA9PlxuICAgICAgICAgICAgICBjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTE9TRSB8fCBjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTE9TRV9BTExcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vcGVuTmF2TGV2ZWwgPSBudWxsO1xuICAgICAgICB9KVxuICAgICk7XG4gIH1cblxuICBnZXQgcmVzcG9uc2l2ZU5hdkNvbW1vblN0cmluZygpIHtcbiAgICBjb25zdCBteUNvbW1vblN0cmluZ3MgPSB0aGlzLmNvbW1vblN0cmluZ3Mua2V5cztcbiAgICBpZiAodGhpcy5vcGVuTmF2TGV2ZWwgIT09IHRoaXMucmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9MRVZFTF8xKSB7XG4gICAgICByZXR1cm4gbXlDb21tb25TdHJpbmdzLnJlc3BvbnNpdmVOYXZUb2dnbGVPcGVuO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbXlDb21tb25TdHJpbmdzLnJlc3BvbnNpdmVOYXZUb2dnbGVDbG9zZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmVzcG9uc2l2ZU92ZXJmbG93Q29tbW9uU3RyaW5nKCkge1xuICAgIGNvbnN0IG15Q29tbW9uU3RyaW5ncyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzO1xuICAgIGlmICh0aGlzLm9wZW5OYXZMZXZlbCAhPT0gdGhpcy5yZXNwb25zaXZlTmF2Q29kZXMuTkFWX0xFVkVMXzIpIHtcbiAgICAgIHJldHVybiBteUNvbW1vblN0cmluZ3MucmVzcG9uc2l2ZU5hdk92ZXJmbG93T3BlbjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG15Q29tbW9uU3RyaW5ncy5yZXNwb25zaXZlTmF2T3ZlcmZsb3dDbG9zZTtcbiAgICB9XG4gIH1cblxuICAvLyByZXNldCB0cmlnZ2Vycy4gaGFuZGxlcyBjYXNlcyB3aGVuIGFuIGFwcGxpY2F0aW9uIGhhcyBkaWZmZXJlbnQgbmF2IGxldmVscyBvbiBkaWZmZXJlbnQgcGFnZXMuXG4gIHJlc2V0TmF2VHJpZ2dlcnMoKSB7XG4gICAgdGhpcy5pc05hdkxldmVsMU9uUGFnZSA9IGZhbHNlO1xuICAgIHRoaXMuaXNOYXZMZXZlbDJPblBhZ2UgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGRlY2lkZXMgd2hpY2ggdHJpZ2dlcnMgdG8gc2hvdyBvbiB0aGUgaGVhZGVyXG4gIGluaXRpYWxpemVOYXZUcmlnZ2VycyhuYXZMaXN0OiBudW1iZXJbXSk6IHZvaWQge1xuICAgIHRoaXMucmVzZXROYXZUcmlnZ2VycygpO1xuICAgIGlmIChuYXZMaXN0Lmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ01vcmUgdGhhbiAyIE5hdiBMZXZlbHMgZGV0ZWN0ZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5hdkxpc3QuZm9yRWFjaChuYXZMZXZlbCA9PiB7XG4gICAgICBpZiAobmF2TGV2ZWwgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMSkge1xuICAgICAgICB0aGlzLmlzTmF2TGV2ZWwxT25QYWdlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAobmF2TGV2ZWwgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMikge1xuICAgICAgICB0aGlzLmlzTmF2TGV2ZWwyT25QYWdlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGNsb3NlcyB0aGUgbmF2IHRoYXQgaXMgb3BlblxuICBjbG9zZU9wZW5OYXYoKSB7XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS5jbG9zZUFsbE5hdnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBXaWxsIGJlIHJlbW92ZWQgaW4gd2l0aCBAY2xyL2FuZ3VsYXIgdjE1LjAuMFxuICAgKlxuICAgKiBVc2UgYG9wZW5OYXYobmF2TGV2ZWwpYCBpbnN0ZWFkIHRvIG9wZW4gdGhlIG5hdmlnYXRpb24gYW5kIFJlc3BvbnNpdmVOYXZTZXJ2aWNlIHRvIGNsb3NlIGl0LlxuICAgKi9cbiAgdG9nZ2xlTmF2KG5hdkxldmVsOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5vcGVuTmF2TGV2ZWwgPT09IG5hdkxldmVsKSB7XG4gICAgICB0aGlzLnJlc3BvbnNpdmVOYXZTZXJ2aWNlLnNlbmRDb250cm9sTWVzc2FnZShSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMT1NFLCBuYXZMZXZlbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vcGVuTmF2KG5hdkxldmVsKTtcbiAgfVxuXG4gIG9wZW5OYXYobmF2TGV2ZWw6IG51bWJlcikge1xuICAgIHRoaXMub3Blbk5hdkxldmVsID0gbmF2TGV2ZWw7XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS5zZW5kQ29udHJvbE1lc3NhZ2UoUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9PUEVOLCBuYXZMZXZlbCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19