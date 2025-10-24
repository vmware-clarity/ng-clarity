/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Input, Optional, SkipSelf } from '@angular/core';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { DROPDOWN_FOCUS_HANDLER_PROVIDER } from './providers/dropdown-focus-handler.service';
import { ROOT_DROPDOWN_PROVIDER } from './providers/dropdown.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/providers/popover-toggle.service";
import * as i2 from "./providers/dropdown-focus-handler.service";
import * as i3 from "./providers/dropdown.service";
import * as i4 from "../../utils/popover/popover-host.directive";
export class ClrDropdown {
    constructor(parent, toggleService, focusHandler, cdr, dropdownService) {
        this.parent = parent;
        this.toggleService = toggleService;
        this.focusHandler = focusHandler;
        this.isMenuClosable = true;
        this.subscriptions = [];
        this.subscriptions.push(dropdownService.changes.subscribe(value => (toggleService.open = value)));
        this.subscriptions.push(toggleService.openChange.subscribe(() => cdr.markForCheck()));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
ClrDropdown.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdown, deps: [{ token: ClrDropdown, optional: true, skipSelf: true }, { token: i1.ClrPopoverToggleService }, { token: i2.DropdownFocusHandler }, { token: i0.ChangeDetectorRef }, { token: i3.RootDropdownService }], target: i0.ɵɵFactoryTarget.Component });
ClrDropdown.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDropdown, selector: "clr-dropdown", inputs: { isMenuClosable: ["clrCloseMenuOnItemClick", "isMenuClosable"] }, host: { properties: { "class.dropdown": "true", "class.open": "toggleService.open" } }, providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER], hostDirectives: [{ directive: i4.ClrPopoverHostDirective }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdown, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dropdown',
                    template: '<ng-content></ng-content>',
                    host: {
                        '[class.dropdown]': 'true',
                        '[class.open]': 'toggleService.open',
                    },
                    providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
                    hostDirectives: [ClrPopoverHostDirective],
                }]
        }], ctorParameters: function () { return [{ type: ClrDropdown, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i1.ClrPopoverToggleService }, { type: i2.DropdownFocusHandler }, { type: i0.ChangeDetectorRef }, { type: i3.RootDropdownService }]; }, propDecorators: { isMenuClosable: [{
                type: Input,
                args: ['clrCloseMenuOnItemClick']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9wb3BvdmVyL2Ryb3Bkb3duL2Ryb3Bkb3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFxQixTQUFTLEVBQUUsS0FBSyxFQUFhLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbkcsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDekUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFFckYsT0FBTyxFQUFFLCtCQUErQixFQUF3QixNQUFNLDRDQUE0QyxDQUFDO0FBQ25ILE9BQU8sRUFBRSxzQkFBc0IsRUFBdUIsTUFBTSw4QkFBOEIsQ0FBQzs7Ozs7O0FBWTNGLE1BQU0sT0FBTyxXQUFXO0lBS3RCLFlBR1MsTUFBbUIsRUFDbkIsYUFBc0MsRUFDdEMsWUFBa0MsRUFDekMsR0FBc0IsRUFDdEIsZUFBb0M7UUFKN0IsV0FBTSxHQUFOLE1BQU0sQ0FBYTtRQUNuQixrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDdEMsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBVFQsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFFaEQsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBV3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDOzt3R0FwQlUsV0FBVzs0RkFBWCxXQUFXLDBNQUhYLENBQUMsc0JBQXNCLEVBQUUsc0JBQXNCLEVBQUUsK0JBQStCLENBQUMsdUZBTGxGLDJCQUEyQjsyRkFRMUIsV0FBVztrQkFWdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLE1BQU07d0JBQzFCLGNBQWMsRUFBRSxvQkFBb0I7cUJBQ3JDO29CQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFLCtCQUErQixDQUFDO29CQUM1RixjQUFjLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDMUM7OzBCQU9JLFFBQVE7OzBCQUNSLFFBQVE7dUxBTnVCLGNBQWM7c0JBQS9DLEtBQUs7dUJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBJbnB1dCwgT25EZXN0cm95LCBPcHRpb25hbCwgU2tpcFNlbGYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGT0NVU19TRVJWSUNFX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMvZm9jdXMuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVySG9zdERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1ob3N0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRFJPUERPV05fRk9DVVNfSEFORExFUl9QUk9WSURFUiwgRHJvcGRvd25Gb2N1c0hhbmRsZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9kcm9wZG93bi1mb2N1cy1oYW5kbGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUk9PVF9EUk9QRE9XTl9QUk9WSURFUiwgUm9vdERyb3Bkb3duU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2Ryb3Bkb3duLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZHJvcGRvd24nLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wZG93bl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vcGVuXSc6ICd0b2dnbGVTZXJ2aWNlLm9wZW4nLFxuICB9LFxuICBwcm92aWRlcnM6IFtST09UX0RST1BET1dOX1BST1ZJREVSLCBGT0NVU19TRVJWSUNFX1BST1ZJREVSLCBEUk9QRE9XTl9GT0NVU19IQU5ETEVSX1BST1ZJREVSXSxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJQb3BvdmVySG9zdERpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRyb3Bkb3duIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQElucHV0KCdjbHJDbG9zZU1lbnVPbkl0ZW1DbGljaycpIGlzTWVudUNsb3NhYmxlID0gdHJ1ZTtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQFNraXBTZWxmKClcbiAgICBAT3B0aW9uYWwoKVxuICAgIHB1YmxpYyBwYXJlbnQ6IENsckRyb3Bkb3duLFxuICAgIHB1YmxpYyB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwdWJsaWMgZm9jdXNIYW5kbGVyOiBEcm9wZG93bkZvY3VzSGFuZGxlcixcbiAgICBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGRyb3Bkb3duU2VydmljZTogUm9vdERyb3Bkb3duU2VydmljZVxuICApIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChkcm9wZG93blNlcnZpY2UuY2hhbmdlcy5zdWJzY3JpYmUodmFsdWUgPT4gKHRvZ2dsZVNlcnZpY2Uub3BlbiA9IHZhbHVlKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRvZ2dsZVNlcnZpY2Uub3BlbkNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gY2RyLm1hcmtGb3JDaGVjaygpKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG59XG4iXX0=