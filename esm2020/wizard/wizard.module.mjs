/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, errorStandardIcon, successStandardIcon } from '@cds/core/icon';
import { ClrAlertModule } from '../emphasis/alert/alert.module';
import { ClrModalModule } from '../modal/modal.module';
import { ClrWizard } from './wizard';
import { ClrWizardButton } from './wizard-button';
import { ClrWizardHeaderAction } from './wizard-header-action';
import { ClrWizardPage } from './wizard-page';
import { ClrWizardPageButtons } from './wizard-page-buttons';
import { ClrWizardPageHeaderActions } from './wizard-page-header-actions';
import { ClrWizardPageNavTitle } from './wizard-page-navtitle';
import { ClrWizardPageTitle } from './wizard-page-title';
import { ClrWizardStepnav } from './wizard-stepnav';
import { ClrWizardStepnavItem } from './wizard-stepnav-item';
import { ClrWizardTitle } from './wizard-title';
import * as i0 from "@angular/core";
export const CLR_WIZARD_DIRECTIVES = [
    ClrWizard,
    ClrWizardPage,
    ClrWizardStepnav,
    ClrWizardStepnavItem,
    ClrWizardButton,
    ClrWizardHeaderAction,
    ClrWizardTitle,
    ClrWizardPageTitle,
    ClrWizardPageNavTitle,
    ClrWizardPageButtons,
    ClrWizardPageHeaderActions,
];
export class ClrWizardModule {
    constructor() {
        ClarityIcons.addIcons(errorStandardIcon, successStandardIcon);
    }
}
ClrWizardModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrWizardModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardModule, declarations: [ClrWizard,
        ClrWizardPage,
        ClrWizardStepnav,
        ClrWizardStepnavItem,
        ClrWizardButton,
        ClrWizardHeaderAction,
        ClrWizardTitle,
        ClrWizardPageTitle,
        ClrWizardPageNavTitle,
        ClrWizardPageButtons,
        ClrWizardPageHeaderActions], imports: [CommonModule, ClrModalModule, ClrAlertModule], exports: [ClrWizard,
        ClrWizardPage,
        ClrWizardStepnav,
        ClrWizardStepnavItem,
        ClrWizardButton,
        ClrWizardHeaderAction,
        ClrWizardTitle,
        ClrWizardPageTitle,
        ClrWizardPageNavTitle,
        ClrWizardPageButtons,
        ClrWizardPageHeaderActions] });
ClrWizardModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardModule, imports: [CommonModule, ClrModalModule, ClrAlertModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrWizardModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrModalModule, ClrAlertModule],
                    declarations: [CLR_WIZARD_DIRECTIVES],
                    exports: [CLR_WIZARD_DIRECTIVES],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l6YXJkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3dpemFyZC93aXphcmQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNoRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDL0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBRWhELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFVO0lBQzFDLFNBQVM7SUFDVCxhQUFhO0lBQ2IsZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQixlQUFlO0lBQ2YscUJBQXFCO0lBQ3JCLGNBQWM7SUFDZCxrQkFBa0I7SUFDbEIscUJBQXFCO0lBQ3JCLG9CQUFvQjtJQUNwQiwwQkFBMEI7Q0FDM0IsQ0FBQztBQU9GLE1BQU0sT0FBTyxlQUFlO0lBQzFCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OzRHQUhVLGVBQWU7NkdBQWYsZUFBZSxpQkFsQjFCLFNBQVM7UUFDVCxhQUFhO1FBQ2IsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQixlQUFlO1FBQ2YscUJBQXFCO1FBQ3JCLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLG9CQUFvQjtRQUNwQiwwQkFBMEIsYUFJaEIsWUFBWSxFQUFFLGNBQWMsRUFBRSxjQUFjLGFBZHRELFNBQVM7UUFDVCxhQUFhO1FBQ2IsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQixlQUFlO1FBQ2YscUJBQXFCO1FBQ3JCLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLG9CQUFvQjtRQUNwQiwwQkFBMEI7NkdBUWYsZUFBZSxZQUpoQixZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWM7MkZBSTNDLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUM7b0JBQ3ZELFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztpQkFDakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2xhcml0eUljb25zLCBlcnJvclN0YW5kYXJkSWNvbiwgc3VjY2Vzc1N0YW5kYXJkSWNvbiB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xyQWxlcnRNb2R1bGUgfSBmcm9tICcuLi9lbXBoYXNpcy9hbGVydC9hbGVydC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyTW9kYWxNb2R1bGUgfSBmcm9tICcuLi9tb2RhbC9tb2RhbC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkIH0gZnJvbSAnLi93aXphcmQnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkQnV0dG9uIH0gZnJvbSAnLi93aXphcmQtYnV0dG9uJztcbmltcG9ydCB7IENscldpemFyZEhlYWRlckFjdGlvbiB9IGZyb20gJy4vd2l6YXJkLWhlYWRlci1hY3Rpb24nO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZSB9IGZyb20gJy4vd2l6YXJkLXBhZ2UnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZUJ1dHRvbnMgfSBmcm9tICcuL3dpemFyZC1wYWdlLWJ1dHRvbnMnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZUhlYWRlckFjdGlvbnMgfSBmcm9tICcuL3dpemFyZC1wYWdlLWhlYWRlci1hY3Rpb25zJztcbmltcG9ydCB7IENscldpemFyZFBhZ2VOYXZUaXRsZSB9IGZyb20gJy4vd2l6YXJkLXBhZ2UtbmF2dGl0bGUnO1xuaW1wb3J0IHsgQ2xyV2l6YXJkUGFnZVRpdGxlIH0gZnJvbSAnLi93aXphcmQtcGFnZS10aXRsZSc7XG5pbXBvcnQgeyBDbHJXaXphcmRTdGVwbmF2IH0gZnJvbSAnLi93aXphcmQtc3RlcG5hdic7XG5pbXBvcnQgeyBDbHJXaXphcmRTdGVwbmF2SXRlbSB9IGZyb20gJy4vd2l6YXJkLXN0ZXBuYXYtaXRlbSc7XG5pbXBvcnQgeyBDbHJXaXphcmRUaXRsZSB9IGZyb20gJy4vd2l6YXJkLXRpdGxlJztcblxuZXhwb3J0IGNvbnN0IENMUl9XSVpBUkRfRElSRUNUSVZFUzogYW55W10gPSBbXG4gIENscldpemFyZCxcbiAgQ2xyV2l6YXJkUGFnZSxcbiAgQ2xyV2l6YXJkU3RlcG5hdixcbiAgQ2xyV2l6YXJkU3RlcG5hdkl0ZW0sXG4gIENscldpemFyZEJ1dHRvbixcbiAgQ2xyV2l6YXJkSGVhZGVyQWN0aW9uLFxuICBDbHJXaXphcmRUaXRsZSxcbiAgQ2xyV2l6YXJkUGFnZVRpdGxlLFxuICBDbHJXaXphcmRQYWdlTmF2VGl0bGUsXG4gIENscldpemFyZFBhZ2VCdXR0b25zLFxuICBDbHJXaXphcmRQYWdlSGVhZGVyQWN0aW9ucyxcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENsck1vZGFsTW9kdWxlLCBDbHJBbGVydE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9XSVpBUkRfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFtDTFJfV0laQVJEX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJXaXphcmRNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoZXJyb3JTdGFuZGFyZEljb24sIHN1Y2Nlc3NTdGFuZGFyZEljb24pO1xuICB9XG59XG4iXX0=