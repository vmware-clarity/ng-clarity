/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityIcons, ellipsisHorizontalIcon } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrKeyFocusModule } from '../../utils/focus/key-focus/key-focus.module';
import { ClrTemplateRefModule } from '../../utils/template-ref/template-ref.module';
import { ActiveOompaLoompa } from './chocolate/active-oompa-loompa';
import { TabsWillyWonka } from './chocolate/tabs-willy-wonka';
import { ClrTab } from './tab';
import { ClrTabAction } from './tab-action.directive';
import { ClrTabContent } from './tab-content';
import { ClrTabLink } from './tab-link.directive';
import { ClrTabOverflowContent } from './tab-overflow-content';
import { ClrTabs } from './tabs';
import { ClrTabsActions } from './tabs-actions';
import * as i0 from "@angular/core";
export const CLR_TABS_DIRECTIVES = [
    ClrTabContent,
    ClrTab,
    ClrTabs,
    ClrTabOverflowContent,
    ClrTabLink,
    ClrTabAction,
    ClrTabsActions,
    TabsWillyWonka,
    ActiveOompaLoompa,
];
export class ClrTabsModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisHorizontalIcon);
    }
}
ClrTabsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrTabsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsModule, declarations: [ClrTabContent,
        ClrTab,
        ClrTabs,
        ClrTabOverflowContent,
        ClrTabLink,
        ClrTabAction,
        ClrTabsActions,
        TabsWillyWonka,
        ActiveOompaLoompa], imports: [CommonModule, ClrConditionalModule, ClrIconModule, ClrTemplateRefModule, ClrKeyFocusModule], exports: [ClrTabContent,
        ClrTab,
        ClrTabs,
        ClrTabOverflowContent,
        ClrTabLink,
        ClrTabAction,
        ClrTabsActions,
        TabsWillyWonka,
        ActiveOompaLoompa, ClrConditionalModule] });
ClrTabsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsModule, imports: [CommonModule, ClrConditionalModule, ClrIconModule, ClrTemplateRefModule, ClrKeyFocusModule, ClrConditionalModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrConditionalModule, ClrIconModule, ClrTemplateRefModule, ClrKeyFocusModule],
                    declarations: [CLR_TABS_DIRECTIVES],
                    exports: [CLR_TABS_DIRECTIVES, ClrConditionalModule],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdGFicy90YWJzLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDbEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDakYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQUVoRCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBZ0I7SUFDOUMsYUFBYTtJQUNiLE1BQU07SUFDTixPQUFPO0lBQ1AscUJBQXFCO0lBQ3JCLFVBQVU7SUFDVixZQUFZO0lBQ1osY0FBYztJQUNkLGNBQWM7SUFDZCxpQkFBaUI7Q0FDbEIsQ0FBQztBQU9GLE1BQU0sT0FBTyxhQUFhO0lBQ3hCO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hELENBQUM7OzBHQUhVLGFBQWE7MkdBQWIsYUFBYSxpQkFoQnhCLGFBQWE7UUFDYixNQUFNO1FBQ04sT0FBTztRQUNQLHFCQUFxQjtRQUNyQixVQUFVO1FBQ1YsWUFBWTtRQUNaLGNBQWM7UUFDZCxjQUFjO1FBQ2QsaUJBQWlCLGFBSVAsWUFBWSxFQUFFLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsYUFacEcsYUFBYTtRQUNiLE1BQU07UUFDTixPQUFPO1FBQ1AscUJBQXFCO1FBQ3JCLFVBQVU7UUFDVixZQUFZO1FBQ1osY0FBYztRQUNkLGNBQWM7UUFDZCxpQkFBaUIsRUFNYyxvQkFBb0I7MkdBRXhDLGFBQWEsWUFKZCxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUVyRSxvQkFBb0I7MkZBRXhDLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG9CQUFvQixFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQztvQkFDckcsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixDQUFDO2lCQUNyRCIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDbGFyaXR5SWNvbnMsIGVsbGlwc2lzSG9yaXpvbnRhbEljb24gfSBmcm9tICdAY2RzL2NvcmUvaWNvbic7XG5cbmltcG9ydCB7IENsckljb25Nb2R1bGUgfSBmcm9tICcuLi8uLi9pY29uL2ljb24ubW9kdWxlJztcbmltcG9ydCB7IENsckNvbmRpdGlvbmFsTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uZGl0aW9uYWwvY29uZGl0aW9uYWwubW9kdWxlJztcbmltcG9ydCB7IENscktleUZvY3VzTW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMva2V5LWZvY3VzL2tleS1mb2N1cy5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyVGVtcGxhdGVSZWZNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy90ZW1wbGF0ZS1yZWYvdGVtcGxhdGUtcmVmLm1vZHVsZSc7XG5pbXBvcnQgeyBBY3RpdmVPb21wYUxvb21wYSB9IGZyb20gJy4vY2hvY29sYXRlL2FjdGl2ZS1vb21wYS1sb29tcGEnO1xuaW1wb3J0IHsgVGFic1dpbGx5V29ua2EgfSBmcm9tICcuL2Nob2NvbGF0ZS90YWJzLXdpbGx5LXdvbmthJztcbmltcG9ydCB7IENsclRhYiB9IGZyb20gJy4vdGFiJztcbmltcG9ydCB7IENsclRhYkFjdGlvbiB9IGZyb20gJy4vdGFiLWFjdGlvbi5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ2xyVGFiQ29udGVudCB9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHsgQ2xyVGFiTGluayB9IGZyb20gJy4vdGFiLWxpbmsuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclRhYk92ZXJmbG93Q29udGVudCB9IGZyb20gJy4vdGFiLW92ZXJmbG93LWNvbnRlbnQnO1xuaW1wb3J0IHsgQ2xyVGFicyB9IGZyb20gJy4vdGFicyc7XG5pbXBvcnQgeyBDbHJUYWJzQWN0aW9ucyB9IGZyb20gJy4vdGFicy1hY3Rpb25zJztcblxuZXhwb3J0IGNvbnN0IENMUl9UQUJTX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW1xuICBDbHJUYWJDb250ZW50LFxuICBDbHJUYWIsXG4gIENsclRhYnMsXG4gIENsclRhYk92ZXJmbG93Q29udGVudCxcbiAgQ2xyVGFiTGluayxcbiAgQ2xyVGFiQWN0aW9uLFxuICBDbHJUYWJzQWN0aW9ucyxcbiAgVGFic1dpbGx5V29ua2EsXG4gIEFjdGl2ZU9vbXBhTG9vbXBhLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xyQ29uZGl0aW9uYWxNb2R1bGUsIENsckljb25Nb2R1bGUsIENsclRlbXBsYXRlUmVmTW9kdWxlLCBDbHJLZXlGb2N1c01vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9UQUJTX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbQ0xSX1RBQlNfRElSRUNUSVZFUywgQ2xyQ29uZGl0aW9uYWxNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUYWJzTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgQ2xhcml0eUljb25zLmFkZEljb25zKGVsbGlwc2lzSG9yaXpvbnRhbEljb24pO1xuICB9XG59XG4iXX0=