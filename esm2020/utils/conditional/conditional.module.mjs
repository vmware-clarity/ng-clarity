/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIfActive } from './if-active.directive';
import { ClrIfExpanded } from './if-expanded.directive';
import { ClrIfOpen } from './if-open.directive';
import * as i0 from "@angular/core";
export const CONDITIONAL_DIRECTIVES = [ClrIfActive, ClrIfOpen, ClrIfExpanded];
export class ClrConditionalModule {
}
ClrConditionalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrConditionalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrConditionalModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrConditionalModule, declarations: [ClrIfActive, ClrIfOpen, ClrIfExpanded], imports: [CommonModule], exports: [ClrIfActive, ClrIfOpen, ClrIfExpanded] });
ClrConditionalModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrConditionalModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrConditionalModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CONDITIONAL_DIRECTIVES],
                    exports: [CONDITIONAL_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvdXRpbHMvY29uZGl0aW9uYWwvY29uZGl0aW9uYWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQVEsTUFBTSxlQUFlLENBQUM7QUFFL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBRWhELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFnQixDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFPM0YsTUFBTSxPQUFPLG9CQUFvQjs7aUhBQXBCLG9CQUFvQjtrSEFBcEIsb0JBQW9CLGlCQVBtQixXQUFXLEVBQUUsU0FBUyxFQUFFLGFBQWEsYUFHN0UsWUFBWSxhQUg0QixXQUFXLEVBQUUsU0FBUyxFQUFFLGFBQWE7a0hBTzVFLG9CQUFvQixZQUpyQixZQUFZOzJGQUlYLG9CQUFvQjtrQkFMaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFlBQVksRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUN0QyxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJJZkFjdGl2ZSB9IGZyb20gJy4vaWYtYWN0aXZlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDbHJJZkV4cGFuZGVkIH0gZnJvbSAnLi9pZi1leHBhbmRlZC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xySWZPcGVuIH0gZnJvbSAnLi9pZi1vcGVuLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCBjb25zdCBDT05ESVRJT05BTF9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtDbHJJZkFjdGl2ZSwgQ2xySWZPcGVuLCBDbHJJZkV4cGFuZGVkXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NPTkRJVElPTkFMX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ09ORElUSU9OQUxfRElSRUNUSVZFU10sXG59KVxuZXhwb3J0IGNsYXNzIENsckNvbmRpdGlvbmFsTW9kdWxlIHt9XG4iXX0=