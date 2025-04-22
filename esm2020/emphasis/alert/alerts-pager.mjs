/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/multi-alert.service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "../../icon/icon";
export class ClrAlertsPager {
    constructor(multiAlertService, commonStrings) {
        this.multiAlertService = multiAlertService;
        this.commonStrings = commonStrings;
        this.currentAlertChange = new EventEmitter(false);
        this.currentAlertIndexChange = new EventEmitter();
    }
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert() {
        return this.multiAlertService.currentAlert;
    }
    set currentAlert(alert) {
        if (alert) {
            this.multiAlertService.currentAlert = alert;
        }
    }
    /**
     * Input/Output to support two way binding on current alert index
     */
    get currentAlertIndex() {
        return this.multiAlertService.current;
    }
    set currentAlertIndex(index) {
        this.multiAlertService.current = index;
    }
    get previousAlertAriaLabel() {
        const CURRENT = this.currentAlertIndex + 1;
        return this.commonStrings.parse(this.commonStrings.keys.alertPreviousAlertAriaLabel, {
            CURRENT: (CURRENT === 1 ? this.multiAlertService.count : CURRENT - 1).toString(),
            COUNT: this.multiAlertService.count.toString(),
        });
    }
    get nextAlertAriaLabel() {
        const CURRENT = this.currentAlertIndex + 1;
        return this.commonStrings.parse(this.commonStrings.keys.alertNextAlertAriaLabel, {
            CURRENT: (CURRENT === this.multiAlertService.count ? 1 : CURRENT + 1).toString(),
            COUNT: this.multiAlertService.count.toString(),
        });
    }
    ngOnInit() {
        this.multiAlertServiceChanges = this.multiAlertService.changes.subscribe(index => {
            this.currentAlertIndexChange.emit(index);
            this.currentAlertChange.emit(this.multiAlertService.activeAlerts[index]);
        });
    }
    ngOnDestroy() {
        this.multiAlertServiceChanges.unsubscribe();
    }
    pageUp() {
        this.multiAlertService.next();
    }
    pageDown() {
        this.multiAlertService.previous();
    }
}
ClrAlertsPager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertsPager, deps: [{ token: i1.MultiAlertService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrAlertsPager.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAlertsPager, selector: "clr-alerts-pager", inputs: { currentAlert: ["clrCurrentAlert", "currentAlert"], currentAlertIndex: ["clrCurrentAlertIndex", "currentAlertIndex"] }, outputs: { currentAlertChange: "clrCurrentAlertChange", currentAlertIndexChange: "clrCurrentAlertIndexChange" }, host: { properties: { "class.alerts-pager": "true" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"alerts-pager-control\">\n  <div class=\"alerts-page-down\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageDown()\" [attr.aria-label]=\"previousAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.previous\"></cds-icon>\n    </button>\n  </div>\n  <div class=\"alerts-pager-text\">{{this.multiAlertService.current+1}} / {{this.multiAlertService.count}}</div>\n  <div class=\"alerts-page-up\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageUp()\" [attr.aria-label]=\"nextAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.next\"></cds-icon>\n    </button>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i3.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlertsPager, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alerts-pager', host: { '[class.alerts-pager]': 'true' }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"alerts-pager-control\">\n  <div class=\"alerts-page-down\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageDown()\" [attr.aria-label]=\"previousAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.previous\"></cds-icon>\n    </button>\n  </div>\n  <div class=\"alerts-pager-text\">{{this.multiAlertService.current+1}} / {{this.multiAlertService.count}}</div>\n  <div class=\"alerts-page-up\">\n    <button class=\"alerts-pager-button\" type=\"button\" (click)=\"pageUp()\" [attr.aria-label]=\"nextAlertAriaLabel\">\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.next\"></cds-icon>\n    </button>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.MultiAlertService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { currentAlertChange: [{
                type: Output,
                args: ['clrCurrentAlertChange']
            }], currentAlertIndexChange: [{
                type: Output,
                args: ['clrCurrentAlertIndexChange']
            }], currentAlert: [{
                type: Input,
                args: ['clrCurrentAlert']
            }], currentAlertIndex: [{
                type: Input,
                args: ['clrCurrentAlertIndex']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnRzLXBhZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZW1waGFzaXMvYWxlcnQvYWxlcnRzLXBhZ2VyLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZW1waGFzaXMvYWxlcnQvYWxlcnRzLXBhZ2VyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFZMUYsTUFBTSxPQUFPLGNBQWM7SUFNekIsWUFBbUIsaUJBQW9DLEVBQVMsYUFBc0M7UUFBbkYsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUxyRSx1QkFBa0IsR0FBRyxJQUFJLFlBQVksQ0FBVyxLQUFLLENBQUMsQ0FBQztRQUNsRCw0QkFBdUIsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO0lBSWMsQ0FBQztJQUUxRzs7T0FFRztJQUNILElBQ0ksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQztJQUM3QyxDQUFDO0lBQ0QsSUFBSSxZQUFZLENBQUMsS0FBZTtRQUM5QixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFDSSxpQkFBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxJQUFJLGlCQUFpQixDQUFDLEtBQWE7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQUVELElBQWMsc0JBQXNCO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNuRixPQUFPLEVBQUUsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2hGLEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtTQUMvQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBYyxrQkFBa0I7UUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztRQUMzQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQy9FLE9BQU8sRUFBRSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDaEYsS0FBSyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1NBQy9DLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9FLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQyxDQUFDOzsyR0FqRVUsY0FBYzsrRkFBZCxjQUFjLGtXQ25CM0IscWhDQW9CQTsyRkREYSxjQUFjO2tCQUwxQixTQUFTOytCQUNFLGtCQUFrQixRQUV0QixFQUFFLHNCQUFzQixFQUFFLE1BQU0sRUFBRTs4SUFHUCxrQkFBa0I7c0JBQWxELE1BQU07dUJBQUMsdUJBQXVCO2dCQUNPLHVCQUF1QjtzQkFBNUQsTUFBTTt1QkFBQyw0QkFBNEI7Z0JBVWhDLFlBQVk7c0JBRGYsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBY3BCLGlCQUFpQjtzQkFEcEIsS0FBSzt1QkFBQyxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckFsZXJ0IH0gZnJvbSAnLi9hbGVydCc7XG5pbXBvcnQgeyBNdWx0aUFsZXJ0U2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL211bHRpLWFsZXJ0LnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItYWxlcnRzLXBhZ2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2FsZXJ0cy1wYWdlci5odG1sJyxcbiAgaG9zdDogeyAnW2NsYXNzLmFsZXJ0cy1wYWdlcl0nOiAndHJ1ZScgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQWxlcnRzUGFnZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ2NsckN1cnJlbnRBbGVydENoYW5nZScpIGN1cnJlbnRBbGVydENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2xyQWxlcnQ+KGZhbHNlKTtcbiAgQE91dHB1dCgnY2xyQ3VycmVudEFsZXJ0SW5kZXhDaGFuZ2UnKSBjdXJyZW50QWxlcnRJbmRleENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIHByaXZhdGUgbXVsdGlBbGVydFNlcnZpY2VDaGFuZ2VzOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHVibGljIG11bHRpQWxlcnRTZXJ2aWNlOiBNdWx0aUFsZXJ0U2VydmljZSwgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlKSB7fVxuXG4gIC8qKlxuICAgKiBJbnB1dC9PdXRwdXQgdG8gc3VwcG9ydCB0d28gd2F5IGJpbmRpbmcgb24gY3VycmVudCBhbGVydCBpbnN0YW5jZVxuICAgKi9cbiAgQElucHV0KCdjbHJDdXJyZW50QWxlcnQnKVxuICBnZXQgY3VycmVudEFsZXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnRBbGVydDtcbiAgfVxuICBzZXQgY3VycmVudEFsZXJ0KGFsZXJ0OiBDbHJBbGVydCkge1xuICAgIGlmIChhbGVydCkge1xuICAgICAgdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jdXJyZW50QWxlcnQgPSBhbGVydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5wdXQvT3V0cHV0IHRvIHN1cHBvcnQgdHdvIHdheSBiaW5kaW5nIG9uIGN1cnJlbnQgYWxlcnQgaW5kZXhcbiAgICovXG4gIEBJbnB1dCgnY2xyQ3VycmVudEFsZXJ0SW5kZXgnKVxuICBnZXQgY3VycmVudEFsZXJ0SW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlBbGVydFNlcnZpY2UuY3VycmVudDtcbiAgfVxuICBzZXQgY3VycmVudEFsZXJ0SW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2UuY3VycmVudCA9IGluZGV4O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBwcmV2aW91c0FsZXJ0QXJpYUxhYmVsKCkge1xuICAgIGNvbnN0IENVUlJFTlQgPSB0aGlzLmN1cnJlbnRBbGVydEluZGV4ICsgMTtcbiAgICByZXR1cm4gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmFsZXJ0UHJldmlvdXNBbGVydEFyaWFMYWJlbCwge1xuICAgICAgQ1VSUkVOVDogKENVUlJFTlQgPT09IDEgPyB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmNvdW50IDogQ1VSUkVOVCAtIDEpLnRvU3RyaW5nKCksXG4gICAgICBDT1VOVDogdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jb3VudC50b1N0cmluZygpLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBuZXh0QWxlcnRBcmlhTGFiZWwoKSB7XG4gICAgY29uc3QgQ1VSUkVOVCA9IHRoaXMuY3VycmVudEFsZXJ0SW5kZXggKyAxO1xuICAgIHJldHVybiB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuYWxlcnROZXh0QWxlcnRBcmlhTGFiZWwsIHtcbiAgICAgIENVUlJFTlQ6IChDVVJSRU5UID09PSB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmNvdW50ID8gMSA6IENVUlJFTlQgKyAxKS50b1N0cmluZygpLFxuICAgICAgQ09VTlQ6IHRoaXMubXVsdGlBbGVydFNlcnZpY2UuY291bnQudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2VDaGFuZ2VzID0gdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jaGFuZ2VzLnN1YnNjcmliZShpbmRleCA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRBbGVydEluZGV4Q2hhbmdlLmVtaXQoaW5kZXgpO1xuICAgICAgdGhpcy5jdXJyZW50QWxlcnRDaGFuZ2UuZW1pdCh0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmFjdGl2ZUFsZXJ0c1tpbmRleF0pO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tdWx0aUFsZXJ0U2VydmljZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHBhZ2VVcCgpIHtcbiAgICB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLm5leHQoKTtcbiAgfVxuXG4gIHBhZ2VEb3duKCkge1xuICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2UucHJldmlvdXMoKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXYgY2xhc3M9XCJhbGVydHMtcGFnZXItY29udHJvbFwiPlxuICA8ZGl2IGNsYXNzPVwiYWxlcnRzLXBhZ2UtZG93blwiPlxuICAgIDxidXR0b24gY2xhc3M9XCJhbGVydHMtcGFnZXItYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJwYWdlRG93bigpXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJwcmV2aW91c0FsZXJ0QXJpYUxhYmVsXCI+XG4gICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cImxlZnRcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMucHJldmlvdXNcIj48L2Nkcy1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImFsZXJ0cy1wYWdlci10ZXh0XCI+e3t0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnQrMX19IC8ge3t0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmNvdW50fX08L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImFsZXJ0cy1wYWdlLXVwXCI+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImFsZXJ0cy1wYWdlci1idXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInBhZ2VVcCgpXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJuZXh0QWxlcnRBcmlhTGFiZWxcIj5cbiAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMubmV4dFwiPjwvY2RzLWljb24+XG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuPC9kaXY+XG4iXX0=