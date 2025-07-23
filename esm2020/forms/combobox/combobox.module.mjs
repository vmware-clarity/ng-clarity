/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { angleIcon, checkCircleIcon, ClarityIcons, exclamationCircleIcon, windowCloseIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrSpinnerModule } from '../../progress/spinner/spinner.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrKeyFocusModule } from '../../utils/focus/key-focus/key-focus.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrCombobox } from './combobox';
import { ClrComboboxContainer } from './combobox-container';
import { ClrOption } from './option';
import { ClrOptionGroup } from './option-group';
import { ClrOptionItems } from './option-items.directive';
import { ClrOptionSelected } from './option-selected.directive';
import { ClrOptions } from './options';
import * as i0 from "@angular/core";
export class ClrComboboxModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, windowCloseIcon);
    }
}
ClrComboboxModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrComboboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxModule, declarations: [ClrCombobox,
        ClrComboboxContainer,
        ClrOptions,
        ClrOption,
        ClrOptionGroup,
        ClrOptionSelected,
        ClrOptionItems], imports: [CommonModule,
        FormsModule,
        ClrIconModule,
        ClrKeyFocusModule,
        ClrCommonFormsModule,
        ClrConditionalModule,
        ClrPopoverModuleNext,
        ClrSpinnerModule], exports: [ClrCommonFormsModule,
        ClrCombobox,
        ClrComboboxContainer,
        ClrOptions,
        ClrOption,
        ClrOptionGroup,
        ClrOptionSelected,
        ClrConditionalModule,
        ClrOptionItems] });
ClrComboboxModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxModule, imports: [CommonModule,
        FormsModule,
        ClrIconModule,
        ClrKeyFocusModule,
        ClrCommonFormsModule,
        ClrConditionalModule,
        ClrPopoverModuleNext,
        ClrSpinnerModule, ClrCommonFormsModule,
        ClrConditionalModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ClrIconModule,
                        ClrKeyFocusModule,
                        ClrCommonFormsModule,
                        ClrConditionalModule,
                        ClrPopoverModuleNext,
                        ClrSpinnerModule,
                    ],
                    declarations: [
                        ClrCombobox,
                        ClrComboboxContainer,
                        ClrOptions,
                        ClrOption,
                        ClrOptionGroup,
                        ClrOptionSelected,
                        ClrOptionItems,
                    ],
                    exports: [
                        ClrCommonFormsModule,
                        ClrCombobox,
                        ClrComboboxContainer,
                        ClrOptions,
                        ClrOption,
                        ClrOptionGroup,
                        ClrOptionSelected,
                        ClrConditionalModule,
                        ClrOptionItems,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvY29tYm9ib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsSCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDMUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFdBQVcsQ0FBQzs7QUFrQ3ZDLE1BQU0sT0FBTyxpQkFBaUI7SUFDNUI7UUFDRSxZQUFZLENBQUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDNUYsQ0FBQzs7OEdBSFUsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBcEIxQixXQUFXO1FBQ1gsb0JBQW9CO1FBQ3BCLFVBQVU7UUFDVixTQUFTO1FBQ1QsY0FBYztRQUNkLGlCQUFpQjtRQUNqQixjQUFjLGFBaEJkLFlBQVk7UUFDWixXQUFXO1FBQ1gsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQixnQkFBZ0IsYUFZaEIsb0JBQW9CO1FBQ3BCLFdBQVc7UUFDWCxvQkFBb0I7UUFDcEIsVUFBVTtRQUNWLFNBQVM7UUFDVCxjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQixjQUFjOytHQUdMLGlCQUFpQixZQTlCMUIsWUFBWTtRQUNaLFdBQVc7UUFDWCxhQUFhO1FBQ2IsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsb0JBQW9CO1FBQ3BCLGdCQUFnQixFQVloQixvQkFBb0I7UUFPcEIsb0JBQW9COzJGQUlYLGlCQUFpQjtrQkFoQzdCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxhQUFhO3dCQUNiLGlCQUFpQjt3QkFDakIsb0JBQW9CO3dCQUNwQixvQkFBb0I7d0JBQ3BCLG9CQUFvQjt3QkFDcEIsZ0JBQWdCO3FCQUNqQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVzt3QkFDWCxvQkFBb0I7d0JBQ3BCLFVBQVU7d0JBQ1YsU0FBUzt3QkFDVCxjQUFjO3dCQUNkLGlCQUFpQjt3QkFDakIsY0FBYztxQkFDZjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asb0JBQW9CO3dCQUNwQixXQUFXO3dCQUNYLG9CQUFvQjt3QkFDcEIsVUFBVTt3QkFDVixTQUFTO3dCQUNULGNBQWM7d0JBQ2QsaUJBQWlCO3dCQUNqQixvQkFBb0I7d0JBQ3BCLGNBQWM7cUJBQ2Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBhbmdsZUljb24sIGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24sIHdpbmRvd0Nsb3NlSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyU3Bpbm5lck1vZHVsZSB9IGZyb20gJy4uLy4uL3Byb2dyZXNzL3NwaW5uZXIvc3Bpbm5lci5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29uZGl0aW9uYWxNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9jb25kaXRpb25hbC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyS2V5Rm9jdXNNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMva2V5LWZvY3VzLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyTW9kdWxlTmV4dCB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uRm9ybXNNb2R1bGUgfSBmcm9tICcuLi9jb21tb24vY29tbW9uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb21ib2JveCB9IGZyb20gJy4vY29tYm9ib3gnO1xuaW1wb3J0IHsgQ2xyQ29tYm9ib3hDb250YWluZXIgfSBmcm9tICcuL2NvbWJvYm94LWNvbnRhaW5lcic7XG5pbXBvcnQgeyBDbHJPcHRpb24gfSBmcm9tICcuL29wdGlvbic7XG5pbXBvcnQgeyBDbHJPcHRpb25Hcm91cCB9IGZyb20gJy4vb3B0aW9uLWdyb3VwJztcbmltcG9ydCB7IENsck9wdGlvbkl0ZW1zIH0gZnJvbSAnLi9vcHRpb24taXRlbXMuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsck9wdGlvblNlbGVjdGVkIH0gZnJvbSAnLi9vcHRpb24tc2VsZWN0ZWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsck9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIENsckljb25Nb2R1bGUsXG4gICAgQ2xyS2V5Rm9jdXNNb2R1bGUsXG4gICAgQ2xyQ29tbW9uRm9ybXNNb2R1bGUsXG4gICAgQ2xyQ29uZGl0aW9uYWxNb2R1bGUsXG4gICAgQ2xyUG9wb3Zlck1vZHVsZU5leHQsXG4gICAgQ2xyU3Bpbm5lck1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ2xyQ29tYm9ib3gsXG4gICAgQ2xyQ29tYm9ib3hDb250YWluZXIsXG4gICAgQ2xyT3B0aW9ucyxcbiAgICBDbHJPcHRpb24sXG4gICAgQ2xyT3B0aW9uR3JvdXAsXG4gICAgQ2xyT3B0aW9uU2VsZWN0ZWQsXG4gICAgQ2xyT3B0aW9uSXRlbXMsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBDbHJDb21tb25Gb3Jtc01vZHVsZSxcbiAgICBDbHJDb21ib2JveCxcbiAgICBDbHJDb21ib2JveENvbnRhaW5lcixcbiAgICBDbHJPcHRpb25zLFxuICAgIENsck9wdGlvbixcbiAgICBDbHJPcHRpb25Hcm91cCxcbiAgICBDbHJPcHRpb25TZWxlY3RlZCxcbiAgICBDbHJDb25kaXRpb25hbE1vZHVsZSxcbiAgICBDbHJPcHRpb25JdGVtcyxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ29tYm9ib3hNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXhjbGFtYXRpb25DaXJjbGVJY29uLCBjaGVja0NpcmNsZUljb24sIGFuZ2xlSWNvbiwgd2luZG93Q2xvc2VJY29uKTtcbiAgfVxufVxuIl19