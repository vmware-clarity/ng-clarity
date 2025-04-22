/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import { ResponsiveNavCodes } from '../nav/responsive-nav-codes';
import * as i0 from "@angular/core";
import * as i1 from "../nav/providers/responsive-navigation.service";
export class ClrMainContainer {
    constructor(elRef, responsiveNavService) {
        this.elRef = elRef;
        this.responsiveNavService = responsiveNavService;
    }
    ngOnInit() {
        this._classList = this.elRef.nativeElement.classList;
        this._subscription = this.responsiveNavService.navControl.subscribe({
            next: (message) => {
                this.processMessage(message);
            },
        });
    }
    processMessage(message) {
        let navClass = ResponsiveNavCodes.NAV_CLASS_HAMBURGER_MENU;
        if (message.controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL) {
            this._classList.remove(ResponsiveNavCodes.NAV_CLASS_HAMBURGER_MENU);
            this._classList.remove(ResponsiveNavCodes.NAV_CLASS_OVERFLOW_MENU);
        }
        else if (message.navLevel === ResponsiveNavCodes.NAV_LEVEL_1) {
            this.controlNav(message.controlCode, navClass);
        }
        else if (message.navLevel === ResponsiveNavCodes.NAV_LEVEL_2) {
            navClass = ResponsiveNavCodes.NAV_CLASS_OVERFLOW_MENU;
            this.controlNav(message.controlCode, navClass);
        }
    }
    controlNav(controlCode, navClass) {
        if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
            this._classList.add(navClass);
        }
        else if (controlCode === ResponsiveNavCodes.NAV_CLOSE) {
            this._classList.remove(navClass);
        }
        else if (controlCode === ResponsiveNavCodes.NAV_TOGGLE) {
            this._classList.toggle(navClass);
        }
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
ClrMainContainer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrMainContainer, deps: [{ token: i0.ElementRef }, { token: i1.ResponsiveNavigationService }], target: i0.ɵɵFactoryTarget.Directive });
ClrMainContainer.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrMainContainer, selector: "clr-main-container", host: { properties: { "class.main-container": "true" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrMainContainer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-main-container',
                    host: { '[class.main-container]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.ResponsiveNavigationService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi1jb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvbWFpbi1jb250YWluZXIvbWFpbi1jb250YWluZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFpQyxNQUFNLGVBQWUsQ0FBQztBQUl6RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7O0FBT2pFLE1BQU0sT0FBTyxnQkFBZ0I7SUFJM0IsWUFBb0IsS0FBOEIsRUFBVSxvQkFBaUQ7UUFBekYsVUFBSyxHQUFMLEtBQUssQ0FBeUI7UUFBVSx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQTZCO0lBQUcsQ0FBQztJQUVqSCxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7UUFDckQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUNsRSxJQUFJLEVBQUUsQ0FBQyxPQUFvQyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsQ0FBQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBb0M7UUFDakQsSUFBSSxRQUFRLEdBQVcsa0JBQWtCLENBQUMsd0JBQXdCLENBQUM7UUFDbkUsSUFBSSxPQUFPLENBQUMsV0FBVyxLQUFLLGtCQUFrQixDQUFDLGFBQWEsRUFBRTtZQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDLENBQUM7U0FDcEU7YUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssa0JBQWtCLENBQUMsV0FBVyxFQUFFO1lBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNoRDthQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUU7WUFDOUQsUUFBUSxHQUFHLGtCQUFrQixDQUFDLHVCQUF1QixDQUFDO1lBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNoRDtJQUNILENBQUM7SUFFRCxVQUFVLENBQUMsV0FBbUIsRUFBRSxRQUFnQjtRQUM5QyxJQUFJLFdBQVcsS0FBSyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDL0I7YUFBTSxJQUFJLFdBQVcsS0FBSyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUU7WUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7YUFBTSxJQUFJLFdBQVcsS0FBSyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUU7WUFDeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7NkdBeENVLGdCQUFnQjtpR0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBSjVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsSUFBSSxFQUFFLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxFQUFFO2lCQUMzQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFJlc3BvbnNpdmVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uL25hdi9wcm92aWRlcnMvcmVzcG9uc2l2ZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUmVzcG9uc2l2ZU5hdkNvZGVzIH0gZnJvbSAnLi4vbmF2L3Jlc3BvbnNpdmUtbmF2LWNvZGVzJztcbmltcG9ydCB7IFJlc3BvbnNpdmVOYXZDb250cm9sTWVzc2FnZSB9IGZyb20gJy4uL25hdi9yZXNwb25zaXZlLW5hdi1jb250cm9sLW1lc3NhZ2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdjbHItbWFpbi1jb250YWluZXInLFxuICBob3N0OiB7ICdbY2xhc3MubWFpbi1jb250YWluZXJdJzogJ3RydWUnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsck1haW5Db250YWluZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9jbGFzc0xpc3Q6IERPTVRva2VuTGlzdDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSByZXNwb25zaXZlTmF2U2VydmljZTogUmVzcG9uc2l2ZU5hdmlnYXRpb25TZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NsYXNzTGlzdCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uID0gdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZS5uYXZDb250cm9sLnN1YnNjcmliZSh7XG4gICAgICBuZXh0OiAobWVzc2FnZTogUmVzcG9uc2l2ZU5hdkNvbnRyb2xNZXNzYWdlKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc01lc3NhZ2UobWVzc2FnZTogUmVzcG9uc2l2ZU5hdkNvbnRyb2xNZXNzYWdlKTogdm9pZCB7XG4gICAgbGV0IG5hdkNsYXNzOiBzdHJpbmcgPSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMQVNTX0hBTUJVUkdFUl9NRU5VO1xuICAgIGlmIChtZXNzYWdlLmNvbnRyb2xDb2RlID09PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMT1NFX0FMTCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0LnJlbW92ZShSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMQVNTX0hBTUJVUkdFUl9NRU5VKTtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdC5yZW1vdmUoUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9DTEFTU19PVkVSRkxPV19NRU5VKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UubmF2TGV2ZWwgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMSkge1xuICAgICAgdGhpcy5jb250cm9sTmF2KG1lc3NhZ2UuY29udHJvbENvZGUsIG5hdkNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UubmF2TGV2ZWwgPT09IFJlc3BvbnNpdmVOYXZDb2Rlcy5OQVZfTEVWRUxfMikge1xuICAgICAgbmF2Q2xhc3MgPSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMQVNTX09WRVJGTE9XX01FTlU7XG4gICAgICB0aGlzLmNvbnRyb2xOYXYobWVzc2FnZS5jb250cm9sQ29kZSwgbmF2Q2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnRyb2xOYXYoY29udHJvbENvZGU6IHN0cmluZywgbmF2Q2xhc3M6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChjb250cm9sQ29kZSA9PT0gUmVzcG9uc2l2ZU5hdkNvZGVzLk5BVl9PUEVOKSB7XG4gICAgICB0aGlzLl9jbGFzc0xpc3QuYWRkKG5hdkNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRyb2xDb2RlID09PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX0NMT1NFKSB7XG4gICAgICB0aGlzLl9jbGFzc0xpc3QucmVtb3ZlKG5hdkNsYXNzKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRyb2xDb2RlID09PSBSZXNwb25zaXZlTmF2Q29kZXMuTkFWX1RPR0dMRSkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0LnRvZ2dsZShuYXZDbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==