/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class ClrDatagridSingleSelectionValueAccessor {
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        // eslint-disable-next-line  @typescript-eslint/no-empty-function
        this.onChange = () => { };
        // eslint-disable-next-line  @typescript-eslint/no-empty-function
        this.onTouched = () => { };
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    writeValue(value) {
        this.state = value;
        this.updateChecked();
    }
    keyOf(value) {
        if (value && this.clrDgItemsTrackBy) {
            return this.clrDgItemsTrackBy(value);
        }
        return value;
    }
    updateChecked() {
        const model = this.keyOf(this.state);
        const value = this.keyOf(this.value);
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', model === value);
    }
}
ClrDatagridSingleSelectionValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridSingleSelectionValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridSingleSelectionValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridSingleSelectionValueAccessor, selector: "input[type=radio][clrDgSingleSelectionRadio]", inputs: { value: "value", clrDgItemsTrackBy: "clrDgItemsTrackBy" }, host: { listeners: { "change": "onChange(value)", "blur": "onTouched()" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
            multi: true,
        },
    ], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridSingleSelectionValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=radio][clrDgSingleSelectionRadio]',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
                            multi: true,
                        },
                    ],
                    host: {
                        '(change)': 'onChange(value)',
                        '(blur)': 'onTouched()',
                    },
                    standalone: false,
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { value: [{
                type: Input
            }], clrDgItemsTrackBy: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtc2luZ2xlLXNlbGVjdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXNpbmdsZS1zZWxlY3Rpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFpQnpFLE1BQU0sT0FBTyx1Q0FBdUM7SUFNbEQsWUFBb0IsUUFBbUIsRUFBVSxVQUF3QztRQUFyRSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsZUFBVSxHQUFWLFVBQVUsQ0FBOEI7UUFFekYsaUVBQWlFO1FBQ2pFLGFBQVEsR0FBeUIsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBQzFDLGlFQUFpRTtRQUNqRSxjQUFTLEdBQWUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBTDJELENBQUM7SUFPN0YsZ0JBQWdCLENBQUMsRUFBd0I7UUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxLQUFLLENBQUMsS0FBVTtRQUN0QixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxhQUFhO1FBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDdkYsQ0FBQzs7b0lBekNVLHVDQUF1Qzt3SEFBdkMsdUNBQXVDLHdOQWJ2QztRQUNUO1lBQ0UsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHVDQUF1QyxDQUFDO1lBQ3RFLEtBQUssRUFBRSxJQUFJO1NBQ1o7S0FDRjsyRkFPVSx1Q0FBdUM7a0JBZm5ELFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDhDQUE4QztvQkFDeEQsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLHdDQUF3QyxDQUFDOzRCQUN0RSxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osVUFBVSxFQUFFLGlCQUFpQjt3QkFDN0IsUUFBUSxFQUFFLGFBQWE7cUJBQ3hCO29CQUNELFVBQVUsRUFBRSxLQUFLO2lCQUNsQjt5SEFFVSxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csaUJBQWlCO3NCQUF6QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1yYWRpb11bY2xyRGdTaW5nbGVTZWxlY3Rpb25SYWRpb10nLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENsckRhdGFncmlkU2luZ2xlU2VsZWN0aW9uVmFsdWVBY2Nlc3NvciksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKHZhbHVlKScsXG4gICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKScsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFNpbmdsZVNlbGVjdGlvblZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIHZhbHVlO1xuICBASW5wdXQoKSBjbHJEZ0l0ZW1zVHJhY2tCeSE6ICh2YWx1ZTogYW55KSA9PiB1bmtub3duO1xuXG4gIHByaXZhdGUgc3RhdGU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pikge31cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICBvbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lICBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgb25Ub3VjaGVkOiAoKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc3RhdGUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNoZWNrZWQoKTtcbiAgfVxuXG4gIHByaXZhdGUga2V5T2YodmFsdWU6IGFueSk6IHVua25vd24ge1xuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmNsckRnSXRlbXNUcmFja0J5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbHJEZ0l0ZW1zVHJhY2tCeSh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ2hlY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMua2V5T2YodGhpcy5zdGF0ZSk7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmtleU9mKHRoaXMudmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdjaGVja2VkJywgbW9kZWwgPT09IHZhbHVlKTtcbiAgfVxufVxuIl19