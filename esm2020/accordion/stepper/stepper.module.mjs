/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrAccordionModule } from '../accordion.module';
import { ClrStepButton } from '../stepper/step-button';
import { ClrStepper } from '../stepper/stepper';
import { StepperOompaLoompa } from './chocolate/stepper-oompa-loompa';
import { StepperWillyWonka } from './chocolate/stepper-willy-wonka';
import { ClrStepperPanel } from './stepper-panel';
import * as i0 from "@angular/core";
const declarations = [ClrStepper, ClrStepButton, ClrStepperPanel, StepperOompaLoompa, StepperWillyWonka];
export class ClrStepperModule {
}
ClrStepperModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrStepperModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrStepperModule, declarations: [ClrStepper, ClrStepButton, ClrStepperPanel, StepperOompaLoompa, StepperWillyWonka], imports: [CommonModule, ClrIconModule, ClrAccordionModule], exports: [ClrStepper, ClrStepButton, ClrStepperPanel, StepperOompaLoompa, StepperWillyWonka, ClrAccordionModule] });
ClrStepperModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepperModule, imports: [CommonModule, ClrIconModule, ClrAccordionModule, ClrAccordionModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrStepperModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrAccordionModule],
                    declarations: [...declarations],
                    exports: [...declarations, ClrAccordionModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9hY2NvcmRpb24vc3RlcHBlci9zdGVwcGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFFbEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBT3pHLE1BQU0sT0FBTyxnQkFBZ0I7OzZHQUFoQixnQkFBZ0I7OEdBQWhCLGdCQUFnQixpQkFQUCxVQUFVLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsYUFHM0YsWUFBWSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsYUFIckMsVUFBVSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBSzFFLGtCQUFrQjs4R0FFbEMsZ0JBQWdCLFlBSmpCLFlBQVksRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBRTlCLGtCQUFrQjsyRkFFbEMsZ0JBQWdCO2tCQUw1QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsa0JBQWtCLENBQUM7b0JBQzFELFlBQVksRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDO29CQUMvQixPQUFPLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxrQkFBa0IsQ0FBQztpQkFDL0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJJY29uTW9kdWxlIH0gZnJvbSAnLi4vLi4vaWNvbi9pY29uLm1vZHVsZSc7XG5pbXBvcnQgeyBDbHJBY2NvcmRpb25Nb2R1bGUgfSBmcm9tICcuLi9hY2NvcmRpb24ubW9kdWxlJztcbmltcG9ydCB7IENsclN0ZXBCdXR0b24gfSBmcm9tICcuLi9zdGVwcGVyL3N0ZXAtYnV0dG9uJztcbmltcG9ydCB7IENsclN0ZXBwZXIgfSBmcm9tICcuLi9zdGVwcGVyL3N0ZXBwZXInO1xuaW1wb3J0IHsgU3RlcHBlck9vbXBhTG9vbXBhIH0gZnJvbSAnLi9jaG9jb2xhdGUvc3RlcHBlci1vb21wYS1sb29tcGEnO1xuaW1wb3J0IHsgU3RlcHBlcldpbGx5V29ua2EgfSBmcm9tICcuL2Nob2NvbGF0ZS9zdGVwcGVyLXdpbGx5LXdvbmthJztcbmltcG9ydCB7IENsclN0ZXBwZXJQYW5lbCB9IGZyb20gJy4vc3RlcHBlci1wYW5lbCc7XG5cbmNvbnN0IGRlY2xhcmF0aW9ucyA9IFtDbHJTdGVwcGVyLCBDbHJTdGVwQnV0dG9uLCBDbHJTdGVwcGVyUGFuZWwsIFN0ZXBwZXJPb21wYUxvb21wYSwgU3RlcHBlcldpbGx5V29ua2FdO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJBY2NvcmRpb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5kZWNsYXJhdGlvbnNdLFxuICBleHBvcnRzOiBbLi4uZGVjbGFyYXRpb25zLCBDbHJBY2NvcmRpb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTdGVwcGVyTW9kdWxlIHt9XG4iXX0=