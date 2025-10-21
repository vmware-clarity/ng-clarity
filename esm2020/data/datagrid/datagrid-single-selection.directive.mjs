/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, forwardRef, Input } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class ClrDatagridSingleSelectionValueAccessor extends DefaultValueAccessor {
    constructor(renderer, elementRef) {
        super(renderer, elementRef, null);
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    writeValue(value) {
        this.model = value;
        this.updateChecked();
    }
    keyOf(value) {
        if (value && this.clrDgItemsTrackBy) {
            return this.clrDgItemsTrackBy(value);
        }
        return value;
    }
    updateChecked() {
        const model = this.keyOf(this.model);
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
    ], usesInheritance: true, ngImport: i0 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtc2luZ2xlLXNlbGVjdGlvbi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL2RhdGFncmlkLXNpbmdsZS1zZWxlY3Rpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQWlCekUsTUFBTSxPQUFPLHVDQUF3QyxTQUFRLG9CQUFvQjtJQU0vRSxZQUFvQixRQUFtQixFQUFVLFVBQXdDO1FBQ3ZGLEtBQUssQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRGhCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUE4QjtJQUV6RixDQUFDO0lBRVEsVUFBVSxDQUFDLEtBQVU7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTyxLQUFLLENBQUMsS0FBVTtRQUN0QixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxhQUFhO1FBQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDdkYsQ0FBQzs7b0lBMUJVLHVDQUF1Qzt3SEFBdkMsdUNBQXVDLHdOQWJ2QztRQUNUO1lBQ0UsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHVDQUF1QyxDQUFDO1lBQ3RFLEtBQUssRUFBRSxJQUFJO1NBQ1o7S0FDRjsyRkFPVSx1Q0FBdUM7a0JBZm5ELFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDhDQUE4QztvQkFDeEQsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLHdDQUF3QyxDQUFDOzRCQUN0RSxLQUFLLEVBQUUsSUFBSTt5QkFDWjtxQkFDRjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osVUFBVSxFQUFFLGlCQUFpQjt3QkFDN0IsUUFBUSxFQUFFLGFBQWE7cUJBQ3hCO29CQUNELFVBQVUsRUFBRSxLQUFLO2lCQUNsQjt5SEFFVSxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csaUJBQWlCO3NCQUF6QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIElucHV0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERlZmF1bHRWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1yYWRpb11bY2xyRGdTaW5nbGVTZWxlY3Rpb25SYWRpb10nLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENsckRhdGFncmlkU2luZ2xlU2VsZWN0aW9uVmFsdWVBY2Nlc3NvciksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKHZhbHVlKScsXG4gICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKScsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFNpbmdsZVNlbGVjdGlvblZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBEZWZhdWx0VmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG4gIEBJbnB1dCgpIGNsckRnSXRlbXNUcmFja0J5ITogKHZhbHVlOiBhbnkpID0+IHVua25vd247XG5cbiAgcHJpdmF0ZSBtb2RlbDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+KSB7XG4gICAgc3VwZXIocmVuZGVyZXIsIGVsZW1lbnRSZWYsIG51bGwpO1xuICB9XG5cbiAgb3ZlcnJpZGUgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5tb2RlbCA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlQ2hlY2tlZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBrZXlPZih2YWx1ZTogYW55KTogdW5rbm93biB7XG4gICAgaWYgKHZhbHVlICYmIHRoaXMuY2xyRGdJdGVtc1RyYWNrQnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNsckRnSXRlbXNUcmFja0J5KHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDaGVja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5rZXlPZih0aGlzLm1vZGVsKTtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMua2V5T2YodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2NoZWNrZWQnLCBtb2RlbCA9PT0gdmFsdWUpO1xuICB9XG59XG4iXX0=