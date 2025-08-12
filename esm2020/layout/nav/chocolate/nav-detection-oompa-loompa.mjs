/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import * as i0 from "@angular/core";
import * as i1 from "./main-container-willy-wonka";
import * as i2 from "../providers/responsive-navigation.service";
export class NavDetectionOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, responsiveNavService) {
        if (!willyWonka) {
            throw new Error('clr-header should only be used inside of a clr-main-container');
        }
        super(cdr, willyWonka);
        this.responsiveNavService = responsiveNavService;
    }
    // NavDetectionOompaLoompa is the addition of the nav levels
    // Since we support 2 levels, the possibilities are 0, 1 or 3 (1 + 2)
    get flavor() {
        return this.responsiveNavService.responsiveNavList.reduce((sum, navLevel) => sum + navLevel, 0);
    }
}
NavDetectionOompaLoompa.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NavDetectionOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.MainContainerWillyWonka, optional: true }, { token: i2.ResponsiveNavigationService }], target: i0.ɵɵFactoryTarget.Directive });
NavDetectionOompaLoompa.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: NavDetectionOompaLoompa, selector: "clr-header", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NavDetectionOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-header',
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.MainContainerWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: i2.ResponsiveNavigationService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWRldGVjdGlvbi1vb21wYS1sb29tcGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvbmF2L2Nob2NvbGF0ZS9uYXYtZGV0ZWN0aW9uLW9vbXBhLWxvb21wYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBcUIsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7Ozs7QUFPcEUsTUFBTSxPQUFPLHVCQUF3QixTQUFRLFdBQVc7SUFHdEQsWUFDRSxHQUFzQixFQUNWLFVBQW1DLEVBQy9DLG9CQUFpRDtRQUVqRCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO1NBQ2xGO1FBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7SUFDbkQsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxxRUFBcUU7SUFDckUsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDOztvSEFuQlUsdUJBQXVCO3dHQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFIbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtpQkFDdkI7OzBCQU1JLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9vbXBhTG9vbXBhIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY2hvY29sYXRlL29vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBSZXNwb25zaXZlTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvcmVzcG9uc2l2ZS1uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWFpbkNvbnRhaW5lcldpbGx5V29ua2EgfSBmcm9tICcuL21haW4tY29udGFpbmVyLXdpbGx5LXdvbmthJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnY2xyLWhlYWRlcicsXG59KVxuZXhwb3J0IGNsYXNzIE5hdkRldGVjdGlvbk9vbXBhTG9vbXBhIGV4dGVuZHMgT29tcGFMb29tcGEge1xuICBwcml2YXRlIHJlc3BvbnNpdmVOYXZTZXJ2aWNlOiBSZXNwb25zaXZlTmF2aWdhdGlvblNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSB3aWxseVdvbmthOiBNYWluQ29udGFpbmVyV2lsbHlXb25rYSxcbiAgICByZXNwb25zaXZlTmF2U2VydmljZTogUmVzcG9uc2l2ZU5hdmlnYXRpb25TZXJ2aWNlXG4gICkge1xuICAgIGlmICghd2lsbHlXb25rYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHItaGVhZGVyIHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGEgY2xyLW1haW4tY29udGFpbmVyJyk7XG4gICAgfVxuICAgIHN1cGVyKGNkciwgd2lsbHlXb25rYSk7XG4gICAgdGhpcy5yZXNwb25zaXZlTmF2U2VydmljZSA9IHJlc3BvbnNpdmVOYXZTZXJ2aWNlO1xuICB9XG5cbiAgLy8gTmF2RGV0ZWN0aW9uT29tcGFMb29tcGEgaXMgdGhlIGFkZGl0aW9uIG9mIHRoZSBuYXYgbGV2ZWxzXG4gIC8vIFNpbmNlIHdlIHN1cHBvcnQgMiBsZXZlbHMsIHRoZSBwb3NzaWJpbGl0aWVzIGFyZSAwLCAxIG9yIDMgKDEgKyAyKVxuICBnZXQgZmxhdm9yKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3BvbnNpdmVOYXZTZXJ2aWNlLnJlc3BvbnNpdmVOYXZMaXN0LnJlZHVjZSgoc3VtLCBuYXZMZXZlbCkgPT4gc3VtICsgbmF2TGV2ZWwsIDApO1xuICB9XG59XG4iXX0=