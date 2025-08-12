/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChildren, Input, ViewChild, } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ClrDestroyService } from '../../utils/destroy/destroy.service';
import { FOCUS_SERVICE_PROVIDER } from '../../utils/focus/focus.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrPopoverPositions } from '../../utils/popover/enums/positions.enum';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, } from '../providers/button-group-focus-handler.service';
import { InitialFocus } from '../providers/button-group-focus.enum';
import { ButtonInGroupService } from '../providers/button-in-group.service';
import { ClrButton } from './button';
import * as i0 from "@angular/core";
import * as i1 from "../providers/button-in-group.service";
import * as i2 from "../../utils/popover/providers/popover-toggle.service";
import * as i3 from "../../utils/i18n/common-strings.service";
import * as i4 from "../../utils/destroy/destroy.service";
import * as i5 from "../providers/button-group-focus-handler.service";
import * as i6 from "../../utils/popover/popover-host.directive";
import * as i7 from "@angular/common";
import * as i8 from "../../icon/icon";
import * as i9 from "../../utils/popover/popover-anchor";
import * as i10 from "../../utils/popover/popover-open-close-button";
import * as i11 from "../../utils/popover/popover-content";
export class ClrButtonGroup {
    constructor(buttonGroupNewService, toggleService, commonStrings, destroy$, focusHandler) {
        this.buttonGroupNewService = buttonGroupNewService;
        this.toggleService = toggleService;
        this.commonStrings = commonStrings;
        this.destroy$ = destroy$;
        this.focusHandler = focusHandler;
        this.clrToggleButtonAriaLabel = this.commonStrings.keys.rowActions;
        this.popoverId = uniqueIdFactory();
        this.InitialFocus = InitialFocus;
        this.popoverPosition = ClrPopoverPositions['bottom-left'];
        this.inlineButtons = [];
        this.menuButtons = [];
    }
    get menuPosition() {
        return this._menuPosition;
    }
    set menuPosition(pos) {
        if (pos && ClrPopoverPositions[pos]) {
            this._menuPosition = pos;
        }
        else {
            this._menuPosition = 'bottom-left';
        }
        this.popoverPosition = ClrPopoverPositions[this._menuPosition];
    }
    get open() {
        return this.toggleService.open;
    }
    /**
     * 1. Initializes the initial Button Group View
     * 2. Subscribes to changes on the ContentChildren
     *    in case the user content projection changes
     */
    ngAfterContentInit() {
        this.initializeButtons();
        this.buttonGroupNewService.changes.pipe(takeUntil(this.destroy$)).subscribe(button => this.rearrangeButton(button));
        this.buttons.changes.subscribe(() => {
            this.initializeButtons();
        });
    }
    ngAfterViewInit() {
        this.handleFocusOnMenuOpen();
    }
    /**
     * Moves the button into the other ViewContainer
     * when an update is received.
     *
     * @param button
     */
    rearrangeButton(button) {
        let fromView;
        let toView;
        if (button.inMenu) {
            fromView = this.inlineButtons;
            toView = this.menuButtons;
        }
        else {
            fromView = this.menuButtons;
            toView = this.inlineButtons;
        }
        const index = fromView.indexOf(button);
        if (index > -1) {
            fromView.splice(index, 1);
            const moveIndex = this.getMoveIndex(button);
            if (moveIndex <= toView.length) {
                toView.splice(moveIndex, 0, button);
            }
        }
    }
    openMenu(event, initialFocus) {
        this.focusHandler.initialFocus = initialFocus;
        if (!this.toggleService.open) {
            this.toggleService.toggleWithEvent(event);
        }
    }
    /**
     * Author: Eudes
     *
     * Finds the order of a button w.r.t other buttons
     *
     * @param buttonToMove
     * @returns
     */
    getMoveIndex(buttonToMove) {
        const tempArr = this.buttons.filter(button => button.inMenu === buttonToMove.inMenu);
        return tempArr.indexOf(buttonToMove);
    }
    initializeButtons() {
        const tempInlineButtons = [];
        const tempInMenuButtons = [];
        this.buttons.forEach(button => {
            if (button.inMenu) {
                tempInMenuButtons.push(button);
            }
            else {
                tempInlineButtons.push(button);
            }
        });
        this.inlineButtons = tempInlineButtons;
        this.menuButtons = tempInMenuButtons;
    }
    handleFocusOnMenuOpen() {
        this.toggleService.popoverVisible.pipe(takeUntil(this.destroy$)).subscribe(visible => {
            if (visible) {
                this.focusHandler.initialize({
                    menu: this.menu.nativeElement,
                    menuToggle: this.menuToggle.nativeElement,
                });
            }
        });
    }
}
ClrButtonGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroup, deps: [{ token: i1.ButtonInGroupService }, { token: i2.ClrPopoverToggleService }, { token: i3.ClrCommonStringsService }, { token: i4.ClrDestroyService }, { token: i5.ButtonGroupFocusHandler }], target: i0.ɵɵFactoryTarget.Component });
ClrButtonGroup.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrButtonGroup, selector: "clr-button-group", inputs: { clrToggleButtonAriaLabel: "clrToggleButtonAriaLabel", menuPosition: ["clrMenuPosition", "menuPosition"] }, host: { properties: { "class.btn-group": "true" } }, providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER], queries: [{ propertyName: "buttons", predicate: ClrButton }], viewQueries: [{ propertyName: "menuToggle", first: true, predicate: ["menuToggle"], descendants: true }, { propertyName: "menu", first: true, predicate: ["menu"], descendants: true }], hostDirectives: [{ directive: i6.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-template *ngFor=\"let inlineButton of inlineButtons\" [ngTemplateOutlet]=\"inlineButton.templateRef\"></ng-template>\n\n<div *ngIf=\"menuButtons.length > 0\" class=\"btn-group-overflow open\" [ngClass]=\"menuPosition\">\n  <button\n    #menuToggle\n    class=\"btn dropdown-toggle\"\n    clrPopoverAnchor\n    clrPopoverOpenCloseButton\n    (keydown.arrowup)=\"openMenu($event, InitialFocus.LAST_ITEM)\"\n    (keydown.arrowdown)=\"openMenu($event, InitialFocus.FIRST_ITEM)\"\n    [attr.aria-controls]=\"popoverId\"\n    [attr.aria-expanded]=\"open\"\n    [attr.aria-label]=\"clrToggleButtonAriaLabel\"\n  >\n    <cds-icon shape=\"ellipsis-horizontal\" [attr.title]=\"commonStrings.keys.more\"></cds-icon>\n  </button>\n  <div\n    #menu\n    role=\"menu\"\n    class=\"dropdown-menu clr-button-group-menu\"\n    [id]=\"popoverId\"\n    [attr.id]=\"popoverId\"\n    [attr.aria-hidden]=\"!open\"\n    *clrPopoverContent=\"open at popoverPosition; outsideClickToClose: true; scrollToClose: true\"\n  >\n    <ng-template *ngFor=\"let menuButton of menuButtons\" [ngTemplateOutlet]=\"menuButton.templateRef\"></ng-template>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i7.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i7.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i8.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i9.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i10.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i11.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrButtonGroup, decorators: [{
            type: Component,
            args: [{ selector: 'clr-button-group', providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER], hostDirectives: [ClrPopoverHostDirective], host: { '[class.btn-group]': 'true' }, template: "<!--\n  ~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-template *ngFor=\"let inlineButton of inlineButtons\" [ngTemplateOutlet]=\"inlineButton.templateRef\"></ng-template>\n\n<div *ngIf=\"menuButtons.length > 0\" class=\"btn-group-overflow open\" [ngClass]=\"menuPosition\">\n  <button\n    #menuToggle\n    class=\"btn dropdown-toggle\"\n    clrPopoverAnchor\n    clrPopoverOpenCloseButton\n    (keydown.arrowup)=\"openMenu($event, InitialFocus.LAST_ITEM)\"\n    (keydown.arrowdown)=\"openMenu($event, InitialFocus.FIRST_ITEM)\"\n    [attr.aria-controls]=\"popoverId\"\n    [attr.aria-expanded]=\"open\"\n    [attr.aria-label]=\"clrToggleButtonAriaLabel\"\n  >\n    <cds-icon shape=\"ellipsis-horizontal\" [attr.title]=\"commonStrings.keys.more\"></cds-icon>\n  </button>\n  <div\n    #menu\n    role=\"menu\"\n    class=\"dropdown-menu clr-button-group-menu\"\n    [id]=\"popoverId\"\n    [attr.id]=\"popoverId\"\n    [attr.aria-hidden]=\"!open\"\n    *clrPopoverContent=\"open at popoverPosition; outsideClickToClose: true; scrollToClose: true\"\n  >\n    <ng-template *ngFor=\"let menuButton of menuButtons\" [ngTemplateOutlet]=\"menuButton.templateRef\"></ng-template>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.ButtonInGroupService }, { type: i2.ClrPopoverToggleService }, { type: i3.ClrCommonStringsService }, { type: i4.ClrDestroyService }, { type: i5.ButtonGroupFocusHandler }]; }, propDecorators: { clrToggleButtonAriaLabel: [{
                type: Input,
                args: ['clrToggleButtonAriaLabel']
            }], menuToggle: [{
                type: ViewChild,
                args: ['menuToggle']
            }], menu: [{
                type: ViewChild,
                args: ['menu']
            }], buttons: [{
                type: ContentChildren,
                args: [ClrButton]
            }], menuPosition: [{
                type: Input,
                args: ['clrMenuPosition']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvYnV0dG9uL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9idXR0b24vYnV0dG9uLWdyb3VwL2J1dHRvbi1ncm91cC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUdMLFNBQVMsRUFDVCxlQUFlLEVBRWYsS0FBSyxFQUVMLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDeEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFekUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRS9FLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBRXJGLE9BQU8sRUFDTCxtQ0FBbUMsR0FFcEMsTUFBTSxpREFBaUQsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDNUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQVNyQyxNQUFNLE9BQU8sY0FBYztJQWtCekIsWUFDUyxxQkFBMkMsRUFDMUMsYUFBc0MsRUFDdkMsYUFBc0MsRUFDckMsUUFBMkIsRUFDM0IsWUFBcUM7UUFKdEMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUFzQjtRQUMx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QUMsYUFBYTtpQkFDMUMsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OzJHQWxJVSxjQUFjOytGQUFkLGNBQWMscU5BSmQsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxtQ0FBbUMsRUFBRSxzQkFBc0IsQ0FBQyxrREFVaEcsU0FBUyxtUkNoRDVCLGs2Q0FtQ0E7MkZET2EsY0FBYztrQkFQMUIsU0FBUzsrQkFDRSxrQkFBa0IsYUFFakIsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsRUFBRSxtQ0FBbUMsRUFBRSxzQkFBc0IsQ0FBQyxrQkFDakcsQ0FBQyx1QkFBdUIsQ0FBQyxRQUNuQyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sRUFBRTs2UEFHRix3QkFBd0I7c0JBQTFELEtBQUs7dUJBQUMsMEJBQTBCO2dCQUVSLFVBQVU7c0JBQWxDLFNBQVM7dUJBQUMsWUFBWTtnQkFDSixJQUFJO3NCQUF0QixTQUFTO3VCQUFDLE1BQU07Z0JBRVcsT0FBTztzQkFBbEMsZUFBZTt1QkFBQyxTQUFTO2dCQXFCdEIsWUFBWTtzQkFEZixLQUFLO3VCQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENsckRlc3Ryb3lTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvZGVzdHJveS9kZXN0cm95LnNlcnZpY2UnO1xuaW1wb3J0IHsgRk9DVVNfU0VSVklDRV9QUk9WSURFUiB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2ZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJQb3NpdGlvbnMgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL3Bvc2l0aW9ucy5lbnVtJztcbmltcG9ydCB7IENsclBvcG92ZXJQb3NpdGlvbiB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvaW50ZXJmYWNlcy9wb3BvdmVyLXBvc2l0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVySG9zdERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1ob3N0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgQlVUVE9OX0dST1VQX0ZPQ1VTX0hBTkRMRVJfUFJPVklERVIsXG4gIEJ1dHRvbkdyb3VwRm9jdXNIYW5kbGVyLFxufSBmcm9tICcuLi9wcm92aWRlcnMvYnV0dG9uLWdyb3VwLWZvY3VzLWhhbmRsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBJbml0aWFsRm9jdXMgfSBmcm9tICcuLi9wcm92aWRlcnMvYnV0dG9uLWdyb3VwLWZvY3VzLmVudW0nO1xuaW1wb3J0IHsgQnV0dG9uSW5Hcm91cFNlcnZpY2UgfSBmcm9tICcuLi9wcm92aWRlcnMvYnV0dG9uLWluLWdyb3VwLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyQnV0dG9uIH0gZnJvbSAnLi9idXR0b24nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItYnV0dG9uLWdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdidXR0b24tZ3JvdXAuaHRtbCcsXG4gIHByb3ZpZGVyczogW0J1dHRvbkluR3JvdXBTZXJ2aWNlLCBDbHJEZXN0cm95U2VydmljZSwgQlVUVE9OX0dST1VQX0ZPQ1VTX0hBTkRMRVJfUFJPVklERVIsIEZPQ1VTX1NFUlZJQ0VfUFJPVklERVJdLFxuICBob3N0RGlyZWN0aXZlczogW0NsclBvcG92ZXJIb3N0RGlyZWN0aXZlXSxcbiAgaG9zdDogeyAnW2NsYXNzLmJ0bi1ncm91cF0nOiAndHJ1ZScgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQnV0dG9uR3JvdXAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCdjbHJUb2dnbGVCdXR0b25BcmlhTGFiZWwnKSBjbHJUb2dnbGVCdXR0b25BcmlhTGFiZWw6IHN0cmluZyA9IHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLnJvd0FjdGlvbnM7XG5cbiAgQFZpZXdDaGlsZCgnbWVudVRvZ2dsZScpIG1lbnVUb2dnbGU6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBAVmlld0NoaWxkKCdtZW51JykgbWVudTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgQENvbnRlbnRDaGlsZHJlbihDbHJCdXR0b24pIGJ1dHRvbnM6IFF1ZXJ5TGlzdDxDbHJCdXR0b24+O1xuXG4gIHBvcG92ZXJJZCA9IHVuaXF1ZUlkRmFjdG9yeSgpO1xuICBJbml0aWFsRm9jdXMgPSBJbml0aWFsRm9jdXM7XG5cbiAgcG9wb3ZlclBvc2l0aW9uOiBDbHJQb3BvdmVyUG9zaXRpb24gPSBDbHJQb3BvdmVyUG9zaXRpb25zWydib3R0b20tbGVmdCddO1xuICBpbmxpbmVCdXR0b25zOiBDbHJCdXR0b25bXSA9IFtdO1xuICBtZW51QnV0dG9uczogQ2xyQnV0dG9uW10gPSBbXTtcblxuICAvLyBJbmRpY2F0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBvdmVyZmxvdyBtZW51XG4gIHByaXZhdGUgX21lbnVQb3NpdGlvbjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBidXR0b25Hcm91cE5ld1NlcnZpY2U6IEJ1dHRvbkluR3JvdXBTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgZGVzdHJveSQ6IENsckRlc3Ryb3lTZXJ2aWNlLFxuICAgIHByaXZhdGUgZm9jdXNIYW5kbGVyOiBCdXR0b25Hcm91cEZvY3VzSGFuZGxlclxuICApIHt9XG5cbiAgQElucHV0KCdjbHJNZW51UG9zaXRpb24nKVxuICBnZXQgbWVudVBvc2l0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lbnVQb3NpdGlvbjtcbiAgfVxuICBzZXQgbWVudVBvc2l0aW9uKHBvczogc3RyaW5nKSB7XG4gICAgaWYgKHBvcyAmJiAoQ2xyUG9wb3ZlclBvc2l0aW9ucyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVtwb3NdKSB7XG4gICAgICB0aGlzLl9tZW51UG9zaXRpb24gPSBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21lbnVQb3NpdGlvbiA9ICdib3R0b20tbGVmdCc7XG4gICAgfVxuXG4gICAgdGhpcy5wb3BvdmVyUG9zaXRpb24gPSAoQ2xyUG9wb3ZlclBvc2l0aW9ucyBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KVt0aGlzLl9tZW51UG9zaXRpb25dO1xuICB9XG5cbiAgZ2V0IG9wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuO1xuICB9XG5cbiAgLyoqXG4gICAqIDEuIEluaXRpYWxpemVzIHRoZSBpbml0aWFsIEJ1dHRvbiBHcm91cCBWaWV3XG4gICAqIDIuIFN1YnNjcmliZXMgdG8gY2hhbmdlcyBvbiB0aGUgQ29udGVudENoaWxkcmVuXG4gICAqICAgIGluIGNhc2UgdGhlIHVzZXIgY29udGVudCBwcm9qZWN0aW9uIGNoYW5nZXNcbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVCdXR0b25zKCk7XG4gICAgdGhpcy5idXR0b25Hcm91cE5ld1NlcnZpY2UuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGJ1dHRvbiA9PiB0aGlzLnJlYXJyYW5nZUJ1dHRvbihidXR0b24pKTtcbiAgICB0aGlzLmJ1dHRvbnMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5pbml0aWFsaXplQnV0dG9ucygpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaGFuZGxlRm9jdXNPbk1lbnVPcGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIGJ1dHRvbiBpbnRvIHRoZSBvdGhlciBWaWV3Q29udGFpbmVyXG4gICAqIHdoZW4gYW4gdXBkYXRlIGlzIHJlY2VpdmVkLlxuICAgKlxuICAgKiBAcGFyYW0gYnV0dG9uXG4gICAqL1xuICByZWFycmFuZ2VCdXR0b24oYnV0dG9uOiBDbHJCdXR0b24pOiB2b2lkIHtcbiAgICBsZXQgZnJvbVZpZXc6IENsckJ1dHRvbltdO1xuICAgIGxldCB0b1ZpZXc6IENsckJ1dHRvbltdO1xuICAgIGlmIChidXR0b24uaW5NZW51KSB7XG4gICAgICBmcm9tVmlldyA9IHRoaXMuaW5saW5lQnV0dG9ucztcbiAgICAgIHRvVmlldyA9IHRoaXMubWVudUJ1dHRvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb21WaWV3ID0gdGhpcy5tZW51QnV0dG9ucztcbiAgICAgIHRvVmlldyA9IHRoaXMuaW5saW5lQnV0dG9ucztcbiAgICB9XG4gICAgY29uc3QgaW5kZXg6IG51bWJlciA9IGZyb21WaWV3LmluZGV4T2YoYnV0dG9uKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgZnJvbVZpZXcuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGNvbnN0IG1vdmVJbmRleCA9IHRoaXMuZ2V0TW92ZUluZGV4KGJ1dHRvbik7XG4gICAgICBpZiAobW92ZUluZGV4IDw9IHRvVmlldy5sZW5ndGgpIHtcbiAgICAgICAgdG9WaWV3LnNwbGljZShtb3ZlSW5kZXgsIDAsIGJ1dHRvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3Blbk1lbnUoZXZlbnQ6IEV2ZW50LCBpbml0aWFsRm9jdXM6IEluaXRpYWxGb2N1cykge1xuICAgIHRoaXMuZm9jdXNIYW5kbGVyLmluaXRpYWxGb2N1cyA9IGluaXRpYWxGb2N1cztcbiAgICBpZiAoIXRoaXMudG9nZ2xlU2VydmljZS5vcGVuKSB7XG4gICAgICB0aGlzLnRvZ2dsZVNlcnZpY2UudG9nZ2xlV2l0aEV2ZW50KGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXV0aG9yOiBFdWRlc1xuICAgKlxuICAgKiBGaW5kcyB0aGUgb3JkZXIgb2YgYSBidXR0b24gdy5yLnQgb3RoZXIgYnV0dG9uc1xuICAgKlxuICAgKiBAcGFyYW0gYnV0dG9uVG9Nb3ZlXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBnZXRNb3ZlSW5kZXgoYnV0dG9uVG9Nb3ZlOiBDbHJCdXR0b24pOiBudW1iZXIge1xuICAgIGNvbnN0IHRlbXBBcnI6IENsckJ1dHRvbltdID0gdGhpcy5idXR0b25zLmZpbHRlcihidXR0b24gPT4gYnV0dG9uLmluTWVudSA9PT0gYnV0dG9uVG9Nb3ZlLmluTWVudSk7XG4gICAgcmV0dXJuIHRlbXBBcnIuaW5kZXhPZihidXR0b25Ub01vdmUpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUJ1dHRvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgdGVtcElubGluZUJ1dHRvbnM6IENsckJ1dHRvbltdID0gW107XG4gICAgY29uc3QgdGVtcEluTWVudUJ1dHRvbnM6IENsckJ1dHRvbltdID0gW107XG4gICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgIGlmIChidXR0b24uaW5NZW51KSB7XG4gICAgICAgIHRlbXBJbk1lbnVCdXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlbXBJbmxpbmVCdXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmlubGluZUJ1dHRvbnMgPSB0ZW1wSW5saW5lQnV0dG9ucztcbiAgICB0aGlzLm1lbnVCdXR0b25zID0gdGVtcEluTWVudUJ1dHRvbnM7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUZvY3VzT25NZW51T3BlbigpIHtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2UucG9wb3ZlclZpc2libGUucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSh2aXNpYmxlID0+IHtcbiAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuZm9jdXNIYW5kbGVyLmluaXRpYWxpemUoe1xuICAgICAgICAgIG1lbnU6IHRoaXMubWVudS5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgIG1lbnVUb2dnbGU6IHRoaXMubWVudVRvZ2dsZS5uYXRpdmVFbGVtZW50LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiPCEtLVxuICB+IENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICB+IFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAgfiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICB+IFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAgLS0+XG5cbjxuZy10ZW1wbGF0ZSAqbmdGb3I9XCJsZXQgaW5saW5lQnV0dG9uIG9mIGlubGluZUJ1dHRvbnNcIiBbbmdUZW1wbGF0ZU91dGxldF09XCJpbmxpbmVCdXR0b24udGVtcGxhdGVSZWZcIj48L25nLXRlbXBsYXRlPlxuXG48ZGl2ICpuZ0lmPVwibWVudUJ1dHRvbnMubGVuZ3RoID4gMFwiIGNsYXNzPVwiYnRuLWdyb3VwLW92ZXJmbG93IG9wZW5cIiBbbmdDbGFzc109XCJtZW51UG9zaXRpb25cIj5cbiAgPGJ1dHRvblxuICAgICNtZW51VG9nZ2xlXG4gICAgY2xhc3M9XCJidG4gZHJvcGRvd24tdG9nZ2xlXCJcbiAgICBjbHJQb3BvdmVyQW5jaG9yXG4gICAgY2xyUG9wb3Zlck9wZW5DbG9zZUJ1dHRvblxuICAgIChrZXlkb3duLmFycm93dXApPVwib3Blbk1lbnUoJGV2ZW50LCBJbml0aWFsRm9jdXMuTEFTVF9JVEVNKVwiXG4gICAgKGtleWRvd24uYXJyb3dkb3duKT1cIm9wZW5NZW51KCRldmVudCwgSW5pdGlhbEZvY3VzLkZJUlNUX0lURU0pXCJcbiAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cInBvcG92ZXJJZFwiXG4gICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJvcGVuXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNsclRvZ2dsZUJ1dHRvbkFyaWFMYWJlbFwiXG4gID5cbiAgICA8Y2RzLWljb24gc2hhcGU9XCJlbGxpcHNpcy1ob3Jpem9udGFsXCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLm1vcmVcIj48L2Nkcy1pY29uPlxuICA8L2J1dHRvbj5cbiAgPGRpdlxuICAgICNtZW51XG4gICAgcm9sZT1cIm1lbnVcIlxuICAgIGNsYXNzPVwiZHJvcGRvd24tbWVudSBjbHItYnV0dG9uLWdyb3VwLW1lbnVcIlxuICAgIFtpZF09XCJwb3BvdmVySWRcIlxuICAgIFthdHRyLmlkXT1cInBvcG92ZXJJZFwiXG4gICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwiIW9wZW5cIlxuICAgICpjbHJQb3BvdmVyQ29udGVudD1cIm9wZW4gYXQgcG9wb3ZlclBvc2l0aW9uOyBvdXRzaWRlQ2xpY2tUb0Nsb3NlOiB0cnVlOyBzY3JvbGxUb0Nsb3NlOiB0cnVlXCJcbiAgPlxuICAgIDxuZy10ZW1wbGF0ZSAqbmdGb3I9XCJsZXQgbWVudUJ1dHRvbiBvZiBtZW51QnV0dG9uc1wiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm1lbnVCdXR0b24udGVtcGxhdGVSZWZcIj48L25nLXRlbXBsYXRlPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19