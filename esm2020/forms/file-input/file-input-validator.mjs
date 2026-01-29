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
                if (accept && accept.length) {
                    if (!this.validateAccept(file, accept)) {
                        errors.accept = errors.accept || [];
                        errors.accept.push({
                            name: file.name,
                            accept,
                            type: file.type || '',
                            extension: this.getSuffixByDepth(file.name, 2), // last up to 2 parts for reporting
                        });
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
    getSuffixByDepth(filename, depth) {
        const match = filename.toLowerCase().match(new RegExp(`(\\.[^.]+){1,${depth}}$`, 'i'));
        return match ? match[0] : '';
    }
    validateAccept(file, acceptList) {
        const name = file.name.toLowerCase();
        const type = (file.type || '').toLowerCase();
        for (const entryRaw of acceptList) {
            const entry = entryRaw.trim().toLowerCase();
            if (!entry) {
                continue;
            }
            // Extension check
            if (entry.startsWith('.')) {
                const depth = (entry.match(/\./g) || []).length;
                if (this.getSuffixByDepth(name, depth) === entry) {
                    return true;
                }
                continue;
            }
            // MIME check
            if (entry.endsWith('/*')) {
                const prefix = entry.slice(0, entry.length - 1); // keep trailing slash
                if (type.startsWith(prefix)) {
                    return true;
                }
            }
            else if (entry.includes('/') && type === entry) {
                return true;
            }
        }
        return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9maWxlLWlucHV0L2ZpbGUtaW5wdXQtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFtQixhQUFhLEVBQStCLE1BQU0sZ0JBQWdCLENBQUM7O0FBUTdGLE1BQU0sT0FBTyxxQkFBcUI7SUFJaEMsWUFBNkIsVUFBd0M7UUFBeEMsZUFBVSxHQUFWLFVBQVUsQ0FBOEI7SUFBRyxDQUFDO0lBRXpFLFFBQVEsQ0FBQyxPQUFrQztRQUN6QyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFdkQsTUFBTSxNQUFNLEdBQWdDLEVBQUUsQ0FBQztRQUUvQyx5Q0FBeUM7UUFDekMsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUU1RyxJQUFJLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcs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LGdCQUFnQjtnQkFDRSxXQUFXO3NCQUFuQyxLQUFLO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWJzdHJhY3RDb250cm9sLCBOR19WQUxJREFUT1JTLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IENsckZpbGVMaXN0VmFsaWRhdGlvbkVycm9ycyB9IGZyb20gJy4vZmlsZS1pbnB1dC12YWxpZGF0b3ItZXJyb3JzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbdHlwZT1cImZpbGVcIl1bY2xyRmlsZUlucHV0XScsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IENsckZpbGVJbnB1dFZhbGlkYXRvciwgbXVsdGk6IHRydWUgfV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVJbnB1dFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIEBJbnB1dCgnY2xyTWluRmlsZVNpemUnKSBtaW5GaWxlU2l6ZTogbnVtYmVyO1xuICBASW5wdXQoJ2Nsck1heEZpbGVTaXplJykgbWF4RmlsZVNpemU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4pIHt9XG5cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sPEZpbGVMaXN0Pik6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGNvbnN0IGZpbGVzID0gY29udHJvbC52YWx1ZTtcbiAgICBjb25zdCBmaWxlSW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBjb25zdCBlcnJvcnM6IENsckZpbGVMaXN0VmFsaWRhdGlvbkVycm9ycyA9IHt9O1xuXG4gICAgLy8gcmVxdWlyZWQgdmFsaWRhdGlvbiAobmF0aXZlIGF0dHJpYnV0ZSlcbiAgICBpZiAoZmlsZUlucHV0RWxlbWVudC5yZXF1aXJlZCAmJiBmaWxlcz8ubGVuZ3RoID09PSAwKSB7XG4gICAgICBlcnJvcnMucmVxdWlyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY2VwdCA9IGZpbGVJbnB1dEVsZW1lbnQuYWNjZXB0ID8gZmlsZUlucHV0RWxlbWVudC5hY2NlcHQuc3BsaXQoJywnKS5tYXAodHlwZSA9PiB0eXBlLnRyaW0oKSkgOiBudWxsO1xuXG4gICAgaWYgKGZpbGVzPy5sZW5ndGggPiAwICYmIChhY2NlcHQgfHwgdGhpcy5taW5GaWxlU2l6ZSB8fCB0aGlzLm1heEZpbGVTaXplKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBmaWxlID0gZmlsZXMuaXRlbShpKTtcblxuICAgICAgICAvLyBhY2NlcHQgdmFsaWRhdGlvbiAobmF0aXZlIGF0dHJpYnV0ZSlcbiAgICAgICAgaWYgKGFjY2VwdCAmJiBhY2NlcHQubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlQWNjZXB0KGZpbGUsIGFjY2VwdCkpIHtcbiAgICAgICAgICAgIGVycm9ycy5hY2NlcHQgPSBlcnJvcnMuYWNjZXB0IHx8IFtdO1xuICAgICAgICAgICAgZXJyb3JzLmFjY2VwdC5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICBhY2NlcHQsXG4gICAgICAgICAgICAgIHR5cGU6IGZpbGUudHlwZSB8fCAnJyxcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uOiB0aGlzLmdldFN1ZmZpeEJ5RGVwdGgoZmlsZS5uYW1lLCAyKSwgLy8gbGFzdCB1cCB0byAyIHBhcnRzIGZvciByZXBvcnRpbmdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1pbiBmaWxlIHZhbGlkYXRpb24gKGN1c3RvbSBpbnB1dClcbiAgICAgICAgaWYgKHRoaXMubWluRmlsZVNpemUgJiYgZmlsZS5zaXplIDwgdGhpcy5taW5GaWxlU2l6ZSkge1xuICAgICAgICAgIGVycm9ycy5taW5GaWxlU2l6ZSA9IGVycm9ycy5taW5GaWxlU2l6ZSB8fCBbXTtcbiAgICAgICAgICBlcnJvcnMubWluRmlsZVNpemUucHVzaCh7IG5hbWU6IGZpbGUubmFtZSwgbWluRmlsZVNpemU6IHRoaXMubWluRmlsZVNpemUsIGFjdHVhbEZpbGVTaXplOiBmaWxlLnNpemUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXggZmlsZSB2YWxpZGF0aW9uIChjdXN0b20gaW5wdXQpXG4gICAgICAgIGlmICh0aGlzLm1heEZpbGVTaXplICYmIGZpbGUuc2l6ZSA+IHRoaXMubWF4RmlsZVNpemUpIHtcbiAgICAgICAgICBlcnJvcnMubWF4RmlsZVNpemUgPSBlcnJvcnMubWF4RmlsZVNpemUgfHwgW107XG4gICAgICAgICAgZXJyb3JzLm1heEZpbGVTaXplLnB1c2goeyBuYW1lOiBmaWxlLm5hbWUsIG1heEZpbGVTaXplOiB0aGlzLm1heEZpbGVTaXplLCBhY3R1YWxGaWxlU2l6ZTogZmlsZS5zaXplIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID8gZXJyb3JzIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3VmZml4QnlEZXB0aChmaWxlbmFtZTogc3RyaW5nLCBkZXB0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBtYXRjaCA9IGZpbGVuYW1lLnRvTG93ZXJDYXNlKCkubWF0Y2gobmV3IFJlZ0V4cChgKFxcXFwuW14uXSspezEsJHtkZXB0aH19JGAsICdpJykpO1xuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzBdIDogJyc7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQWNjZXB0KGZpbGU6IEZpbGUsIGFjY2VwdExpc3Q6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmFtZSA9IGZpbGUubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IHR5cGUgPSAoZmlsZS50eXBlIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgZm9yIChjb25zdCBlbnRyeVJhdyBvZiBhY2NlcHRMaXN0KSB7XG4gICAgICBjb25zdCBlbnRyeSA9IGVudHJ5UmF3LnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKCFlbnRyeSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRXh0ZW5zaW9uIGNoZWNrXG4gICAgICBpZiAoZW50cnkuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgICAgIGNvbnN0IGRlcHRoID0gKGVudHJ5Lm1hdGNoKC9cXC4vZykgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3VmZml4QnlEZXB0aChuYW1lLCBkZXB0aCkgPT09IGVudHJ5KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIE1JTUUgY2hlY2tcbiAgICAgIGlmIChlbnRyeS5lbmRzV2l0aCgnLyonKSkge1xuICAgICAgICBjb25zdCBwcmVmaXggPSBlbnRyeS5zbGljZSgwLCBlbnRyeS5sZW5ndGggLSAxKTsgLy8ga2VlcCB0cmFpbGluZyBzbGFzaFxuICAgICAgICBpZiAodHlwZS5zdGFydHNXaXRoKHByZWZpeCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbnRyeS5pbmNsdWRlcygnLycpICYmIHR5cGUgPT09IGVudHJ5KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19