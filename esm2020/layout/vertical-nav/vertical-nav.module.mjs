/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { angleDoubleIcon, angleIcon, ClarityIcons } from '@cds/core/icon';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrFocusOnViewInitModule } from '../../utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrVerticalNav } from './vertical-nav';
import { ClrVerticalNavGroup } from './vertical-nav-group';
import { ClrVerticalNavGroupChildren } from './vertical-nav-group-children';
import { ClrVerticalNavIcon } from './vertical-nav-icon';
import { ClrVerticalNavLink } from './vertical-nav-link';
import * as i0 from "@angular/core";
export const CLR_VERTICAL_NAV_DIRECTIVES = [
    ClrVerticalNav,
    ClrVerticalNavLink,
    ClrVerticalNavGroup,
    ClrVerticalNavGroupChildren,
    ClrVerticalNavIcon,
];
export class ClrVerticalNavModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, angleDoubleIcon);
    }
}
ClrVerticalNavModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClrVerticalNavModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavModule, declarations: [ClrVerticalNav,
        ClrVerticalNavLink,
        ClrVerticalNavGroup,
        ClrVerticalNavGroupChildren,
        ClrVerticalNavIcon], imports: [CommonModule, ClrIconModule, ClrConditionalModule, ClrFocusOnViewInitModule], exports: [ClrVerticalNav,
        ClrVerticalNavLink,
        ClrVerticalNavGroup,
        ClrVerticalNavGroupChildren,
        ClrVerticalNavIcon, ClrConditionalModule, ClrIconModule, ClrFocusOnViewInitModule] });
ClrVerticalNavModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavModule, imports: [CommonModule, ClrIconModule, ClrConditionalModule, ClrFocusOnViewInitModule, ClrConditionalModule, ClrIconModule, ClrFocusOnViewInitModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIconModule, ClrConditionalModule, ClrFocusOnViewInitModule],
                    declarations: [CLR_VERTICAL_NAV_DIRECTIVES],
                    exports: [CLR_VERTICAL_NAV_DIRECTIVES, ClrConditionalModule, ClrIconModule, ClrFocusOnViewInitModule],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2xheW91dC92ZXJ0aWNhbC1uYXYvdmVydGljYWwtbmF2Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNsRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMxRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDNUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDekQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBRXpELE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFnQjtJQUN0RCxjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQiwyQkFBMkI7SUFDM0Isa0JBQWtCO0NBQ25CLENBQUM7QUFPRixNQUFNLE9BQU8sb0JBQW9CO0lBQy9CO1FBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDcEQsQ0FBQzs7aUhBSFUsb0JBQW9CO2tIQUFwQixvQkFBb0IsaUJBWi9CLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLDJCQUEyQjtRQUMzQixrQkFBa0IsYUFJUixZQUFZLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLHdCQUF3QixhQVJyRixjQUFjO1FBQ2Qsa0JBQWtCO1FBQ2xCLG1CQUFtQjtRQUNuQiwyQkFBMkI7UUFDM0Isa0JBQWtCLEVBTXFCLG9CQUFvQixFQUFFLGFBQWEsRUFBRSx3QkFBd0I7a0hBRXpGLG9CQUFvQixZQUpyQixZQUFZLEVBQUUsYUFBYSxFQUFFLG9CQUFvQixFQUFFLHdCQUF3QixFQUU5QyxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsd0JBQXdCOzJGQUV6RixvQkFBb0I7a0JBTGhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSx3QkFBd0IsQ0FBQztvQkFDdEYsWUFBWSxFQUFFLENBQUMsMkJBQTJCLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLDJCQUEyQixFQUFFLG9CQUFvQixFQUFFLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQztpQkFDdEciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgYW5nbGVEb3VibGVJY29uLCBhbmdsZUljb24sIENsYXJpdHlJY29ucyB9IGZyb20gJ0BjZHMvY29yZS9pY29uJztcblxuaW1wb3J0IHsgQ2xySWNvbk1vZHVsZSB9IGZyb20gJy4uLy4uL2ljb24vaWNvbi5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyQ29uZGl0aW9uYWxNb2R1bGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9jb25kaXRpb25hbC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyRm9jdXNPblZpZXdJbml0TW9kdWxlIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXMtb24tdmlldy1pbml0L2ZvY3VzLW9uLXZpZXctaW5pdC5tb2R1bGUnO1xuaW1wb3J0IHsgQ2xyVmVydGljYWxOYXYgfSBmcm9tICcuL3ZlcnRpY2FsLW5hdic7XG5pbXBvcnQgeyBDbHJWZXJ0aWNhbE5hdkdyb3VwIH0gZnJvbSAnLi92ZXJ0aWNhbC1uYXYtZ3JvdXAnO1xuaW1wb3J0IHsgQ2xyVmVydGljYWxOYXZHcm91cENoaWxkcmVuIH0gZnJvbSAnLi92ZXJ0aWNhbC1uYXYtZ3JvdXAtY2hpbGRyZW4nO1xuaW1wb3J0IHsgQ2xyVmVydGljYWxOYXZJY29uIH0gZnJvbSAnLi92ZXJ0aWNhbC1uYXYtaWNvbic7XG5pbXBvcnQgeyBDbHJWZXJ0aWNhbE5hdkxpbmsgfSBmcm9tICcuL3ZlcnRpY2FsLW5hdi1saW5rJztcblxuZXhwb3J0IGNvbnN0IENMUl9WRVJUSUNBTF9OQVZfRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbXG4gIENsclZlcnRpY2FsTmF2LFxuICBDbHJWZXJ0aWNhbE5hdkxpbmssXG4gIENsclZlcnRpY2FsTmF2R3JvdXAsXG4gIENsclZlcnRpY2FsTmF2R3JvdXBDaGlsZHJlbixcbiAgQ2xyVmVydGljYWxOYXZJY29uLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2xySWNvbk1vZHVsZSwgQ2xyQ29uZGl0aW9uYWxNb2R1bGUsIENsckZvY3VzT25WaWV3SW5pdE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW0NMUl9WRVJUSUNBTF9OQVZfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFtDTFJfVkVSVElDQUxfTkFWX0RJUkVDVElWRVMsIENsckNvbmRpdGlvbmFsTW9kdWxlLCBDbHJJY29uTW9kdWxlLCBDbHJGb2N1c09uVmlld0luaXRNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJWZXJ0aWNhbE5hdk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIENsYXJpdHlJY29ucy5hZGRJY29ucyhhbmdsZUljb24sIGFuZ2xlRG91YmxlSWNvbik7XG4gIH1cbn1cbiJdfQ==