/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ViewChild } from '@angular/core';
import * as i0 from "@angular/core";
export class WrappedCell {
    ngAfterViewInit() {
        this.cellView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.cellView.destroy();
    }
}
WrappedCell.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedCell, deps: [], target: i0.ɵɵFactoryTarget.Component });
WrappedCell.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: WrappedCell, selector: "dg-wrapped-cell", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["cellPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: WrappedCell, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-cell',
                    template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['cellPortal']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlZC1jZWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC93cmFwcGVkLWNlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQWlCLFNBQVMsRUFBMkMsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVU3RyxNQUFNLE9BQU8sV0FBVztJQUl0QixlQUFlO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDOzt3R0FWVSxXQUFXOzRGQUFYLFdBQVcsa0tBTlo7Ozs7R0FJVDsyRkFFVSxXQUFXO2tCQVJ2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRTs7OztHQUlUO2lCQUNGOzhCQUUwQixXQUFXO3NCQUFuQyxTQUFTO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRW1iZWRkZWRWaWV3UmVmLCBPbkRlc3Ryb3ksIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZGctd3JhcHBlZC1jZWxsJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2NlbGxQb3J0YWw+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbn0pXG5leHBvcnQgY2xhc3MgV3JhcHBlZENlbGwgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKCdjZWxsUG9ydGFsJykgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPHZvaWQ+O1xuICBjZWxsVmlldzogRW1iZWRkZWRWaWV3UmVmPHZvaWQ+OyAvLyB0aGUgY2VsbHMgcHJvamVjdGVkIHZpZXdcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5jZWxsVmlldyA9IHRoaXMudGVtcGxhdGVSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KG51bGwpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jZWxsVmlldy5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==