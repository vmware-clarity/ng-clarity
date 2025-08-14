/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { angleIcon, ClarityIcons } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrExpandableAnimationModule } from '../../utils/animations/expandable-animation/expandable-animation.module';
import { ClrStackBlock } from './stack-block';
import { ClrStackContentInput } from './stack-content-input';
import { ClrStackHeader } from './stack-header';
import { ClrStackView } from './stack-view';
import { ClrStackViewCustomTags, ClrStackViewLabel } from './stack-view-custom-tags';
import * as i0 from "@angular/core";
export const CLR_STACK_VIEW_DIRECTIVES = [
    ClrStackView,
    ClrStackHeader,
    ClrStackBlock,
    ClrStackContentInput,
    ClrStackViewLabel,
    ClrStackViewCustomTags,
];
export class ClrStackViewModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
}
ClrStackViewModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrStackViewModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewModule, declarations: [ClrStackView,
        ClrStackHeader,
        ClrStackBlock,
        ClrStackContentInput,
        ClrStackViewLabel,
        ClrStackViewCustomTags], imports: [CommonModule, FormsModule, ClrIconModule, ClrExpandableAnimationModule], exports: [ClrStackView,
        ClrStackHeader,
        ClrStackBlock,
        ClrStackContentInput,
        ClrStackViewLabel,
        ClrStackViewCustomTags] });
ClrStackViewModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrExpandableAnimationModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStackViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrExpandableAnimationModule],
                    declarations: [CLR_STACK_VIEW_DIRECTIVES],
                    exports: [CLR_STACK_VIEW_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stdmlldy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL3N0YWNrLXZpZXcvc3RhY2stdmlldy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0seUVBQXlFLENBQUM7QUFDdkgsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFckYsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQWdCO0lBQ3BELFlBQVk7SUFDWixjQUFjO0lBQ2QsYUFBYTtJQUNiLG9CQUFvQjtJQUNwQixpQkFBaUI7SUFDakIsc0JBQXNCO0NBQ3ZCLENBQUM7QUFPRixNQUFNLE9BQU8sa0JBQWtCO0lBQzdCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDOzsrR0FIVSxrQkFBa0I7Z0hBQWxCLGtCQUFrQixpQkFiN0IsWUFBWTtRQUNaLGNBQWM7UUFDZCxhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQixzQkFBc0IsYUFJWixZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSw0QkFBNEIsYUFUaEYsWUFBWTtRQUNaLGNBQWM7UUFDZCxhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQixzQkFBc0I7Z0hBUVgsa0JBQWtCLFlBSm5CLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLDRCQUE0QjsyRkFJckUsa0JBQWtCO2tCQUw5QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLDRCQUE0QixDQUFDO29CQUNqRixZQUFZLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztvQkFDekMsT0FBTyxFQUFFLENBQUMseUJBQXlCLENBQUM7aUJBQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgYW5nbGVJY29uLCBDbGFyaXR5SWNvbnMgfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckV4cGFuZGFibGVBbmltYXRpb25Nb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9hbmltYXRpb25zL2V4cGFuZGFibGUtYW5pbWF0aW9uL2V4cGFuZGFibGUtYW5pbWF0aW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJTdGFja0Jsb2NrIH0gZnJvbSAnLi9zdGFjay1ibG9jayc7XG5pbXBvcnQgeyBDbHJTdGFja0NvbnRlbnRJbnB1dCB9IGZyb20gJy4vc3RhY2stY29udGVudC1pbnB1dCc7XG5pbXBvcnQgeyBDbHJTdGFja0hlYWRlciB9IGZyb20gJy4vc3RhY2staGVhZGVyJztcbmltcG9ydCB7IENsclN0YWNrVmlldyB9IGZyb20gJy4vc3RhY2stdmlldyc7XG5pbXBvcnQgeyBDbHJTdGFja1ZpZXdDdXN0b21UYWdzLCBDbHJTdGFja1ZpZXdMYWJlbCB9IGZyb20gJy4vc3RhY2stdmlldy1jdXN0b20tdGFncyc7XG5cbmV4cG9ydCBjb25zdCBDTFJfU1RBQ0tfVklFV19ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcbiAgQ2xyU3RhY2tWaWV3LFxuICBDbHJTdGFja0hlYWRlcixcbiAgQ2xyU3RhY2tCbG9jayxcbiAgQ2xyU3RhY2tDb250ZW50SW5wdXQsXG4gIENsclN0YWNrVmlld0xhYmVsLFxuICBDbHJTdGFja1ZpZXdDdXN0b21UYWdzLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIENsckljb25Nb2R1bGUsIENsckV4cGFuZGFibGVBbmltYXRpb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtDTFJfU1RBQ0tfVklFV19ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0NMUl9TVEFDS19WSUVXX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTdGFja1ZpZXdNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoYW5nbGVJY29uKTtcbiAgfVxufVxuIl19