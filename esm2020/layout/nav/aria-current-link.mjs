/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class ClrAriaCurrentLink {
    constructor(rla) {
        this.rla = rla;
    }
    ngOnInit() {
        this.subscription = this.rla.isActiveChange.subscribe(isActive => {
            this.ariaCurrent = isActive ? 'page' : undefined;
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
ClrAriaCurrentLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAriaCurrentLink, deps: [{ token: i1.RouterLinkActive }], target: i0.ɵɵFactoryTarget.Directive });
ClrAriaCurrentLink.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrAriaCurrentLink, selector: "[clrAriaCurrentLink]", host: { properties: { "attr.aria-current": "ariaCurrent" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAriaCurrentLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrAriaCurrentLink]',
                    host: { '[attr.aria-current]': 'ariaCurrent' },
                }]
        }], ctorParameters: function () { return [{ type: i1.RouterLinkActive }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJpYS1jdXJyZW50LWxpbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvbmF2L2FyaWEtY3VycmVudC1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBcUIsTUFBTSxlQUFlLENBQUM7OztBQVE3RCxNQUFNLE9BQU8sa0JBQWtCO0lBSTdCLFlBQW9CLEdBQXFCO1FBQXJCLFFBQUcsR0FBSCxHQUFHLENBQWtCO0lBQUcsQ0FBQztJQUU3QyxRQUFRO1FBQ04sSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7OytHQWRVLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBSjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUUscUJBQXFCLEVBQUUsYUFBYSxFQUFFO2lCQUMvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTGlua0FjdGl2ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsckFyaWFDdXJyZW50TGlua10nLFxuICBob3N0OiB7ICdbYXR0ci5hcmlhLWN1cnJlbnRdJzogJ2FyaWFDdXJyZW50JyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJBcmlhQ3VycmVudExpbmsgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIGFyaWFDdXJyZW50OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBybGE6IFJvdXRlckxpbmtBY3RpdmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnJsYS5pc0FjdGl2ZUNoYW5nZS5zdWJzY3JpYmUoaXNBY3RpdmUgPT4ge1xuICAgICAgdGhpcy5hcmlhQ3VycmVudCA9IGlzQWN0aXZlID8gJ3BhZ2UnIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19