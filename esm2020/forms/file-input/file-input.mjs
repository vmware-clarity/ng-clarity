/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Optional, Self, } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrFileInputContainer } from './file-input-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../utils";
export class ClrFileInput extends WrappedFormControl {
    constructor(injector, renderer, viewContainerRef, elementRef, control, commonStrings) {
        super(viewContainerRef, ClrFileInputContainer, injector, control, renderer, elementRef);
        this.elementRef = elementRef;
        this.commonStrings = commonStrings;
        this.selection = undefined;
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
ClrFileInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInput, selector: "input[type=\"file\"][clrFileInput]", host: { attributes: { "tabindex": "-1", "aria-hidden": "true" }, listeners: { "change": "handleChange()" }, properties: { "class.clr-file-input": "true" } }, usesInheritance: true, ngImport: i0 });
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
                }] }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUVaLFFBQVEsRUFFUixJQUFJLEdBRUwsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7Ozs7QUFnQi9ELE1BQU0sT0FBTyxZQUFhLFNBQVEsa0JBQXlDO0lBR3pFLFlBQ0UsUUFBa0IsRUFDbEIsUUFBbUIsRUFDbkIsZ0JBQWtDLEVBQ3pCLFVBQXdDLEVBQzdCLE9BQWtCLEVBQ3JCLGFBQXNDO1FBRXZELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUovRSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtRQUVoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFSekQsY0FBUyxHQUEwQixTQUFTLENBQUM7SUFXN0MsQ0FBQztJQUdPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxlQUFlO1FBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUNsRCxJQUFJLG9CQUE0QixDQUFDO1FBQ2pDLElBQUkscUJBQTZCLENBQUM7UUFFbEMsSUFBSSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRS9CLG9CQUFvQixHQUFHLFFBQVEsQ0FBQztZQUVoQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xGLElBQUksRUFBRSxRQUFRO2FBQ2YsQ0FBQyxDQUFDO1NBQ0o7YUFBTSxJQUFJLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFMUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNqRixLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7WUFFSCxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25GLEtBQUssRUFBRSxTQUFTO2FBQ2pCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTTtZQUN2QixXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLHFCQUFxQjtTQUN0QixDQUFDO0lBQ0osQ0FBQzs7eUdBakRVLFlBQVk7NkZBQVosWUFBWTsyRkFBWixZQUFZO2tCQVJ4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLElBQUksRUFBRTt3QkFDSixRQUFRLEVBQUUsSUFBSTt3QkFDZCxhQUFhLEVBQUUsTUFBTTt3QkFDckIsd0JBQXdCLEVBQUUsTUFBTTtxQkFDakM7aUJBQ0Y7OzBCQVNJLElBQUk7OzBCQUFJLFFBQVE7a0ZBT1gsWUFBWTtzQkFEbkIsWUFBWTt1QkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyRmlsZUlucHV0Q29udGFpbmVyIH0gZnJvbSAnLi9maWxlLWlucHV0LWNvbnRhaW5lcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2xyRmlsZUlucHV0U2VsZWN0aW9uIHtcbiAgZmlsZUNvdW50OiBudW1iZXI7XG4gIGJ1dHRvbkxhYmVsOiBzdHJpbmc7XG4gIGNsZWFyRmlsZXNCdXR0b25MYWJlbDogc3RyaW5nO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPVwiZmlsZVwiXVtjbHJGaWxlSW5wdXRdJyxcbiAgaG9zdDoge1xuICAgIHRhYmluZGV4OiAnLTEnLCAvLyBSZW1vdmUgdGhlIGhpZGRlbiBmaWxlIGBpbnB1dGAgZWxlbWVudCBmcm9tIHRoZSB0YWIgb3JkZXIgYmVjYXVzZSB0aGUgYnJvd3NlIGBidXR0b25gIHJlcGxhY2VzIGl0LlxuICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJywgLy8gUmVtb3ZlIHRoZSBoaWRkZW4gZmlsZSBgaW5wdXRgIGVsZW1lbnQgZnJvbSB0aGUgYWNjZXNzaWJpbGl0eSB0cmVlIGJlY2F1c2UgdGhlIGJyb3dzZSBgYnV0dG9uYCByZXBsYWNlcyBpdC5cbiAgICAnW2NsYXNzLmNsci1maWxlLWlucHV0XSc6ICd0cnVlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRmlsZUlucHV0IGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsckZpbGVJbnB1dENvbnRhaW5lcj4ge1xuICBzZWxlY3Rpb246IENsckZpbGVJbnB1dFNlbGVjdGlvbiA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQFNlbGYoKSBAT3B0aW9uYWwoKSBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHtcbiAgICBzdXBlcih2aWV3Q29udGFpbmVyUmVmLCBDbHJGaWxlSW5wdXRDb250YWluZXIsIGluamVjdG9yLCBjb250cm9sLCByZW5kZXJlciwgZWxlbWVudFJlZik7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnKVxuICBwcml2YXRlIGhhbmRsZUNoYW5nZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTZWxlY3Rpb24oKSB7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5maWxlcztcbiAgICBsZXQgc2VsZWN0aW9uQnV0dG9uTGFiZWw6IHN0cmluZztcbiAgICBsZXQgY2xlYXJGaWxlc0J1dHRvbkxhYmVsOiBzdHJpbmc7XG5cbiAgICBpZiAoZmlsZXM/Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlc1swXS5uYW1lO1xuXG4gICAgICBzZWxlY3Rpb25CdXR0b25MYWJlbCA9IGZpbGVuYW1lO1xuXG4gICAgICBjbGVhckZpbGVzQnV0dG9uTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuY2xlYXJGaWxlLCB7XG4gICAgICAgIEZJTEU6IGZpbGVuYW1lLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChmaWxlcz8ubGVuZ3RoID4gMSkge1xuICAgICAgY29uc3QgZmlsZUNvdW50ID0gZmlsZXMubGVuZ3RoLnRvU3RyaW5nKCk7XG5cbiAgICAgIHNlbGVjdGlvbkJ1dHRvbkxhYmVsID0gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmZpbGVDb3VudCwge1xuICAgICAgICBDT1VOVDogZmlsZUNvdW50LFxuICAgICAgfSk7XG5cbiAgICAgIGNsZWFyRmlsZXNCdXR0b25MYWJlbCA9IHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jbGVhckZpbGVzLCB7XG4gICAgICAgIENPVU5UOiBmaWxlQ291bnQsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdGlvbiA9IHtcbiAgICAgIGZpbGVDb3VudDogZmlsZXMubGVuZ3RoLFxuICAgICAgYnV0dG9uTGFiZWw6IHNlbGVjdGlvbkJ1dHRvbkxhYmVsLFxuICAgICAgY2xlYXJGaWxlc0J1dHRvbkxhYmVsLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==