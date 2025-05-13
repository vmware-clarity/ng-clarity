/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/vertical-nav.service";
import * as i2 from "./providers/vertical-nav-icon.service";
import * as i3 from "./providers/vertical-nav-group-registration.service";
import * as i4 from "../../utils/i18n/common-strings.service";
import * as i5 from "@angular/common";
import * as i6 from "../../icon/icon";
export class ClrVerticalNav {
    constructor(_navService, _navIconService, _navGroupRegistrationService, commonStrings) {
        this._navService = _navService;
        this._navIconService = _navIconService;
        this._navGroupRegistrationService = _navGroupRegistrationService;
        this.commonStrings = commonStrings;
        this.contentId = uniqueIdFactory();
        this._collapsedChanged = new EventEmitter(true);
        this._sub = _navService.collapsedChanged.subscribe(value => {
            this._collapsedChanged.emit(value);
        });
    }
    get collapsible() {
        return this._navService.collapsible;
    }
    set collapsible(value) {
        this._navService.collapsible = value;
    }
    get collapsed() {
        return this._navService.collapsed;
    }
    set collapsed(value) {
        this._navService.collapsed = value;
    }
    get hasNavGroups() {
        return this._navGroupRegistrationService.navGroupCount > 0;
    }
    get hasIcons() {
        return this._navIconService.hasIcons;
    }
    get ariaExpanded() {
        if (!this.collapsible) {
            return null;
        }
        return !this.collapsed ? 'true' : 'false';
    }
    ngOnDestroy() {
        this._sub.unsubscribe();
    }
    toggleByButton() {
        this.collapsed = !this.collapsed;
    }
}
ClrVerticalNav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNav, deps: [{ token: i1.VerticalNavService }, { token: i2.VerticalNavIconService }, { token: i3.VerticalNavGroupRegistrationService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrVerticalNav.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrVerticalNav, selector: "clr-vertical-nav", inputs: { toggleLabel: ["clrVerticalNavToggleLabel", "toggleLabel"], collapsible: ["clrVerticalNavCollapsible", "collapsible"], collapsed: ["clrVerticalNavCollapsed", "collapsed"] }, outputs: { _collapsedChanged: "clrVerticalNavCollapsedChange" }, host: { properties: { "class.is-collapsed": "collapsed", "class.has-nav-groups": "hasNavGroups", "class.has-icons": "hasIcons" }, classAttribute: "clr-vertical-nav" }, providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n  *ngIf=\"collapsible\"\n>\n  <cds-icon\n    shape=\"angle-double\"\n    class=\"nav-trigger-icon\"\n    [attr.direction]=\"(this.collapsed) ? 'right' : 'left'\"\n  ></cds-icon>\n</button>\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n    *ngIf=\"collapsible && collapsed\"\n  ></button>\n</div>\n", dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNav, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav', providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], host: {
                        class: 'clr-vertical-nav',
                        '[class.is-collapsed]': 'collapsed',
                        '[class.has-nav-groups]': 'hasNavGroups',
                        '[class.has-icons]': 'hasIcons',
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n  *ngIf=\"collapsible\"\n>\n  <cds-icon\n    shape=\"angle-double\"\n    class=\"nav-trigger-icon\"\n    [attr.direction]=\"(this.collapsed) ? 'right' : 'left'\"\n  ></cds-icon>\n</button>\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n    *ngIf=\"collapsible && collapsed\"\n  ></button>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.VerticalNavService }, { type: i2.VerticalNavIconService }, { type: i3.VerticalNavGroupRegistrationService }, { type: i4.ClrCommonStringsService }]; }, propDecorators: { toggleLabel: [{
                type: Input,
                args: ['clrVerticalNavToggleLabel']
            }], _collapsedChanged: [{
                type: Output,
                args: ['clrVerticalNavCollapsedChange']
            }], collapsible: [{
                type: Input,
                args: ['clrVerticalNavCollapsible']
            }], collapsed: [{
                type: Input,
                args: ['clrVerticalNavCollapsed']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3ZlcnRpY2FsLW5hdi92ZXJ0aWNhbC1uYXYudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdmVydGljYWwtbmF2L3ZlcnRpY2FsLW5hdi5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlsRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0scURBQXFELENBQUM7QUFDMUcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7Ozs7Ozs7O0FBYXRFLE1BQU0sT0FBTyxjQUFjO0lBUXpCLFlBQ1UsV0FBK0IsRUFDL0IsZUFBdUMsRUFDdkMsNEJBQWlFLEVBQ2xFLGFBQXNDO1FBSHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsaUNBQTRCLEdBQTVCLDRCQUE0QixDQUFxQztRQUNsRSxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFWL0MsY0FBUyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRW1CLHNCQUFpQixHQUFHLElBQUksWUFBWSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBVW5HLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQ0ksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7SUFDdEMsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQXVCO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLEtBQWdCLENBQUM7SUFDbEQsQ0FBQztJQUVELElBQ0ksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7SUFDcEMsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLEtBQXVCO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLEtBQWdCLENBQUM7SUFDaEQsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDNUMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDbkMsQ0FBQzs7MkdBeERVLGNBQWM7K0ZBQWQsY0FBYywyY0FSZCxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLG1DQUFtQyxDQUFDLDBCQ25COUYsMm9DQW9DQTsyRkRUYSxjQUFjO2tCQVgxQixTQUFTOytCQUNFLGtCQUFrQixhQUVqQixDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLG1DQUFtQyxDQUFDLFFBQ3RGO3dCQUNKLEtBQUssRUFBRSxrQkFBa0I7d0JBQ3pCLHNCQUFzQixFQUFFLFdBQVc7d0JBQ25DLHdCQUF3QixFQUFFLGNBQWM7d0JBQ3hDLG1CQUFtQixFQUFFLFVBQVU7cUJBQ2hDO3NPQUdtQyxXQUFXO3NCQUE5QyxLQUFLO3VCQUFDLDJCQUEyQjtnQkFHZSxpQkFBaUI7c0JBQWpFLE1BQU07dUJBQUMsK0JBQStCO2dCQWdCbkMsV0FBVztzQkFEZCxLQUFLO3VCQUFDLDJCQUEyQjtnQkFTOUIsU0FBUztzQkFEWixLQUFLO3VCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBWZXJ0aWNhbE5hdkdyb3VwUmVnaXN0cmF0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3ZlcnRpY2FsLW5hdi1ncm91cC1yZWdpc3RyYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBWZXJ0aWNhbE5hdkljb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdmVydGljYWwtbmF2LWljb24uc2VydmljZSc7XG5pbXBvcnQgeyBWZXJ0aWNhbE5hdlNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy92ZXJ0aWNhbC1uYXYuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci12ZXJ0aWNhbC1uYXYnLFxuICB0ZW1wbGF0ZVVybDogJy4vdmVydGljYWwtbmF2Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtWZXJ0aWNhbE5hdlNlcnZpY2UsIFZlcnRpY2FsTmF2SWNvblNlcnZpY2UsIFZlcnRpY2FsTmF2R3JvdXBSZWdpc3RyYXRpb25TZXJ2aWNlXSxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnY2xyLXZlcnRpY2FsLW5hdicsXG4gICAgJ1tjbGFzcy5pcy1jb2xsYXBzZWRdJzogJ2NvbGxhcHNlZCcsXG4gICAgJ1tjbGFzcy5oYXMtbmF2LWdyb3Vwc10nOiAnaGFzTmF2R3JvdXBzJyxcbiAgICAnW2NsYXNzLmhhcy1pY29uc10nOiAnaGFzSWNvbnMnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJWZXJ0aWNhbE5hdiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyVmVydGljYWxOYXZUb2dnbGVMYWJlbCcpIHRvZ2dsZUxhYmVsOiBzdHJpbmc7XG4gIGNvbnRlbnRJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuXG4gIEBPdXRwdXQoJ2NsclZlcnRpY2FsTmF2Q29sbGFwc2VkQ2hhbmdlJykgcHJpdmF0ZSBfY29sbGFwc2VkQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4odHJ1ZSk7XG5cbiAgcHJpdmF0ZSBfc3ViOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbmF2U2VydmljZTogVmVydGljYWxOYXZTZXJ2aWNlLFxuICAgIHByaXZhdGUgX25hdkljb25TZXJ2aWNlOiBWZXJ0aWNhbE5hdkljb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgX25hdkdyb3VwUmVnaXN0cmF0aW9uU2VydmljZTogVmVydGljYWxOYXZHcm91cFJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuX3N1YiA9IF9uYXZTZXJ2aWNlLmNvbGxhcHNlZENoYW5nZWQuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgIHRoaXMuX2NvbGxhcHNlZENoYW5nZWQuZW1pdCh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZlcnRpY2FsTmF2Q29sbGFwc2libGUnKVxuICBnZXQgY29sbGFwc2libGUoKTogYm9vbGVhbiB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX25hdlNlcnZpY2UuY29sbGFwc2libGU7XG4gIH1cbiAgc2V0IGNvbGxhcHNpYmxlKHZhbHVlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5fbmF2U2VydmljZS5jb2xsYXBzaWJsZSA9IHZhbHVlIGFzIGJvb2xlYW47XG4gIH1cblxuICBASW5wdXQoJ2NsclZlcnRpY2FsTmF2Q29sbGFwc2VkJylcbiAgZ2V0IGNvbGxhcHNlZCgpOiBib29sZWFuIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbmF2U2VydmljZS5jb2xsYXBzZWQ7XG4gIH1cbiAgc2V0IGNvbGxhcHNlZCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHRoaXMuX25hdlNlcnZpY2UuY29sbGFwc2VkID0gdmFsdWUgYXMgYm9vbGVhbjtcbiAgfVxuXG4gIGdldCBoYXNOYXZHcm91cHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX25hdkdyb3VwUmVnaXN0cmF0aW9uU2VydmljZS5uYXZHcm91cENvdW50ID4gMDtcbiAgfVxuXG4gIGdldCBoYXNJY29ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbmF2SWNvblNlcnZpY2UuaGFzSWNvbnM7XG4gIH1cblxuICBnZXQgYXJpYUV4cGFuZGVkKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLmNvbGxhcHNpYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLmNvbGxhcHNlZCA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWIudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHRvZ2dsZUJ5QnV0dG9uKCkge1xuICAgIHRoaXMuY29sbGFwc2VkID0gIXRoaXMuY29sbGFwc2VkO1xuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cblxuPGJ1dHRvblxuICB0eXBlPVwiYnV0dG9uXCJcbiAgY2xhc3M9XCJuYXYtdHJpZ2dlclwiXG4gIFtjbGFzcy5vbi1jb2xsYXBzZV09XCJjb2xsYXBzZWRcIlxuICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImNvbnRlbnRJZFwiXG4gIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiYXJpYUV4cGFuZGVkXCJcbiAgW2F0dHIuYXJpYS1sYWJlbF09XCJ0b2dnbGVMYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMudmVydGljYWxOYXZUb2dnbGVcIlxuICAoY2xpY2spPVwidG9nZ2xlQnlCdXR0b24oKVwiXG4gICpuZ0lmPVwiY29sbGFwc2libGVcIlxuPlxuICA8Y2RzLWljb25cbiAgICBzaGFwZT1cImFuZ2xlLWRvdWJsZVwiXG4gICAgY2xhc3M9XCJuYXYtdHJpZ2dlci1pY29uXCJcbiAgICBbYXR0ci5kaXJlY3Rpb25dPVwiKHRoaXMuY29sbGFwc2VkKSA/ICdyaWdodCcgOiAnbGVmdCdcIlxuICA+PC9jZHMtaWNvbj5cbjwvYnV0dG9uPlxuPGRpdiBbaWRdPVwiY29udGVudElkXCIgY2xhc3M9XCJuYXYtY29udGVudFwiPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDxidXR0b25cbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAoY2xpY2spPVwiY29sbGFwc2VkID0gZmFsc2VcIlxuICAgIGNsYXNzPVwibmF2LWJ0blwiXG4gICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICB0YWJpbmRleD1cIi0xXCJcbiAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImNvbnRlbnRJZFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJ0b2dnbGVMYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMudmVydGljYWxOYXZUb2dnbGVcIlxuICAgICpuZ0lmPVwiY29sbGFwc2libGUgJiYgY29sbGFwc2VkXCJcbiAgPjwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=