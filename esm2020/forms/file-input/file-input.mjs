/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostBinding, HostListener, Optional, Self, } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrFileInputContainer } from './file-input-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../utils";
export class ClrFileInput extends WrappedFormControl {
    constructor(injector, renderer, viewContainerRef, elementRef, control, commonStrings) {
        super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);
        this.elementRef = elementRef;
        this.control = control;
        this.commonStrings = commonStrings;
        this.selection = undefined;
    }
    get disabled() {
        return this.control && this.control.disabled;
    }
    handleChange() {
        this.updateSelection();
    }
    updateSelection() {
        const files = this.elementRef.nativeElement.files;
        let selectionButtonLabel;
        let clearFilesButtonLabel;
        if (files?.length === 1) {
            const filename = files[0].name;
            selectionButtonLabel = filename;
            clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFile, {
                FILE: filename,
            });
        }
        else if (files?.length > 1) {
            const fileCount = files.length.toString();
            selectionButtonLabel = this.commonStrings.parse(this.commonStrings.keys.fileCount, {
                COUNT: fileCount,
            });
            clearFilesButtonLabel = this.commonStrings.parse(this.commonStrings.keys.clearFiles, {
                COUNT: fileCount,
            });
        }
        this.selection = {
            fileCount: files.length,
            buttonLabel: selectionButtonLabel,
            clearFilesButtonLabel,
        };
    }
}
ClrFileInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInput, deps: [{ token: i0.Injector }, { token: i0.Renderer2 }, { token: i0.ViewContainerRef }, { token: i0.ElementRef }, { token: i1.NgControl, optional: true, self: true }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Directive });
ClrFileInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInput, selector: "input[type=\"file\"][clrFileInput]", host: { attributes: { "tabindex": "-1", "aria-hidden": "true" }, listeners: { "change": "handleChange()" }, properties: { "class.clr-file-input": "true", "disabled": "this.disabled" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    host: {
                        tabindex: '-1',
                        'aria-hidden': 'true',
                        '[class.clr-file-input]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.Renderer2 }, { type: i0.ViewContainerRef }, { type: i0.ElementRef }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { disabled: [{
                type: HostBinding,
                args: ['disabled']
            }], handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBRVQsV0FBVyxFQUNYLFlBQVksRUFFWixRQUFRLEVBRVIsSUFBSSxHQUVMLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7O0FBZ0IvRCxNQUFNLE9BQU8sWUFBYSxTQUFRLGtCQUF5QztJQUd6RSxZQUNFLFFBQWtCLEVBQ2xCLFFBQW1CLEVBQ25CLGdCQUFrQyxFQUN6QixVQUF3QyxFQUNaLE9BQWtCLEVBQ3RDLGFBQXNDO1FBRXZELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUovRSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtRQUNaLFlBQU8sR0FBUCxPQUFPLENBQVc7UUFDdEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBUnpELGNBQVMsR0FBMEIsU0FBUyxDQUFDO0lBVzdDLENBQUM7SUFFRCxJQUNjLFFBQVE7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQy9DLENBQUM7SUFHTyxZQUFZO1FBQ2xCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU8sZUFBZTtRQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDbEQsSUFBSSxvQkFBNEIsQ0FBQztRQUNqQyxJQUFJLHFCQUE2QixDQUFDO1FBRWxDLElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUvQixvQkFBb0IsR0FBRyxRQUFRLENBQUM7WUFFaEMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsRixJQUFJLEVBQUUsUUFBUTthQUNmLENBQUMsQ0FBQztTQUNKO2FBQU0sSUFBSSxLQUFLLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRTFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDakYsS0FBSyxFQUFFLFNBQVM7YUFDakIsQ0FBQyxDQUFDO1lBRUgscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuRixLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixTQUFTLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDdkIsV0FBVyxFQUFFLG9CQUFvQjtZQUNqQyxxQkFBcUI7U0FDdEIsQ0FBQztJQUNKLENBQUM7O3lHQXREVSxZQUFZOzZGQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFSeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0NBQWtDO29CQUM1QyxJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLElBQUk7d0JBQ2QsYUFBYSxFQUFFLE1BQU07d0JBQ3JCLHdCQUF3QixFQUFFLE1BQU07cUJBQ2pDO2lCQUNGOzswQkFTSSxJQUFJOzswQkFBSSxRQUFRO2tGQU9MLFFBQVE7c0JBRHJCLFdBQVc7dUJBQUMsVUFBVTtnQkFNZixZQUFZO3NCQURuQixZQUFZO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyRmlsZUlucHV0Q29udGFpbmVyIH0gZnJvbSAnLi9maWxlLWlucHV0LWNvbnRhaW5lcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xyRmlsZUlucHV0U2VsZWN0aW9uIHtcbiAgZmlsZUNvdW50OiBudW1iZXI7XG4gIGJ1dHRvbkxhYmVsOiBzdHJpbmc7XG4gIGNsZWFyRmlsZXNCdXR0b25MYWJlbDogc3RyaW5nO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPVwiZmlsZVwiXVtjbHJGaWxlSW5wdXRdJyxcbiAgaG9zdDoge1xuICAgIHRhYmluZGV4OiAnLTEnLCAvLyBSZW1vdmUgdGhlIGhpZGRlbiBmaWxlIGBpbnB1dGAgZWxlbWVudCBmcm9tIHRoZSB0YWIgb3JkZXIgYmVjYXVzZSB0aGUgYnJvd3NlIGBidXR0b25gIHJlcGxhY2VzIGl0LlxuICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJywgLy8gUmVtb3ZlIHRoZSBoaWRkZW4gZmlsZSBgaW5wdXRgIGVsZW1lbnQgZnJvbSB0aGUgYWNjZXNzaWJpbGl0eSB0cmVlIGJlY2F1c2UgdGhlIGJyb3dzZSBgYnV0dG9uYCByZXBsYWNlcyBpdC5cbiAgICAnW2NsYXNzLmNsci1maWxlLWlucHV0XSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRmlsZUlucHV0IGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsckZpbGVJbnB1dENvbnRhaW5lcj4ge1xuICBzZWxlY3Rpb246IENsckZpbGVJbnB1dFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQFNlbGYoKSBAT3B0aW9uYWwoKSBwcml2YXRlIHJlYWRvbmx5IGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKHZpZXdDb250YWluZXJSZWYsIENsckZpbGVJbnB1dENvbnRhaW5lciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbGVtZW50UmVmKTtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnZGlzYWJsZWQnKVxuICBwcm90ZWN0ZWQgZ2V0IGRpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2wgJiYgdGhpcy5jb250cm9sLmRpc2FibGVkO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJylcbiAgcHJpdmF0ZSBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgdGhpcy51cGRhdGVTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZmlsZXM7XG4gICAgbGV0IHNlbGVjdGlvbkJ1dHRvbkxhYmVsOiBzdHJpbmc7XG4gICAgbGV0IGNsZWFyRmlsZXNCdXR0b25MYWJlbDogc3RyaW5nO1xuXG4gICAgaWYgKGZpbGVzPy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IGZpbGVuYW1lID0gZmlsZXNbMF0ubmFtZTtcblxuICAgICAgc2VsZWN0aW9uQnV0dG9uTGFiZWwgPSBmaWxlbmFtZTtcblxuICAgICAgY2xlYXJGaWxlc0J1dHRvbkxhYmVsID0gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsZWFyRmlsZSwge1xuICAgICAgICBGSUxFOiBmaWxlbmFtZSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZmlsZXM/Lmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IGZpbGVDb3VudCA9IGZpbGVzLmxlbmd0aC50b1N0cmluZygpO1xuXG4gICAgICBzZWxlY3Rpb25CdXR0b25MYWJlbCA9IHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5maWxlQ291bnQsIHtcbiAgICAgICAgQ09VTlQ6IGZpbGVDb3VudCxcbiAgICAgIH0pO1xuXG4gICAgICBjbGVhckZpbGVzQnV0dG9uTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuY2xlYXJGaWxlcywge1xuICAgICAgICBDT1VOVDogZmlsZUNvdW50LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3Rpb24gPSB7XG4gICAgICBmaWxlQ291bnQ6IGZpbGVzLmxlbmd0aCxcbiAgICAgIGJ1dHRvbkxhYmVsOiBzZWxlY3Rpb25CdXR0b25MYWJlbCxcbiAgICAgIGNsZWFyRmlsZXNCdXR0b25MYWJlbCxcbiAgICB9O1xuICB9XG59XG4iXX0=