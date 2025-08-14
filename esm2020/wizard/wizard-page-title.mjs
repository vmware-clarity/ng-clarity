/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ClrWizardPageTitle {
    constructor(pageTitleTemplateRef) {
        this.pageTitleTemplateRef = pageTitleTemplateRef;
    }
}
ClrWizardPageTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardPageTitle, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrWizardPageTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrWizardPageTitle, selector: "[clrPageTitle]", inputs: { headingLevel: ["clrHeadingLevel", "headingLevel"] }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardPageTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPageTitle]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { headingLevel: [{
                type: Input,
                args: ['clrHeadingLevel']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLXBhZ2UtdGl0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy93aXphcmQvd2l6YXJkLXBhZ2UtdGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBZSxNQUFNLGVBQWUsQ0FBQzs7QUFPOUQsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUFtQixvQkFBc0M7UUFBdEMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFrQjtJQUFHLENBQUM7OytHQUhsRCxrQkFBa0I7bUdBQWxCLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUg5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCO2tHQUUyQixZQUFZO3NCQUFyQyxLQUFLO3VCQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSGVhZGluZ0xldmVsIH0gZnJvbSAnLi9oZWFkaW5nLWxldmVsJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclBhZ2VUaXRsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmRQYWdlVGl0bGUge1xuICBASW5wdXQoJ2NsckhlYWRpbmdMZXZlbCcpIGhlYWRpbmdMZXZlbDogSGVhZGluZ0xldmVsO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWdlVGl0bGVUZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cbiJdfQ==