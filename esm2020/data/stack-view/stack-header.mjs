/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./stack-view";
export class ClrStackHeader {
    constructor(stackView) {
        this.stackView = stackView;
    }
}
ClrStackHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackHeader, deps: [{ token: i1.ClrStackView }], target: i0.ɵɵFactoryTarget.Component });
ClrStackHeader.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrStackHeader, selector: "clr-stack-header", ngImport: i0, template: `
    <div class="stack-header">
      <h4 class="stack-title"><ng-content></ng-content></h4>

      <span class="stack-actions">
        <ng-content select=".stack-action"></ng-content>
      </span>
    </div>
  `, isInline: true, styles: [":host{display:block}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackHeader, decorators: [{
            type: Component,
            args: [{ selector: 'clr-stack-header', template: `
    <div class="stack-header">
      <h4 class="stack-title"><ng-content></ng-content></h4>

      <span class="stack-actions">
        <ng-content select=".stack-action"></ng-content>
      </span>
    </div>
  `, styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ClrStackView }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2staGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9zdGFjay12aWV3L3N0YWNrLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQXdCMUMsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFBbUIsU0FBdUI7UUFBdkIsY0FBUyxHQUFULFNBQVMsQ0FBYztJQUFHLENBQUM7OzJHQURuQyxjQUFjOytGQUFkLGNBQWMsd0RBbEJmOzs7Ozs7OztHQVFUOzJGQVVVLGNBQWM7a0JBcEIxQixTQUFTOytCQUNFLGtCQUFrQixZQUNsQjs7Ozs7Ozs7R0FRVCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsclN0YWNrVmlldyB9IGZyb20gJy4vc3RhY2stdmlldyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1zdGFjay1oZWFkZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJzdGFjay1oZWFkZXJcIj5cbiAgICAgIDxoNCBjbGFzcz1cInN0YWNrLXRpdGxlXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvaDQ+XG5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3RhY2stYWN0aW9uc1wiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCIuc3RhY2stYWN0aW9uXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9zcGFuPlxuICAgIDwvZGl2PlxuICBgLFxuICAvLyBDdXN0b20gZWxlbWVudHMgYXJlIGlubGluZSBieSBkZWZhdWx0XG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU3RhY2tIZWFkZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhY2tWaWV3OiBDbHJTdGFja1ZpZXcpIHt9XG59XG4iXX0=