/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { clearFiles, selectFiles } from './file-input.helpers';
import * as i0 from "@angular/core";
export class ClrFileInputValueAccessor {
    constructor(elementRef) {
        this.elementRef = elementRef;
        // eslint-disable-next-line  @typescript-eslint/no-empty-function
        this.onChange = (_value) => { };
        // eslint-disable-next-line  @typescript-eslint/no-empty-function
        this.onTouched = () => { };
    }
    writeValue(value) {
        if (value !== undefined && value !== null && !(value instanceof FileList)) {
            throw new Error('The value of a file input control must be a FileList.');
        }
        if (value) {
            selectFiles(this.elementRef.nativeElement, value);
        }
        else if (this.elementRef.nativeElement.files.length) {
            clearFiles(this.elementRef.nativeElement);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    handleChange() {
        this.onTouched();
        this.onChange(this.elementRef.nativeElement.files);
    }
}
ClrFileInputValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputValueAccessor, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrFileInputValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInputValueAccessor, selector: "input[type=\"file\"][clrFileInput]", host: { listeners: { "change": "handleChange()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: ClrFileInputValueAccessor, multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { handleChange: [{
                type: HostListener,
                args: ['change']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC12YWx1ZS1hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2ZpbGUtaW5wdXQvZmlsZS1pbnB1dC12YWx1ZS1hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDOztBQU0vRCxNQUFNLE9BQU8seUJBQXlCO0lBQ3BDLFlBQTZCLFVBQXdDO1FBQXhDLGVBQVUsR0FBVixVQUFVLENBQThCO1FBNEJyRSxpRUFBaUU7UUFDekQsYUFBUSxHQUFHLENBQUMsTUFBZ0IsRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRTVDLGlFQUFpRTtRQUN6RCxjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBaEMyQyxDQUFDO0lBRXpFLFVBQVUsQ0FBQyxLQUFlO1FBQ3hCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLFlBQVksUUFBUSxDQUFDLEVBQUU7WUFDekUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxLQUFLLEVBQUU7WUFDVCxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkQ7YUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDckQsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBNkI7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQWM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUdPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQzs7c0hBM0JVLHlCQUF5QjswR0FBekIseUJBQXlCLGtIQUZ6QixDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSx5QkFBeUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7MkZBRXJGLHlCQUF5QjtrQkFKckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0NBQWtDO29CQUM1QyxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLDJCQUEyQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDakc7aUdBeUJTLFlBQVk7c0JBRG5CLFlBQVk7dUJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgY2xlYXJGaWxlcywgc2VsZWN0RmlsZXMgfSBmcm9tICcuL2ZpbGUtaW5wdXQuaGVscGVycyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJmaWxlXCJdW2NsckZpbGVJbnB1dF0nLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogQ2xyRmlsZUlucHV0VmFsdWVBY2Nlc3NvciwgbXVsdGk6IHRydWUgfV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVJbnB1dFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pikge31cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBGaWxlTGlzdCkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmICEodmFsdWUgaW5zdGFuY2VvZiBGaWxlTGlzdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHZhbHVlIG9mIGEgZmlsZSBpbnB1dCBjb250cm9sIG11c3QgYmUgYSBGaWxlTGlzdC4nKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHNlbGVjdEZpbGVzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5maWxlcy5sZW5ndGgpIHtcbiAgICAgIGNsZWFyRmlsZXModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogRmlsZUxpc3QpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnKVxuICBwcml2YXRlIGhhbmRsZUNoYW5nZSgpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIHRoaXMub25DaGFuZ2UodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZmlsZXMpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lICBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbiAgcHJpdmF0ZSBvbkNoYW5nZSA9IChfdmFsdWU6IEZpbGVMaXN0KSA9PiB7fTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1mdW5jdGlvblxuICBwcml2YXRlIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xufVxuIl19