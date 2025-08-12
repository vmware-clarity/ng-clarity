/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrDropdown } from './dropdown';
import { ClrDropdownItem } from './dropdown-item';
import { ClrDropdownMenu } from './dropdown-menu';
import { ClrDropdownTrigger } from './dropdown-trigger';
import * as i0 from "@angular/core";
export const CLR_DROPDOWN_DIRECTIVES = [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem];
export class ClrDropdownModule {
}
ClrDropdownModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrDropdownModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownModule, declarations: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem], imports: [CommonModule], exports: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem, ClrConditionalModule, ClrIconModule] });
ClrDropdownModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownModule, imports: [CommonModule, ClrConditionalModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_DROPDOWN_DIRECTIVES],
                    exports: [CLR_DROPDOWN_DIRECTIVES, ClrConditionalModule, ClrIconModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci9kcm9wZG93bi9kcm9wZG93bi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOztBQUV4RCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBZ0IsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBT3hILE1BQU0sT0FBTyxpQkFBaUI7OzhHQUFqQixpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFQdUIsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLGFBRzFHLFlBQVksYUFINkIsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBS2pGLG9CQUFvQixFQUFFLGFBQWE7K0dBRTNELGlCQUFpQixZQUpsQixZQUFZLEVBRWEsb0JBQW9CLEVBQUUsYUFBYTsyRkFFM0QsaUJBQWlCO2tCQUw3QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLHVCQUF1QixFQUFFLG9CQUFvQixFQUFFLGFBQWEsQ0FBQztpQkFDeEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb25kaXRpb25hbE1vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2NvbmRpdGlvbmFsLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuaW1wb3J0IHsgQ2xyRHJvcGRvd25JdGVtIH0gZnJvbSAnLi9kcm9wZG93bi1pdGVtJztcbmltcG9ydCB7IENsckRyb3Bkb3duTWVudSB9IGZyb20gJy4vZHJvcGRvd24tbWVudSc7XG5pbXBvcnQgeyBDbHJEcm9wZG93blRyaWdnZXIgfSBmcm9tICcuL2Ryb3Bkb3duLXRyaWdnZXInO1xuXG5leHBvcnQgY29uc3QgQ0xSX0RST1BET1dOX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW0NsckRyb3Bkb3duLCBDbHJEcm9wZG93bk1lbnUsIENsckRyb3Bkb3duVHJpZ2dlciwgQ2xyRHJvcGRvd25JdGVtXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9EUk9QRE9XTl9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0NMUl9EUk9QRE9XTl9ESVJFQ1RJVkVTLCBDbHJDb25kaXRpb25hbE1vZHVsZSwgQ2xySWNvbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRyb3Bkb3duTW9kdWxlIHt9XG4iXX0=