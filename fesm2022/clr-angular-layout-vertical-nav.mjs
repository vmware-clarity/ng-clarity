import * as i0 from '@angular/core';
import { Component, Injectable, EventEmitter, Input, HostBinding, Output, Optional, Inject, Directive, NgModule } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as i1 from '@clr/angular/utils';
import { IfExpandService, uniqueIdFactory, ClrConditionalModule, ClrFocusOnViewInitModule } from '@clr/angular/utils';
import { Subject, fromEvent } from 'rxjs';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, angleDoubleIcon, ClrIcon } from '@clr/angular/icon';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavGroupChildren {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavGroupChildren, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrVerticalNavGroupChildren, isStandalone: false, selector: "clr-vertical-nav-group-children", ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavGroupChildren, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-vertical-nav-group-children',
                    template: `<ng-content></ng-content>`,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavGroupService {
    constructor() {
        this._expandChange = new Subject();
    }
    get expandChange() {
        return this._expandChange.asObservable();
    }
    expand() {
        this._expandChange.next(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavGroupRegistrationService {
    constructor() {
        this.navGroupCount = 0;
    }
    registerNavGroup() {
        this.navGroupCount++;
    }
    unregisterNavGroup() {
        this.navGroupCount--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupRegistrationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupRegistrationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavGroupRegistrationService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavService {
    constructor() {
        this._animateOnCollapsed = new Subject();
        this._collapsedChanged = new Subject();
        this._collapsed = false;
        this._collapsible = false;
    }
    get animateOnCollapsed() {
        return this._animateOnCollapsed.asObservable();
    }
    get collapsedChanged() {
        return this._collapsedChanged.asObservable();
    }
    get collapsed() {
        return this._collapsed;
    }
    set collapsed(value) {
        value = !!value;
        if (this.collapsible && this._collapsed !== value) {
            this.updateCollapseBehavior(value);
        }
    }
    get collapsible() {
        return this._collapsible;
    }
    set collapsible(value) {
        value = !!value;
        if (this._collapsible !== value) {
            if (!value && this.collapsed) {
                this.updateCollapseBehavior(false);
            }
            this._collapsible = value;
        }
    }
    updateCollapseBehavior(value) {
        this._animateOnCollapsed.next(value);
        this._collapsed = value;
        this._collapsedChanged.next(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const EXPANDED_STATE = 'expanded';
const COLLAPSED_STATE = 'collapsed';
class ClrVerticalNavGroup {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavGroup, deps: [{ token: i1.IfExpandService }, { token: VerticalNavGroupRegistrationService }, { token: VerticalNavGroupService }, { token: VerticalNavService }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrVerticalNavGroup, isStandalone: false, selector: "clr-vertical-nav-group", inputs: { userExpandedInput: ["clrVerticalNavGroupExpanded", "userExpandedInput"] }, outputs: { expandedChange: "clrVerticalNavGroupExpandedChange" }, host: { properties: { "class.is-expanded": "this.expanded" }, classAttribute: "nav-group" }, providers: [IfExpandService, VerticalNavGroupService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }], animations: [
            trigger('clrExpand', [
                state(EXPANDED_STATE, style({ height: '*' })),
                state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
                transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
            ]),
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavGroup, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav-group', providers: [IfExpandService, VerticalNavGroupService], animations: [
                        trigger('clrExpand', [
                            state(EXPANDED_STATE, style({ height: '*' })),
                            state(COLLAPSED_STATE, style({ height: 0, visibility: 'hidden' })),
                            transition(`${EXPANDED_STATE} <=> ${COLLAPSED_STATE}`, animate('0.2s ease-in-out')),
                        ]),
                    ], host: { class: 'nav-group' }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<div class=\"nav-group-content\">\n  <ng-content select=\"[clrVerticalNavLink]\"></ng-content>\n  <button class=\"nav-group-trigger\" type=\"button\" [attr.aria-expanded]=\"expanded\" (click)=\"toggleExpand()\">\n    <ng-content select=\"[clrVerticalNavIcon]\"></ng-content>\n    <div class=\"nav-group-text\">\n      <ng-content></ng-content>\n    </div>\n    <cds-icon shape=\"angle\" class=\"nav-group-trigger-icon\" [direction]=\"expanded ? 'down' : 'right'\"></cds-icon>\n  </button>\n</div>\n<!--TODO: This animation needs to be added to the clr-vertical-nav-group-children component-->\n<div class=\"nav-group-children\" [@clrExpand]=\"expandAnimationState\" (@clrExpand.done)=\"expandAnimationDone($event)\">\n  <ng-content select=\"[clrIfExpanded], clr-vertical-nav-group-children\"></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: i1.IfExpandService }, { type: VerticalNavGroupRegistrationService }, { type: VerticalNavGroupService }, { type: VerticalNavService }, { type: i1.ClrCommonStringsService }], propDecorators: { expandedChange: [{
                type: Output,
                args: ['clrVerticalNavGroupExpandedChange']
            }], expanded: [{
                type: HostBinding,
                args: ['class.is-expanded']
            }], userExpandedInput: [{
                type: Input,
                args: ['clrVerticalNavGroupExpanded']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class VerticalNavIconService {
    constructor() {
        this._icons = 0;
    }
    get hasIcons() {
        return this._icons > 0;
    }
    registerIcon() {
        this._icons++;
    }
    unregisterIcon() {
        this._icons--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavIconService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavIconService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: VerticalNavIconService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNav {
    constructor(_navService, _navIconService, _navGroupRegistrationService, commonStrings) {
        this._navService = _navService;
        this._navIconService = _navIconService;
        this._navGroupRegistrationService = _navGroupRegistrationService;
        this.commonStrings = commonStrings;
        this.contentId = uniqueIdFactory();
        this._collapsedChanged = new EventEmitter(true);
        this._sub = _navService.collapsedChanged.subscribe(value => {
            this._collapsedChanged.emit(value);
        });
    }
    get collapsible() {
        return this._navService.collapsible;
    }
    set collapsible(value) {
        this._navService.collapsible = value;
    }
    get collapsed() {
        return this._navService.collapsed;
    }
    set collapsed(value) {
        this._navService.collapsed = value;
    }
    get hasNavGroups() {
        return this._navGroupRegistrationService.navGroupCount > 0;
    }
    get hasIcons() {
        return this._navIconService.hasIcons;
    }
    get ariaExpanded() {
        if (!this.collapsible) {
            return null;
        }
        return !this.collapsed ? 'true' : 'false';
    }
    ngOnDestroy() {
        this._sub.unsubscribe();
    }
    toggleByButton() {
        this.collapsed = !this.collapsed;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNav, deps: [{ token: VerticalNavService }, { token: VerticalNavIconService }, { token: VerticalNavGroupRegistrationService }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrVerticalNav, isStandalone: false, selector: "clr-vertical-nav", inputs: { toggleLabel: ["clrVerticalNavToggleLabel", "toggleLabel"], collapsible: ["clrVerticalNavCollapsible", "collapsible"], collapsed: ["clrVerticalNavCollapsed", "collapsed"] }, outputs: { _collapsedChanged: "clrVerticalNavCollapsedChange" }, host: { properties: { "class.is-collapsed": "collapsed", "class.has-nav-groups": "hasNavGroups", "class.has-icons": "hasIcons" }, classAttribute: "clr-vertical-nav" }, providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNav, decorators: [{
            type: Component,
            args: [{ selector: 'clr-vertical-nav', providers: [VerticalNavService, VerticalNavIconService, VerticalNavGroupRegistrationService], host: {
                        class: 'clr-vertical-nav',
                        '[class.is-collapsed]': 'collapsed',
                        '[class.has-nav-groups]': 'hasNavGroups',
                        '[class.has-icons]': 'hasIcons',
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (collapsible) {\n<button\n  type=\"button\"\n  class=\"nav-trigger\"\n  [class.on-collapse]=\"collapsed\"\n  [attr.aria-controls]=\"contentId\"\n  [attr.aria-expanded]=\"ariaExpanded\"\n  [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  (click)=\"toggleByButton()\"\n>\n  <cds-icon shape=\"angle-double\" class=\"nav-trigger-icon\" [direction]=\"(collapsed) ? 'right' : 'left'\"></cds-icon>\n</button>\n}\n<div [id]=\"contentId\" class=\"nav-content\">\n  <ng-content></ng-content>\n  @if (collapsible && collapsed) {\n  <button\n    type=\"button\"\n    (click)=\"collapsed = false\"\n    class=\"nav-btn\"\n    aria-hidden=\"true\"\n    tabindex=\"-1\"\n    [attr.aria-controls]=\"contentId\"\n    [attr.aria-label]=\"toggleLabel || commonStrings.keys.verticalNavToggle\"\n  ></button>\n  }\n</div>\n" }]
        }], ctorParameters: () => [{ type: VerticalNavService }, { type: VerticalNavIconService }, { type: VerticalNavGroupRegistrationService }, { type: i1.ClrCommonStringsService }], propDecorators: { toggleLabel: [{
                type: Input,
                args: ['clrVerticalNavToggleLabel']
            }], _collapsedChanged: [{
                type: Output,
                args: ['clrVerticalNavCollapsedChange']
            }], collapsible: [{
                type: Input,
                args: ['clrVerticalNavCollapsible']
            }], collapsed: [{
                type: Input,
                args: ['clrVerticalNavCollapsed']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavLink {
    constructor(host, ref, navGroupService) {
        this.destroy$ = new Subject();
        // Note: since the `VerticalNavGroupService` is an optional provider, we'll setup the event
        // listener only when the `[clrVerticalLink]` is located within the `clr-vertical-nav-group`.
        navGroupService &&
            fromEvent(host.nativeElement, 'click')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                navGroupService.expand();
                ref.markForCheck();
            });
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavLink, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: VerticalNavGroupService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrVerticalNavLink, isStandalone: false, selector: "[clrVerticalNavLink]", host: { classAttribute: "nav-link" }, ngImport: i0, template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavLink, decorators: [{
            type: Component,
            args: [{
                    selector: '[clrVerticalNavLink]',
                    template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `,
                    host: {
                        class: 'nav-link',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: VerticalNavGroupService, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [VerticalNavGroupService]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrVerticalNavIcon {
    constructor(_verticalNavIconService) {
        this._verticalNavIconService = _verticalNavIconService;
        _verticalNavIconService.registerIcon();
    }
    ngOnDestroy() {
        this._verticalNavIconService.unregisterIcon();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavIcon, deps: [{ token: VerticalNavIconService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrVerticalNavIcon, isStandalone: false, selector: "[clrVerticalNavIcon]", host: { classAttribute: "nav-icon" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVerticalNavIcon]',
                    host: { class: 'nav-icon' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: VerticalNavIconService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_VERTICAL_NAV_DIRECTIVES = [
    ClrVerticalNav,
    ClrVerticalNavLink,
    ClrVerticalNavGroup,
    ClrVerticalNavGroupChildren,
    ClrVerticalNavIcon,
];
class ClrVerticalNavModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, angleDoubleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavModule, declarations: [ClrVerticalNav,
            ClrVerticalNavLink,
            ClrVerticalNavGroup,
            ClrVerticalNavGroupChildren,
            ClrVerticalNavIcon], imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule], exports: [ClrVerticalNav,
            ClrVerticalNavLink,
            ClrVerticalNavGroup,
            ClrVerticalNavGroupChildren,
            ClrVerticalNavIcon, ClrConditionalModule, ClrIcon, ClrFocusOnViewInitModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavModule, imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule, ClrConditionalModule, ClrFocusOnViewInitModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrVerticalNavModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrConditionalModule, ClrFocusOnViewInitModule],
                    declarations: [CLR_VERTICAL_NAV_DIRECTIVES],
                    exports: [CLR_VERTICAL_NAV_DIRECTIVES, ClrConditionalModule, ClrIcon, ClrFocusOnViewInitModule],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_VERTICAL_NAV_DIRECTIVES, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule };
//# sourceMappingURL=clr-angular-layout-vertical-nav.mjs.map
