/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { VerticalNavGroupService } from './providers/vertical-nav-group.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/conditional/if-expanded.service";
import * as i2 from "./providers/vertical-nav-group-registration.service";
import * as i3 from "./providers/vertical-nav-group.service";
import * as i4 from "./providers/vertical-nav.service";
import * as i5 from "../../utils/i18n/common-strings.service";
import * as i6 from "../../icon/icon";
const EXPANDED_STATE = 'expanded';
const COLLAPSED_STATE = 'collapsed';
export class ClrVerticalNavGroup {
    constructor(_itemExpand, _navGroupRegistrationService, navGroupService, _navService, commonStrings) {
        this._itemExpand = _itemExpand;
        this._navGroupRegistrationService = _navGroupRegistrationService;
        this._navService = _navService;
        this.commonStrings = commonStrings;
        this.expandedChange = new EventEmitter(true);
        this.wasExpanded = false;
        this._subscriptions = [];
        this._expandAnimationState = COLLAPSED_STATE;
        _navGroupRegistrationService.registerNavGroup();
        // FIXME: This subscription handles a corner case
        // Vertical Nav collapse requires the animation to run first and then
        // remove the nodes from the DOM. If the user directly sets the input
        // on the clrIfExpanded directive, we have no chance to run the animation
        // and wait for it to complete. This subscription makes sure that the
        // animation states are correct for that edge case.
        this._subscriptions.push(_itemExpand.expandChange.subscribe(value => {
            if (value && this.expandAnimationState === COLLAPSED_STATE) {
                if (_navService.collapsed) {
                    _navService.collapsed = false;
                }
                this.expandAnimationState = EXPANDED_STATE;
            }
            else if (!value && this.expandAnimationState === EXPANDED_STATE) {
                this.expandAnimationState = COLLAPSED_STATE;
            }
        }));
        // 1. If the nav is collapsing, close the open nav group + save its state
        // 2. If the nav is expanding, expand the nav group if the previous state was expanded
        this._subscriptions.push(_navService.animateOnCollapsed.subscribe((goingToCollapse) => {
            if (goingToCollapse && this.expanded) {
                this.wasExpanded = true;
                this.expandAnimationState = COLLAPSED_STATE;
            }
            else if (!goingToCollapse && this.wasExpanded) {
                this.expandGroup();
                this.wasExpanded = false;
            }
        }));
        // If a link is clicked, expand the nav group
        this._subscriptions.push(navGroupService.expandChange.subscribe((expand) => {
            if (expand && !this.expanded) {
                this.expandGroup();
            }
        }));
    }
    get expanded() {
        return this._itemExpand.expanded;
    }
    set expanded(value) {
        if (this._itemExpand.expanded !== value) {
            this._itemExpand.expanded = value;
            this.expandedChange.emit(value);
        }
    }
    set userExpandedInput(value) {
        value = !!value;
        if (this.expanded !== value) {
            // We have to call toggleExpand because some cases require animations to occur first
            // Directly setting the Expand service value skips the animation and can result in
            // nodes in the DOM but the nav group still being collapsed
            this.toggleExpand();
        }
    }
    get expandAnimationState() {
        return this._expandAnimationState;
    }
    set expandAnimationState(value) {
        if (value !== this._expandAnimationState) {
            this._expandAnimationState = value;
        }
    }
    ngAfterContentInit() {
        // This makes sure that if someone marks a nav group expanded in a collapsed nav
        // the expanded property is switched back to collapsed state.
        if (this._navService.collapsed && this.expanded) {
            this.wasExpanded = true;
            this.expandAnimationState = COLLAPSED_STATE;
        }
    }
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
        this._navGroupRegistrationService.unregisterNavGroup();
    }
    expandGroup() {
        this.expanded = true;
        // Expanded animation occurs after Expand.expand is set to true
        this.expandAnimationState = EXPANDED_STATE;
    }
    collapseGroup() {
        // If a Vertical Nav Group toggle button is clicked while the Vertical Nav is in Collapsed state,
        // the Vertical Nav should be expanded first.
        this.expandAnimationState = COLLAPSED_STATE;
    }
    // closes a group after the collapse animation
    expandAnimationDone($event) {
        if ($event.toState === COLLAPSED_STATE) {
            this.expanded = false;
        }
    }
    toggleExpand() {
        if (this.expanded) {
            this.collapseGroup();
        }
        else {
            // If nav is collasped, first open the nav
            if (this._navService.collapsed) {
                this._navService.collapsed = false;
            }
            // then expand the nav group
            this.expandGroup();
        }
    }
}
ClrVerticalNavGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavGroup, deps: [{ token: i1.IfExpandService }, { token: i2.VerticalNavGroupRegistrationService }, { token: i3.VerticalNavGroupService }, { token: i4.VerticalNavService }, { token: i5.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrVerticalNavGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrVerticalNavGroup, selector: "clr-vertical-nav-group", inputs: { userExpandedInput: ["clrVerticalNavGroupExpanded", "userExpandedInput"] }, outputs: { expandedChange: "clrVerticalNavGroupExpandedChange" }, host: { properties: { "class.is-expanded": "this.expanded" }, classAttribute: "nav-group" }, providers: [IfExpandService, VerticalNavGroupService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [attr.direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }], animations: [
        trigger('clrExpand', [
            state(EXPANDED_STATE, style({ height: '*' })),
            state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
            transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
        ]),
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrVerticalNavGroup, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav-group', providers: [IfExpandService, VerticalNavGroupService], animations: [
                        trigger('clrExpand', [
                            state(EXPANDED_STATE, style({ height: '*' })),
                            state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
                            transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
                        ]),
                    ], host: { class: 'nav-group' }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [attr.direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.IfExpandService }, { type: i2.VerticalNavGroupRegistrationService }, { type: i3.VerticalNavGroupService }, { type: i4.VerticalNavService }, { type: i5.ClrCommonStringsService }]; }, propDecorators: { expandedChange: [{
                type: Output,
                args: ['clrVerticalNavGroupExpandedChange']
            }], expanded: [{
                type: HostBinding,
                args: ['class.is-expanded']
            }], userExpandedInput: [{
                type: Input,
                args: ['clrVerticalNavGroupExpanded']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWwtbmF2LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvbGF5b3V0L3ZlcnRpY2FsLW5hdi92ZXJ0aWNhbC1uYXYtZ3JvdXAudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9sYXlvdXQvdmVydGljYWwtbmF2L3ZlcnRpY2FsLW5hdi1ncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLE9BQU8sRUFBa0IsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakcsT0FBTyxFQUFvQixTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQWEsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR2pILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUc5RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7Ozs7Ozs7QUFHakYsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO0FBQ2xDLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQztBQWVwQyxNQUFNLE9BQU8sbUJBQW1CO0lBTzlCLFlBQ1UsV0FBNEIsRUFDNUIsNEJBQWlFLEVBQ3pFLGVBQXdDLEVBQ2hDLFdBQStCLEVBQ2hDLGFBQXNDO1FBSnJDLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUM1QixpQ0FBNEIsR0FBNUIsNEJBQTRCLENBQXFDO1FBRWpFLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUNoQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFYRixtQkFBYyxHQUFHLElBQUksWUFBWSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBRXRGLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLG1CQUFjLEdBQW1CLEVBQUUsQ0FBQztR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QVZuQixDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQywwQkN2QnZELGdtQ0FxQkEsc0dER2M7UUFDVixPQUFPLENBQUMsV0FBVyxFQUFFO1lBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLFVBQVUsQ0FBQyxHQUFHLGNBQWMsUUFBUSxlQUFlLEVBQUUsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNwRixDQUFDO0tBQ0g7MkZBR1UsbUJBQW1CO2tCQWIvQixTQUFTOytCQUNFLHdCQUF3QixhQUV2QixDQUFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxjQUN6Qzt3QkFDVixPQUFPLENBQUMsV0FBVyxFQUFFOzRCQUNuQixLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDOzRCQUM3QyxLQUFLLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7NEJBQ2xFLFVBQVUsQ0FBQyxHQUFHLGNBQWMsUUFBUSxlQUFlLEVBQUUsRUFBRSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzt5QkFDcEYsQ0FBQztxQkFDSCxRQUNLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtxUUFHaUIsY0FBYztzQkFBMUQsTUFBTTt1QkFBQyxtQ0FBbUM7Z0JBMkR2QyxRQUFRO3NCQURYLFdBQVc7dUJBQUMsbUJBQW1CO2dCQVk1QixpQkFBaUI7c0JBRHBCLEtBQUs7dUJBQUMsNkJBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBhbmltYXRlLCBBbmltYXRpb25FdmVudCwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdEJpbmRpbmcsIElucHV0LCBPbkRlc3Ryb3ksIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElmRXhwYW5kU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmRpdGlvbmFsL2lmLWV4cGFuZGVkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmVydGljYWxOYXZHcm91cFJlZ2lzdHJhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy92ZXJ0aWNhbC1uYXYtZ3JvdXAtcmVnaXN0cmF0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmVydGljYWxOYXZHcm91cFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy92ZXJ0aWNhbC1uYXYtZ3JvdXAuc2VydmljZSc7XG5pbXBvcnQgeyBWZXJ0aWNhbE5hdlNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy92ZXJ0aWNhbC1uYXYuc2VydmljZSc7XG5cbmNvbnN0IEVYUEFOREVEX1NUQVRFID0gJ2V4cGFuZGVkJztcbmNvbnN0IENPTExBUFNFRF9TVEFURSA9ICdjb2xsYXBzZWQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItdmVydGljYWwtbmF2LWdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3ZlcnRpY2FsLW5hdi1ncm91cC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbSWZFeHBhbmRTZXJ2aWNlLCBWZXJ0aWNhbE5hdkdyb3VwU2VydmljZV0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdjbHJFeHBhbmQnLCBbXG4gICAgICBzdGF0ZShFWFBBTkRFRF9TVEFURSwgc3R5bGUoeyBoZWlnaHQ6ICcqJyB9KSksXG4gICAgICBzdGF0ZShDT0xMQVBTRURfU1RBVEUsIHN0eWxlKHsgaGVpZ2h0OiAwLCB2aXNpYmlsaXR5OiAnaGlkZGVuJyB9KSksXG4gICAgICB0cmFuc2l0aW9uKGAke0VYUEFOREVEX1NUQVRFfSA8PT4gJHtDT0xMQVBTRURfU1RBVEV9YCwgYW5pbWF0ZSgnMC4ycyBlYXNlLWluLW91dCcpKSxcbiAgICBdKSxcbiAgXSxcbiAgaG9zdDogeyBjbGFzczogJ25hdi1ncm91cCcgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVmVydGljYWxOYXZHcm91cCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoJ2NsclZlcnRpY2FsTmF2R3JvdXBFeHBhbmRlZENoYW5nZScpIGV4cGFuZGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPih0cnVlKTtcblxuICBwcml2YXRlIHdhc0V4cGFuZGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX2V4cGFuZEFuaW1hdGlvblN0YXRlOiBzdHJpbmcgPSBDT0xMQVBTRURfU1RBVEU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfaXRlbUV4cGFuZDogSWZFeHBhbmRTZXJ2aWNlLFxuICAgIHByaXZhdGUgX25hdkdyb3VwUmVnaXN0cmF0aW9uU2VydmljZTogVmVydGljYWxOYXZHcm91cFJlZ2lzdHJhdGlvblNlcnZpY2UsXG4gICAgbmF2R3JvdXBTZXJ2aWNlOiBWZXJ0aWNhbE5hdkdyb3VwU2VydmljZSxcbiAgICBwcml2YXRlIF9uYXZTZXJ2aWNlOiBWZXJ0aWNhbE5hdlNlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIF9uYXZHcm91cFJlZ2lzdHJhdGlvblNlcnZpY2UucmVnaXN0ZXJOYXZHcm91cCgpO1xuXG4gICAgLy8gRklYTUU6IFRoaXMgc3Vic2NyaXB0aW9uIGhhbmRsZXMgYSBjb3JuZXIgY2FzZVxuICAgIC8vIFZlcnRpY2FsIE5hdiBjb2xsYXBzZSByZXF1aXJlcyB0aGUgYW5pbWF0aW9uIHRvIHJ1biBmaXJzdCBhbmQgdGhlblxuICAgIC8vIHJlbW92ZSB0aGUgbm9kZXMgZnJvbSB0aGUgRE9NLiBJZiB0aGUgdXNlciBkaXJlY3RseSBzZXRzIHRoZSBpbnB1dFxuICAgIC8vIG9uIHRoZSBjbHJJZkV4cGFuZGVkIGRpcmVjdGl2ZSwgd2UgaGF2ZSBubyBjaGFuY2UgdG8gcnVuIHRoZSBhbmltYXRpb25cbiAgICAvLyBhbmQgd2FpdCBmb3IgaXQgdG8gY29tcGxldGUuIFRoaXMgc3Vic2NyaXB0aW9uIG1ha2VzIHN1cmUgdGhhdCB0aGVcbiAgICAvLyBhbmltYXRpb24gc3RhdGVzIGFyZSBjb3JyZWN0IGZvciB0aGF0IGVkZ2UgY2FzZS5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBfaXRlbUV4cGFuZC5leHBhbmRDaGFuZ2Uuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHRoaXMuZXhwYW5kQW5pbWF0aW9uU3RhdGUgPT09IENPTExBUFNFRF9TVEFURSkge1xuICAgICAgICAgIGlmIChfbmF2U2VydmljZS5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgIF9uYXZTZXJ2aWNlLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmV4cGFuZEFuaW1hdGlvblN0YXRlID0gRVhQQU5ERURfU1RBVEU7XG4gICAgICAgIH0gZWxzZSBpZiAoIXZhbHVlICYmIHRoaXMuZXhwYW5kQW5pbWF0aW9uU3RhdGUgPT09IEVYUEFOREVEX1NUQVRFKSB7XG4gICAgICAgICAgdGhpcy5leHBhbmRBbmltYXRpb25TdGF0ZSA9IENPTExBUFNFRF9TVEFURTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gMS4gSWYgdGhlIG5hdiBpcyBjb2xsYXBzaW5nLCBjbG9zZSB0aGUgb3BlbiBuYXYgZ3JvdXAgKyBzYXZlIGl0cyBzdGF0ZVxuICAgIC8vIDIuIElmIHRoZSBuYXYgaXMgZXhwYW5kaW5nLCBleHBhbmQgdGhlIG5hdiBncm91cCBpZiB0aGUgcHJldmlvdXMgc3RhdGUgd2FzIGV4cGFuZGVkXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgX25hdlNlcnZpY2UuYW5pbWF0ZU9uQ29sbGFwc2VkLnN1YnNjcmliZSgoZ29pbmdUb0NvbGxhcHNlOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGlmIChnb2luZ1RvQ29sbGFwc2UgJiYgdGhpcy5leHBhbmRlZCkge1xuICAgICAgICAgIHRoaXMud2FzRXhwYW5kZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZXhwYW5kQW5pbWF0aW9uU3RhdGUgPSBDT0xMQVBTRURfU1RBVEU7XG4gICAgICAgIH0gZWxzZSBpZiAoIWdvaW5nVG9Db2xsYXBzZSAmJiB0aGlzLndhc0V4cGFuZGVkKSB7XG4gICAgICAgICAgdGhpcy5leHBhbmRHcm91cCgpO1xuICAgICAgICAgIHRoaXMud2FzRXhwYW5kZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gSWYgYSBsaW5rIGlzIGNsaWNrZWQsIGV4cGFuZCB0aGUgbmF2IGdyb3VwXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgbmF2R3JvdXBTZXJ2aWNlLmV4cGFuZENoYW5nZS5zdWJzY3JpYmUoKGV4cGFuZDogYm9vbGVhbikgPT4ge1xuICAgICAgICBpZiAoZXhwYW5kICYmICF0aGlzLmV4cGFuZGVkKSB7XG4gICAgICAgICAgdGhpcy5leHBhbmRHcm91cCgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlzLWV4cGFuZGVkJylcbiAgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pdGVtRXhwYW5kLmV4cGFuZGVkO1xuICB9XG4gIHNldCBleHBhbmRlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9pdGVtRXhwYW5kLmV4cGFuZGVkICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5faXRlbUV4cGFuZC5leHBhbmRlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5leHBhbmRlZENoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsclZlcnRpY2FsTmF2R3JvdXBFeHBhbmRlZCcpXG4gIHNldCB1c2VyRXhwYW5kZWRJbnB1dCh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIHZhbHVlID0gISF2YWx1ZTtcbiAgICBpZiAodGhpcy5leHBhbmRlZCAhPT0gdmFsdWUpIHtcbiAgICAgIC8vIFdlIGhhdmUgdG8gY2FsbCB0b2dnbGVFeHBhbmQgYmVjYXVzZSBzb21lIGNhc2VzIHJlcXVpcmUgYW5pbWF0aW9ucyB0byBvY2N1ciBmaXJzdFxuICAgICAgLy8gRGlyZWN0bHkgc2V0dGluZyB0aGUgRXhwYW5kIHNlcnZpY2UgdmFsdWUgc2tpcHMgdGhlIGFuaW1hdGlvbiBhbmQgY2FuIHJlc3VsdCBpblxuICAgICAgLy8gbm9kZXMgaW4gdGhlIERPTSBidXQgdGhlIG5hdiBncm91cCBzdGlsbCBiZWluZyBjb2xsYXBzZWRcbiAgICAgIHRoaXMudG9nZ2xlRXhwYW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGV4cGFuZEFuaW1hdGlvblN0YXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2V4cGFuZEFuaW1hdGlvblN0YXRlO1xuICB9XG4gIHNldCBleHBhbmRBbmltYXRpb25TdGF0ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9leHBhbmRBbmltYXRpb25TdGF0ZSkge1xuICAgICAgdGhpcy5fZXhwYW5kQW5pbWF0aW9uU3RhdGUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gVGhpcyBtYWtlcyBzdXJlIHRoYXQgaWYgc29tZW9uZSBtYXJrcyBhIG5hdiBncm91cCBleHBhbmRlZCBpbiBhIGNvbGxhcHNlZCBuYXZcbiAgICAvLyB0aGUgZXhwYW5kZWQgcHJvcGVydHkgaXMgc3dpdGNoZWQgYmFjayB0byBjb2xsYXBzZWQgc3RhdGUuXG4gICAgaWYgKHRoaXMuX25hdlNlcnZpY2UuY29sbGFwc2VkICYmIHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMud2FzRXhwYW5kZWQgPSB0cnVlO1xuICAgICAgdGhpcy5leHBhbmRBbmltYXRpb25TdGF0ZSA9IENPTExBUFNFRF9TVEFURTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmZvckVhY2goKHN1YjogU3Vic2NyaXB0aW9uKSA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgdGhpcy5fbmF2R3JvdXBSZWdpc3RyYXRpb25TZXJ2aWNlLnVucmVnaXN0ZXJOYXZHcm91cCgpO1xuICB9XG5cbiAgZXhwYW5kR3JvdXAoKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbmRlZCA9IHRydWU7XG4gICAgLy8gRXhwYW5kZWQgYW5pbWF0aW9uIG9jY3VycyBhZnRlciBFeHBhbmQuZXhwYW5kIGlzIHNldCB0byB0cnVlXG4gICAgdGhpcy5leHBhbmRBbmltYXRpb25TdGF0ZSA9IEVYUEFOREVEX1NUQVRFO1xuICB9XG5cbiAgY29sbGFwc2VHcm91cCgpOiB2b2lkIHtcbiAgICAvLyBJZiBhIFZlcnRpY2FsIE5hdiBHcm91cCB0b2dnbGUgYnV0dG9uIGlzIGNsaWNrZWQgd2hpbGUgdGhlIFZlcnRpY2FsIE5hdiBpcyBpbiBDb2xsYXBzZWQgc3RhdGUsXG4gICAgLy8gdGhlIFZlcnRpY2FsIE5hdiBzaG91bGQgYmUgZXhwYW5kZWQgZmlyc3QuXG4gICAgdGhpcy5leHBhbmRBbmltYXRpb25TdGF0ZSA9IENPTExBUFNFRF9TVEFURTtcbiAgfVxuXG4gIC8vIGNsb3NlcyBhIGdyb3VwIGFmdGVyIHRoZSBjb2xsYXBzZSBhbmltYXRpb25cbiAgZXhwYW5kQW5pbWF0aW9uRG9uZSgkZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgaWYgKCRldmVudC50b1N0YXRlID09PSBDT0xMQVBTRURfU1RBVEUpIHtcbiAgICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVFeHBhbmQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgIHRoaXMuY29sbGFwc2VHcm91cCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBuYXYgaXMgY29sbGFzcGVkLCBmaXJzdCBvcGVuIHRoZSBuYXZcbiAgICAgIGlmICh0aGlzLl9uYXZTZXJ2aWNlLmNvbGxhcHNlZCkge1xuICAgICAgICB0aGlzLl9uYXZTZXJ2aWNlLmNvbGxhcHNlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gdGhlbiBleHBhbmQgdGhlIG5hdiBncm91cFxuICAgICAgdGhpcy5leHBhbmRHcm91cCgpO1xuICAgIH1cbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxkaXYgY2xhc3M9XCJuYXYtZ3JvdXAtY29udGVudFwiPlxuICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xyVmVydGljYWxOYXZMaW5rXVwiPjwvbmctY29udGVudD5cbiAgPGJ1dHRvbiBjbGFzcz1cIm5hdi1ncm91cC10cmlnZ2VyXCIgdHlwZT1cImJ1dHRvblwiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwiZXhwYW5kZWRcIiAoY2xpY2spPVwidG9nZ2xlRXhwYW5kKClcIj5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbY2xyVmVydGljYWxOYXZJY29uXVwiPjwvbmctY29udGVudD5cbiAgICA8ZGl2IGNsYXNzPVwibmF2LWdyb3VwLXRleHRcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGNsYXNzPVwibmF2LWdyb3VwLXRyaWdnZXItaWNvblwiIFthdHRyLmRpcmVjdGlvbl09XCJleHBhbmRlZCA/ICdkb3duJyA6ICdyaWdodCdcIj48L2Nkcy1pY29uPlxuICA8L2J1dHRvbj5cbjwvZGl2PlxuPCEtLVRPRE86IFRoaXMgYW5pbWF0aW9uIG5lZWRzIHRvIGJlIGFkZGVkIHRvIHRoZSBjbHItdmVydGljYWwtbmF2LWdyb3VwLWNoaWxkcmVuIGNvbXBvbmVudC0tPlxuPGRpdiBjbGFzcz1cIm5hdi1ncm91cC1jaGlsZHJlblwiIFtAY2xyRXhwYW5kXT1cImV4cGFuZEFuaW1hdGlvblN0YXRlXCIgKEBjbHJFeHBhbmQuZG9uZSk9XCJleHBhbmRBbmltYXRpb25Eb25lKCRldmVudClcIj5cbiAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW2NscklmRXhwYW5kZWRdLCBjbHItdmVydGljYWwtbmF2LWdyb3VwLWNoaWxkcmVuXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG4iXX0=