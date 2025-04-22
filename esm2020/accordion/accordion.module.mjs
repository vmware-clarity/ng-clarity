/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { angleIcon, checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';
import { ClrIconModule } from '../icon/icon.module';
import { ClrAccordion } from './accordion';
import { ClrAccordionContent } from './accordion-content';
import { ClrAccordionDescription } from './accordion-description';
import { ClrAccordionPanel } from './accordion-panel';
import { ClrAccordionTitle } from './accordion-title';
import { AccordionOompaLoompa } from './chocolate/accordion-oompa-loompa';
import { AccordionWillyWonka } from './chocolate/accordion-willy-wonka';
import * as i0 from "@angular/core";
const declarations = [
    ClrAccordion,
    ClrAccordionPanel,
    ClrAccordionTitle,
    ClrAccordionDescription,
    ClrAccordionContent,
    AccordionOompaLoompa,
    AccordionWillyWonka,
];
export class ClrAccordionModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, exclamationCircleIcon, checkCircleIcon);
    }
}
ClrAccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrAccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionModule, declarations: [ClrAccordion,
        ClrAccordionPanel,
        ClrAccordionTitle,
        ClrAccordionDescription,
        ClrAccordionContent,
        AccordionOompaLoompa,
        AccordionWillyWonka], imports: [CommonModule, ClrIconModule], exports: [ClrAccordion,
        ClrAccordionPanel,
        ClrAccordionTitle,
        ClrAccordionDescription,
        ClrAccordionContent,
        AccordionOompaLoompa,
        AccordionWillyWonka] });
ClrAccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionModule, imports: [CommonModule, ClrIconModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule],
                    declarations: [...declarations],
                    exports: [...declarations],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2FjY29yZGlvbi9hY2NvcmRpb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFakcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDMUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDMUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7O0FBRXhFLE1BQU0sWUFBWSxHQUFHO0lBQ25CLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsaUJBQWlCO0lBQ2pCLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtDQUNwQixDQUFDO0FBT0YsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QjtRQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLHFCQUFxQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7OytHQUhVLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQWQ3QixZQUFZO1FBQ1osaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQix1QkFBdUI7UUFDdkIsbUJBQW1CO1FBQ25CLG9CQUFvQjtRQUNwQixtQkFBbUIsYUFJVCxZQUFZLEVBQUUsYUFBYSxhQVZyQyxZQUFZO1FBQ1osaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQix1QkFBdUI7UUFDdkIsbUJBQW1CO1FBQ25CLG9CQUFvQjtRQUNwQixtQkFBbUI7Z0hBUVIsa0JBQWtCLFlBSm5CLFlBQVksRUFBRSxhQUFhOzJGQUkxQixrQkFBa0I7a0JBTDlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsWUFBWSxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDO2lCQUMzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBhbmdsZUljb24sIGNoZWNrQ2lyY2xlSWNvbiwgQ2xhcml0eUljb25zLCBleGNsYW1hdGlvbkNpcmNsZUljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckFjY29yZGlvbiB9IGZyb20gJy4vYWNjb3JkaW9uJztcbmltcG9ydCB7IENsckFjY29yZGlvbkNvbnRlbnQgfSBmcm9tICcuL2FjY29yZGlvbi1jb250ZW50JztcbmltcG9ydCB7IENsckFjY29yZGlvbkRlc2NyaXB0aW9uIH0gZnJvbSAnLi9hY2NvcmRpb24tZGVzY3JpcHRpb24nO1xuaW1wb3J0IHsgQ2xyQWNjb3JkaW9uUGFuZWwgfSBmcm9tICcuL2FjY29yZGlvbi1wYW5lbCc7XG5pbXBvcnQgeyBDbHJBY2NvcmRpb25UaXRsZSB9IGZyb20gJy4vYWNjb3JkaW9uLXRpdGxlJztcbmltcG9ydCB7IEFjY29yZGlvbk9vbXBhTG9vbXBhIH0gZnJvbSAnLi9jaG9jb2xhdGUvYWNjb3JkaW9uLW9vbXBhLWxvb21wYSc7XG5pbXBvcnQgeyBBY2NvcmRpb25XaWxseVdvbmthIH0gZnJvbSAnLi9jaG9jb2xhdGUvYWNjb3JkaW9uLXdpbGx5LXdvbmthJztcblxuY29uc3QgZGVjbGFyYXRpb25zID0gW1xuICBDbHJBY2NvcmRpb24sXG4gIENsckFjY29yZGlvblBhbmVsLFxuICBDbHJBY2NvcmRpb25UaXRsZSxcbiAgQ2xyQWNjb3JkaW9uRGVzY3JpcHRpb24sXG4gIENsckFjY29yZGlvbkNvbnRlbnQsXG4gIEFjY29yZGlvbk9vbXBhTG9vbXBhLFxuICBBY2NvcmRpb25XaWxseVdvbmthLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySWNvbk1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogWy4uLmRlY2xhcmF0aW9uc10sXG4gIGV4cG9ydHM6IFsuLi5kZWNsYXJhdGlvbnNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJBY2NvcmRpb25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBDbGFyaXR5SWNvbnMuYWRkSWNvbnMoYW5nbGVJY29uLCBleGNsYW1hdGlvbkNpcmNsZUljb24sIGNoZWNrQ2lyY2xlSWNvbik7XG4gIH1cbn1cbiJdfQ==