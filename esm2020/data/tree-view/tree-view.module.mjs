/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrLoadingModule } from '../../utils/loading/loading.module';
import { RecursiveChildren } from './recursive-children';
import { ClrRecursiveForOf } from './recursive-for-of';
import { ClrTree } from './tree';
import { ClrTreeNode } from './tree-node';
import { ClrTreeNodeLink } from './tree-node-link';
import * as i0 from "@angular/core";
export const CLR_TREE_VIEW_DIRECTIVES = [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink];
export class ClrTreeViewModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
}
ClrTreeViewModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrTreeViewModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeViewModule, declarations: [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink, RecursiveChildren], imports: [CommonModule, ClrIconModule, ClrLoadingModule], exports: [ClrTree, ClrTreeNode, ClrRecursiveForOf, ClrTreeNodeLink] });
ClrTreeViewModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeViewModule, imports: [CommonModule, ClrIconModule, ClrLoadingModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTreeViewModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrLoadingModule],
                    declarations: [CLR_TREE_VIEW_DIRECTIVES, RecursiveChildren],
                    exports: [CLR_TREE_VIEW_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvdHJlZS12aWV3L3RyZWUtdmlldy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBUSxNQUFNLGVBQWUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXpELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztBQUVuRCxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBZ0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBT2hILE1BQU0sT0FBTyxpQkFBaUI7SUFDNUI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7OzhHQUhVLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQVB3QixPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFJbkUsaUJBQWlCLGFBRGhELFlBQVksRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLGFBSEgsT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxlQUFlOytHQU9qRyxpQkFBaUIsWUFKbEIsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0I7MkZBSTVDLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDO29CQUN4RCxZQUFZLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxpQkFBaUIsQ0FBQztvQkFDM0QsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7aUJBQ3BDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUsIFR5cGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFuZ2xlSWNvbiwgQ2xhcml0eUljb25zIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJMb2FkaW5nTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbG9hZGluZy9sb2FkaW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBSZWN1cnNpdmVDaGlsZHJlbiB9IGZyb20gJy4vcmVjdXJzaXZlLWNoaWxkcmVuJztcbmltcG9ydCB7IENsclJlY3Vyc2l2ZUZvck9mIH0gZnJvbSAnLi9yZWN1cnNpdmUtZm9yLW9mJztcbmltcG9ydCB7IENsclRyZWUgfSBmcm9tICcuL3RyZWUnO1xuaW1wb3J0IHsgQ2xyVHJlZU5vZGUgfSBmcm9tICcuL3RyZWUtbm9kZSc7XG5pbXBvcnQgeyBDbHJUcmVlTm9kZUxpbmsgfSBmcm9tICcuL3RyZWUtbm9kZS1saW5rJztcblxuZXhwb3J0IGNvbnN0IENMUl9UUkVFX1ZJRVdfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbQ2xyVHJlZSwgQ2xyVHJlZU5vZGUsIENsclJlY3Vyc2l2ZUZvck9mLCBDbHJUcmVlTm9kZUxpbmtdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJMb2FkaW5nTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQ0xSX1RSRUVfVklFV19ESVJFQ1RJVkVTLCBSZWN1cnNpdmVDaGlsZHJlbl0sXG4gIGV4cG9ydHM6IFtDTFJfVFJFRV9WSUVXX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUcmVlVmlld01vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhhbmdsZUljb24pO1xuICB9XG59XG4iXX0=