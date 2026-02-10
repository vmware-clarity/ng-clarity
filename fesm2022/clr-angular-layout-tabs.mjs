import * as i0 from '@angular/core';
import { Injectable, ViewChild, Input, Inject, Component, InjectionToken, HostListener, HostBinding, Directive, ContentChild, ElementRef, ViewContainerRef, ContentChildren, Optional, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective } from '@clr/angular/popover/common';
import * as i1 from '@clr/angular/utils';
import { IF_ACTIVE_ID, TemplateRefContainer, IF_ACTIVE_ID_PROVIDER, ClrKeyFocus, IfActiveService, WillyWonka, OompaLoompa, ClrConditionalModule, ClrTemplateRefModule, ClrKeyFocusModule } from '@clr/angular/utils';
import { startWith } from 'rxjs/operators';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, ellipsisHorizontalIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var TabsLayout;
(function (TabsLayout) {
    TabsLayout["HORIZONTAL"] = "horizontal";
    TabsLayout["VERTICAL"] = "vertical";
})(TabsLayout || (TabsLayout = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TabsService {
    constructor() {
        this.layout = TabsLayout.HORIZONTAL;
        this._children = [];
    }
    get children() {
        return this._children;
    }
    get activeTab() {
        return this.children.find((tab) => {
            return tab.active;
        });
    }
    get overflowTabs() {
        if (this.layout === TabsLayout.VERTICAL) {
            return [];
        }
        else {
            return this.children.filter((tab) => tab.tabLink.inOverflow === true);
        }
    }
    register(tab) {
        this._children.push(tab);
    }
    unregister(tab) {
        const index = this.children.indexOf(tab);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabContentComponents = 0;
class ClrTabContent {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        if (!this.tabContentId) {
            this.tabContentId = 'clr-tab-content-' + nbTabContentComponents++;
        }
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    get ariaLabelledBy() {
        return this.tabsService.children.find(tab => tab.tabLink.id === this.id)?.tabLink?.tabLinkId;
    }
    // The template must be applied on the top-down phase of view-child initialization to prevent
    // components in the content from initializing before a content container exists.
    // Some child components need their container for sizing calculations.
    set templateRef(value) {
        this.viewRef = this.tabsService.tabContentViewContainer.createEmbeddedView(value);
    }
    ngOnDestroy() {
        const index = this.tabsService.tabContentViewContainer.indexOf(this.viewRef);
        if (index > -1) {
            this.tabsService.tabContentViewContainer.remove(index);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabContent, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: TabsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabContent, isStandalone: false, selector: "clr-tab-content", inputs: { tabContentId: ["id", "tabContentId"] }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["tabContentProjectedRef"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab-content',
                    template: `
    <ng-template #tabContentProjectedRef>
      <section
        [id]="tabContentId"
        role="tabpanel"
        class="tab-content"
        [class.active]="active"
        [hidden]="!active"
        [attr.aria-labelledby]="ariaLabelledBy"
        [attr.aria-hidden]="!active"
      >
        <ng-content></ng-content>
      </section>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: TabsService }], propDecorators: { tabContentId: [{
                type: Input,
                args: ['id']
            }], templateRef: [{
                type: ViewChild,
                args: ['tabContentProjectedRef', { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabsComponent = 0;
const TABS_ID = new InjectionToken('TABS_ID');
function tokenFactory() {
    return 'clr-tabs-' + nbTabsComponent++;
}
const TABS_ID_PROVIDER = {
    provide: TABS_ID,
    useFactory: tokenFactory,
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbTabLinkComponents = 0;
class ClrTabLink {
    constructor(ifActiveService, id, el, viewContainerRef, tabsService, tabsId) {
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
        this.templateRefContainer = viewContainerRef.createComponent(TemplateRefContainer, {
            projectableNodes: [[el.nativeElement]],
        }).instance;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabLink, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: TabsService }, { token: TABS_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabLink, isStandalone: false, selector: "[clrTabLink]", inputs: { tabLinkId: ["id", "tabLinkId"], inOverflow: ["clrTabLinkInOverflow", "inOverflow"] }, host: { attributes: { "role": "tab", "type": "button" }, listeners: { "click": "activate()" }, properties: { "class.btn": "true", "id": "this.tabLinkId", "class.btn-link": "this.addLinkClasses", "class.nav-link": "this.addLinkClasses", "attr.aria-controls": "this.ariaControls", "class.active": "this.active", "attr.aria-selected": "this.active", "attr.tabindex": "this.tabindex" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink]',
                    host: {
                        '[class.btn]': 'true',
                        role: 'tab',
                        type: 'button',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }], propDecorators: { tabLinkId: [{
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTab {
    constructor(ifActiveService, id, tabsService) {
        this.ifActiveService = ifActiveService;
        this.id = id;
        this.tabsService = tabsService;
        tabsService.register(this);
    }
    get active() {
        return this.ifActiveService.current === this.id;
    }
    ngOnDestroy() {
        this.tabsService.unregister(this);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTab, deps: [{ token: i1.IfActiveService }, { token: IF_ACTIVE_ID }, { token: TabsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTab, isStandalone: false, selector: "clr-tab", providers: [IF_ACTIVE_ID_PROVIDER], queries: [{ propertyName: "tabLink", first: true, predicate: ClrTabLink, descendants: true, static: true }, { propertyName: "tabContent", first: true, predicate: ClrTabContent, descendants: true, static: true }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTab, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab',
                    template: `<ng-content></ng-content>`,
                    providers: [IF_ACTIVE_ID_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.IfActiveService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: TabsService }], propDecorators: { tabLink: [{
                type: ContentChild,
                args: [ClrTabLink, { static: true }]
            }], tabContent: [{
                type: ContentChild,
                args: [ClrTabContent, { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabAction {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabAction, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabAction, isStandalone: false, selector: "[clrTabAction]", host: { attributes: { "tabindex": "0" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabAction, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabAction]',
                    host: {
                        tabindex: '0',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabOverflowContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabOverflowContent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabOverflowContent, isStandalone: false, selector: "clr-tab-overflow-content", host: { properties: { "class.dropdown-menu": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabOverflowContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tab-overflow-content',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.dropdown-menu]': 'true',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabs {
    constructor(ifActiveService, popoverService, tabsService, tabsId, commonStrings) {
        this.ifActiveService = ifActiveService;
        this.popoverService = popoverService;
        this.tabsService = tabsService;
        this.tabsId = tabsId;
        this.commonStrings = commonStrings;
        this.tabLinkElements = [];
        // in order to check focus is triggered by click
        // we are using this _mousedown flag
        this._mousedown = false;
        this.subscriptions = [];
        this._tabLinkDirectives = [];
    }
    get layout() {
        return this.tabsService.layout;
    }
    set layout(layout) {
        if (Object.keys(TabsLayout)
            .map(key => {
            return TabsLayout[key];
        })
            .indexOf(layout) >= 0) {
            this.tabsService.layout = layout;
        }
    }
    get tabLinkDirectives() {
        return this._tabLinkDirectives;
    }
    get activeTabInOverflow() {
        return this.tabsService.overflowTabs.indexOf(this.tabsService.activeTab) > -1;
    }
    get activeTabPosition() {
        return this._tabLinkDirectives.findIndex(link => link.active);
    }
    get isCurrentInOverflow() {
        return this.keyFocus.current >= this.overflowPosition;
    }
    get isVertical() {
        return this.layout === TabsLayout.VERTICAL;
    }
    set tabOverflowEl(value) {
        this._tabOverflowEl = value && value.nativeElement;
        if (this.popoverService.open && value) {
            // only when tab overflow view element is registered,
            // we need to move the focus to the first item
            this.keyFocus.focusCurrent();
        }
    }
    get overflowPosition() {
        return this._tabLinkDirectives.filter(link => !link.inOverflow).length;
    }
    set tabContentViewContainer(value) {
        this.tabsService.tabContentViewContainer = value;
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.listenForTabLinkChanges());
        this.subscriptions.push(this.listedForTabsActionsChanges());
        if (typeof this.ifActiveService.current === 'undefined' && this.tabLinkDirectives[0]) {
            this.tabLinkDirectives[0].activate();
        }
        // set initial current position
        this.keyFocus.current = this.activeTabPosition;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
    toggleOverflowOnPosition(position) {
        // we need to check current position to determine
        // whether we need to open the tab overflow or not
        this.popoverService.open = position >= this.overflowPosition;
    }
    resetKeyFocusCurrentToActive(event) {
        const keyFocusContainsFocus = this.keyFocus.nativeElement.contains(event.relatedTarget);
        if (!keyFocusContainsFocus && this.keyFocus.current !== this.activeTabPosition) {
            this.keyFocus.current = this.activeTabPosition;
        }
    }
    toggleOverflowOnClick() {
        if (this.isCurrentInOverflow && this.popoverService.open) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
        else {
            this.keyFocus.moveTo(this.overflowPosition);
        }
        // once click handler completes running,
        // reset the _mousedown flag
        this._mousedown = false;
    }
    openOverflowOnFocus() {
        // This method should be called only on keyboard generated focus
        // when the active tab is in the overflow
        if (!this._mousedown && !this.popoverService.open) {
            this.keyFocus.moveTo(this.activeTabPosition);
        }
    }
    closeOnFocusOut(event) {
        if (!this._tabOverflowEl.contains(event.relatedTarget) &&
            this.popoverService.open &&
            !this._mousedown) {
            this.popoverService.open = false;
            // if the focus is out of overflow and lands on the active tab link
            // which is currently visible, set the key focus current to activeTabPosition
            if (this.tabLinkElements[this.activeTabPosition] === event.relatedTarget) {
                this.keyFocus.current = this.activeTabPosition;
            }
        }
    }
    closeOnEscapeKey() {
        // Move current to the last visible focusable item
        this.keyFocus.moveTo(this.overflowPosition - 1);
    }
    closeOnOutsideClick(event, tabOverflowTrigger) {
        // Exit early if the event target is the trigger element itself or element that's inside the trigger element.
        // This is because we have another handler on the tabOverflowTrigger element itself.
        // As this handler method is on the document level so the event bubbles up to it and conflicts
        // with the tabOverflowTrigger handler resulting in opening the tab overflow and closing it right away consecutively.
        const isTabsAction = this.tabsActions.some(action => action.nativeElement.contains(event.target));
        if (event.target === tabOverflowTrigger ||
            tabOverflowTrigger.contains(event.target) ||
            isTabsAction) {
            return;
        }
        // Move current to the last visible focusable item
        if (!this._tabOverflowEl.contains(event.target) && this.isCurrentInOverflow) {
            this.keyFocus.moveTo(this.overflowPosition - 1);
        }
    }
    setTabLinkElements() {
        this._tabLinkDirectives = this.tabs.map(tab => tab.tabLink);
        this.tabLinkElements = this._tabLinkDirectives.map(tab => tab.el.nativeElement);
        if (this.tabsActions && this.tabsActions) {
            this.tabLinkElements.push(...this.tabsActions.map(action => action.nativeElement));
        }
    }
    listenForTabLinkChanges() {
        return this.tabs.changes
            .pipe(startWith(this.tabs.map(tab => tab.tabLink)))
            .subscribe(() => this.setTabLinkElements());
    }
    listedForTabsActionsChanges() {
        return this.tabsActions.changes.subscribe(() => this.setTabLinkElements());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabs, deps: [{ token: i1.IfActiveService }, { token: i2.ClrPopoverService }, { token: TabsService }, { token: TABS_ID }, { token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrTabs, isStandalone: false, selector: "clr-tabs", inputs: { layout: ["clrLayout", "layout"] }, host: { properties: { "class.tabs-vertical": "this.isVertical" } }, providers: [IfActiveService, TabsService, TABS_ID_PROVIDER], queries: [{ propertyName: "tabsActions", predicate: ClrTabAction, descendants: true, read: ElementRef }, { propertyName: "tabs", predicate: ClrTab }], viewQueries: [{ propertyName: "keyFocus", first: true, predicate: ClrKeyFocus, descendants: true, static: true }, { propertyName: "tabOverflowEl", first: true, predicate: ClrTabOverflowContent, descendants: true, read: ElementRef }, { propertyName: "tabContentViewContainer", first: true, predicate: ["tabContentViewContainer"], descendants: true, read: ViewContainerRef, static: true }], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      @for (link of tabLinkDirectives; track link) {
        @if (link.tabsId === tabsId && !link.inOverflow) {
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        }
      }
      @if (tabsService.overflowTabs.length > 0) {
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="popoverService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !popoverService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="popoverService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [status]="popoverService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          @if (popoverService.open) {
            <clr-tab-overflow-content
              (document:keydown.escape)="closeOnEscapeKey()"
              (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
              (focusout)="closeOnFocusOut($event)"
            >
              @for (link of tabLinkDirectives; track link) {
                @if (link.tabsId === tabsId && link.inOverflow) {
                  <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
                }
              }
            </clr-tab-overflow-content>
          }
        </div>
      }
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i1.ClrKeyFocus, selector: "[clrKeyFocus]", inputs: ["clrDirection", "clrFocusOnLoad", "clrKeyFocus"], outputs: ["clrFocusChange"] }, { kind: "component", type: ClrTabOverflowContent, selector: "clr-tab-overflow-content" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabs, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs',
                    template: `
    <ul
      class="nav"
      role="tablist"
      [clrKeyFocus]="tabLinkElements"
      clrDirection="both"
      (clrFocusChange)="toggleOverflowOnPosition($event)"
      (focusout)="resetKeyFocusCurrentToActive($event)"
    >
      <!--tab links-->
      @for (link of tabLinkDirectives; track link) {
        @if (link.tabsId === tabsId && !link.inOverflow) {
          <li role="presentation" class="nav-item">
            <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
          </li>
        }
      }
      @if (tabsService.overflowTabs.length > 0) {
        <div class="tabs-overflow bottom-right" role="presentation" [class.open]="popoverService.open">
          <li role="application" class="nav-item">
            <button
              #tabOverflowTrigger
              class="btn btn-link nav-link dropdown-toggle"
              type="button"
              aria-hidden="true"
              [attr.tabindex]="activeTabInOverflow && !popoverService.open ? 0 : -1"
              [class.active]="activeTabInOverflow"
              [class.open]="popoverService.open"
              (mousedown)="_mousedown = true"
              (focus)="openOverflowOnFocus()"
              (click)="toggleOverflowOnClick()"
              [attr.title]="commonStrings.keys.more"
            >
              <cds-icon
                shape="ellipsis-horizontal"
                [status]="popoverService.open ? 'info' : null"
                [attr.title]="commonStrings.keys.more"
              ></cds-icon>
            </button>
          </li>
          <!--tab links in overflow menu-->
          @if (popoverService.open) {
            <clr-tab-overflow-content
              (document:keydown.escape)="closeOnEscapeKey()"
              (document:click)="closeOnOutsideClick($event, tabOverflowTrigger)"
              (focusout)="closeOnFocusOut($event)"
            >
              @for (link of tabLinkDirectives; track link) {
                @if (link.tabsId === tabsId && link.inOverflow) {
                  <ng-container [ngTemplateOutlet]="link.templateRefContainer.template"></ng-container>
                }
              }
            </clr-tab-overflow-content>
          }
        </div>
      }
      <ng-content select="clr-tabs-actions"></ng-content>
    </ul>
    <ng-container #tabContentViewContainer></ng-container>
  `,
                    providers: [IfActiveService, TabsService, TABS_ID_PROVIDER],
                    hostDirectives: [ClrPopoverHostDirective],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.IfActiveService }, { type: i2.ClrPopoverService }, { type: TabsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [TABS_ID]
                }] }, { type: i1.ClrCommonStringsService }], propDecorators: { keyFocus: [{
                type: ViewChild,
                args: [ClrKeyFocus, { static: true }]
            }], tabsActions: [{
                type: ContentChildren,
                args: [ClrTabAction, { read: ElementRef, descendants: true }]
            }], tabs: [{
                type: ContentChildren,
                args: [ClrTab]
            }], layout: [{
                type: Input,
                args: ['clrLayout']
            }], isVertical: [{
                type: HostBinding,
                args: ['class.tabs-vertical']
            }], tabOverflowEl: [{
                type: ViewChild,
                args: [ClrTabOverflowContent, { read: ElementRef }]
            }], tabContentViewContainer: [{
                type: ViewChild,
                args: ['tabContentViewContainer', { static: true, read: ViewContainerRef }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTabsActions {
    constructor() {
        this.position = 'right';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsActions, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTabsActions, isStandalone: false, selector: "clr-tabs-actions", inputs: { position: "position" }, host: { properties: { "class.tabs-actions": "true", "attr.position": "this.position" } }, ngImport: i0, template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tabs-actions',
                    template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `,
                    host: {
                        '[class.tabs-actions]': 'true',
                    },
                    standalone: false,
                }]
        }], propDecorators: { position: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['attr.position']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TabsWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: TabsWillyWonka, isStandalone: false, selector: "clr-tabs", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TabsWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-tabs',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ActiveOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, id, ifActive) {
        if (!willyWonka) {
            throw new Error('clrTabLink and clr-tab-content should only be used inside of a clr-tabs');
        }
        super(cdr, willyWonka);
        this.ifActive = ifActive;
        this.id = id;
    }
    get flavor() {
        return this.ifActive.current === this.id;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActiveOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: TabsWillyWonka, optional: true }, { token: IF_ACTIVE_ID }, { token: i1.IfActiveService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ActiveOompaLoompa, isStandalone: false, selector: "[clrTabLink], clr-tab-content", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActiveOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTabLink], clr-tab-content',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: TabsWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [IF_ACTIVE_ID]
                }] }, { type: i1.IfActiveService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TABS_DIRECTIVES = [
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
class ClrTabsModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisHorizontalIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, declarations: [ClrTabContent,
            ClrTab,
            ClrTabs,
            ClrTabOverflowContent,
            ClrTabLink,
            ClrTabAction,
            ClrTabsActions,
            TabsWillyWonka,
            ActiveOompaLoompa], imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule], exports: [ClrTabContent,
            ClrTab,
            ClrTabs,
            ClrTabOverflowContent,
            ClrTabLink,
            ClrTabAction,
            ClrTabsActions,
            TabsWillyWonka,
            ActiveOompaLoompa, ClrConditionalModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule, ClrConditionalModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTabsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrTemplateRefModule, ClrKeyFocusModule],
                    declarations: [CLR_TABS_DIRECTIVES],
                    exports: [CLR_TABS_DIRECTIVES, ClrConditionalModule],
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

export { CLR_TABS_DIRECTIVES, ClrTab, ClrTabAction, ClrTabContent, ClrTabLink, ClrTabOverflowContent, ClrTabs, ClrTabsActions, ClrTabsModule, ActiveOompaLoompa as ÇlrActiveOompaLoompa, TabsWillyWonka as ÇlrTabsWillyWonka };
//# sourceMappingURL=clr-angular-layout-tabs.mjs.map
