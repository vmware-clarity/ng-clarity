/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrSelect } from './select';
import { ClrSelectContainer } from './select-container';
import * as i0 from "@angular/core";
export class ClrSelectModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon);
    }
}
ClrSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrSelectModule, declarations: [ClrSelect, ClrSelectContainer], imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule, ClrSelect, ClrSelectContainer] });
ClrSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSelectModule, imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [ClrSelect, ClrSelectContainer],
                    exports: [ClrCommonFormsModule, ClrSelect, ClrSelectContainer],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL3NlbGVjdC9zZWxlY3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBT3hELE1BQU0sT0FBTyxlQUFlO0lBQzFCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNoRSxDQUFDOzs0R0FIVSxlQUFlOzZHQUFmLGVBQWUsaUJBSFgsU0FBUyxFQUFFLGtCQUFrQixhQURsQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsYUFFOUQsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLGtCQUFrQjs2R0FFbEQsZUFBZSxZQUpoQixZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFFOUQsb0JBQW9COzJGQUVuQixlQUFlO2tCQUwzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixDQUFDO29CQUN6RSxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUM7b0JBQzdDLE9BQU8sRUFBRSxDQUFDLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQztpQkFDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBjaGVja0NpcmNsZUljb24sIENsYXJpdHlJY29ucywgZXhjbGFtYXRpb25DaXJjbGVJY29uIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb21tb25Gb3Jtc01vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENsclNlbGVjdCB9IGZyb20gJy4vc2VsZWN0JztcbmltcG9ydCB7IENsclNlbGVjdENvbnRhaW5lciB9IGZyb20gJy4vc2VsZWN0LWNvbnRhaW5lcic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJDb21tb25Gb3Jtc01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NsclNlbGVjdCwgQ2xyU2VsZWN0Q29udGFpbmVyXSxcbiAgZXhwb3J0czogW0NsckNvbW1vbkZvcm1zTW9kdWxlLCBDbHJTZWxlY3QsIENsclNlbGVjdENvbnRhaW5lcl0sXG59KVxuZXhwb3J0IGNsYXNzIENsclNlbGVjdE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhleGNsYW1hdGlvbkNpcmNsZUljb24sIGNoZWNrQ2lyY2xlSWNvbik7XG4gIH1cbn1cbiJdfQ==