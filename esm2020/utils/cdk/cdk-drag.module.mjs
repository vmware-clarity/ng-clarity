import { CDK_DRAG_CONFIG, CDK_DROP_LIST, CdkDrag } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Directive, Inject, NgModule, Optional, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/cdk/drag-drop";
/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
export class CdkDragModule_CdkDrag extends CdkDrag {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef, dropContainer, document, ngZone, viewContainerRef, config, dir, dragDrop, changeDetectorRef) {
        super(elementRef, dropContainer, document, ngZone, viewContainerRef, config, dir, dragDrop, changeDetectorRef);
    }
}
CdkDragModule_CdkDrag.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule_CdkDrag, deps: [{ token: i0.ElementRef }, { token: CDK_DROP_LIST, optional: true }, { token: DOCUMENT, optional: true }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: CDK_DRAG_CONFIG, optional: true }, { token: i1.Directionality }, { token: i2.DragDrop }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
CdkDragModule_CdkDrag.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: CdkDragModule_CdkDrag, selector: "[cdkDrag]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule_CdkDrag, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkDrag]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_DROP_LIST]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CDK_DRAG_CONFIG]
                }] }, { type: i1.Directionality }, { type: i2.DragDrop }, { type: i0.ChangeDetectorRef }]; } });
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
export class CdkDragModule {
}
CdkDragModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CdkDragModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule, declarations: [CdkDragModule_CdkDrag], exports: [CdkDragModule_CdkDrag] });
CdkDragModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkDragModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkDragModule_CdkDrag],
                    exports: [CdkDragModule_CdkDrag],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRyYWcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY2RrL2Nkay1kcmFnLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQTRCLE1BQU0sd0JBQXdCLENBQUM7QUFDM0csT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFFTCxTQUFTLEVBRVQsTUFBTSxFQUNOLFFBQVEsRUFFUixRQUFRLEdBRVQsTUFBTSxlQUFlLENBQUM7Ozs7QUFFdkI7O0dBRUc7QUFJSCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsT0FBTztJQUNoRDs7OztPQUlHO0lBQ0gsWUFDRSxVQUFtQyxFQUNBLGFBQWtCLEVBQ3ZCLFFBQWEsRUFDM0MsTUFBYyxFQUNkLGdCQUFrQyxFQUNHLE1BQXNCLEVBQzNELEdBQW1CLEVBQ25CLFFBQWtCLEVBQ2xCLGlCQUFvQztRQUVwQyxLQUFLLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDakgsQ0FBQzs7a0hBbEJVLHFCQUFxQiw0Q0FRVixhQUFhLDZCQUNiLFFBQVEsbUZBR1IsZUFBZTtzR0FaMUIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCOzswQkFTSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLGFBQWE7OzBCQUNoQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7OzBCQUczQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLGVBQWU7O0FBU3ZDOztHQUVHO0FBS0gsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkE1QmIscUJBQXFCLGFBQXJCLHFCQUFxQjsyR0E0QnJCLGFBQWE7MkZBQWIsYUFBYTtrQkFKekIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7aUJBQ2pDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IENES19EUkFHX0NPTkZJRywgQ0RLX0RST1BfTElTVCwgQ2RrRHJhZywgRHJhZ0Ryb3AsIERyYWdEcm9wQ29uZmlnIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIE5nTW9kdWxlLFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBUaGlzIGlzIGp1c3QgYSBjb3B5IG9mIENka0RyYWcgc28gaXQgY2FuIGJlIHVzZWQgaW5kZXBlbmRlbnQgb2YgdGhlIHJlc3Qgb2YgdGhlIENka0RyYWdEcm9wTW9kdWxlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2RrRHJhZ10nLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtEcmFnTW9kdWxlX0Nka0RyYWcgZXh0ZW5kcyBDZGtEcmFnIHtcbiAgLyoqXG4gICAqIEluY2x1ZGUgdGhlIGNvbnN0cnVjdG9yIHRvIGZvcndhcmQgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gdGhlIGJhc2UgY2xhc3NcbiAgICogYXMgYSB3b3JrYXJvdW5kIHRvIGZpeCBBbmd1bGFyIFwiybXJtWludmFsaWRGYWN0b3J5RGVwXCIgZXJyb3IgYWZ0ZXIgdXBncmFkaW5nIHN0b3J5Ym9va1xuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3Rvcnlib29ranMvc3Rvcnlib29rL2lzc3Vlcy8yMzUzNFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChDREtfRFJPUF9MSVNUKSBkcm9wQ29udGFpbmVyOiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ0RLX0RSQUdfQ09ORklHKSBjb25maWc6IERyYWdEcm9wQ29uZmlnLFxuICAgIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgZHJhZ0Ryb3A6IERyYWdEcm9wLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkcm9wQ29udGFpbmVyLCBkb2N1bWVudCwgbmdab25lLCB2aWV3Q29udGFpbmVyUmVmLCBjb25maWcsIGRpciwgZHJhZ0Ryb3AsIGNoYW5nZURldGVjdG9yUmVmKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGFsbG93cyB1cyB0byBhdm9pZCBpbXBvcnRpbmcgYWxsIG9mIENka0RyYWdEcm9wTW9kdWxlIHdoaWNoIHJlc3VsdHMgaW4gYSBzbWFsbGVyIGFwcGxpY2F0aW9uIGJ1bmRsZS5cbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbQ2RrRHJhZ01vZHVsZV9DZGtEcmFnXSxcbiAgZXhwb3J0czogW0Nka0RyYWdNb2R1bGVfQ2RrRHJhZ10sXG59KVxuZXhwb3J0IGNsYXNzIENka0RyYWdNb2R1bGUge31cbiJdfQ==