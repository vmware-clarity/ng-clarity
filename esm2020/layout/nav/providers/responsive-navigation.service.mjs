/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ResponsiveNavCodes } from '../responsive-nav-codes';
import { ResponsiveNavControlMessage } from '../responsive-nav-control-message';
import * as i0 from "@angular/core";
export class ResponsiveNavigationService {
    constructor() {
        this.responsiveNavList = [];
        this.registerNavSubject = new ReplaySubject();
        this.controlNavSubject = new Subject();
        this.closeAllNavs(); // We start with all navs closed
    }
    get registeredNavs() {
        return this.registerNavSubject.asObservable();
    }
    get navControl() {
        return this.controlNavSubject.asObservable();
    }
    registerNav(navLevel) {
        if (!navLevel || this.isNavRegistered(navLevel)) {
            return;
        }
        this.responsiveNavList.push(navLevel);
        this.registerNavSubject.next(this.responsiveNavList);
    }
    isNavRegistered(navLevel) {
        if (this.responsiveNavList.indexOf(navLevel) > -1) {
            console.error('Multiple clr-nav-level ' + navLevel + ' attributes found. Please make sure that only one exists');
            return true;
        }
        return false;
    }
    unregisterNav(navLevel) {
        const index = this.responsiveNavList.indexOf(navLevel);
        if (index > -1) {
            this.responsiveNavList.splice(index, 1);
            this.registerNavSubject.next(this.responsiveNavList);
        }
    }
    sendControlMessage(controlCode, navLevel) {
        const message = new ResponsiveNavControlMessage(controlCode, navLevel);
        this.controlNavSubject.next(message);
    }
    closeAllNavs() {
        const message = new ResponsiveNavControlMessage(ResponsiveNavCodes.NAV_CLOSE_ALL, -999);
        this.controlNavSubject.next(message);
    }
}
ResponsiveNavigationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ResponsiveNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ResponsiveNavigationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ResponsiveNavigationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ResponsiveNavigationService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2l2ZS1uYXZpZ2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvbmF2L3Byb3ZpZGVycy9yZXNwb25zaXZlLW5hdmlnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFOUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7O0FBR2hGLE1BQU0sT0FBTywyQkFBMkI7SUFNdEM7UUFMQSxzQkFBaUIsR0FBYSxFQUFFLENBQUM7UUFFekIsdUJBQWtCLEdBQUcsSUFBSSxhQUFhLEVBQVksQ0FBQztRQUNuRCxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBK0IsQ0FBQztRQUdyRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxnQ0FBZ0M7SUFDdkQsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQjtRQUMxQixJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0MsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxlQUFlLENBQUMsUUFBZ0I7UUFDOUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2pELE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEdBQUcsUUFBUSxHQUFHLDBEQUEwRCxDQUFDLENBQUM7WUFDakgsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELGFBQWEsQ0FBQyxRQUFnQjtRQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxXQUFtQixFQUFFLFFBQWdCO1FBQ3RELE1BQU0sT0FBTyxHQUFnQyxJQUFJLDJCQUEyQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxZQUFZO1FBQ1YsTUFBTSxPQUFPLEdBQWdDLElBQUksMkJBQTJCLENBQzFFLGtCQUFrQixDQUFDLGFBQWEsRUFDaEMsQ0FBQyxHQUFHLENBQ0wsQ0FBQztRQUNGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7d0hBckRVLDJCQUEyQjs0SEFBM0IsMkJBQTJCLGNBRGQsTUFBTTsyRkFDbkIsMkJBQTJCO2tCQUR2QyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBSZXNwb25zaXZlTmF2Q29kZXMgfSBmcm9tICcuLi9yZXNwb25zaXZlLW5hdi1jb2Rlcyc7XG5pbXBvcnQgeyBSZXNwb25zaXZlTmF2Q29udHJvbE1lc3NhZ2UgfSBmcm9tICcuLi9yZXNwb25zaXZlLW5hdi1jb250cm9sLW1lc3NhZ2UnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFJlc3BvbnNpdmVOYXZpZ2F0aW9uU2VydmljZSB7XG4gIHJlc3BvbnNpdmVOYXZMaXN0OiBudW1iZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVnaXN0ZXJOYXZTdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8bnVtYmVyW10+KCk7XG4gIHByaXZhdGUgY29udHJvbE5hdlN1YmplY3QgPSBuZXcgU3ViamVjdDxSZXNwb25zaXZlTmF2Q29udHJvbE1lc3NhZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jbG9zZUFsbE5hdnMoKTsgLy8gV2Ugc3RhcnQgd2l0aCBhbGwgbmF2cyBjbG9zZWRcbiAgfVxuXG4gIGdldCByZWdpc3RlcmVkTmF2cygpOiBPYnNlcnZhYmxlPG51bWJlcltdPiB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJOYXZTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IG5hdkNvbnRyb2woKTogT2JzZXJ2YWJsZTxSZXNwb25zaXZlTmF2Q29udHJvbE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sTmF2U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyTmF2KG5hdkxldmVsOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIW5hdkxldmVsIHx8IHRoaXMuaXNOYXZSZWdpc3RlcmVkKG5hdkxldmVsKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlc3BvbnNpdmVOYXZMaXN0LnB1c2gobmF2TGV2ZWwpO1xuICAgIHRoaXMucmVnaXN0ZXJOYXZTdWJqZWN0Lm5leHQodGhpcy5yZXNwb25zaXZlTmF2TGlzdCk7XG4gIH1cblxuICBpc05hdlJlZ2lzdGVyZWQobmF2TGV2ZWw6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnJlc3BvbnNpdmVOYXZMaXN0LmluZGV4T2YobmF2TGV2ZWwpID4gLTEpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ011bHRpcGxlIGNsci1uYXYtbGV2ZWwgJyArIG5hdkxldmVsICsgJyBhdHRyaWJ1dGVzIGZvdW5kLiBQbGVhc2UgbWFrZSBzdXJlIHRoYXQgb25seSBvbmUgZXhpc3RzJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdW5yZWdpc3Rlck5hdihuYXZMZXZlbDogbnVtYmVyKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnJlc3BvbnNpdmVOYXZMaXN0LmluZGV4T2YobmF2TGV2ZWwpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLnJlc3BvbnNpdmVOYXZMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnJlZ2lzdGVyTmF2U3ViamVjdC5uZXh0KHRoaXMucmVzcG9uc2l2ZU5hdkxpc3QpO1xuICAgIH1cbiAgfVxuXG4gIHNlbmRDb250cm9sTWVzc2FnZShjb250cm9sQ29kZTogc3RyaW5nLCBuYXZMZXZlbDogbnVtYmVyKSB7XG4gICAgY29uc3QgbWVzc2FnZTogUmVzcG9uc2l2ZU5hdkNvbnRyb2xNZXNzYWdlID0gbmV3IFJlc3BvbnNpdmVOYXZDb250cm9sTWVzc2FnZShjb250cm9sQ29kZSwgbmF2TGV2ZWwpO1xuICAgIHRoaXMuY29udHJvbE5hdlN1YmplY3QubmV4dChtZXNzYWdlKTtcbiAgfVxuXG4gIGNsb3NlQWxsTmF2cygpIHtcbiAgICBjb25zdCBtZXNzYWdlOiBSZXNwb25zaXZlTmF2Q29udHJvbE1lc3NhZ2UgPSBuZXcgUmVzcG9uc2l2ZU5hdkNvbnRyb2xNZXNzYWdlKFxuICAgICAgUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTE9TRV9BTEwsXG4gICAgICAtOTk5XG4gICAgKTtcbiAgICB0aGlzLmNvbnRyb2xOYXZTdWJqZWN0Lm5leHQobWVzc2FnZSk7XG4gIH1cbn1cbiJdfQ==