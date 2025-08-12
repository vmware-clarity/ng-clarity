/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostBinding, HostListener, Inject, Input, } from '@angular/core';
import { IF_ACTIVE_ID } from '../../utils/conditional/if-active.service';
import { TemplateRefContainer } from '../../utils/template-ref/template-ref-container';
import { TabsLayout } from './enums/tabs-layout.enum';
import { TABS_ID } from './tabs-id.provider';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/conditional/if-active.service";
import * as i2 from "./providers/tabs.service";
let nbTabLinkComponents = 0;
export class ClrTabLink {
    constructor(ifActiveService, id, el, cfr, viewContainerRef, tabsService, tabsId) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.el = el;
        this.tabsService = tabsService;
        this.tabsId = tabsId;
        if (!this.tabLinkId) {
            this.tabLinkId = 'clr-tab-link-' + nbTabLinkComponents++;
        }
        // Tab links can be rendered in one of two places: in the main area or inside the overflow dropdown menu.
        // Here, we create a container so that its template can be used to create embeddedView on the fly.
        // See TabsService's renderView() method and how it's used in Tabs class for an example.
        const factory = cfr.resolveComponentFactory(TemplateRefContainer);
        this.templateRefContainer = viewContainerRef.createComponent(factory, undefined, undefined, [
            [el.nativeElement],
        ]).instance;
    }
    get inOverflow() {
        return this._inOverflow && this.tabsService.layout !== TabsLayout.VERTICAL;
    }
    set inOverflow(inOverflow) {
        this._inOverflow = inOverflow;
    }
    get addLinkClasses() {
        return !this.inOverflow;
    }
    get ariaControls() {
        return this.tabsService.children.find(tab => tab.tabLink === this)?.tabContent?.tabContentId;
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    get tabindex() {
        return this.active ? 0 : -1;
    }
    activate() {
        this.ifActiveService.current = this.id;
    }
}
ClrTabLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabLink, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }, { token: i2.TabsService }, { token: TABS_ID }], target: i0.ɵɵFactoryTarget.Directive });
ClrTabLink.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrTabLink, selector: "[clrTabLink]", inputs: { tabLinkId: ["id", "tabLinkId"], inOverflow: ["clrTabLinkInOverflow", "inOverflow"] }, host: { attributes: { "role": "tab", "type": "button" }, listeners: { "click": "activate()" }, properties: { "class.btn": "true", "id": "this.tabLinkId", "class.btn-link": "this.addLinkClasses", "class.nav-link": "this.addLinkClasses", "attr.aria-controls": "this.ariaControls", "class.active": "this.active", "attr.aria-selected": "this.active", "attr.tabindex": "this.tabindex" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTabLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink]',
                    host: {
                        '[class.btn]': 'true',
                        role: 'tab',
                        type: 'button',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }, { type: i2.TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }]; }, propDecorators: { tabLinkId: [{
                type: Input,
                args: ['id']
            }, {
                type: HostBinding,
                args: ['id']
            }], inOverflow: [{
                type: Input,
                args: ['clrTabLinkInOverflow']
            }], addLinkClasses: [{
                type: HostBinding,
                args: ['class.btn-link']
            }, {
                type: HostBinding,
                args: ['class.nav-link']
            }], ariaControls: [{
                type: HostBinding,
                args: ['attr.aria-controls']
            }], active: [{
                type: HostBinding,
                args: ['class.active']
            }, {
                type: HostBinding,
                args: ['attr.aria-selected']
            }], tabindex: [{
                type: HostBinding,
                args: ['attr.tabindex']
            }], activate: [{
                type: HostListener,
                args: ['click']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWxpbmsuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3RhYnMvdGFiLWxpbmsuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUVMLFNBQVMsRUFFVCxXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEdBRU4sTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSwyQ0FBMkMsQ0FBQztBQUMxRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUN2RixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7O0FBRTdDLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO0FBVTVCLE1BQU0sT0FBTyxVQUFVO0lBT3JCLFlBQ1MsZUFBZ0MsRUFDUixFQUFVLEVBQ2xDLEVBQTJCLEVBQ2xDLEdBQTZCLEVBQzdCLGdCQUFrQyxFQUMxQixXQUF3QixFQUNSLE1BQWM7UUFOL0Isb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ1IsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNsQyxPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUcxQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUNSLFdBQU0sR0FBTixNQUFNLENBQVE7UUFFdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztTQUMxRDtRQUVELHlHQUF5RztRQUN6RyxrR0FBa0c7UUFDbEcsd0ZBQXdGO1FBQ3hGLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7WUFDMUYsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQ25CLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFDSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDN0UsQ0FBQztJQUNELElBQUksVUFBVSxDQUFDLFVBQVU7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVELElBRUksY0FBYztRQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFDSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUM7SUFDL0YsQ0FBQztJQUVELElBRUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUN6QyxDQUFDOzt1R0E5RFUsVUFBVSxpREFTWCxZQUFZLDBJQUtaLE9BQU87MkZBZE4sVUFBVTsyRkFBVixVQUFVO2tCQVJ0QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixJQUFJLEVBQUU7d0JBQ0osYUFBYSxFQUFFLE1BQU07d0JBQ3JCLElBQUksRUFBRSxLQUFLO3dCQUNYLElBQUksRUFBRSxRQUFRO3FCQUNmO2lCQUNGOzswQkFVSSxNQUFNOzJCQUFDLFlBQVk7OzBCQUtuQixNQUFNOzJCQUFDLE9BQU87NENBYmUsU0FBUztzQkFBeEMsS0FBSzt1QkFBQyxJQUFJOztzQkFBRyxXQUFXO3VCQUFDLElBQUk7Z0JBNkIxQixVQUFVO3NCQURiLEtBQUs7dUJBQUMsc0JBQXNCO2dCQVV6QixjQUFjO3NCQUZqQixXQUFXO3VCQUFDLGdCQUFnQjs7c0JBQzVCLFdBQVc7dUJBQUMsZ0JBQWdCO2dCQU16QixZQUFZO3NCQURmLFdBQVc7dUJBQUMsb0JBQW9CO2dCQU83QixNQUFNO3NCQUZULFdBQVc7dUJBQUMsY0FBYzs7c0JBQzFCLFdBQVc7dUJBQUMsb0JBQW9CO2dCQU03QixRQUFRO3NCQURYLFdBQVc7dUJBQUMsZUFBZTtnQkFNNUIsUUFBUTtzQkFEUCxZQUFZO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSUZfQUNUSVZFX0lELCBJZkFjdGl2ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9jb25kaXRpb25hbC9pZi1hY3RpdmUuc2VydmljZSc7XG5pbXBvcnQgeyBUZW1wbGF0ZVJlZkNvbnRhaW5lciB9IGZyb20gJy4uLy4uL3V0aWxzL3RlbXBsYXRlLXJlZi90ZW1wbGF0ZS1yZWYtY29udGFpbmVyJztcbmltcG9ydCB7IFRhYnNMYXlvdXQgfSBmcm9tICcuL2VudW1zL3RhYnMtbGF5b3V0LmVudW0nO1xuaW1wb3J0IHsgVGFic1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90YWJzLnNlcnZpY2UnO1xuaW1wb3J0IHsgVEFCU19JRCB9IGZyb20gJy4vdGFicy1pZC5wcm92aWRlcic7XG5cbmxldCBuYlRhYkxpbmtDb21wb25lbnRzID0gMDtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclRhYkxpbmtdJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYnRuXSc6ICd0cnVlJyxcbiAgICByb2xlOiAndGFiJyxcbiAgICB0eXBlOiAnYnV0dG9uJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVGFiTGluayB7XG4gIEBJbnB1dCgnaWQnKSBASG9zdEJpbmRpbmcoJ2lkJykgdGFiTGlua0lkOiBzdHJpbmc7XG5cbiAgdGVtcGxhdGVSZWZDb250YWluZXI6IFRlbXBsYXRlUmVmQ29udGFpbmVyO1xuXG4gIHByaXZhdGUgX2luT3ZlcmZsb3c6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGlmQWN0aXZlU2VydmljZTogSWZBY3RpdmVTZXJ2aWNlLFxuICAgIEBJbmplY3QoSUZfQUNUSVZFX0lEKSByZWFkb25seSBpZDogbnVtYmVyLFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2ZyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIHRhYnNTZXJ2aWNlOiBUYWJzU2VydmljZSxcbiAgICBASW5qZWN0KFRBQlNfSUQpIHB1YmxpYyB0YWJzSWQ6IG51bWJlclxuICApIHtcbiAgICBpZiAoIXRoaXMudGFiTGlua0lkKSB7XG4gICAgICB0aGlzLnRhYkxpbmtJZCA9ICdjbHItdGFiLWxpbmstJyArIG5iVGFiTGlua0NvbXBvbmVudHMrKztcbiAgICB9XG5cbiAgICAvLyBUYWIgbGlua3MgY2FuIGJlIHJlbmRlcmVkIGluIG9uZSBvZiB0d28gcGxhY2VzOiBpbiB0aGUgbWFpbiBhcmVhIG9yIGluc2lkZSB0aGUgb3ZlcmZsb3cgZHJvcGRvd24gbWVudS5cbiAgICAvLyBIZXJlLCB3ZSBjcmVhdGUgYSBjb250YWluZXIgc28gdGhhdCBpdHMgdGVtcGxhdGUgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGVtYmVkZGVkVmlldyBvbiB0aGUgZmx5LlxuICAgIC8vIFNlZSBUYWJzU2VydmljZSdzIHJlbmRlclZpZXcoKSBtZXRob2QgYW5kIGhvdyBpdCdzIHVzZWQgaW4gVGFicyBjbGFzcyBmb3IgYW4gZXhhbXBsZS5cbiAgICBjb25zdCBmYWN0b3J5ID0gY2ZyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFRlbXBsYXRlUmVmQ29udGFpbmVyKTtcbiAgICB0aGlzLnRlbXBsYXRlUmVmQ29udGFpbmVyID0gdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFtcbiAgICAgIFtlbC5uYXRpdmVFbGVtZW50XSxcbiAgICBdKS5pbnN0YW5jZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVGFiTGlua0luT3ZlcmZsb3cnKVxuICBnZXQgaW5PdmVyZmxvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faW5PdmVyZmxvdyAmJiB0aGlzLnRhYnNTZXJ2aWNlLmxheW91dCAhPT0gVGFic0xheW91dC5WRVJUSUNBTDtcbiAgfVxuICBzZXQgaW5PdmVyZmxvdyhpbk92ZXJmbG93KSB7XG4gICAgdGhpcy5faW5PdmVyZmxvdyA9IGluT3ZlcmZsb3c7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmJ0bi1saW5rJylcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uYXYtbGluaycpXG4gIGdldCBhZGRMaW5rQ2xhc3NlcygpIHtcbiAgICByZXR1cm4gIXRoaXMuaW5PdmVyZmxvdztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWNvbnRyb2xzJylcbiAgZ2V0IGFyaWFDb250cm9scygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRhYnNTZXJ2aWNlLmNoaWxkcmVuLmZpbmQodGFiID0+IHRhYi50YWJMaW5rID09PSB0aGlzKT8udGFiQ29udGVudD8udGFiQ29udGVudElkO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hY3RpdmUnKVxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1zZWxlY3RlZCcpXG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWZBY3RpdmVTZXJ2aWNlLmN1cnJlbnQgPT09IHRoaXMuaWQ7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIudGFiaW5kZXgnKVxuICBnZXQgdGFiaW5kZXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlID8gMCA6IC0xO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snKVxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlmQWN0aXZlU2VydmljZS5jdXJyZW50ID0gdGhpcy5pZDtcbiAgfVxufVxuIl19