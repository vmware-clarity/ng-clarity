/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Inject, Input, Output, } from '@angular/core';
import { IF_ACTIVE_ID } from './if-active.service';
import * as i0 from "@angular/core";
import * as i1 from "./if-active.service";
/**********
 *
 * @class ClrIfActive
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: IfActiveService to maintain state between itself and
 * the component using it in the component template.
 *
 */
export class ClrIfActive {
    constructor(ifActiveService, id, template, container) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.template = template;
        this.container = container;
        /**********
         * @property activeChange
         *
         * @description
         * An event emitter that emits when the active property is set to allow for 2way binding when the directive is
         * used with de-structured / de-sugared syntax.
         *
         */
        this.activeChange = new EventEmitter(false);
        this.wasActive = false;
        this.checkAndUpdateView(ifActiveService.current);
        this.subscription = ifActiveService.currentChange.subscribe(newCurrentId => {
            this.checkAndUpdateView(newCurrentId);
        });
    }
    /**
     * @description
     * A property that gets/sets IfActiveService.active with value.
     *
     */
    get active() {
        return this.ifActiveService.current === this.id;
    }
    set active(value) {
        if (value) {
            this.ifActiveService.current = this.id;
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * @description
     * Function that takes a any value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     */
    updateView(value) {
        if (value) {
            this.container.createEmbeddedView(this.template);
        }
        else {
            this.container.clear();
        }
    }
    checkAndUpdateView(currentId) {
        const isNowActive = currentId === this.id;
        // only emit if the new active state is changed since last time.
        if (isNowActive !== this.wasActive) {
            this.updateView(isNowActive);
            this.activeChange.emit(isNowActive);
            this.wasActive = isNowActive;
        }
    }
}
ClrIfActive.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfActive, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrIfActive.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrIfActive, selector: "[clrIfActive]", inputs: { active: ["clrIfActive", "active"] }, outputs: { activeChange: "clrIfActiveChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrIfActive, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfActive]',
                }]
        }], ctorParameters: function () { return [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }]; }, propDecorators: { activeChange: [{
                type: Output,
                args: ['clrIfActiveChange']
            }], active: [{
                type: Input,
                args: ['clrIfActive']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWYtYWN0aXZlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWFjdGl2ZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsWUFBWSxFQUFtQixNQUFNLHFCQUFxQixDQUFDOzs7QUFNcEU7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxPQUFPLFdBQVc7SUFjdEIsWUFDVSxlQUFnQyxFQUNWLEVBQVUsRUFDaEMsUUFBMEIsRUFDMUIsU0FBMkI7UUFIM0Isb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ1YsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNoQyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUMxQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQWpCckM7Ozs7Ozs7V0FPRztRQUMwQixpQkFBWSxHQUFHLElBQUksWUFBWSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBR3JFLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFReEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFDSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFDRCxJQUFJLE1BQU0sQ0FBQyxLQUF1QjtRQUNoQyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxVQUFVLENBQUMsS0FBYztRQUN2QixJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xEO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVPLGtCQUFrQixDQUFDLFNBQWlCO1FBQzFDLE1BQU0sV0FBVyxHQUFHLFNBQVMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzFDLGdFQUFnRTtRQUNoRSxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7U0FDOUI7SUFDSCxDQUFDOzt3R0FuRVUsV0FBVyxpREFnQlosWUFBWTs0RkFoQlgsV0FBVzsyRkFBWCxXQUFXO2tCQWR2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO2lCQUMxQjs7MEJBNEJJLE1BQU07MkJBQUMsWUFBWTtxR0FQTyxZQUFZO3NCQUF4QyxNQUFNO3VCQUFDLG1CQUFtQjtnQkF3QnZCLE1BQU07c0JBRFQsS0FBSzt1QkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJRl9BQ1RJVkVfSUQsIElmQWN0aXZlU2VydmljZSB9IGZyb20gJy4vaWYtYWN0aXZlLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xySWZBY3RpdmVdJyxcbn0pXG5cbi8qKioqKioqKioqXG4gKlxuICogQGNsYXNzIENscklmQWN0aXZlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIHN0cnVjdHVyYWwgZGlyZWN0aXZlIHRoYXQgY29udHJvbHMgd2hldGhlciBvciBub3QgdGhlIGFzc29jaWF0ZWQgVGVtcGxhdGVSZWYgaXMgaW5zdGFudGlhdGVkIG9yIG5vdC5cbiAqIEl0IG1ha2VzIHVzZSBvZiBhIENvbXBvbmVudCBpbnN0YW5jZSBsZXZlbCBzZXJ2aWNlOiBJZkFjdGl2ZVNlcnZpY2UgdG8gbWFpbnRhaW4gc3RhdGUgYmV0d2VlbiBpdHNlbGYgYW5kXG4gKiB0aGUgY29tcG9uZW50IHVzaW5nIGl0IGluIHRoZSBjb21wb25lbnQgdGVtcGxhdGUuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQ2xySWZBY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKioqKioqKioqKlxuICAgKiBAcHJvcGVydHkgYWN0aXZlQ2hhbmdlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBbiBldmVudCBlbWl0dGVyIHRoYXQgZW1pdHMgd2hlbiB0aGUgYWN0aXZlIHByb3BlcnR5IGlzIHNldCB0byBhbGxvdyBmb3IgMndheSBiaW5kaW5nIHdoZW4gdGhlIGRpcmVjdGl2ZSBpc1xuICAgKiB1c2VkIHdpdGggZGUtc3RydWN0dXJlZCAvIGRlLXN1Z2FyZWQgc3ludGF4LlxuICAgKlxuICAgKi9cbiAgQE91dHB1dCgnY2xySWZBY3RpdmVDaGFuZ2UnKSBhY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KGZhbHNlKTtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIHdhc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaWZBY3RpdmVTZXJ2aWNlOiBJZkFjdGl2ZVNlcnZpY2UsXG4gICAgQEluamVjdChJRl9BQ1RJVkVfSUQpIHByaXZhdGUgaWQ6IG51bWJlcixcbiAgICBwcml2YXRlIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+LFxuICAgIHByaXZhdGUgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmXG4gICkge1xuICAgIHRoaXMuY2hlY2tBbmRVcGRhdGVWaWV3KGlmQWN0aXZlU2VydmljZS5jdXJyZW50KTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gaWZBY3RpdmVTZXJ2aWNlLmN1cnJlbnRDaGFuZ2Uuc3Vic2NyaWJlKG5ld0N1cnJlbnRJZCA9PiB7XG4gICAgICB0aGlzLmNoZWNrQW5kVXBkYXRlVmlldyhuZXdDdXJyZW50SWQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIHByb3BlcnR5IHRoYXQgZ2V0cy9zZXRzIElmQWN0aXZlU2VydmljZS5hY3RpdmUgd2l0aCB2YWx1ZS5cbiAgICpcbiAgICovXG4gIEBJbnB1dCgnY2xySWZBY3RpdmUnKVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLmlmQWN0aXZlU2VydmljZS5jdXJyZW50ID09PSB0aGlzLmlkO1xuICB9XG4gIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4gfCBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuaWZBY3RpdmVTZXJ2aWNlLmN1cnJlbnQgPSB0aGlzLmlkO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBhbnkgdmFsdWUgYW5kIGVpdGhlciBjcmVhdGVkIGFuIGVtYmVkZGVkIHZpZXcgZm9yIHRoZSBhc3NvY2lhdGVkIFZpZXdDb250YWluZXJSZWYgb3IsXG4gICAqIENsZWFycyBhbGwgdmlld3MgZnJvbSB0aGUgVmlld0NvbnRhaW5lclJlZlxuICAgKi9cbiAgdXBkYXRlVmlldyh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tBbmRVcGRhdGVWaWV3KGN1cnJlbnRJZDogbnVtYmVyKSB7XG4gICAgY29uc3QgaXNOb3dBY3RpdmUgPSBjdXJyZW50SWQgPT09IHRoaXMuaWQ7XG4gICAgLy8gb25seSBlbWl0IGlmIHRoZSBuZXcgYWN0aXZlIHN0YXRlIGlzIGNoYW5nZWQgc2luY2UgbGFzdCB0aW1lLlxuICAgIGlmIChpc05vd0FjdGl2ZSAhPT0gdGhpcy53YXNBY3RpdmUpIHtcbiAgICAgIHRoaXMudXBkYXRlVmlldyhpc05vd0FjdGl2ZSk7XG4gICAgICB0aGlzLmFjdGl2ZUNoYW5nZS5lbWl0KGlzTm93QWN0aXZlKTtcbiAgICAgIHRoaXMud2FzQWN0aXZlID0gaXNOb3dBY3RpdmU7XG4gICAgfVxuICB9XG59XG4iXX0=