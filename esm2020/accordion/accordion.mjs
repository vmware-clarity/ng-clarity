/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectionStrategy, Component, ContentChildren, Input, } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { ClrAccordionPanel } from './accordion-panel';
import { AccordionStrategy } from './enums/accordion-strategy.enum';
import { AccordionService } from './providers/accordion.service';
import * as i0 from "@angular/core";
import * as i1 from "./providers/accordion.service";
export class ClrAccordion {
    constructor(accordionService) {
        this.accordionService = accordionService;
        this.multiPanel = false;
        this.subscriptions = [];
    }
    ngOnInit() {
        this.setAccordionStrategy();
    }
    ngOnChanges(changes) {
        if (changes.multiPanel.currentValue !== changes.multiPanel.previousValue) {
            this.setAccordionStrategy();
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.listenForDOMChanges());
    }
    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    setAccordionStrategy() {
        const strategy = this.multiPanel ? AccordionStrategy.Multi : AccordionStrategy.Default;
        this.accordionService.setStrategy(strategy);
    }
    listenForDOMChanges() {
        return this.panels.changes
            .pipe(startWith(this.panels))
            .subscribe((panels) => this.accordionService.updatePanelOrder(panels.toArray().map(p => p.id)));
    }
}
ClrAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordion, deps: [{ token: i1.AccordionService }], target: i0.ɵɵFactoryTarget.Component });
ClrAccordion.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrAccordion, selector: "clr-accordion", inputs: { multiPanel: ["clrAccordionMultiPanel", "multiPanel"] }, host: { properties: { "class.clr-accordion": "true" } }, providers: [AccordionService], queries: [{ propertyName: "panels", predicate: ClrAccordionPanel }], usesOnChanges: true, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrAccordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-accordion',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-accordion]': 'true' },
                    providers: [AccordionService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.AccordionService }]; }, propDecorators: { multiPanel: [{
                type: Input,
                args: ['clrAccordionMultiPanel']
            }], panels: [{
                type: ContentChildren,
                args: [ClrAccordionPanel]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYWNjb3JkaW9uL2FjY29yZGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULGVBQWUsRUFDZixLQUFLLEdBTU4sTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDOzs7QUFTakUsTUFBTSxPQUFPLFlBQVk7SUFLdkIsWUFBb0IsZ0JBQWtDO1FBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFKckIsZUFBVSxHQUFxQixLQUFLLENBQUM7UUFFdEUsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO0lBRXNCLENBQUM7SUFFMUQsUUFBUTtRQUNOLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRTtZQUN4RSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVPLG9CQUFvQjtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQztRQUN2RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTyxtQkFBbUI7UUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87YUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDNUIsU0FBUyxDQUFDLENBQUMsTUFBb0MsRUFBRSxFQUFFLENBQ2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3hFLENBQUM7SUFDTixDQUFDOzt5R0FwQ1UsWUFBWTs2RkFBWixZQUFZLG1LQUhaLENBQUMsZ0JBQWdCLENBQUMsaURBS1osaUJBQWlCLGtEQVB4QiwyQkFBMkI7MkZBSzFCLFlBQVk7a0JBUHhCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRSxFQUFFLHVCQUF1QixFQUFFLE1BQU0sRUFBRTtvQkFDekMsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQzdCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDt1R0FFa0MsVUFBVTtzQkFBMUMsS0FBSzt1QkFBQyx3QkFBd0I7Z0JBQ0ssTUFBTTtzQkFBekMsZUFBZTt1QkFBQyxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN0YXJ0V2l0aCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ2xyQWNjb3JkaW9uUGFuZWwgfSBmcm9tICcuL2FjY29yZGlvbi1wYW5lbCc7XG5pbXBvcnQgeyBBY2NvcmRpb25TdHJhdGVneSB9IGZyb20gJy4vZW51bXMvYWNjb3JkaW9uLXN0cmF0ZWd5LmVudW0nO1xuaW1wb3J0IHsgQWNjb3JkaW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2FjY29yZGlvbi5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWFjY29yZGlvbicsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jbHItYWNjb3JkaW9uXSc6ICd0cnVlJyB9LFxuICBwcm92aWRlcnM6IFtBY2NvcmRpb25TZXJ2aWNlXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENsckFjY29yZGlvbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2NsckFjY29yZGlvbk11bHRpUGFuZWwnKSBtdWx0aVBhbmVsOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG4gIEBDb250ZW50Q2hpbGRyZW4oQ2xyQWNjb3JkaW9uUGFuZWwpIHBhbmVsczogUXVlcnlMaXN0PENsckFjY29yZGlvblBhbmVsPjtcbiAgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjY29yZGlvblNlcnZpY2U6IEFjY29yZGlvblNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zZXRBY2NvcmRpb25TdHJhdGVneSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLm11bHRpUGFuZWwuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLm11bHRpUGFuZWwucHJldmlvdXNWYWx1ZSkge1xuICAgICAgdGhpcy5zZXRBY2NvcmRpb25TdHJhdGVneSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmxpc3RlbkZvckRPTUNoYW5nZXMoKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBwcml2YXRlIHNldEFjY29yZGlvblN0cmF0ZWd5KCkge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5tdWx0aVBhbmVsID8gQWNjb3JkaW9uU3RyYXRlZ3kuTXVsdGkgOiBBY2NvcmRpb25TdHJhdGVneS5EZWZhdWx0O1xuICAgIHRoaXMuYWNjb3JkaW9uU2VydmljZS5zZXRTdHJhdGVneShzdHJhdGVneSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvckRPTUNoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWxzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLnBhbmVscykpXG4gICAgICAuc3Vic2NyaWJlKChwYW5lbHM6IFF1ZXJ5TGlzdDxDbHJBY2NvcmRpb25QYW5lbD4pID0+XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uU2VydmljZS51cGRhdGVQYW5lbE9yZGVyKHBhbmVscy50b0FycmF5KCkubWFwKHAgPT4gcC5pZCkpXG4gICAgICApO1xuICB9XG59XG4iXX0=