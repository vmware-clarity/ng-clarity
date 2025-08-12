/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
/**
 * @description
 *
 * Developers should explicitly add this service to providers; it then can be injected
 * into a constructor and used as a notifier for the `takeUntil` operator. This eliminates
 * the need for boilerplates with subscriptions, and we don't need to implement the `OnDestroy`
 * interface and teardown subscriptions there.
 *
 * This can be used as follows:
 * ```ts
 * @Component({
 *   selector: 'clr-button-group',
 *   templateUrl: 'button-group.html',
 *   providers: [ClrDestroyService],
 * })
 * export class ClrButtonGroup {
 *   constructor(public buttonGroupNewService: ButtonInGroupService, private destroy$: ClrDestroyService) {}
 *
 *   ngAfterContentInit() {
 *     this.buttonGroupNewService.changes.pipe(takeUntil(this.destroy$)).subscribe(button => this.rearrangeButton(button));
 *   }
 * }
 * ```
 */
export class ClrDestroyService extends Subject {
    ngOnDestroy() {
        this.next();
        this.complete();
    }
}
ClrDestroyService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDestroyService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ClrDestroyService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDestroyService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDestroyService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzdHJveS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvZGVzdHJveS9kZXN0cm95LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUVILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxPQUFhO0lBQ2xELFdBQVc7UUFDVCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEIsQ0FBQzs7OEdBSlUsaUJBQWlCO2tIQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogRGV2ZWxvcGVycyBzaG91bGQgZXhwbGljaXRseSBhZGQgdGhpcyBzZXJ2aWNlIHRvIHByb3ZpZGVyczsgaXQgdGhlbiBjYW4gYmUgaW5qZWN0ZWRcbiAqIGludG8gYSBjb25zdHJ1Y3RvciBhbmQgdXNlZCBhcyBhIG5vdGlmaWVyIGZvciB0aGUgYHRha2VVbnRpbGAgb3BlcmF0b3IuIFRoaXMgZWxpbWluYXRlc1xuICogdGhlIG5lZWQgZm9yIGJvaWxlcnBsYXRlcyB3aXRoIHN1YnNjcmlwdGlvbnMsIGFuZCB3ZSBkb24ndCBuZWVkIHRvIGltcGxlbWVudCB0aGUgYE9uRGVzdHJveWBcbiAqIGludGVyZmFjZSBhbmQgdGVhcmRvd24gc3Vic2NyaXB0aW9ucyB0aGVyZS5cbiAqXG4gKiBUaGlzIGNhbiBiZSB1c2VkIGFzIGZvbGxvd3M6XG4gKiBgYGB0c1xuICogQENvbXBvbmVudCh7XG4gKiAgIHNlbGVjdG9yOiAnY2xyLWJ1dHRvbi1ncm91cCcsXG4gKiAgIHRlbXBsYXRlVXJsOiAnYnV0dG9uLWdyb3VwLmh0bWwnLFxuICogICBwcm92aWRlcnM6IFtDbHJEZXN0cm95U2VydmljZV0sXG4gKiB9KVxuICogZXhwb3J0IGNsYXNzIENsckJ1dHRvbkdyb3VwIHtcbiAqICAgY29uc3RydWN0b3IocHVibGljIGJ1dHRvbkdyb3VwTmV3U2VydmljZTogQnV0dG9uSW5Hcm91cFNlcnZpY2UsIHByaXZhdGUgZGVzdHJveSQ6IENsckRlc3Ryb3lTZXJ2aWNlKSB7fVxuICpcbiAqICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICogICAgIHRoaXMuYnV0dG9uR3JvdXBOZXdTZXJ2aWNlLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShidXR0b24gPT4gdGhpcy5yZWFycmFuZ2VCdXR0b24oYnV0dG9uKSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2xyRGVzdHJveVNlcnZpY2UgZXh0ZW5kcyBTdWJqZWN0PHZvaWQ+IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgdGhpcy5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=