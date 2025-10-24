/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./wizard-navigation.service";
export class HeaderActionService {
    constructor(navService) {
        this.navService = navService;
    }
    get wizardHasHeaderActions() {
        const wizardHdrActions = this.wizardHeaderActions;
        if (!wizardHdrActions) {
            return false;
        }
        return wizardHdrActions.toArray().length > 0;
    }
    get currentPageHasHeaderActions() {
        return this.navService.currentPage ? this.navService.currentPage.hasHeaderActions : false;
    }
    get showWizardHeaderActions() {
        return !this.currentPageHasHeaderActions && this.wizardHasHeaderActions;
    }
    get displayHeaderActionsWrapper() {
        return this.currentPageHasHeaderActions || this.wizardHasHeaderActions;
    }
}
HeaderActionService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: HeaderActionService, deps: [{ token: i1.WizardNavigationService }], target: i0.ɵɵFactoryTarget.Injectable });
HeaderActionService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: HeaderActionService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: HeaderActionService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.WizardNavigationService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLWFjdGlvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC9wcm92aWRlcnMvaGVhZGVyLWFjdGlvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQWEsTUFBTSxlQUFlLENBQUM7OztBQU10RCxNQUFNLE9BQU8sbUJBQW1CO0lBTTlCLFlBQW1CLFVBQW1DO1FBQW5DLGVBQVUsR0FBVixVQUFVLENBQXlCO0lBQUcsQ0FBQztJQUUxRCxJQUFJLHNCQUFzQjtRQUN4QixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSwyQkFBMkI7UUFDN0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM1RixDQUFDO0lBRUQsSUFBSSx1QkFBdUI7UUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQywyQkFBMkIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDMUUsQ0FBQztJQUVELElBQUksMkJBQTJCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLDJCQUEyQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUN6RSxDQUFDOztnSEExQlUsbUJBQW1CO29IQUFuQixtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENscldpemFyZEhlYWRlckFjdGlvbiB9IGZyb20gJy4uL3dpemFyZC1oZWFkZXItYWN0aW9uJztcbmltcG9ydCB7IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi93aXphcmQtbmF2aWdhdGlvbi5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEhlYWRlckFjdGlvblNlcnZpY2Uge1xuICAvLyB0aGlzIHNlcnZpY2UgY29tbXVuaWNhdGVzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBwcmVzZW5jZS9kaXNwbGF5IG9mIGhlYWRlciBhY3Rpb25zXG4gIC8vIGFjcm9zcyB0aGUgd2l6YXJkXG5cbiAgd2l6YXJkSGVhZGVyQWN0aW9uczogUXVlcnlMaXN0PENscldpemFyZEhlYWRlckFjdGlvbj47XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5hdlNlcnZpY2U6IFdpemFyZE5hdmlnYXRpb25TZXJ2aWNlKSB7fVxuXG4gIGdldCB3aXphcmRIYXNIZWFkZXJBY3Rpb25zKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHdpemFyZEhkckFjdGlvbnMgPSB0aGlzLndpemFyZEhlYWRlckFjdGlvbnM7XG4gICAgaWYgKCF3aXphcmRIZHJBY3Rpb25zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB3aXphcmRIZHJBY3Rpb25zLnRvQXJyYXkoKS5sZW5ndGggPiAwO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQYWdlSGFzSGVhZGVyQWN0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlID8gdGhpcy5uYXZTZXJ2aWNlLmN1cnJlbnRQYWdlLmhhc0hlYWRlckFjdGlvbnMgOiBmYWxzZTtcbiAgfVxuXG4gIGdldCBzaG93V2l6YXJkSGVhZGVyQWN0aW9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuY3VycmVudFBhZ2VIYXNIZWFkZXJBY3Rpb25zICYmIHRoaXMud2l6YXJkSGFzSGVhZGVyQWN0aW9ucztcbiAgfVxuXG4gIGdldCBkaXNwbGF5SGVhZGVyQWN0aW9uc1dyYXBwZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VIYXNIZWFkZXJBY3Rpb25zIHx8IHRoaXMud2l6YXJkSGFzSGVhZGVyQWN0aW9ucztcbiAgfVxufVxuIl19