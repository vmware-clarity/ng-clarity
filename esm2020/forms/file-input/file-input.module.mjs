/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, folderOpenIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrFileInput } from './file-input';
import { ClrFileInputContainer } from './file-input-container';
import { ClrFileInputValidator } from './file-input-validator';
import { ClrFileInputValueAccessor } from './file-input-value-accessor';
import { ClrFileList } from './file-list';
import { ClrFileError, ClrFileInfo, ClrFileSuccess } from './file-messages';
import { ClrFileMessagesTemplate } from './file-messages-template';
import * as i0 from "@angular/core";
export class ClrFileInputModule {
    constructor() {
        ClarityIcons.addIcons(folderOpenIcon);
    }
}
ClrFileInputModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrFileInputModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputModule, declarations: [ClrFileInput,
        ClrFileInputContainer,
        ClrFileInputValidator,
        ClrFileInputValueAccessor,
        ClrFileList,
        ClrFileMessagesTemplate,
        ClrFileInfo,
        ClrFileSuccess,
        ClrFileError], imports: [CommonModule, ClrIconModule, ClrCommonFormsModule], exports: [ClrCommonFormsModule,
        ClrFileInput,
        ClrFileInputContainer,
        ClrFileInputValidator,
        ClrFileInputValueAccessor,
        ClrFileList,
        ClrFileMessagesTemplate,
        ClrFileInfo,
        ClrFileSuccess,
        ClrFileError] });
ClrFileInputModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputModule, imports: [CommonModule, ClrIconModule, ClrCommonFormsModule, ClrCommonFormsModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrFileInputModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrCommonFormsModule],
                    declarations: [
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                    exports: [
                        ClrCommonFormsModule,
                        ClrFileInput,
                        ClrFileInputContainer,
                        ClrFileInputValidator,
                        ClrFileInputValueAccessor,
                        ClrFileList,
                        ClrFileMessagesTemplate,
                        ClrFileInfo,
                        ClrFileSuccess,
                        ClrFileError,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbnB1dC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9maWxlLWlucHV0L2ZpbGUtaW5wdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQTRCbkUsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7K0dBSFUsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBdkIzQixZQUFZO1FBQ1oscUJBQXFCO1FBQ3JCLHFCQUFxQjtRQUNyQix5QkFBeUI7UUFDekIsV0FBVztRQUNYLHVCQUF1QjtRQUN2QixXQUFXO1FBQ1gsY0FBYztRQUNkLFlBQVksYUFWSixZQUFZLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixhQWF6RCxvQkFBb0I7UUFDcEIsWUFBWTtRQUNaLHFCQUFxQjtRQUNyQixxQkFBcUI7UUFDckIseUJBQXlCO1FBQ3pCLFdBQVc7UUFDWCx1QkFBdUI7UUFDdkIsV0FBVztRQUNYLGNBQWM7UUFDZCxZQUFZO2dIQUdILGtCQUFrQixZQXpCbkIsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFhekQsb0JBQW9COzJGQVlYLGtCQUFrQjtrQkExQjlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQztvQkFDNUQsWUFBWSxFQUFFO3dCQUNaLFlBQVk7d0JBQ1oscUJBQXFCO3dCQUNyQixxQkFBcUI7d0JBQ3JCLHlCQUF5Qjt3QkFDekIsV0FBVzt3QkFDWCx1QkFBdUI7d0JBQ3ZCLFdBQVc7d0JBQ1gsY0FBYzt3QkFDZCxZQUFZO3FCQUNiO29CQUNELE9BQU8sRUFBRTt3QkFDUCxvQkFBb0I7d0JBQ3BCLFlBQVk7d0JBQ1oscUJBQXFCO3dCQUNyQixxQkFBcUI7d0JBQ3JCLHlCQUF5Qjt3QkFDekIsV0FBVzt3QkFDWCx1QkFBdUI7d0JBQ3ZCLFdBQVc7d0JBQ1gsY0FBYzt3QkFDZCxZQUFZO3FCQUNiO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENsYXJpdHlJY29ucywgZm9sZGVyT3Blbkljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbW1vbkZvcm1zTW9kdWxlIH0gZnJvbSAnLi4vY29tbW9uL2NvbW1vbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyRmlsZUlucHV0IH0gZnJvbSAnLi9maWxlLWlucHV0JztcbmltcG9ydCB7IENsckZpbGVJbnB1dENvbnRhaW5lciB9IGZyb20gJy4vZmlsZS1pbnB1dC1jb250YWluZXInO1xuaW1wb3J0IHsgQ2xyRmlsZUlucHV0VmFsaWRhdG9yIH0gZnJvbSAnLi9maWxlLWlucHV0LXZhbGlkYXRvcic7XG5pbXBvcnQgeyBDbHJGaWxlSW5wdXRWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnLi9maWxlLWlucHV0LXZhbHVlLWFjY2Vzc29yJztcbmltcG9ydCB7IENsckZpbGVMaXN0IH0gZnJvbSAnLi9maWxlLWxpc3QnO1xuaW1wb3J0IHsgQ2xyRmlsZUVycm9yLCBDbHJGaWxlSW5mbywgQ2xyRmlsZVN1Y2Nlc3MgfSBmcm9tICcuL2ZpbGUtbWVzc2FnZXMnO1xuaW1wb3J0IHsgQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGUgfSBmcm9tICcuL2ZpbGUtbWVzc2FnZXMtdGVtcGxhdGUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJDb21tb25Gb3Jtc01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENsckZpbGVJbnB1dCxcbiAgICBDbHJGaWxlSW5wdXRDb250YWluZXIsXG4gICAgQ2xyRmlsZUlucHV0VmFsaWRhdG9yLFxuICAgIENsckZpbGVJbnB1dFZhbHVlQWNjZXNzb3IsXG4gICAgQ2xyRmlsZUxpc3QsXG4gICAgQ2xyRmlsZU1lc3NhZ2VzVGVtcGxhdGUsXG4gICAgQ2xyRmlsZUluZm8sXG4gICAgQ2xyRmlsZVN1Y2Nlc3MsXG4gICAgQ2xyRmlsZUVycm9yLFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQ2xyQ29tbW9uRm9ybXNNb2R1bGUsXG4gICAgQ2xyRmlsZUlucHV0LFxuICAgIENsckZpbGVJbnB1dENvbnRhaW5lcixcbiAgICBDbHJGaWxlSW5wdXRWYWxpZGF0b3IsXG4gICAgQ2xyRmlsZUlucHV0VmFsdWVBY2Nlc3NvcixcbiAgICBDbHJGaWxlTGlzdCxcbiAgICBDbHJGaWxlTWVzc2FnZXNUZW1wbGF0ZSxcbiAgICBDbHJGaWxlSW5mbyxcbiAgICBDbHJGaWxlU3VjY2VzcyxcbiAgICBDbHJGaWxlRXJyb3IsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENsckZpbGVJbnB1dE1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhmb2xkZXJPcGVuSWNvbik7XG4gIH1cbn1cbiJdfQ==