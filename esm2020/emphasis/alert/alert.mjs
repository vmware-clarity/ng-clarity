/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, Input, Optional, Output, } from '@angular/core';
import { AlertIconAndTypesService } from './providers/icon-and-types.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/icon-and-types.service";
import * as i2 from "./providers/multi-alert.service";
import * as i3 from "../../utils/i18n/common-strings.service";
import * as i4 from "@angular/common";
import * as i5 from "../../icon/icon";
export class ClrAlert {
    constructor(iconService, cdr, multiAlertService, commonStrings, renderer, hostElement) {
        this.iconService = iconService;
        this.cdr = cdr;
        this.multiAlertService = multiAlertService;
        this.commonStrings = commonStrings;
        this.renderer = renderer;
        this.hostElement = hostElement;
        this.isSmall = false;
        this.closable = true;
        this.isAppLevel = false;
        this.clrCloseButtonAriaLabel = this.commonStrings.keys.alertCloseButtonAriaLabel;
        this._closedChanged = new EventEmitter(false);
        this._closed = false;
        this.subscriptions = [];
        this._isLightweight = false;
    }
    get isLightweight() {
        return this._isLightweight;
    }
    set isLightweight(val) {
        this._isLightweight = val;
        this.configAlertType(this._origAlertType);
    }
    get alertType() {
        return this.iconService.alertType;
    }
    set alertType(val) {
        this._origAlertType = val;
        this.configAlertType(val);
    }
    set alertIconShape(value) {
        this.iconService.alertIconShape = value;
    }
    set closed(value) {
        if (value && !this._closed) {
            this.close();
        }
        else if (!value && this._closed) {
            this.open();
        }
    }
    get alertClass() {
        return this.iconService.iconInfoFromType(this.iconService.alertType).cssClass;
    }
    get hidden() {
        return this._hidden;
    }
    set hidden(value) {
        if (value !== this._hidden) {
            this._hidden = value;
            // CDE-1249 @HostBinding('class.alert-hidden') decoration will raise error in console https://angular.io/errors/NG0100
            if (this._hidden) {
                this.renderer.addClass(this.hostElement.nativeElement, 'alert-hidden');
            }
            else {
                this.renderer.removeClass(this.hostElement.nativeElement, 'alert-hidden');
            }
            this.cdr.detectChanges();
        }
    }
    ngOnInit() {
        if (this.multiAlertService) {
            this.subscriptions.push(this.multiAlertService.changes.subscribe(() => {
                this.hidden = this.multiAlertService.currentAlert !== this;
            }));
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    configAlertType(val) {
        this.iconService.alertType = val;
    }
    open() {
        this._closed = false;
        if (this.multiAlertService) {
            this.multiAlertService.open();
        }
        this._closedChanged.emit(false);
    }
    close() {
        if (!this.closable) {
            return;
        }
        const isCurrentAlert = this.multiAlertService?.currentAlert === this;
        this._closed = true;
        if (this.multiAlertService?.activeAlerts) {
            this.multiAlertService.close(isCurrentAlert);
        }
        this._closedChanged.emit(true);
    }
}
ClrAlert.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlert, deps: [{ token: i1.AlertIconAndTypesService }, { token: i0.ChangeDetectorRef }, { token: i2.MultiAlertService, optional: true }, { token: i3.ClrCommonStringsService }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
ClrAlert.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAlert, selector: "clr-alert", inputs: { isSmall: ["clrAlertSizeSmall", "isSmall"], closable: ["clrAlertClosable", "closable"], isAppLevel: ["clrAlertAppLevel", "isAppLevel"], clrCloseButtonAriaLabel: "clrCloseButtonAriaLabel", isLightweight: ["clrAlertLightweight", "isLightweight"], alertType: ["clrAlertType", "alertType"], alertIconShape: ["clrAlertIcon", "alertIconShape"], closed: ["clrAlertClosed", "closed"] }, outputs: { _closedChanged: "clrAlertClosedChange" }, providers: [AlertIconAndTypesService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  *ngIf=\"!_closed\"\n  class=\"alert\"\n  [ngClass]=\"alertClass\"\n  [class.alert-sm]=\"isSmall\"\n  [class.alert-lightweight]=\"isLightweight\"\n  [class.alert-app-level]=\"isAppLevel\"\n>\n  <div class=\"alert-items\">\n    <ng-content></ng-content>\n  </div>\n  <button type=\"button\" class=\"close\" *ngIf=\"closable\" (click)=\"close()\" [attr.aria-label]=\"clrCloseButtonAriaLabel\">\n    <cds-icon shape=\"times\"></cds-icon>\n  </button>\n</div>\n", dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlert, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alert', providers: [AlertIconAndTypesService], template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div\n  *ngIf=\"!_closed\"\n  class=\"alert\"\n  [ngClass]=\"alertClass\"\n  [class.alert-sm]=\"isSmall\"\n  [class.alert-lightweight]=\"isLightweight\"\n  [class.alert-app-level]=\"isAppLevel\"\n>\n  <div class=\"alert-items\">\n    <ng-content></ng-content>\n  </div>\n  <button type=\"button\" class=\"close\" *ngIf=\"closable\" (click)=\"close()\" [attr.aria-label]=\"clrCloseButtonAriaLabel\">\n    <cds-icon shape=\"times\"></cds-icon>\n  </button>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.AlertIconAndTypesService }, { type: i0.ChangeDetectorRef }, { type: i2.MultiAlertService, decorators: [{
                    type: Optional
                }] }, { type: i3.ClrCommonStringsService }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { isSmall: [{
                type: Input,
                args: ['clrAlertSizeSmall']
            }], closable: [{
                type: Input,
                args: ['clrAlertClosable']
            }], isAppLevel: [{
                type: Input,
                args: ['clrAlertAppLevel']
            }], clrCloseButtonAriaLabel: [{
                type: Input
            }], _closedChanged: [{
                type: Output,
                args: ['clrAlertClosedChange']
            }], isLightweight: [{
                type: Input,
                args: ['clrAlertLightweight']
            }], alertType: [{
                type: Input,
                args: ['clrAlertType']
            }], alertIconShape: [{
                type: Input,
                args: ['clrAlertIcon']
            }], closed: [{
                type: Input,
                args: ['clrAlertClosed']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9lbXBoYXNpcy9hbGVydC9hbGVydC50cyIsIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2VtcGhhc2lzL2FsZXJ0L2FsZXJ0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7Ozs7OztBQVE5RSxNQUFNLE9BQU8sUUFBUTtJQWVuQixZQUNVLFdBQXFDLEVBQ3JDLEdBQXNCLEVBQ1YsaUJBQW9DLEVBQ2hELGFBQXNDLEVBQ3RDLFFBQW1CLEVBQ25CLFdBQW9DO1FBTHBDLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtRQUNyQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNWLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDaEQsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBcEJsQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNyQyw0QkFBdUIsR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztRQUU3RCxtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBRWxGLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFHUixrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsbUJBQWMsR0FBRyxLQUFLLENBQUM7SUFVNUIsQ0FBQztJQUVKLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsR0FBWTtRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUUxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsR0FBVztRQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUUxQixJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUNJLGNBQWMsQ0FBQyxLQUFhO1FBQzlCLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFDSSxNQUFNLENBQUMsS0FBYztRQUN2QixJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7YUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ2hGLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUNELElBQUksTUFBTSxDQUFDLEtBQWM7UUFDdkIsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUVyQixzSEFBc0g7WUFDdEgsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUN4RTtpQkFBTTtnQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUMzRTtZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksS0FBSyxJQUFJLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxlQUFlLENBQUMsR0FBVztRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE9BQU87U0FDUjtRQUNELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLEtBQUssSUFBSSxDQUFDO1FBQ3JFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLFlBQVksRUFBRTtZQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQzs7cUdBbkhVLFFBQVE7eUZBQVIsUUFBUSw2ZEFIUixDQUFDLHdCQUF3QixDQUFDLDBCQzNCdkMsNHZCQXNCQTsyRkRRYSxRQUFRO2tCQUxwQixTQUFTOytCQUNFLFdBQVcsYUFDVixDQUFDLHdCQUF3QixDQUFDOzswQkFxQmxDLFFBQVE7bUlBakJpQixPQUFPO3NCQUFsQyxLQUFLO3VCQUFDLG1CQUFtQjtnQkFDQyxRQUFRO3NCQUFsQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFDRSxVQUFVO3NCQUFwQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFDaEIsdUJBQXVCO3NCQUEvQixLQUFLO2dCQUUwQixjQUFjO3NCQUE3QyxNQUFNO3VCQUFDLHNCQUFzQjtnQkFtQjFCLGFBQWE7c0JBRGhCLEtBQUs7dUJBQUMscUJBQXFCO2dCQVd4QixTQUFTO3NCQURaLEtBQUs7dUJBQUMsY0FBYztnQkFXakIsY0FBYztzQkFEakIsS0FBSzt1QkFBQyxjQUFjO2dCQU1qQixNQUFNO3NCQURULEtBQUs7dUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBBbGVydEljb25BbmRUeXBlc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9pY29uLWFuZC10eXBlcy5zZXJ2aWNlJztcbmltcG9ydCB7IE11bHRpQWxlcnRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvbXVsdGktYWxlcnQuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1hbGVydCcsXG4gIHByb3ZpZGVyczogW0FsZXJ0SWNvbkFuZFR5cGVzU2VydmljZV0sXG4gIHRlbXBsYXRlVXJsOiAnLi9hbGVydC5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQWxlcnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyQWxlcnRTaXplU21hbGwnKSBpc1NtYWxsID0gZmFsc2U7XG4gIEBJbnB1dCgnY2xyQWxlcnRDbG9zYWJsZScpIGNsb3NhYmxlID0gdHJ1ZTtcbiAgQElucHV0KCdjbHJBbGVydEFwcExldmVsJykgaXNBcHBMZXZlbCA9IGZhbHNlO1xuICBASW5wdXQoKSBjbHJDbG9zZUJ1dHRvbkFyaWFMYWJlbDogc3RyaW5nID0gdGhpcy5jb21tb25TdHJpbmdzLmtleXMuYWxlcnRDbG9zZUJ1dHRvbkFyaWFMYWJlbDtcblxuICBAT3V0cHV0KCdjbHJBbGVydENsb3NlZENoYW5nZScpIF9jbG9zZWRDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgX2Nsb3NlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2hpZGRlbjogYm9vbGVhbjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIF9pc0xpZ2h0d2VpZ2h0ID0gZmFsc2U7XG4gIHByaXZhdGUgX29yaWdBbGVydFR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGljb25TZXJ2aWNlOiBBbGVydEljb25BbmRUeXBlc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgbXVsdGlBbGVydFNlcnZpY2U6IE11bHRpQWxlcnRTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgaG9zdEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+XG4gICkge31cblxuICBASW5wdXQoJ2NsckFsZXJ0TGlnaHR3ZWlnaHQnKVxuICBnZXQgaXNMaWdodHdlaWdodCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNMaWdodHdlaWdodDtcbiAgfVxuICBzZXQgaXNMaWdodHdlaWdodCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9pc0xpZ2h0d2VpZ2h0ID0gdmFsO1xuXG4gICAgdGhpcy5jb25maWdBbGVydFR5cGUodGhpcy5fb3JpZ0FsZXJ0VHlwZSk7XG4gIH1cblxuICBASW5wdXQoJ2NsckFsZXJ0VHlwZScpXG4gIGdldCBhbGVydFR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pY29uU2VydmljZS5hbGVydFR5cGU7XG4gIH1cbiAgc2V0IGFsZXJ0VHlwZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX29yaWdBbGVydFR5cGUgPSB2YWw7XG5cbiAgICB0aGlzLmNvbmZpZ0FsZXJ0VHlwZSh2YWwpO1xuICB9XG5cbiAgQElucHV0KCdjbHJBbGVydEljb24nKVxuICBzZXQgYWxlcnRJY29uU2hhcGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuaWNvblNlcnZpY2UuYWxlcnRJY29uU2hhcGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyQWxlcnRDbG9zZWQnKVxuICBzZXQgY2xvc2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlICYmICF0aGlzLl9jbG9zZWQpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2UgaWYgKCF2YWx1ZSAmJiB0aGlzLl9jbG9zZWQpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhbGVydENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWNvblNlcnZpY2UuaWNvbkluZm9Gcm9tVHlwZSh0aGlzLmljb25TZXJ2aWNlLmFsZXJ0VHlwZSkuY3NzQ2xhc3M7XG4gIH1cblxuICBnZXQgaGlkZGVuKCkge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW47XG4gIH1cbiAgc2V0IGhpZGRlbih2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5faGlkZGVuKSB7XG4gICAgICB0aGlzLl9oaWRkZW4gPSB2YWx1ZTtcblxuICAgICAgLy8gQ0RFLTEyNDkgQEhvc3RCaW5kaW5nKCdjbGFzcy5hbGVydC1oaWRkZW4nKSBkZWNvcmF0aW9uIHdpbGwgcmFpc2UgZXJyb3IgaW4gY29uc29sZSBodHRwczovL2FuZ3VsYXIuaW8vZXJyb3JzL05HMDEwMFxuICAgICAgaWYgKHRoaXMuX2hpZGRlbikge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2FsZXJ0LWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdhbGVydC1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5tdWx0aUFsZXJ0U2VydmljZSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2UuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaGlkZGVuID0gdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jdXJyZW50QWxlcnQgIT09IHRoaXM7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBjb25maWdBbGVydFR5cGUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLmljb25TZXJ2aWNlLmFsZXJ0VHlwZSA9IHZhbDtcbiAgfVxuXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubXVsdGlBbGVydFNlcnZpY2UpIHtcbiAgICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2Uub3BlbigpO1xuICAgIH1cbiAgICB0aGlzLl9jbG9zZWRDaGFuZ2VkLmVtaXQoZmFsc2UpO1xuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNsb3NhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzQ3VycmVudEFsZXJ0ID0gdGhpcy5tdWx0aUFsZXJ0U2VydmljZT8uY3VycmVudEFsZXJ0ID09PSB0aGlzO1xuICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMubXVsdGlBbGVydFNlcnZpY2U/LmFjdGl2ZUFsZXJ0cykge1xuICAgICAgdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jbG9zZShpc0N1cnJlbnRBbGVydCk7XG4gICAgfVxuICAgIHRoaXMuX2Nsb3NlZENoYW5nZWQuZW1pdCh0cnVlKTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXZcbiAgKm5nSWY9XCIhX2Nsb3NlZFwiXG4gIGNsYXNzPVwiYWxlcnRcIlxuICBbbmdDbGFzc109XCJhbGVydENsYXNzXCJcbiAgW2NsYXNzLmFsZXJ0LXNtXT1cImlzU21hbGxcIlxuICBbY2xhc3MuYWxlcnQtbGlnaHR3ZWlnaHRdPVwiaXNMaWdodHdlaWdodFwiXG4gIFtjbGFzcy5hbGVydC1hcHAtbGV2ZWxdPVwiaXNBcHBMZXZlbFwiXG4+XG4gIDxkaXYgY2xhc3M9XCJhbGVydC1pdGVtc1wiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9kaXY+XG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiAqbmdJZj1cImNsb3NhYmxlXCIgKGNsaWNrKT1cImNsb3NlKClcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImNsckNsb3NlQnV0dG9uQXJpYUxhYmVsXCI+XG4gICAgPGNkcy1pY29uIHNoYXBlPVwidGltZXNcIj48L2Nkcy1pY29uPlxuICA8L2J1dHRvbj5cbjwvZGl2PlxuIl19