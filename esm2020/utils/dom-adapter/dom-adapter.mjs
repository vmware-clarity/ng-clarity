/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * If we someday want to be able to render the datagrid in a webworker,
 * this is where we would test if we're in headless mode. Right now it's not testing anything, but any access
 * to native DOM elements' methods and properties in the Datagrid happens here.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class DomAdapter {
    /*
      We clone the element and take its measurements from outside the grid
      so we don't trigger reflow for the whole datagrid.
    */
    userDefinedWidth(element) {
        const clonedElement = element.cloneNode(true);
        if (clonedElement.id) {
            clonedElement.id = clonedElement.id + '-clone';
        }
        clonedElement.classList.add('datagrid-cell-width-zero');
        document.body.appendChild(clonedElement);
        const userDefinedWidth = this.clientRect(clonedElement).width;
        clonedElement.remove();
        return userDefinedWidth;
    }
    scrollBarWidth(element) {
        return element.offsetWidth - element.clientWidth;
    }
    scrollWidth(element) {
        return element.scrollWidth || 0;
    }
    computedHeight(element) {
        return parseInt(getComputedStyle(element).getPropertyValue('height'), 10);
    }
    clientRect(element) {
        const elementClientRect = element.getBoundingClientRect();
        return {
            top: parseInt(elementClientRect.top, 10),
            bottom: parseInt(elementClientRect.bottom, 10),
            left: parseInt(elementClientRect.left, 10),
            right: parseInt(elementClientRect.right, 10),
            width: parseInt(elementClientRect.width, 10),
            height: parseInt(elementClientRect.height, 10),
        };
    }
    minWidth(element) {
        return parseInt(getComputedStyle(element).getPropertyValue('min-width'), 10);
    }
    focus(element) {
        element.focus();
    }
}
DomAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DomAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DomAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DomAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DomAdapter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLWFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9kb20tYWRhcHRlci9kb20tYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVIOzs7O0dBSUc7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sVUFBVTtJQUNyQjs7O01BR0U7SUFDRixnQkFBZ0IsQ0FBQyxPQUFvQjtRQUNuQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBZ0IsQ0FBQztRQUM3RCxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUU7WUFDcEIsYUFBYSxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQztTQUNoRDtRQUNELGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM5RCxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQVk7UUFDekIsT0FBTyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDbkQsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxPQUFZO1FBQ3pCLE9BQU8sUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWTtRQUNyQixNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzFELE9BQU87WUFDTCxHQUFHLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDeEMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQzlDLElBQUksRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMxQyxLQUFLLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDNUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQzVDLE1BQU0sRUFBRSxRQUFRLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztTQUNwQyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUFZO1FBQ25CLE9BQU8sUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBWTtRQUNoQixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsQ0FBQzs7dUdBL0NVLFVBQVU7MkdBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUR0QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG4vKlxuICogSWYgd2Ugc29tZWRheSB3YW50IHRvIGJlIGFibGUgdG8gcmVuZGVyIHRoZSBkYXRhZ3JpZCBpbiBhIHdlYndvcmtlcixcbiAqIHRoaXMgaXMgd2hlcmUgd2Ugd291bGQgdGVzdCBpZiB3ZSdyZSBpbiBoZWFkbGVzcyBtb2RlLiBSaWdodCBub3cgaXQncyBub3QgdGVzdGluZyBhbnl0aGluZywgYnV0IGFueSBhY2Nlc3NcbiAqIHRvIG5hdGl2ZSBET00gZWxlbWVudHMnIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgaW4gdGhlIERhdGFncmlkIGhhcHBlbnMgaGVyZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEb21BZGFwdGVyIHtcbiAgLyogXG4gICAgV2UgY2xvbmUgdGhlIGVsZW1lbnQgYW5kIHRha2UgaXRzIG1lYXN1cmVtZW50cyBmcm9tIG91dHNpZGUgdGhlIGdyaWRcbiAgICBzbyB3ZSBkb24ndCB0cmlnZ2VyIHJlZmxvdyBmb3IgdGhlIHdob2xlIGRhdGFncmlkLlxuICAqL1xuICB1c2VyRGVmaW5lZFdpZHRoKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICBjb25zdCBjbG9uZWRFbGVtZW50ID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKGNsb25lZEVsZW1lbnQuaWQpIHtcbiAgICAgIGNsb25lZEVsZW1lbnQuaWQgPSBjbG9uZWRFbGVtZW50LmlkICsgJy1jbG9uZSc7XG4gICAgfVxuICAgIGNsb25lZEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGF0YWdyaWQtY2VsbC13aWR0aC16ZXJvJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjbG9uZWRFbGVtZW50KTtcbiAgICBjb25zdCB1c2VyRGVmaW5lZFdpZHRoID0gdGhpcy5jbGllbnRSZWN0KGNsb25lZEVsZW1lbnQpLndpZHRoO1xuICAgIGNsb25lZEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHVzZXJEZWZpbmVkV2lkdGg7XG4gIH1cblxuICBzY3JvbGxCYXJXaWR0aChlbGVtZW50OiBhbnkpIHtcbiAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRXaWR0aCAtIGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gIH1cblxuICBzY3JvbGxXaWR0aChlbGVtZW50OiBhbnkpIHtcbiAgICByZXR1cm4gZWxlbWVudC5zY3JvbGxXaWR0aCB8fCAwO1xuICB9XG5cbiAgY29tcHV0ZWRIZWlnaHQoZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSwgMTApO1xuICB9XG5cbiAgY2xpZW50UmVjdChlbGVtZW50OiBhbnkpOiBET01SZWN0IHtcbiAgICBjb25zdCBlbGVtZW50Q2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogcGFyc2VJbnQoZWxlbWVudENsaWVudFJlY3QudG9wLCAxMCksXG4gICAgICBib3R0b206IHBhcnNlSW50KGVsZW1lbnRDbGllbnRSZWN0LmJvdHRvbSwgMTApLFxuICAgICAgbGVmdDogcGFyc2VJbnQoZWxlbWVudENsaWVudFJlY3QubGVmdCwgMTApLFxuICAgICAgcmlnaHQ6IHBhcnNlSW50KGVsZW1lbnRDbGllbnRSZWN0LnJpZ2h0LCAxMCksXG4gICAgICB3aWR0aDogcGFyc2VJbnQoZWxlbWVudENsaWVudFJlY3Qud2lkdGgsIDEwKSxcbiAgICAgIGhlaWdodDogcGFyc2VJbnQoZWxlbWVudENsaWVudFJlY3QuaGVpZ2h0LCAxMCksXG4gICAgfSBhcyBET01SZWN0O1xuICB9XG5cbiAgbWluV2lkdGgoZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKCdtaW4td2lkdGgnKSwgMTApO1xuICB9XG5cbiAgZm9jdXMoZWxlbWVudDogYW55KTogdm9pZCB7XG4gICAgZWxlbWVudC5mb2N1cygpO1xuICB9XG59XG4iXX0=