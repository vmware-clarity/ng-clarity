/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Directive, Inject, NgModule, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
export class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef, focusTrapFactory, document) {
        super(elementRef, focusTrapFactory, document);
    }
}
CdkTrapFocusModule_CdkTrapFocus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, deps: [{ token: i0.ElementRef }, { token: i1.FocusTrapFactory }, { token: DOCUMENT, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
CdkTrapFocusModule_CdkTrapFocus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule_CdkTrapFocus, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cdkTrapFocus]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusTrapFactory }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
export class CdkTrapFocusModule {
}
CdkTrapFocusModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CdkTrapFocusModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule, declarations: [CdkTrapFocusModule_CdkTrapFocus], exports: [CdkTrapFocusModule_CdkTrapFocus] });
CdkTrapFocusModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: CdkTrapFocusModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CdkTrapFocusModule_CdkTrapFocus],
                    exports: [CdkTrapFocusModule_CdkTrapFocus],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXRyYXAtZm9jdXMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY2RrL2Nkay10cmFwLWZvY3VzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQW9CLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQWMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQUVsRjs7R0FFRztBQUlILE1BQU0sT0FBTywrQkFBZ0MsU0FBUSxZQUFZO0lBQy9EOzs7O09BSUc7SUFDSCxZQUNFLFVBQW1DLEVBQ25DLGdCQUFrQyxFQUNKLFFBQWE7UUFFM0MsS0FBSyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDOzs0SEFaVSwrQkFBK0IsNEVBU3BCLFFBQVE7Z0hBVG5CLCtCQUErQjsyRkFBL0IsK0JBQStCO2tCQUgzQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7aUJBQzNCOzswQkFVSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7O0FBTWhDOztHQUVHO0FBS0gsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQXRCbEIsK0JBQStCLGFBQS9CLCtCQUErQjtnSEFzQi9CLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUo5QixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLCtCQUErQixDQUFDO29CQUMvQyxPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENka1RyYXBGb2N1cywgRm9jdXNUcmFwRmFjdG9yeSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBOZ01vZHVsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBUaGlzIGlzIGp1c3QgYSBjb3B5IG9mIENka1RyYXBGb2N1cyBzbyBpdCBjYW4gYmUgdXNlZCBpbmRlcGVuZGVudCBvZiB0aGUgcmVzdCBvZiB0aGUgQTExeU1vZHVsZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Nka1RyYXBGb2N1c10nLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtUcmFwRm9jdXNNb2R1bGVfQ2RrVHJhcEZvY3VzIGV4dGVuZHMgQ2RrVHJhcEZvY3VzIHtcbiAgLyoqXG4gICAqIEluY2x1ZGUgdGhlIGNvbnN0cnVjdG9yIHRvIGZvcndhcmQgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gdGhlIGJhc2UgY2xhc3NcbiAgICogYXMgYSB3b3JrYXJvdW5kIHRvIGZpeCBBbmd1bGFyIFwiybXJtWludmFsaWRGYWN0b3J5RGVwXCIgZXJyb3IgYWZ0ZXIgdXBncmFkaW5nIHN0b3J5Ym9va1xuICAgKiBodHRwczovL2dpdGh1Yi5jb20vc3Rvcnlib29ranMvc3Rvcnlib29rL2lzc3Vlcy8yMzUzNFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZm9jdXNUcmFwRmFjdG9yeTogRm9jdXNUcmFwRmFjdG9yeSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55XG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGZvY3VzVHJhcEZhY3RvcnksIGRvY3VtZW50KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgbW9kdWxlIGFsbG93cyB1cyB0byBhdm9pZCBpbXBvcnRpbmcgYWxsIG9mIEExMXlNb2R1bGUgd2hpY2ggcmVzdWx0cyBpbiBhIHNtYWxsZXIgYXBwbGljYXRpb24gYnVuZGxlLlxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtDZGtUcmFwRm9jdXNNb2R1bGVfQ2RrVHJhcEZvY3VzXSxcbiAgZXhwb3J0czogW0Nka1RyYXBGb2N1c01vZHVsZV9DZGtUcmFwRm9jdXNdLFxufSlcbmV4cG9ydCBjbGFzcyBDZGtUcmFwRm9jdXNNb2R1bGUge31cbiJdfQ==