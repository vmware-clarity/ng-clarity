/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EXPANDABLE_ANIMATION_DIRECTIVES } from './index';
import * as i0 from "@angular/core";
import * as i1 from "./expandable-animation";
import * as i2 from "./expandable-animation.directive";
export class ClrExpandableAnimationModule {
}
ClrExpandableAnimationModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrExpandableAnimationModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationModule, declarations: [i1.ClrExpandableAnimation, i2.ClrExpandableAnimationDirective], imports: [CommonModule], exports: [i1.ClrExpandableAnimation, i2.ClrExpandableAnimationDirective] });
ClrExpandableAnimationModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrExpandableAnimationModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [EXPANDABLE_ANIMATION_DIRECTIVES],
                    exports: [EXPANDABLE_ANIMATION_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kYWJsZS1hbmltYXRpb24ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvYW5pbWF0aW9ucy9leHBhbmRhYmxlLWFuaW1hdGlvbi9leHBhbmRhYmxlLWFuaW1hdGlvbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxTQUFTLENBQUM7Ozs7QUFPMUQsTUFBTSxPQUFPLDRCQUE0Qjs7eUhBQTVCLDRCQUE0QjswSEFBNUIsNEJBQTRCLDJGQUo3QixZQUFZOzBIQUlYLDRCQUE0QixZQUo3QixZQUFZOzJGQUlYLDRCQUE0QjtrQkFMeEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLCtCQUErQixDQUFDO29CQUMvQyxPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztpQkFDM0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBFWFBBTkRBQkxFX0FOSU1BVElPTl9ESVJFQ1RJVkVTIH0gZnJvbSAnLi9pbmRleCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtFWFBBTkRBQkxFX0FOSU1BVElPTl9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0VYUEFOREFCTEVfQU5JTUFUSU9OX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJFeHBhbmRhYmxlQW5pbWF0aW9uTW9kdWxlIHt9XG4iXX0=