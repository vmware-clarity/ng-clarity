/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ComponentFactoryResolver, ElementRef, } from '@angular/core';
import { EmptyAnchor } from './empty-anchor';
/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 * TODO - make sure these comment annotations do not break ng-packgr.
 */
export class HostWrapper {
    constructor(containerType, vcr, index = 0) {
        this.injector = vcr.injector;
        // If the host is already wrapped, we don't do anything
        if (!this.injector.get(containerType, null)) {
            const cfr = this.injector.get(ComponentFactoryResolver);
            const el = this.injector.get(ElementRef);
            // We need a new anchor, since we're projecting the current one.
            vcr.createComponent(cfr.resolveComponentFactory(EmptyAnchor));
            const factory = cfr.resolveComponentFactory(containerType);
            // Craft the element array based on what slot to use. Angular only uses the index to determine
            // which ng-content to project into, so if you have more than one ng-content you'll need to set
            // the index in the constructor appropriately
            const element = [];
            element[index] = [el.nativeElement];
            // We're assuming only one projection slot, but in more complex cases we might want to provide
            // a different array of projected elements.
            const containerRef = vcr.createComponent(factory, undefined, undefined, element);
            // We can now remove the useless anchor
            vcr.remove(0);
            // We keep the wrapper's injector to access the dependencies that weren't available before.
            this.injector = containerRef.injector;
        }
    }
    get(token, notFoundValue) {
        return this.injector.get(token, notFoundValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC13cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBRUwsd0JBQXdCLEVBQ3hCLFVBQVUsR0FLWCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0M7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBR3RCLFlBQVksYUFBc0IsRUFBRSxHQUFxQixFQUFFLEtBQUssR0FBRyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztRQUM3Qix1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUMzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXpDLGdFQUFnRTtZQUNoRSxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlELE1BQU0sT0FBTyxHQUF3QixHQUFHLENBQUMsdUJBQXVCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEYsOEZBQThGO1lBQzlGLCtGQUErRjtZQUMvRiw2Q0FBNkM7WUFDN0MsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwQyw4RkFBOEY7WUFDOUYsMkNBQTJDO1lBQzNDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakYsdUNBQXVDO1lBQ3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFZCwyRkFBMkY7WUFDM0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELEdBQUcsQ0FBSSxLQUFrQyxFQUFFLGFBQWlCO1FBQzFELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIFR5cGUsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFbXB0eUFuY2hvciB9IGZyb20gJy4vZW1wdHktYW5jaG9yJztcblxuLyoqXG4gKiBIb3N0V3JhcHBlciBtdXN0IGJlIGNhbGxlZCBpbiBPbkluaXQgdG8gZW5zdXJlIHRoYXQgdGhlIFZpZXdzIGFyZSByZWFkeS4gSWYgaXRzIGNhbGxlZCBpbiBhIGNvbnN0cnVjdG9yIHRoZSB2aWV3IGlzXG4gKiBzdGlsbCB1bmRlZmluZWQuXG4gKiBUT0RPIC0gbWFrZSBzdXJlIHRoZXNlIGNvbW1lbnQgYW5ub3RhdGlvbnMgZG8gbm90IGJyZWFrIG5nLXBhY2tnci5cbiAqL1xuZXhwb3J0IGNsYXNzIEhvc3RXcmFwcGVyPFc+IGltcGxlbWVudHMgSW5qZWN0b3Ige1xuICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcjtcblxuICBjb25zdHJ1Y3Rvcihjb250YWluZXJUeXBlOiBUeXBlPFc+LCB2Y3I6IFZpZXdDb250YWluZXJSZWYsIGluZGV4ID0gMCkge1xuICAgIHRoaXMuaW5qZWN0b3IgPSB2Y3IuaW5qZWN0b3I7XG4gICAgLy8gSWYgdGhlIGhvc3QgaXMgYWxyZWFkeSB3cmFwcGVkLCB3ZSBkb24ndCBkbyBhbnl0aGluZ1xuICAgIGlmICghdGhpcy5pbmplY3Rvci5nZXQoY29udGFpbmVyVHlwZSwgbnVsbCkpIHtcbiAgICAgIGNvbnN0IGNmciA9IHRoaXMuaW5qZWN0b3IuZ2V0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcik7XG4gICAgICBjb25zdCBlbCA9IHRoaXMuaW5qZWN0b3IuZ2V0KEVsZW1lbnRSZWYpO1xuXG4gICAgICAvLyBXZSBuZWVkIGEgbmV3IGFuY2hvciwgc2luY2Ugd2UncmUgcHJvamVjdGluZyB0aGUgY3VycmVudCBvbmUuXG4gICAgICB2Y3IuY3JlYXRlQ29tcG9uZW50KGNmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShFbXB0eUFuY2hvcikpO1xuICAgICAgY29uc3QgZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxXPiA9IGNmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb250YWluZXJUeXBlKTtcbiAgICAgIC8vIENyYWZ0IHRoZSBlbGVtZW50IGFycmF5IGJhc2VkIG9uIHdoYXQgc2xvdCB0byB1c2UuIEFuZ3VsYXIgb25seSB1c2VzIHRoZSBpbmRleCB0byBkZXRlcm1pbmVcbiAgICAgIC8vIHdoaWNoIG5nLWNvbnRlbnQgdG8gcHJvamVjdCBpbnRvLCBzbyBpZiB5b3UgaGF2ZSBtb3JlIHRoYW4gb25lIG5nLWNvbnRlbnQgeW91J2xsIG5lZWQgdG8gc2V0XG4gICAgICAvLyB0aGUgaW5kZXggaW4gdGhlIGNvbnN0cnVjdG9yIGFwcHJvcHJpYXRlbHlcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBbXTtcbiAgICAgIGVsZW1lbnRbaW5kZXhdID0gW2VsLm5hdGl2ZUVsZW1lbnRdO1xuICAgICAgLy8gV2UncmUgYXNzdW1pbmcgb25seSBvbmUgcHJvamVjdGlvbiBzbG90LCBidXQgaW4gbW9yZSBjb21wbGV4IGNhc2VzIHdlIG1pZ2h0IHdhbnQgdG8gcHJvdmlkZVxuICAgICAgLy8gYSBkaWZmZXJlbnQgYXJyYXkgb2YgcHJvamVjdGVkIGVsZW1lbnRzLlxuICAgICAgY29uc3QgY29udGFpbmVyUmVmID0gdmNyLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZWxlbWVudCk7XG4gICAgICAvLyBXZSBjYW4gbm93IHJlbW92ZSB0aGUgdXNlbGVzcyBhbmNob3JcbiAgICAgIHZjci5yZW1vdmUoMCk7XG5cbiAgICAgIC8vIFdlIGtlZXAgdGhlIHdyYXBwZXIncyBpbmplY3RvciB0byBhY2Nlc3MgdGhlIGRlcGVuZGVuY2llcyB0aGF0IHdlcmVuJ3QgYXZhaWxhYmxlIGJlZm9yZS5cbiAgICAgIHRoaXMuaW5qZWN0b3IgPSBjb250YWluZXJSZWYuaW5qZWN0b3I7XG4gICAgfVxuICB9XG5cbiAgZ2V0PFQ+KHRva2VuOiBUeXBlPFQ+IHwgSW5qZWN0aW9uVG9rZW48VD4sIG5vdEZvdW5kVmFsdWU/OiBUKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuaW5qZWN0b3IuZ2V0KHRva2VuLCBub3RGb3VuZFZhbHVlKTtcbiAgfVxufVxuIl19