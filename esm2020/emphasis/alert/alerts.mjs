/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, EventEmitter, Input, Output, } from '@angular/core';
import { ClrAlert } from './alert';
import { MultiAlertService } from './providers/multi-alert.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/multi-alert.service";
import * as i2 from "@angular/common";
import * as i3 from "./alerts-pager";
export class ClrAlerts {
    constructor(multiAlertService) {
        this.multiAlertService = multiAlertService;
        this.currentAlertChange = new EventEmitter(false);
        this.currentAlertIndexChange = new EventEmitter(false);
        this.subscriptions = [];
    }
    set allAlerts(value) {
        this.multiAlertService.manage(value); // provide alerts
    }
    /**
     * Input/Output to support two way binding on current alert index
     */
    set _inputCurrentIndex(index) {
        if (Number.isInteger(index) && index >= 0) {
            this.multiAlertService.current = index;
        }
    }
    get currentAlertIndex() {
        return this.multiAlertService.current;
    }
    set currentAlertIndex(index) {
        this.multiAlertService.current = index;
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
     * Ensure we are only dealing with alerts that have not been closed yet
     */
    get alerts() {
        return this.allAlerts.filter(alert => {
            return alert.hidden === false;
        });
    }
    get currentAlertType() {
        if (this.multiAlertService.currentAlert) {
            return this.multiAlertService.currentAlert.alertType;
        }
        return '';
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.multiAlertService.changes.subscribe(index => {
            this.currentAlertIndexChange.next(index);
            this.currentAlertChange.next(this.multiAlertService.currentAlert);
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.multiAlertService.destroy();
    }
}
ClrAlerts.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlerts, deps: [{ token: i1.MultiAlertService }], target: i0.ɵɵFactoryTarget.Component });
ClrAlerts.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAlerts, selector: "clr-alerts", inputs: { _inputCurrentIndex: ["clrCurrentAlertIndex", "_inputCurrentIndex"], currentAlert: ["clrCurrentAlert", "currentAlert"] }, outputs: { currentAlertChange: "clrCurrentAlertChange", currentAlertIndexChange: "clrCurrentAlertIndexChange" }, host: { properties: { "class.alerts": "true", "class.alert-danger": "this.currentAlertType == 'danger'", "class.alert-info": "this.currentAlertType == 'info'", "class.alert-success": "this.currentAlertType == 'success'", "class.alert-warning": "this.currentAlertType == 'warning'", "class.alert-neutral": "this.currentAlertType == 'neutral'" } }, providers: [MultiAlertService], queries: [{ propertyName: "allAlerts", predicate: ClrAlert }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"alerts-wrapper\">\n  <clr-alerts-pager *ngIf=\"multiAlertService.count > 1\" [clrCurrentAlertIndex]=\"currentAlertIndex\"></clr-alerts-pager>\n  <ng-content select=\"clr-alert\"></ng-content>\n</div>\n", styles: [":host{display:block}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.ClrAlertsPager, selector: "clr-alerts-pager", inputs: ["clrCurrentAlert", "clrCurrentAlertIndex"], outputs: ["clrCurrentAlertChange", "clrCurrentAlertIndexChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAlerts, decorators: [{
            type: Component,
            args: [{ selector: 'clr-alerts', providers: [MultiAlertService], host: {
                        '[class.alerts]': 'true',
                        '[class.alert-danger]': "this.currentAlertType == 'danger'",
                        '[class.alert-info]': "this.currentAlertType == 'info'",
                        '[class.alert-success]': "this.currentAlertType == 'success'",
                        '[class.alert-warning]': "this.currentAlertType == 'warning'",
                        '[class.alert-neutral]': "this.currentAlertType == 'neutral'",
                    }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"alerts-wrapper\">\n  <clr-alerts-pager *ngIf=\"multiAlertService.count > 1\" [clrCurrentAlertIndex]=\"currentAlertIndex\"></clr-alerts-pager>\n  <ng-content select=\"clr-alert\"></ng-content>\n</div>\n", styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MultiAlertService }]; }, propDecorators: { currentAlertChange: [{
                type: Output,
                args: ['clrCurrentAlertChange']
            }], currentAlertIndexChange: [{
                type: Output,
                args: ['clrCurrentAlertIndexChange']
            }], allAlerts: [{
                type: ContentChildren,
                args: [ClrAlert]
            }], _inputCurrentIndex: [{
                type: Input,
                args: ['clrCurrentAlertIndex']
            }], currentAlert: [{
                type: Input,
                args: ['clrCurrentAlert']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZW1waGFzaXMvYWxlcnQvYWxlcnRzLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZW1waGFzaXMvYWxlcnQvYWxlcnRzLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOzs7OztBQWdCcEUsTUFBTSxPQUFPLFNBQVM7SUFNcEIsWUFBbUIsaUJBQW9DO1FBQXBDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFMdEIsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLENBQVcsS0FBSyxDQUFDLENBQUM7UUFDbEQsNEJBQXVCLEdBQUcsSUFBSSxZQUFZLENBQVMsS0FBSyxDQUFDLENBQUM7UUFFeEYsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO0lBRWUsQ0FBQztJQUUzRCxJQUNJLFNBQVMsQ0FBQyxLQUEwQjtRQUN0QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3pELENBQUM7SUFFRDs7T0FFRztJQUNILElBQ0ksa0JBQWtCLENBQUMsS0FBYTtRQUNsQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRCxJQUFJLGlCQUFpQjtRQUNuQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQUksaUJBQWlCLENBQUMsS0FBYTtRQUNqQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7SUFDN0MsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEtBQWU7UUFDOUIsSUFBSSxLQUFLLEVBQUU7WUFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUU7WUFDdkMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQztTQUN0RDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0MsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQyxDQUFDOztzR0F2RVUsU0FBUzswRkFBVCxTQUFTLG9uQkFYVCxDQUFDLGlCQUFpQixDQUFDLG9EQW1CYixRQUFRLDZCQzVDM0IsZ2dCQVVBOzJGRDBCYSxTQUFTO2tCQWRyQixTQUFTOytCQUNFLFlBQVksYUFFWCxDQUFDLGlCQUFpQixDQUFDLFFBQ3hCO3dCQUNKLGdCQUFnQixFQUFFLE1BQU07d0JBQ3hCLHNCQUFzQixFQUFFLG1DQUFtQzt3QkFDM0Qsb0JBQW9CLEVBQUUsaUNBQWlDO3dCQUN2RCx1QkFBdUIsRUFBRSxvQ0FBb0M7d0JBQzdELHVCQUF1QixFQUFFLG9DQUFvQzt3QkFDN0QsdUJBQXVCLEVBQUUsb0NBQW9DO3FCQUM5RDt3R0FJZ0Msa0JBQWtCO3NCQUFsRCxNQUFNO3VCQUFDLHVCQUF1QjtnQkFDTyx1QkFBdUI7c0JBQTVELE1BQU07dUJBQUMsNEJBQTRCO2dCQU9oQyxTQUFTO3NCQURaLGVBQWU7dUJBQUMsUUFBUTtnQkFTckIsa0JBQWtCO3NCQURyQixLQUFLO3VCQUFDLHNCQUFzQjtnQkFrQnpCLFlBQVk7c0JBRGYsS0FBSzt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJBbGVydCB9IGZyb20gJy4vYWxlcnQnO1xuaW1wb3J0IHsgTXVsdGlBbGVydFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9tdWx0aS1hbGVydC5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWFsZXJ0cycsXG4gIHRlbXBsYXRlVXJsOiAnLi9hbGVydHMuaHRtbCcsXG4gIHByb3ZpZGVyczogW011bHRpQWxlcnRTZXJ2aWNlXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYWxlcnRzXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmFsZXJ0LWRhbmdlcl0nOiBcInRoaXMuY3VycmVudEFsZXJ0VHlwZSA9PSAnZGFuZ2VyJ1wiLFxuICAgICdbY2xhc3MuYWxlcnQtaW5mb10nOiBcInRoaXMuY3VycmVudEFsZXJ0VHlwZSA9PSAnaW5mbydcIixcbiAgICAnW2NsYXNzLmFsZXJ0LXN1Y2Nlc3NdJzogXCJ0aGlzLmN1cnJlbnRBbGVydFR5cGUgPT0gJ3N1Y2Nlc3MnXCIsXG4gICAgJ1tjbGFzcy5hbGVydC13YXJuaW5nXSc6IFwidGhpcy5jdXJyZW50QWxlcnRUeXBlID09ICd3YXJuaW5nJ1wiLFxuICAgICdbY2xhc3MuYWxlcnQtbmV1dHJhbF0nOiBcInRoaXMuY3VycmVudEFsZXJ0VHlwZSA9PSAnbmV1dHJhbCdcIixcbiAgfSxcbiAgc3R5bGVzOiBbJzpob3N0IHsgZGlzcGxheTogYmxvY2sgfSddLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJBbGVydHMgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCdjbHJDdXJyZW50QWxlcnRDaGFuZ2UnKSBjdXJyZW50QWxlcnRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENsckFsZXJ0PihmYWxzZSk7XG4gIEBPdXRwdXQoJ2NsckN1cnJlbnRBbGVydEluZGV4Q2hhbmdlJykgY3VycmVudEFsZXJ0SW5kZXhDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oZmFsc2UpO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbXVsdGlBbGVydFNlcnZpY2U6IE11bHRpQWxlcnRTZXJ2aWNlKSB7fVxuXG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyQWxlcnQpXG4gIHNldCBhbGxBbGVydHModmFsdWU6IFF1ZXJ5TGlzdDxDbHJBbGVydD4pIHtcbiAgICB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLm1hbmFnZSh2YWx1ZSk7IC8vIHByb3ZpZGUgYWxlcnRzXG4gIH1cblxuICAvKipcbiAgICogSW5wdXQvT3V0cHV0IHRvIHN1cHBvcnQgdHdvIHdheSBiaW5kaW5nIG9uIGN1cnJlbnQgYWxlcnQgaW5kZXhcbiAgICovXG4gIEBJbnB1dCgnY2xyQ3VycmVudEFsZXJ0SW5kZXgnKVxuICBzZXQgX2lucHV0Q3VycmVudEluZGV4KGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbmRleCkgJiYgaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jdXJyZW50ID0gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRBbGVydEluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnQ7XG4gIH1cbiAgc2V0IGN1cnJlbnRBbGVydEluZGV4KGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnQgPSBpbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnB1dC9PdXRwdXQgdG8gc3VwcG9ydCB0d28gd2F5IGJpbmRpbmcgb24gY3VycmVudCBhbGVydCBpbnN0YW5jZVxuICAgKi9cbiAgQElucHV0KCdjbHJDdXJyZW50QWxlcnQnKVxuICBnZXQgY3VycmVudEFsZXJ0KCkge1xuICAgIHJldHVybiB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnRBbGVydDtcbiAgfVxuICBzZXQgY3VycmVudEFsZXJ0KGFsZXJ0OiBDbHJBbGVydCkge1xuICAgIGlmIChhbGVydCkge1xuICAgICAgdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jdXJyZW50QWxlcnQgPSBhbGVydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHdlIGFyZSBvbmx5IGRlYWxpbmcgd2l0aCBhbGVydHMgdGhhdCBoYXZlIG5vdCBiZWVuIGNsb3NlZCB5ZXRcbiAgICovXG4gIGdldCBhbGVydHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsQWxlcnRzLmZpbHRlcihhbGVydCA9PiB7XG4gICAgICByZXR1cm4gYWxlcnQuaGlkZGVuID09PSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBjdXJyZW50QWxlcnRUeXBlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMubXVsdGlBbGVydFNlcnZpY2UuY3VycmVudEFsZXJ0KSB7XG4gICAgICByZXR1cm4gdGhpcy5tdWx0aUFsZXJ0U2VydmljZS5jdXJyZW50QWxlcnQuYWxlcnRUeXBlO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmNoYW5nZXMuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50QWxlcnRJbmRleENoYW5nZS5uZXh0KGluZGV4KTtcbiAgICAgICAgdGhpcy5jdXJyZW50QWxlcnRDaGFuZ2UubmV4dCh0aGlzLm11bHRpQWxlcnRTZXJ2aWNlLmN1cnJlbnRBbGVydCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIHRoaXMubXVsdGlBbGVydFNlcnZpY2UuZGVzdHJveSgpO1xuICB9XG59XG4iLCI8IS0tXG4gIH4gQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gIH4gVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICB+IFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gIH4gVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICAtLT5cbjxkaXYgY2xhc3M9XCJhbGVydHMtd3JhcHBlclwiPlxuICA8Y2xyLWFsZXJ0cy1wYWdlciAqbmdJZj1cIm11bHRpQWxlcnRTZXJ2aWNlLmNvdW50ID4gMVwiIFtjbHJDdXJyZW50QWxlcnRJbmRleF09XCJjdXJyZW50QWxlcnRJbmRleFwiPjwvY2xyLWFsZXJ0cy1wYWdlcj5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWFsZXJ0XCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG4iXX0=