/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren } from '@angular/core';
import { ClrSignpost } from '../../popover/signpost/signpost';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { WrappedCell } from './wrapped-cell';
import * as i0 from "@angular/core";
export class ClrDatagridCell {
    constructor(vcr) {
        this.vcr = vcr;
    }
    get _view() {
        return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
    }
    ngOnInit() {
        this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
    }
}
ClrDatagridCell.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridCell, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridCell.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridCell, selector: "clr-dg-cell", host: { attributes: { "role": "gridcell" }, properties: { "class.datagrid-cell": "true", "class.datagrid-signpost-trigger": "signpost.length > 0" } }, queries: [{ propertyName: "signpost", predicate: ClrSignpost }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridCell, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-cell',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.datagrid-cell]': 'true',
                        '[class.datagrid-signpost-trigger]': 'signpost.length > 0',
                        role: 'gridcell',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; }, propDecorators: { signpost: [{
                type: ContentChildren,
                args: [ClrSignpost]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtY2VsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFpRCxNQUFNLGVBQWUsQ0FBQztBQUUxRyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFXN0MsTUFBTSxPQUFPLGVBQWU7SUFhMUIsWUFBb0IsR0FBcUI7UUFBckIsUUFBRyxHQUFILEdBQUcsQ0FBa0I7SUFBRyxDQUFDO0lBRTdDLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDbEUsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEUsQ0FBQzs7NEdBckJVLGVBQWU7Z0dBQWYsZUFBZSxtT0FTVCxXQUFXLDZCQWhCbEIsMkJBQTJCOzJGQU8xQixlQUFlO2tCQVQzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osdUJBQXVCLEVBQUUsTUFBTTt3QkFDL0IsbUNBQW1DLEVBQUUscUJBQXFCO3dCQUMxRCxJQUFJLEVBQUUsVUFBVTtxQkFDakI7aUJBQ0Y7dUdBVStCLFFBQVE7c0JBQXJDLGVBQWU7dUJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEluamVjdG9yLCBPbkluaXQsIFF1ZXJ5TGlzdCwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJTaWducG9zdCB9IGZyb20gJy4uLy4uL3BvcG92ZXIvc2lnbnBvc3Qvc2lnbnBvc3QnO1xuaW1wb3J0IHsgSG9zdFdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlscy9ob3N0LXdyYXBwaW5nL2hvc3Qtd3JhcHBlcic7XG5pbXBvcnQgeyBXcmFwcGVkQ2VsbCB9IGZyb20gJy4vd3JhcHBlZC1jZWxsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLWNlbGwnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1jZWxsXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmRhdGFncmlkLXNpZ25wb3N0LXRyaWdnZXJdJzogJ3NpZ25wb3N0Lmxlbmd0aCA+IDAnLFxuICAgIHJvbGU6ICdncmlkY2VsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkQ2VsbCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8qKioqKioqKipcbiAgICogQHByb3BlcnR5IHNpZ25wb3N0XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBAQ29udGVudENoaWxkIGlzIHVzZWQgdG8gZGV0ZWN0IHRoZSBwcmVzZW5jZSBvZiBhIFNpZ25wb3N0IGluIHRoZSBwcm9qZWN0ZWQgY29udGVudC5cbiAgICogT24gdGhlIGhvc3QsIHdlIHNldCB0aGUgLmRhdGFncmlkLXNpZ25wb3N0LXRyaWdnZXIgY2xhc3Mgb24gdGhlIGNlbGwgd2hlbiBzaWducG9zdC5sZW5ndGggaXMgZ3JlYXRlciB0aGFuIDAuXG4gICAqXG4gICAqL1xuICBAQ29udGVudENoaWxkcmVuKENsclNpZ25wb3N0KSBzaWducG9zdDogUXVlcnlMaXN0PENsclNpZ25wb3N0PjtcblxuICBwcml2YXRlIHdyYXBwZWRJbmplY3RvcjogSW5qZWN0b3I7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB2Y3I6IFZpZXdDb250YWluZXJSZWYpIHt9XG5cbiAgZ2V0IF92aWV3KCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWRJbmplY3Rvci5nZXQoV3JhcHBlZENlbGwsIHRoaXMudmNyKS5jZWxsVmlldztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMud3JhcHBlZEluamVjdG9yID0gbmV3IEhvc3RXcmFwcGVyKFdyYXBwZWRDZWxsLCB0aGlzLnZjcik7XG4gIH1cbn1cbiJdfQ==