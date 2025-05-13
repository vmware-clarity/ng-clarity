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
ClrComboboxModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrComboboxModule, declarations: [ClrCombobox, ClrComboboxContainer, ClrOptions, ClrOption, ClrOptionSelected, ClrOptionItems], imports: [CommonModule,
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
                    declarations: [ClrCombobox, ClrComboboxContainer, ClrOptions, ClrOption, ClrOptionSelected, ClrOptionItems],
                    exports: [
                        ClrCommonFormsModule,
                        ClrCombobox,
                        ClrComboboxContainer,
                        ClrOptions,
                        ClrOption,
                        ClrOptionSelected,
                        ClrConditionalModule,
                        ClrOptionItems,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYm9ib3gubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvY29tYm9ib3gvY29tYm9ib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsSCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDMUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDOztBQXlCdkMsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM1RixDQUFDOzs4R0FIVSxpQkFBaUI7K0dBQWpCLGlCQUFpQixpQkFaYixXQUFXLEVBQUUsb0JBQW9CLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLGFBVHhHLFlBQVk7UUFDWixXQUFXO1FBQ1gsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQixnQkFBZ0IsYUFJaEIsb0JBQW9CO1FBQ3BCLFdBQVc7UUFDWCxvQkFBb0I7UUFDcEIsVUFBVTtRQUNWLFNBQVM7UUFDVCxpQkFBaUI7UUFDakIsb0JBQW9CO1FBQ3BCLGNBQWM7K0dBR0wsaUJBQWlCLFlBckIxQixZQUFZO1FBQ1osV0FBVztRQUNYLGFBQWE7UUFDYixpQkFBaUI7UUFDakIsb0JBQW9CO1FBQ3BCLG9CQUFvQjtRQUNwQixvQkFBb0I7UUFDcEIsZ0JBQWdCLEVBSWhCLG9CQUFvQjtRQU1wQixvQkFBb0I7MkZBSVgsaUJBQWlCO2tCQXZCN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixXQUFXO3dCQUNYLGFBQWE7d0JBQ2IsaUJBQWlCO3dCQUNqQixvQkFBb0I7d0JBQ3BCLG9CQUFvQjt3QkFDcEIsb0JBQW9CO3dCQUNwQixnQkFBZ0I7cUJBQ2pCO29CQUNELFlBQVksRUFBRSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGNBQWMsQ0FBQztvQkFDM0csT0FBTyxFQUFFO3dCQUNQLG9CQUFvQjt3QkFDcEIsV0FBVzt3QkFDWCxvQkFBb0I7d0JBQ3BCLFVBQVU7d0JBQ1YsU0FBUzt3QkFDVCxpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsY0FBYztxQkFDZjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IGFuZ2xlSWNvbiwgY2hlY2tDaXJjbGVJY29uLCBDbGFyaXR5SWNvbnMsIGV4Y2xhbWF0aW9uQ2lyY2xlSWNvbiwgd2luZG93Q2xvc2VJY29uIH0gZnJvbSAnQGNkcy9jb3JlL2ljb24nO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJTcGlubmVyTW9kdWxlIH0gZnJvbSAnLi4vLi4vcHJvZ3Jlc3Mvc3Bpbm5lci9zcGlubmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb25kaXRpb25hbE1vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2NvbmRpdGlvbmFsLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJLZXlGb2N1c01vZHVsZSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy9rZXktZm9jdXMubW9kdWxlJztcbmltcG9ydCB7IENsclBvcG92ZXJNb2R1bGVOZXh0IH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJDb21tb25Gb3Jtc01vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbWJvYm94IH0gZnJvbSAnLi9jb21ib2JveCc7XG5pbXBvcnQgeyBDbHJDb21ib2JveENvbnRhaW5lciB9IGZyb20gJy4vY29tYm9ib3gtY29udGFpbmVyJztcbmltcG9ydCB7IENsck9wdGlvbiB9IGZyb20gJy4vb3B0aW9uJztcbmltcG9ydCB7IENsck9wdGlvbkl0ZW1zIH0gZnJvbSAnLi9vcHRpb24taXRlbXMuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsck9wdGlvblNlbGVjdGVkIH0gZnJvbSAnLi9vcHRpb24tc2VsZWN0ZWQuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsck9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICAgIENsckljb25Nb2R1bGUsXG4gICAgQ2xyS2V5Rm9jdXNNb2R1bGUsXG4gICAgQ2xyQ29tbW9uRm9ybXNNb2R1bGUsXG4gICAgQ2xyQ29uZGl0aW9uYWxNb2R1bGUsXG4gICAgQ2xyUG9wb3Zlck1vZHVsZU5leHQsXG4gICAgQ2xyU3Bpbm5lck1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbQ2xyQ29tYm9ib3gsIENsckNvbWJvYm94Q29udGFpbmVyLCBDbHJPcHRpb25zLCBDbHJPcHRpb24sIENsck9wdGlvblNlbGVjdGVkLCBDbHJPcHRpb25JdGVtc10sXG4gIGV4cG9ydHM6IFtcbiAgICBDbHJDb21tb25Gb3Jtc01vZHVsZSxcbiAgICBDbHJDb21ib2JveCxcbiAgICBDbHJDb21ib2JveENvbnRhaW5lcixcbiAgICBDbHJPcHRpb25zLFxuICAgIENsck9wdGlvbixcbiAgICBDbHJPcHRpb25TZWxlY3RlZCxcbiAgICBDbHJDb25kaXRpb25hbE1vZHVsZSxcbiAgICBDbHJPcHRpb25JdGVtcyxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ29tYm9ib3hNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXhjbGFtYXRpb25DaXJjbGVJY29uLCBjaGVja0NpcmNsZUljb24sIGFuZ2xlSWNvbiwgd2luZG93Q2xvc2VJY29uKTtcbiAgfVxufVxuIl19