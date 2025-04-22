/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Keys } from '../utils/enums/keys.enum';
import { normalizeKey } from '../utils/focus/key-focus/util';
import * as i0 from "@angular/core";
export class ModalStackService {
    constructor(platformId) {
        this.platformId = platformId;
        this.modalStack = [];
        this.keyUpEventListener = this.onKeyUp.bind(this);
    }
    trackModalOpen(openedModal) {
        if (this.modalStack.includes(openedModal) === false) {
            this.modalStack.unshift(openedModal);
        }
        if (isPlatformBrowser(this.platformId)) {
            document.body.addEventListener('keyup', this.keyUpEventListener);
        }
    }
    trackModalClose(closedModal) {
        const closedModalIndex = this.modalStack.indexOf(closedModal);
        if (closedModalIndex > -1) {
            this.modalStack.splice(closedModalIndex, 1);
        }
        if (this.modalStack.length === 0 && isPlatformBrowser(this.platformId)) {
            document.body.removeEventListener('keyup', this.keyUpEventListener);
        }
    }
    onKeyUp(event) {
        if (this.modalStack.length && normalizeKey(event.key) === Keys.Escape) {
            // We blur the active element because escaping with an input element in focus could cause
            // an ExpressionChangedAfterItHasBeenCheckedError for the touched state. (CDE-1662)
            document.activeElement.blur();
            this.modalStack[0].close();
        }
    }
}
ModalStackService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ModalStackService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ModalStackService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ModalStackService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ModalStackService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtc3RhY2suc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL21vZGFsL21vZGFsLXN0YWNrLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQzs7QUFPN0QsTUFBTSxPQUFPLGlCQUFpQjtJQUk1QixZQUFrRCxVQUFtQjtRQUFuQixlQUFVLEdBQVYsVUFBVSxDQUFTO1FBSHBELGVBQVUsR0FBZSxFQUFFLENBQUM7UUFDNUIsdUJBQWtCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFVSxDQUFDO0lBRXpFLGNBQWMsQ0FBQyxXQUFxQjtRQUNsQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3RDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ2xFO0lBQ0gsQ0FBQztJQUVELGVBQWUsQ0FBQyxXQUFxQjtRQUNuQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTlELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdEUsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRU8sT0FBTyxDQUFDLEtBQW9CO1FBQ2xDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3JFLHlGQUF5RjtZQUN6RixtRkFBbUY7WUFDbEYsUUFBUSxDQUFDLGFBQTZCLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM1QjtJQUNILENBQUM7OzhHQXBDVSxpQkFBaUIsa0JBSVIsV0FBVztrSEFKcEIsaUJBQWlCLGNBREosTUFBTTsyRkFDbkIsaUJBQWlCO2tCQUQ3QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7MEJBS25CLE1BQU07MkJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IG5vcm1hbGl6ZUtleSB9IGZyb20gJy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBDbG9zYWJsZSB7XG4gIGNsb3NlKCk6IHZvaWQ7XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTW9kYWxTdGFja1NlcnZpY2Uge1xuICBwcml2YXRlIHJlYWRvbmx5IG1vZGFsU3RhY2s6IENsb3NhYmxlW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBrZXlVcEV2ZW50TGlzdGVuZXIgPSB0aGlzLm9uS2V5VXAuYmluZCh0aGlzKTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHJlYWRvbmx5IHBsYXRmb3JtSWQ6IHVua25vd24pIHt9XG5cbiAgdHJhY2tNb2RhbE9wZW4ob3BlbmVkTW9kYWw6IENsb3NhYmxlKSB7XG4gICAgaWYgKHRoaXMubW9kYWxTdGFjay5pbmNsdWRlcyhvcGVuZWRNb2RhbCkgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm1vZGFsU3RhY2sudW5zaGlmdChvcGVuZWRNb2RhbCk7XG4gICAgfVxuXG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleVVwRXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgdHJhY2tNb2RhbENsb3NlKGNsb3NlZE1vZGFsOiBDbG9zYWJsZSkge1xuICAgIGNvbnN0IGNsb3NlZE1vZGFsSW5kZXggPSB0aGlzLm1vZGFsU3RhY2suaW5kZXhPZihjbG9zZWRNb2RhbCk7XG5cbiAgICBpZiAoY2xvc2VkTW9kYWxJbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm1vZGFsU3RhY2suc3BsaWNlKGNsb3NlZE1vZGFsSW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGFsU3RhY2subGVuZ3RoID09PSAwICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmtleVVwRXZlbnRMaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW9kYWxTdGFjay5sZW5ndGggJiYgbm9ybWFsaXplS2V5KGV2ZW50LmtleSkgPT09IEtleXMuRXNjYXBlKSB7XG4gICAgICAvLyBXZSBibHVyIHRoZSBhY3RpdmUgZWxlbWVudCBiZWNhdXNlIGVzY2FwaW5nIHdpdGggYW4gaW5wdXQgZWxlbWVudCBpbiBmb2N1cyBjb3VsZCBjYXVzZVxuICAgICAgLy8gYW4gRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvciBmb3IgdGhlIHRvdWNoZWQgc3RhdGUuIChDREUtMTY2MilcbiAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5ibHVyKCk7XG5cbiAgICAgIHRoaXMubW9kYWxTdGFja1swXS5jbG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIl19