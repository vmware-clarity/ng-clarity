/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import * as i0 from "@angular/core";
import * as i1 from "./stepper-willy-wonka";
import * as i2 from "../../../utils/conditional/if-expanded.service";
export class StepperOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, ifExpandService) {
        if (!willyWonka) {
            throw new Error('clr-stepper-panel should only be used inside of clrStepper');
        }
        super(cdr, willyWonka);
        this.expand = ifExpandService;
    }
    get flavor() {
        return this.expand.expanded;
    }
}
StepperOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StepperOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.StepperWillyWonka, optional: true }, { token: i2.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive });
StepperOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: StepperOompaLoompa, selector: "clr-stepper-panel, [clrStepButton]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StepperOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-stepper-panel, [clrStepButton]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.StepperWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i2.IfExpandService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1vb21wYS1sb29tcGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9hY2NvcmRpb24vc3RlcHBlci9jaG9jb2xhdGUvc3RlcHBlci1vb21wYS1sb29tcGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQXFCLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVDQUF1QyxDQUFDOzs7O0FBT3BFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxXQUFXO0lBR2pELFlBQVksR0FBc0IsRUFBYyxVQUE2QixFQUFFLGVBQWdDO1FBQzdHLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDZixNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUM7U0FDL0U7UUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQzlCLENBQUM7OytHQWJVLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBSDlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9DQUFvQztpQkFDL0M7OzBCQUlzQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPb21wYUxvb21wYSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL2Nob2NvbGF0ZS9vb21wYS1sb29tcGEnO1xuaW1wb3J0IHsgSWZFeHBhbmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvaWYtZXhwYW5kZWQuc2VydmljZSc7XG5pbXBvcnQgeyBTdGVwcGVyV2lsbHlXb25rYSB9IGZyb20gJy4vc3RlcHBlci13aWxseS13b25rYSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1zdGVwcGVyLXBhbmVsLCBbY2xyU3RlcEJ1dHRvbl0nLFxufSlcbmV4cG9ydCBjbGFzcyBTdGVwcGVyT29tcGFMb29tcGEgZXh0ZW5kcyBPb21wYUxvb21wYSB7XG4gIHByaXZhdGUgZXhwYW5kOiBJZkV4cGFuZFNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgQE9wdGlvbmFsKCkgd2lsbHlXb25rYTogU3RlcHBlcldpbGx5V29ua2EsIGlmRXhwYW5kU2VydmljZTogSWZFeHBhbmRTZXJ2aWNlKSB7XG4gICAgaWYgKCF3aWxseVdvbmthKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nsci1zdGVwcGVyLXBhbmVsIHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGNsclN0ZXBwZXInKTtcbiAgICB9XG4gICAgc3VwZXIoY2RyLCB3aWxseVdvbmthKTtcbiAgICB0aGlzLmV4cGFuZCA9IGlmRXhwYW5kU2VydmljZTtcbiAgfVxuXG4gIGdldCBmbGF2b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kLmV4cGFuZGVkO1xuICB9XG59XG4iXX0=