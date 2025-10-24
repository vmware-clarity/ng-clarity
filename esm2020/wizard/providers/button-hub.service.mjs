/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class ButtonHubService {
    constructor() {
        this.buttonsReady = false;
        this._previousBtnClicked = new Subject();
        this._nextBtnClicked = new Subject();
        this._dangerBtnClicked = new Subject();
        this._cancelBtnClicked = new Subject();
        this._finishBtnClicked = new Subject();
        this._customBtnClicked = new Subject();
    }
    get previousBtnClicked() {
        return this._previousBtnClicked.asObservable();
    }
    get nextBtnClicked() {
        return this._nextBtnClicked.asObservable();
    }
    get dangerBtnClicked() {
        return this._dangerBtnClicked.asObservable();
    }
    get cancelBtnClicked() {
        return this._cancelBtnClicked.asObservable();
    }
    get finishBtnClicked() {
        return this._finishBtnClicked.asObservable();
    }
    get customBtnClicked() {
        return this._customBtnClicked.asObservable();
    }
    buttonClicked(buttonType) {
        if ('previous' === buttonType) {
            this._previousBtnClicked.next();
        }
        else if ('next' === buttonType) {
            this._nextBtnClicked.next();
        }
        else if ('finish' === buttonType) {
            this._finishBtnClicked.next();
        }
        else if ('danger' === buttonType) {
            this._dangerBtnClicked.next();
        }
        else if ('cancel' === buttonType) {
            this._cancelBtnClicked.next();
        }
        else {
            this._customBtnClicked.next(buttonType);
        }
    }
}
ButtonHubService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonHubService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ButtonHubService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonHubService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ButtonHubService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWh1Yi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvd2l6YXJkL3Byb3ZpZGVycy9idXR0b24taHViLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRy9CLE1BQU0sT0FBTyxnQkFBZ0I7SUFEN0I7UUFFRSxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUViLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDMUMsb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3RDLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDeEMsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUN4QyxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQ3hDLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7S0F5Q25EO0lBdkNDLElBQUksa0JBQWtCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsYUFBYSxDQUFDLFVBQWtCO1FBQzlCLElBQUksVUFBVSxLQUFLLFVBQVUsRUFBRTtZQUM3QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDakM7YUFBTSxJQUFJLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM3QjthQUFNLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNsQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDL0I7YUFBTSxJQUFJLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO1NBQy9CO2FBQU0sSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjthQUFNO1lBQ0wsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7OzZHQWhEVSxnQkFBZ0I7aUhBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCdXR0b25IdWJTZXJ2aWNlIHtcbiAgYnV0dG9uc1JlYWR5ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfcHJldmlvdXNCdG5DbGlja2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfbmV4dEJ0bkNsaWNrZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9kYW5nZXJCdG5DbGlja2VkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfY2FuY2VsQnRuQ2xpY2tlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2ZpbmlzaEJ0bkNsaWNrZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9jdXN0b21CdG5DbGlja2VkID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIGdldCBwcmV2aW91c0J0bkNsaWNrZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzQnRuQ2xpY2tlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBuZXh0QnRuQ2xpY2tlZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fbmV4dEJ0bkNsaWNrZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXQgZGFuZ2VyQnRuQ2xpY2tlZCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZGFuZ2VyQnRuQ2xpY2tlZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBjYW5jZWxCdG5DbGlja2VkKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9jYW5jZWxCdG5DbGlja2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGZpbmlzaEJ0bkNsaWNrZWQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbmlzaEJ0bkNsaWNrZWQuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXQgY3VzdG9tQnRuQ2xpY2tlZCgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9jdXN0b21CdG5DbGlja2VkLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgYnV0dG9uQ2xpY2tlZChidXR0b25UeXBlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoJ3ByZXZpb3VzJyA9PT0gYnV0dG9uVHlwZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNCdG5DbGlja2VkLm5leHQoKTtcbiAgICB9IGVsc2UgaWYgKCduZXh0JyA9PT0gYnV0dG9uVHlwZSkge1xuICAgICAgdGhpcy5fbmV4dEJ0bkNsaWNrZWQubmV4dCgpO1xuICAgIH0gZWxzZSBpZiAoJ2ZpbmlzaCcgPT09IGJ1dHRvblR5cGUpIHtcbiAgICAgIHRoaXMuX2ZpbmlzaEJ0bkNsaWNrZWQubmV4dCgpO1xuICAgIH0gZWxzZSBpZiAoJ2RhbmdlcicgPT09IGJ1dHRvblR5cGUpIHtcbiAgICAgIHRoaXMuX2RhbmdlckJ0bkNsaWNrZWQubmV4dCgpO1xuICAgIH0gZWxzZSBpZiAoJ2NhbmNlbCcgPT09IGJ1dHRvblR5cGUpIHtcbiAgICAgIHRoaXMuX2NhbmNlbEJ0bkNsaWNrZWQubmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jdXN0b21CdG5DbGlja2VkLm5leHQoYnV0dG9uVHlwZSk7XG4gICAgfVxuICB9XG59XG4iXX0=