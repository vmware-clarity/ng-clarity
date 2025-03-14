/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import * as i0 from "@angular/core";
export class ClrFileInputValidator {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    validate(control) {
        const files = control.value;
        const fileInputElement = this.elementRef.nativeElement;
        const errors = {};
        // required validation (native attribute)
        if (fileInputElement.required && files?.length === 0) {
            errors.required = true;
        }
        const accept = fileInputElement.accept ? fileInputElement.accept.split(',').map(type => type.trim()) : null;
        if (files?.length > 0 && (accept || this.minFileSize || this.maxFileSize)) {
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                // accept validation (native attribute)
                if (accept) {
                    const [fileExtension] = file.name.match(/\..+$/);
                    if (!accept.includes(file.type) && !accept.includes(fileExtension)) {
                        errors.accept = errors.accept || [];
                        errors.accept.push({ name: file.name, accept, type: file.type, extension: fileExtension });
                    }
                }
                // min file validation (custom input)
                if (this.minFileSize && file.size < this.minFileSize) {
                    errors.minFileSize = errors.minFileSize || [];
                    errors.minFileSize.push({ name: file.name, minFileSize: this.minFileSize, actualFileSize: file.size });
                }
                // max file validation (custom input)
                if (this.maxFileSize && file.size > this.maxFileSize) {
                    errors.maxFileSize = errors.maxFileSize || [];
                    errors.maxFileSize.push({ name: file.name, maxFileSize: this.maxFileSize, actualFileSize: file.size });
                }
            }
        }
        return Object.keys(errors).length ? errors : null;
    }
}
ClrFileInputValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputValidator, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrFileInputValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrFileInputValidator, selector: "input[type=\"file\"][clrFileInput]", inputs: { minFileSize: ["clrMinFileSize", "minFileSize"], maxFileSize: ["clrMaxFileSize", "maxFileSize"] }, providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="file"][clrFileInput]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrFileInputValidator, multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { minFileSize: [{
                type: Input,
                args: ['clrMinFileSize']
            }], maxFileSize: [{
                type: Input,
                args: ['clrMaxFileSize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9maWxlLWlucHV0L2ZpbGUtaW5wdXQtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFtQixhQUFhLEVBQStCLE1BQU0sZ0JBQWdCLENBQUM7O0FBUTdGLE1BQU0sT0FBTyxxQkFBcUI7SUFJaEMsWUFBNkIsVUFBd0M7UUFBeEMsZUFBVSxHQUFWLFVBQVUsQ0FBOEI7SUFBRyxDQUFDO0lBRXpFLFFBQVEsQ0FBQyxPQUFrQztRQUN6QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFdkQsTUFBTSxNQUFNLEdBQWdDLEVBQUUsQ0FBQztRQUUvQyx5Q0FBeUM7UUFDekMsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUU1RyxJQUFJLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3pFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUzQix1Q0FBdUM7Z0JBQ3ZDLElBQUksTUFBTSxFQUFFO29CQUNWLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFDbEUsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQzt3QkFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7cUJBQzVGO2lCQUNGO2dCQUVELHFDQUFxQztnQkFDckMsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDcEQsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ3hHO2dCQUVELHFDQUFxQztnQkFDckMsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDcEQsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQ3hHO2FBQ0Y7U0FDRjtRQUVELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3BELENBQUM7O2tIQWhEVSxxQkFBcUI7c0dBQXJCLHFCQUFxQix5S0FGckIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQzsyRkFFN0UscUJBQXFCO2tCQUpqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLHVCQUF1QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDekY7aUdBRTBCLFdBQVc7c0JBQW5DLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQUNFLFdBQVc7c0JBQW5DLEtBQUs7dUJBQUMsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wsIE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgQ2xyRmlsZUxpc3RWYWxpZGF0aW9uRXJyb3JzIH0gZnJvbSAnLi9maWxlLWlucHV0LXZhbGlkYXRvci1lcnJvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPVwiZmlsZVwiXVtjbHJGaWxlSW5wdXRdJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ2xyRmlsZUlucHV0VmFsaWRhdG9yLCBtdWx0aTogdHJ1ZSB9XSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRmlsZUlucHV0VmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgQElucHV0KCdjbHJNaW5GaWxlU2l6ZScpIG1pbkZpbGVTaXplOiBudW1iZXI7XG4gIEBJbnB1dCgnY2xyTWF4RmlsZVNpemUnKSBtYXhGaWxlU2l6ZTogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50Pikge31cblxuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2w8RmlsZUxpc3Q+KTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgZmlsZXMgPSBjb250cm9sLnZhbHVlO1xuICAgIGNvbnN0IGZpbGVJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGNvbnN0IGVycm9yczogQ2xyRmlsZUxpc3RWYWxpZGF0aW9uRXJyb3JzID0ge307XG5cbiAgICAvLyByZXF1aXJlZCB2YWxpZGF0aW9uIChuYXRpdmUgYXR0cmlidXRlKVxuICAgIGlmIChmaWxlSW5wdXRFbGVtZW50LnJlcXVpcmVkICYmIGZpbGVzPy5sZW5ndGggPT09IDApIHtcbiAgICAgIGVycm9ycy5yZXF1aXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWNjZXB0ID0gZmlsZUlucHV0RWxlbWVudC5hY2NlcHQgPyBmaWxlSW5wdXRFbGVtZW50LmFjY2VwdC5zcGxpdCgnLCcpLm1hcCh0eXBlID0+IHR5cGUudHJpbSgpKSA6IG51bGw7XG5cbiAgICBpZiAoZmlsZXM/Lmxlbmd0aCA+IDAgJiYgKGFjY2VwdCB8fCB0aGlzLm1pbkZpbGVTaXplIHx8IHRoaXMubWF4RmlsZVNpemUpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBmaWxlcy5pdGVtKGkpO1xuXG4gICAgICAgIC8vIGFjY2VwdCB2YWxpZGF0aW9uIChuYXRpdmUgYXR0cmlidXRlKVxuICAgICAgICBpZiAoYWNjZXB0KSB7XG4gICAgICAgICAgY29uc3QgW2ZpbGVFeHRlbnNpb25dID0gZmlsZS5uYW1lLm1hdGNoKC9cXC4uKyQvKTtcblxuICAgICAgICAgIGlmICghYWNjZXB0LmluY2x1ZGVzKGZpbGUudHlwZSkgJiYgIWFjY2VwdC5pbmNsdWRlcyhmaWxlRXh0ZW5zaW9uKSkge1xuICAgICAgICAgICAgZXJyb3JzLmFjY2VwdCA9IGVycm9ycy5hY2NlcHQgfHwgW107XG4gICAgICAgICAgICBlcnJvcnMuYWNjZXB0LnB1c2goeyBuYW1lOiBmaWxlLm5hbWUsIGFjY2VwdCwgdHlwZTogZmlsZS50eXBlLCBleHRlbnNpb246IGZpbGVFeHRlbnNpb24gfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWluIGZpbGUgdmFsaWRhdGlvbiAoY3VzdG9tIGlucHV0KVxuICAgICAgICBpZiAodGhpcy5taW5GaWxlU2l6ZSAmJiBmaWxlLnNpemUgPCB0aGlzLm1pbkZpbGVTaXplKSB7XG4gICAgICAgICAgZXJyb3JzLm1pbkZpbGVTaXplID0gZXJyb3JzLm1pbkZpbGVTaXplIHx8IFtdO1xuICAgICAgICAgIGVycm9ycy5taW5GaWxlU2l6ZS5wdXNoKHsgbmFtZTogZmlsZS5uYW1lLCBtaW5GaWxlU2l6ZTogdGhpcy5taW5GaWxlU2l6ZSwgYWN0dWFsRmlsZVNpemU6IGZpbGUuc2l6ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1heCBmaWxlIHZhbGlkYXRpb24gKGN1c3RvbSBpbnB1dClcbiAgICAgICAgaWYgKHRoaXMubWF4RmlsZVNpemUgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhGaWxlU2l6ZSkge1xuICAgICAgICAgIGVycm9ycy5tYXhGaWxlU2l6ZSA9IGVycm9ycy5tYXhGaWxlU2l6ZSB8fCBbXTtcbiAgICAgICAgICBlcnJvcnMubWF4RmlsZVNpemUucHVzaCh7IG5hbWU6IGZpbGUubmFtZSwgbWF4RmlsZVNpemU6IHRoaXMubWF4RmlsZVNpemUsIGFjdHVhbEZpbGVTaXplOiBmaWxlLnNpemUgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZXJyb3JzKS5sZW5ndGggPyBlcnJvcnMgOiBudWxsO1xuICB9XG59XG4iXX0=