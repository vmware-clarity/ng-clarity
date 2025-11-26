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
        return this.elementRef.nativeElement.disabled || (this.control && this.control.disabled);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBRVQsV0FBVyxFQUNYLFlBQVksRUFFWixRQUFRLEVBRVIsSUFBSSxHQUVMLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7O0FBZ0IvRCxNQUFNLE9BQU8sWUFBYSxTQUFRLGtCQUF5QztJQUd6RSxZQUNFLFFBQWtCLEVBQ2xCLFFBQW1CLEVBQ25CLGdCQUFrQyxFQUN6QixVQUF3QyxFQUNaLE9BQWtCLEVBQ3RDLGFBQXNDO1FBRXZELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUovRSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtRQUNaLFlBQU8sR0FBUCxPQUFPLENBQVc7UUFDdEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBUnpELGNBQVMsR0FBMEIsU0FBUyxDQUFDO0lBVzdDLENBQUM7SUFFRCxJQUNjLFFBQVE7UUFDcEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUdPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTyxlQUFlO1FBQ3JCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUNsRCxJQUFJLG9CQUE0QixDQUFDO1FBQ2pDLElBQUkscUJBQTZCLENBQUM7UUFFbEMsSUFBSSxLQUFLLEVBQUUsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRS9CLG9CQUFvQixHQUFHLFFBQVEsQ0FBQztZQUVoQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xGLElBQUksRUFBRSxRQUFRO2FBQ2YsQ0FBQyxDQUFDO1NBQ0o7YUFBTSxJQUFJLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFMUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNqRixLQUFLLEVBQUUsU0FBUzthQUNqQixDQUFDLENBQUM7WUFFSCxxQkFBcUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25GLEtBQUssRUFBRSxTQUFTO2FBQ2pCLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTTtZQUN2QixXQUFXLEVBQUUsb0JBQW9CO1lBQ2pDLHFCQUFxQjtTQUN0QixDQUFDO0lBQ0osQ0FBQzs7eUdBdERVLFlBQVk7NkZBQVosWUFBWTsyRkFBWixZQUFZO2tCQVJ4QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLElBQUksRUFBRTt3QkFDSixRQUFRLEVBQUUsSUFBSTt3QkFDZCxhQUFhLEVBQUUsTUFBTTt3QkFDckIsd0JBQXdCLEVBQUUsTUFBTTtxQkFDakM7aUJBQ0Y7OzBCQVNJLElBQUk7OzBCQUFJLFFBQVE7a0ZBT0wsUUFBUTtzQkFEckIsV0FBVzt1QkFBQyxVQUFVO2dCQU1mLFlBQVk7c0JBRG5CLFlBQVk7dUJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbiAgU2VsZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJGaWxlSW5wdXRDb250YWluZXIgfSBmcm9tICcuL2ZpbGUtaW5wdXQtY29udGFpbmVyJztcblxuZXhwb3J0IGludGVyZmFjZSBDbHJGaWxlSW5wdXRTZWxlY3Rpb24ge1xuICBmaWxlQ291bnQ6IG51bWJlcjtcbiAgYnV0dG9uTGFiZWw6IHN0cmluZztcbiAgY2xlYXJGaWxlc0J1dHRvbkxhYmVsOiBzdHJpbmc7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJmaWxlXCJdW2NsckZpbGVJbnB1dF0nLFxuICBob3N0OiB7XG4gICAgdGFiaW5kZXg6ICctMScsIC8vIFJlbW92ZSB0aGUgaGlkZGVuIGZpbGUgYGlucHV0YCBlbGVtZW50IGZyb20gdGhlIHRhYiBvcmRlciBiZWNhdXNlIHRoZSBicm93c2UgYGJ1dHRvbmAgcmVwbGFjZXMgaXQuXG4gICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLCAvLyBSZW1vdmUgdGhlIGhpZGRlbiBmaWxlIGBpbnB1dGAgZWxlbWVudCBmcm9tIHRoZSBhY2Nlc3NpYmlsaXR5IHRyZWUgYmVjYXVzZSB0aGUgYnJvd3NlIGBidXR0b25gIHJlcGxhY2VzIGl0LlxuICAgICdbY2xhc3MuY2xyLWZpbGUtaW5wdXRdJzogJ3RydWUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJGaWxlSW5wdXQgZXh0ZW5kcyBXcmFwcGVkRm9ybUNvbnRyb2w8Q2xyRmlsZUlucHV0Q29udGFpbmVyPiB7XG4gIHNlbGVjdGlvbjogQ2xyRmlsZUlucHV0U2VsZWN0aW9uID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBAU2VsZigpIEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgY29udHJvbDogTmdDb250cm9sLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2VcbiAgKSB7XG4gICAgc3VwZXIodmlld0NvbnRhaW5lclJlZiwgQ2xyRmlsZUlucHV0Q29udGFpbmVyLCBpbmplY3RvciwgY29udHJvbCwgcmVuZGVyZXIsIGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdkaXNhYmxlZCcpXG4gIHByb3RlY3RlZCBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc2FibGVkIHx8ICh0aGlzLmNvbnRyb2wgJiYgdGhpcy5jb250cm9sLmRpc2FibGVkKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NoYW5nZScpXG4gIHByaXZhdGUgaGFuZGxlQ2hhbmdlKCkge1xuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVNlbGVjdGlvbigpIHtcbiAgICBjb25zdCBmaWxlcyA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZpbGVzO1xuICAgIGxldCBzZWxlY3Rpb25CdXR0b25MYWJlbDogc3RyaW5nO1xuICAgIGxldCBjbGVhckZpbGVzQnV0dG9uTGFiZWw6IHN0cmluZztcblxuICAgIGlmIChmaWxlcz8ubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVzWzBdLm5hbWU7XG5cbiAgICAgIHNlbGVjdGlvbkJ1dHRvbkxhYmVsID0gZmlsZW5hbWU7XG5cbiAgICAgIGNsZWFyRmlsZXNCdXR0b25MYWJlbCA9IHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5jbGVhckZpbGUsIHtcbiAgICAgICAgRklMRTogZmlsZW5hbWUsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGZpbGVzPy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBmaWxlQ291bnQgPSBmaWxlcy5sZW5ndGgudG9TdHJpbmcoKTtcblxuICAgICAgc2VsZWN0aW9uQnV0dG9uTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuZmlsZUNvdW50LCB7XG4gICAgICAgIENPVU5UOiBmaWxlQ291bnQsXG4gICAgICB9KTtcblxuICAgICAgY2xlYXJGaWxlc0J1dHRvbkxhYmVsID0gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmNsZWFyRmlsZXMsIHtcbiAgICAgICAgQ09VTlQ6IGZpbGVDb3VudCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0aW9uID0ge1xuICAgICAgZmlsZUNvdW50OiBmaWxlcy5sZW5ndGgsXG4gICAgICBidXR0b25MYWJlbDogc2VsZWN0aW9uQnV0dG9uTGFiZWwsXG4gICAgICBjbGVhckZpbGVzQnV0dG9uTGFiZWwsXG4gICAgfTtcbiAgfVxufVxuIl19