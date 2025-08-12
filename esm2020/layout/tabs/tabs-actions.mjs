/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ClrTabsActions {
    constructor() {
        this.position = 'right';
    }
}
ClrTabsActions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsActions, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrTabsActions.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTabsActions, selector: "clr-tabs-actions", inputs: { position: "position" }, host: { properties: { "class.tabs-actions": "true", "attr.position": "this.position" } }, ngImport: i0, template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs-actions',
                    template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `,
                    host: {
                        '[class.tabs-actions]': 'true',
                    },
                }]
        }], propDecorators: { position: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.position']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3RhYnMvdGFicy1hY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQWU5RCxNQUFNLE9BQU8sY0FBYztJQVgzQjtRQWNFLGFBQVEsR0FBMkIsT0FBTyxDQUFDO0tBQzVDOzsyR0FKWSxjQUFjOytGQUFkLGNBQWMsb0xBVGY7Ozs7R0FJVDsyRkFLVSxjQUFjO2tCQVgxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRTs7OztHQUlUO29CQUNELElBQUksRUFBRTt3QkFDSixzQkFBc0IsRUFBRSxNQUFNO3FCQUMvQjtpQkFDRjs4QkFJQyxRQUFRO3NCQUZQLEtBQUs7O3NCQUNMLFdBQVc7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZywgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IHR5cGUgQ2xyVGFic0FjdGlvbnNQb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10YWJzLWFjdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJ0YWJzLWFjdGlvbnMtd3JhcHBlclwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy50YWJzLWFjdGlvbnNdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUYWJzQWN0aW9ucyB7XG4gIEBJbnB1dCgpXG4gIEBIb3N0QmluZGluZygnYXR0ci5wb3NpdGlvbicpXG4gIHBvc2l0aW9uOiBDbHJUYWJzQWN0aW9uc1Bvc2l0aW9uID0gJ3JpZ2h0Jztcbn1cbiJdfQ==