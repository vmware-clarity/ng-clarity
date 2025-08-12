/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { OompaLoompa } from '../../utils/chocolate/oompa-loompa';
import * as i0 from "@angular/core";
import * as i1 from "./accordion-willy-wonka";
import * as i2 from "../../utils/conditional/if-expanded.service";
export class AccordionOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, ifExpandService) {
        if (!willyWonka) {
            throw new Error('clr-accordion-panel should only be used inside of clr-accordion');
        }
        super(cdr, willyWonka);
        this.expand = ifExpandService;
    }
    get flavor() {
        return this.expand.expanded;
    }
}
AccordionOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AccordionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.AccordionWillyWonka, optional: true }, { token: i2.IfExpandService }], target: i0.ɵɵFactoryTarget.Directive });
AccordionOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: AccordionOompaLoompa, selector: "clr-accordion-panel", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: AccordionOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-accordion-panel',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.AccordionWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i2.IfExpandService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLW9vbXBhLWxvb21wYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2FjY29yZGlvbi9jaG9jb2xhdGUvYWNjb3JkaW9uLW9vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBcUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7Ozs7QUFPakUsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFdBQVc7SUFHbkQsWUFBWSxHQUFzQixFQUFjLFVBQStCLEVBQUUsZUFBZ0M7UUFDL0csSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztTQUNwRjtRQUNELEtBQUssQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQzs7aUhBYlUsb0JBQW9CO3FHQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFIaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO2lCQUNoQzs7MEJBSXNDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9vbXBhTG9vbXBhIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBJZkV4cGFuZFNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1leHBhbmRlZC5zZXJ2aWNlJztcbmltcG9ydCB7IEFjY29yZGlvbldpbGx5V29ua2EgfSBmcm9tICcuL2FjY29yZGlvbi13aWxseS13b25rYSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Nsci1hY2NvcmRpb24tcGFuZWwnLFxufSlcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb25Pb21wYUxvb21wYSBleHRlbmRzIE9vbXBhTG9vbXBhIHtcbiAgcHJpdmF0ZSBleHBhbmQ6IElmRXhwYW5kU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihjZHI6IENoYW5nZURldGVjdG9yUmVmLCBAT3B0aW9uYWwoKSB3aWxseVdvbmthOiBBY2NvcmRpb25XaWxseVdvbmthLCBpZkV4cGFuZFNlcnZpY2U6IElmRXhwYW5kU2VydmljZSkge1xuICAgIGlmICghd2lsbHlXb25rYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHItYWNjb3JkaW9uLXBhbmVsIHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGNsci1hY2NvcmRpb24nKTtcbiAgICB9XG4gICAgc3VwZXIoY2RyLCB3aWxseVdvbmthKTtcbiAgICB0aGlzLmV4cGFuZCA9IGlmRXhwYW5kU2VydmljZTtcbiAgfVxuXG4gIGdldCBmbGF2b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kLmV4cGFuZGVkO1xuICB9XG59XG4iXX0=