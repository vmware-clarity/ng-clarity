/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
export class ClrTreeNodeLink {
    constructor(el) {
        this.el = el;
    }
    get active() {
        return this.el.nativeElement.classList.contains('active');
    }
    activate() {
        if (this.el.nativeElement && this.el.nativeElement.click) {
            this.el.nativeElement.click();
        }
    }
}
ClrTreeNodeLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeNodeLink, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrTreeNodeLink.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrTreeNodeLink, selector: ".clr-treenode-link", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeNodeLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '.clr-treenode-link',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL3RyZWUtdmlldy90cmVlLW5vZGUtbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsTUFBTSxlQUFlLENBQUM7O0FBS3RELE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQW9CLEVBQTJCO1FBQTNCLE9BQUUsR0FBRixFQUFFLENBQXlCO0lBQUcsQ0FBQztJQUVuRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRTtZQUN4RCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7OzRHQVhVLGVBQWU7Z0dBQWYsZUFBZTsyRkFBZixlQUFlO2tCQUgzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnLmNsci10cmVlbm9kZS1saW5rJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVHJlZU5vZGVMaW5rIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG5cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJyk7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5lbC5uYXRpdmVFbGVtZW50ICYmIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGljaykge1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuICB9XG59XG4iXX0=