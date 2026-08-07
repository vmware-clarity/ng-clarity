import * as i5 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, ContentChildren, Input, Component, inject, Injectable, ViewContainerRef, ViewChild, EventEmitter, ElementRef, forwardRef, HostListener, Output, Optional, NgModule } from '@angular/core';
import * as i1 from '@clr/addons/a11y';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import * as i2 from '@clr/angular/popover/dropdown';
import { ClrDropdownMenu, ClrDropdown, ClrDropdownModule } from '@clr/angular/popover/dropdown';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import * as i3 from '@clr/angular/popover/common';
import * as i4 from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Used as token for querying a list of heterogeneous implementations.
 */
class FocusableItemProvider {
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Pulls out the FocusableItem instance associated with a clrDropdownItem.
 */
class FocusableDropdownItemDirective {
    constructor(menu) {
        this.menu = menu;
    }
    getFocusableItem() {
        return this.menu.focusableItem;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableDropdownItemDirective, deps: [{ token: i2.ClrDropdownItem }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: FocusableDropdownItemDirective, isStandalone: false, selector: "[clrDropdownItem][appfxFocusableDropdownItem]", providers: [{ provide: FocusableItemProvider, useExisting: FocusableDropdownItemDirective }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableDropdownItemDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDropdownItem][appfxFocusableDropdownItem]',
                    standalone: false,
                    providers: [{ provide: FocusableItemProvider, useExisting: FocusableDropdownItemDirective }],
                }]
        }], ctorParameters: () => [{ type: i2.ClrDropdownItem }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Does the job of the parent ClrDropdownMenu which isn't able to collect the child FocusableItems
 * because they are not in the content but in a nested template. see menu.component.html
 */
class FocusableItemCollectorComponent {
    ngAfterContentInit() {
        const focusHandler = this.parentMenu.focusHandler;
        const originalAddChildren = focusHandler.addChildren;
        //overrides the addChildren as it's called with empty array and overrides the value we pass.
        focusHandler.addChildren = () => { };
        //the code here is the same as in ClrDropdownMenu.ngAfterContentInit
        this.items.changes.subscribe(() => originalAddChildren.call(focusHandler, this.items.map(item => item.getFocusableItem())));
        this.items.notifyOnChanges();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableItemCollectorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: FocusableItemCollectorComponent, isStandalone: false, selector: "focusable-item-collector", inputs: { parentMenu: "parentMenu" }, queries: [{ propertyName: "items", predicate: FocusableItemProvider, descendants: true }], ngImport: i0, template: '<ng-content></ng-content>', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableItemCollectorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'focusable-item-collector',
                    standalone: false,
                    template: '<ng-content></ng-content>',
                }]
        }], propDecorators: { parentMenu: [{
                type: Input
            }], items: [{
                type: ContentChildren,
                args: [FocusableItemProvider, { descendants: true }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Pulls out the FocusableItem instance associated with a clr-dropdown-menu.
 */
class FocusableMenuDirective {
    constructor() {
        this.menu = inject(ClrDropdownMenu);
    }
    getFocusableItem() {
        return this.menu.focusHandler;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableMenuDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: FocusableMenuDirective, isStandalone: false, selector: "clr-dropdown-menu[appfxFocusableMenu]", providers: [{ provide: FocusableItemProvider, useExisting: FocusableMenuDirective }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FocusableMenuDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dropdown-menu[appfxFocusableMenu]',
                    standalone: false,
                    providers: [{ provide: FocusableItemProvider, useExisting: FocusableMenuDirective }],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Exposes an imperative way to display a menu.
 */
class MenuOutletService {
    /**
     * Shows and attaches the menu component.
     */
    showMenu(menuComponentRef, e, x, y, trigger) {
        this.menuOutlet.attachMenu(menuComponentRef);
        menuComponentRef.instance.show(e, x, y, trigger);
        menuComponentRef.instance.closed.subscribe(() => this.closeMenu());
    }
    /**
     * Closes and detaches the menu component
     */
    closeMenu() {
        this.menuOutlet.detachMenu();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuOutletService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuOutletService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuOutletService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Determines the location of a menu shown through instance of MenuOutletService.
 */
class MenuOutletComponent {
    constructor(menuOutletService) {
        this.menuOutletService = menuOutletService;
    }
    ngOnInit() {
        this.menuOutletService.menuOutlet = this;
    }
    /**
     * Adds the menu component to the component's container.
     */
    attachMenu(menuComponentRef) {
        this.vc.clear();
        this.vc.insert(menuComponentRef.hostView);
        menuComponentRef.changeDetectorRef.detectChanges();
    }
    /**
     * Removes to menu component from the component's container.
     */
    detachMenu() {
        this.vc.clear();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuOutletComponent, deps: [{ token: MenuOutletService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MenuOutletComponent, isStandalone: false, selector: "menu-outlet", viewQueries: [{ propertyName: "vc", first: true, predicate: ["vc"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: ` <ng-container #vc></ng-container>`, isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuOutletComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'menu-outlet',
                    standalone: false,
                    template: ` <ng-container #vc></ng-container>`,
                }]
        }], ctorParameters: () => [{ type: MenuOutletService }], propDecorators: { vc: [{
                type: ViewChild,
                args: ['vc', { read: ViewContainerRef }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Base class for all items that can be shown as children of a menu.
 * Used as type injection token used to query heterogeneous list of menu items.
 */
class MenuItem {
    constructor() {
        this.hidden = false;
    }
}
var MenuItemType;
(function (MenuItemType) {
    MenuItemType[MenuItemType["action"] = 0] = "action";
    MenuItemType[MenuItemType["separator"] = 1] = "separator";
    MenuItemType[MenuItemType["header"] = 2] = "header";
    MenuItemType[MenuItemType["menu"] = 3] = "menu";
})(MenuItemType || (MenuItemType = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A MenuItem where multiple menuItems can be nested.
 */
class NestedMenu extends MenuItem {
    constructor() {
        super(...arguments);
        this.type = MenuItemType.menu;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/member-ordering */
/**
 * A contextual menu based on `clr-dropdown`
 *
 * The notable features added on top of the generic `clr-dropdown` and describe in further details below are:
 * + positioning based on anchor point instead of anchor button
 * + positioning and scrolling taking into account an encompassing container which in the primary use-case is the viewport
 * + domain specific declarative interface instead of custom HTML markup
 */
class MenuComponent extends NestedMenu {
    constructor(cdr, zoomLevelService) {
        super();
        this.cdr = cdr;
        this.zoomLevelService = zoomLevelService;
        this.itemTypes = MenuItemType;
        this.anchorPoint = { x: 0, y: 0 };
        this.opened = new EventEmitter();
        this.closed = new EventEmitter();
        this.ZoomLevel = ZoomLevel;
        this.subscriptions = new Subscription();
    }
    ngOnInit() {
        if (!this.zoomLevelService) {
            return;
        }
        this.subscriptions.add(this.zoomLevelService.onChange.subscribe((zoomLevel) => {
            const prevZoomLevel = this.currentZoomLevel;
            this.currentZoomLevel = zoomLevel;
            // Close the action menu if zoom happens.
            // The user will need to reopen it in which case the menu calculations
            // will be done and it will be displayed correctly.
            if (prevZoomLevel !== undefined && prevZoomLevel !== this.currentZoomLevel) {
                this.closed.emit();
            }
            this.cdr.detectChanges();
        }));
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    show(e, x, y, trigger) {
        this.trigger = trigger;
        this.anchorPoint = { x, y };
        this.dropdown.popoverService.openChange.pipe(first(open => !open)).subscribe(() => {
            this.trigger?.focus();
            this.closed.emit();
        });
        this.dropdown.popoverService.openChange.pipe(first(open => open)).subscribe(() => this.opened.emit());
        this.dropdown.openAtPoint(this.anchorPoint, trigger);
        this.dropdown.popoverService.openEvent = e;
        this.openingEvent = e;
    }
    ngAfterContentInit() {
        this.menuItems.changes.subscribe(() => {
            throw new Error(`Dear developer.

            You see this error because the set of menu items has changed.

            Usually, adding or removing an item is causing the menu to shrink or expand suddenly, which is considered a bad UX.

            Please don't try to avoid the error by delaying the opening of the menu. It's going to degrade the performance.

            Instead, show all items and disable those, which are unavailable asynchronously.`);
        });
    }
    close(e) {
        if (this.dropdown.popoverService.open) {
            this.dropdown.popoverService.toggleWithEvent(e);
        }
    }
    handleAction(actionItem) {
        if (actionItem.enabled) {
            if (this.trigger) {
                this.trigger.focus();
            }
            actionItem.handle.next();
        }
    }
    documentContextMenu(event) {
        if (this.dropdownElRef.nativeElement.contains(event.target) || event === this.openingEvent) {
            //if the contextmenu event is within the menu or
            //the event is the one opening the menu
            //then do nothing
            event.preventDefault();
        }
        else {
            //if the contextmenu is outside close the menu to prevent showing multiple menus
            this.close(event);
        }
    }
    menuHasIcons(menuItems) {
        for (const item of menuItems) {
            if (item.iconClass) {
                return true;
            }
        }
        return false;
    }
    getIconClass(iconClass, menuHasIcons) {
        if (iconClass) {
            return iconClass;
        }
        if (menuHasIcons) {
            return 'no-icon-item';
        }
        return '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.ZoomLevelService, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MenuComponent, isStandalone: false, selector: "appfx-menu", inputs: { text: "text" }, outputs: { opened: "opened", closed: "closed" }, host: { listeners: { "document:contextmenu": "documentContextMenu($event)" } }, providers: [
            {
                provide: MenuItem,
                useExisting: forwardRef(() => MenuComponent),
            },
        ], queries: [{ propertyName: "menuItems", predicate: MenuItem }], viewQueries: [{ propertyName: "dropdown", first: true, predicate: ClrDropdown, descendants: true }, { propertyName: "dropdownElRef", first: true, predicate: ClrDropdown, descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown class=\"app-menu\" [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\">\n  <!-- hidden clrDropdownTrigger so the DropdownFocusHandler is instantiated before ClrDropdownMenu-->\n  <!-- otherwise DropdownFocusHandler will miss the openChange emission and won't move the focus to the first item -->\n  <button class=\"appfx-menu-trigger\" clrDropdownTrigger></button>\n  <clr-dropdown-menu #rootDropdownMenu *clrIfOpen [class.fullscreen]=\"currentZoomLevel === ZoomLevel.x4\">\n    <ng-template\n      #menuTemplate\n      let-items\n      let-hasIcons=\"hasIcons\"\n      let-parentMenu=\"parentMenu\"\n      let-parentDropdown=\"parentDropdown\"\n      let-parentText=\"parentText\"\n    >\n      <div class=\"scrollable-content\">\n        <focusable-item-collector [parentMenu]=\"parentMenu\">\n          <ng-container *ngIf=\"parentMenu !== rootDropdownMenu && currentZoomLevel === ZoomLevel.x4\">\n            <div class=\"dropdown-header\" aria-hidden=\"true\">\n              <button class=\"btn-close-submenu\" (click)=\"parentDropdown.popoverService.toggleWithEvent($event)\">\n                <cds-icon size=\"18\" shape=\"angle\" direction=\"left\"></cds-icon>\n              </button>\n              <span class=\"submenu-header-text\">{{ parentText }}</span>\n              <button type=\"button\" class=\"close\" (click)=\"this.close($event)\">\n                <cds-icon class=\"btn-close-menu\" shape=\"window-close\"></cds-icon>\n              </button>\n            </div>\n          </ng-container>\n\n          <ng-container *ngFor=\"let menuItem of $any(items)\" [ngSwitch]=\"menuItem.type\">\n            <ng-container *ngIf=\"!menuItem.hidden\">\n              <!-- header item template -->\n              <div *ngSwitchCase=\"itemTypes.header\" class=\"dropdown-header\" aria-hidden=\"true\">\n                <span class=\"menu-item-icon\" [ngClass]=\"menuItem.iconClass\"></span>\n                <span class=\"title-text\">{{ menuItem.text }}</span>\n                <button\n                  *ngIf=\"currentZoomLevel === ZoomLevel.x4\"\n                  type=\"button\"\n                  class=\"close\"\n                  (click)=\"this.close($event)\"\n                >\n                  <cds-icon class=\"btn-close-menu\" shape=\"window-close\"></cds-icon>\n                </button>\n              </div>\n\n              <!-- action item template -->\n              <button\n                *ngSwitchCase=\"itemTypes.action\"\n                clrDropdownItem\n                appfxFocusableDropdownItem\n                [clrDisabled]=\"!menuItem.enabled\"\n                (click)=\"handleAction(menuItem)\"\n                class=\"menu-item-action\"\n                [attr.data-test-id]=\"menuItem.text\"\n              >\n                <span class=\"menu-item-icon\" [ngClass]=\"getIconClass(menuItem.iconClass, hasIcons)\"></span>\n                <span class=\"menu-item-text\">{{ menuItem.text }}</span>\n                <span class=\"menu-item-shortcut\">{{ menuItem.shortcut }}</span>\n              </button>\n\n              <!-- separator item template -->\n              <div\n                *ngSwitchCase=\"itemTypes.separator\"\n                class=\"dropdown-divider\"\n                role=\"separator\"\n                aria-hidden=\"true\"\n              ></div>\n\n              <!-- nested menu item template -->\n              <ng-container *ngSwitchCase=\"itemTypes.menu\">\n                <clr-dropdown #nestedDropdown>\n                  <button clrDropdownTrigger>\n                    <span class=\"menu-item-icon\" [ngClass]=\"getIconClass(menuItem.iconClass, hasIcons)\"></span\n                    >{{ menuItem.text }}\n                  </button>\n                  <clr-dropdown-menu\n                    #nestedDropdownMenu\n                    appfxFocusableMenu\n                    [class.fullscreen]=\"currentZoomLevel === ZoomLevel.x4\"\n                  >\n                    <ng-template\n                      [ngTemplateOutlet]=\"menuTemplate\"\n                      [ngTemplateOutletContext]=\"{\n                        $implicit: menuItem.menuItems,\n                        hasIcons: menuHasIcons(menuItem.menuItems),\n                        parentMenu: nestedDropdownMenu,\n                        parentDropdown: nestedDropdown,\n                        parentText: menuItem.text,\n                      }\"\n                    >\n                    </ng-template>\n                  </clr-dropdown-menu>\n                </clr-dropdown>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n        </focusable-item-collector>\n      </div>\n    </ng-template>\n    <ng-container\n      [ngTemplateOutlet]=\"menuTemplate\"\n      [ngTemplateOutletContext]=\"{\n        $implicit: menuItems,\n        hasIcons: menuHasIcons(menuItems),\n        parentMenu: rootDropdownMenu,\n        parentDropdown: dropdown,\n        parentText: text,\n      }\"\n    >\n    </ng-container>\n  </clr-dropdown-menu>\n</clr-dropdown>\n", styles: ["clr-dropdown-menu div.scrollable-content{position:static;overflow:hidden auto}clr-dropdown-menu .dropdown-header{display:flex}clr-dropdown-menu .dropdown-header .title-text{overflow-wrap:break-word;white-space:normal;min-width:11rem;max-height:21rem}clr-dropdown-menu .dropdown-item.menu-item-action{height:auto}clr-dropdown-menu .dropdown-item.menu-item-action .dropdown-item-content{display:contents}clr-dropdown-menu .dropdown-divider{margin:5px var(--clr-base-horizontal-offset-l)}clr-dropdown{display:block;position:static}.appfx-menu-trigger{display:none}.menu-item-action{display:flex;align-items:center}.menu-item-text{flex:1 1 auto;white-space:pre-line;overflow-wrap:break-word;width:max-content}.menu-item-icon{margin-right:4px;margin-left:0;display:inline-block;flex:0 0 auto}.no-icon-item{width:18px}.menu-item-shortcut{flex:0 0 auto;padding-left:.5rem;opacity:.6}.app-menu .fullscreen{width:100vw;height:100vh}.app-menu.zoom4x clr-dropdown-menu{position:fixed!important;max-width:none;margin:0;border-width:0;border-radius:0;transform:none!important}.app-menu.zoom4x .submenu-header-text{vertical-align:middle}.app-menu.zoom4x .btn-close-submenu{cursor:pointer;margin-right:4px;margin-left:0;margin-top:1px;display:inline-block;border:0;background:transparent;padding:0}.app-menu.zoom4x .btn-close-submenu cds-icon{fill:var(--cds-alias-typography-color-400)}.app-menu.zoom4x .btn-close-menu{margin-top:2px;display:block}\n"], dependencies: [{ kind: "component", type: i2.ClrDropdown, selector: "clr-dropdown", inputs: ["clrCloseMenuOnItemClick"] }, { kind: "component", type: i2.ClrDropdownMenu, selector: "clr-dropdown-menu", inputs: ["clrPosition"] }, { kind: "directive", type: i2.ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]" }, { kind: "directive", type: i2.ClrDropdownItem, selector: "[clrDropdownItem]", inputs: ["clrDisabled", "id"] }, { kind: "directive", type: i3.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "component", type: i4.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i5.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i5.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: FocusableDropdownItemDirective, selector: "[clrDropdownItem][appfxFocusableDropdownItem]" }, { kind: "component", type: FocusableItemCollectorComponent, selector: "focusable-item-collector", inputs: ["parentMenu"] }, { kind: "directive", type: FocusableMenuDirective, selector: "clr-dropdown-menu[appfxFocusableMenu]" }], preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-menu', standalone: false, providers: [
                        {
                            provide: MenuItem,
                            useExisting: forwardRef(() => MenuComponent),
                        },
                    ], template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-dropdown class=\"app-menu\" [class.zoom4x]=\"currentZoomLevel === ZoomLevel.x4\">\n  <!-- hidden clrDropdownTrigger so the DropdownFocusHandler is instantiated before ClrDropdownMenu-->\n  <!-- otherwise DropdownFocusHandler will miss the openChange emission and won't move the focus to the first item -->\n  <button class=\"appfx-menu-trigger\" clrDropdownTrigger></button>\n  <clr-dropdown-menu #rootDropdownMenu *clrIfOpen [class.fullscreen]=\"currentZoomLevel === ZoomLevel.x4\">\n    <ng-template\n      #menuTemplate\n      let-items\n      let-hasIcons=\"hasIcons\"\n      let-parentMenu=\"parentMenu\"\n      let-parentDropdown=\"parentDropdown\"\n      let-parentText=\"parentText\"\n    >\n      <div class=\"scrollable-content\">\n        <focusable-item-collector [parentMenu]=\"parentMenu\">\n          <ng-container *ngIf=\"parentMenu !== rootDropdownMenu && currentZoomLevel === ZoomLevel.x4\">\n            <div class=\"dropdown-header\" aria-hidden=\"true\">\n              <button class=\"btn-close-submenu\" (click)=\"parentDropdown.popoverService.toggleWithEvent($event)\">\n                <cds-icon size=\"18\" shape=\"angle\" direction=\"left\"></cds-icon>\n              </button>\n              <span class=\"submenu-header-text\">{{ parentText }}</span>\n              <button type=\"button\" class=\"close\" (click)=\"this.close($event)\">\n                <cds-icon class=\"btn-close-menu\" shape=\"window-close\"></cds-icon>\n              </button>\n            </div>\n          </ng-container>\n\n          <ng-container *ngFor=\"let menuItem of $any(items)\" [ngSwitch]=\"menuItem.type\">\n            <ng-container *ngIf=\"!menuItem.hidden\">\n              <!-- header item template -->\n              <div *ngSwitchCase=\"itemTypes.header\" class=\"dropdown-header\" aria-hidden=\"true\">\n                <span class=\"menu-item-icon\" [ngClass]=\"menuItem.iconClass\"></span>\n                <span class=\"title-text\">{{ menuItem.text }}</span>\n                <button\n                  *ngIf=\"currentZoomLevel === ZoomLevel.x4\"\n                  type=\"button\"\n                  class=\"close\"\n                  (click)=\"this.close($event)\"\n                >\n                  <cds-icon class=\"btn-close-menu\" shape=\"window-close\"></cds-icon>\n                </button>\n              </div>\n\n              <!-- action item template -->\n              <button\n                *ngSwitchCase=\"itemTypes.action\"\n                clrDropdownItem\n                appfxFocusableDropdownItem\n                [clrDisabled]=\"!menuItem.enabled\"\n                (click)=\"handleAction(menuItem)\"\n                class=\"menu-item-action\"\n                [attr.data-test-id]=\"menuItem.text\"\n              >\n                <span class=\"menu-item-icon\" [ngClass]=\"getIconClass(menuItem.iconClass, hasIcons)\"></span>\n                <span class=\"menu-item-text\">{{ menuItem.text }}</span>\n                <span class=\"menu-item-shortcut\">{{ menuItem.shortcut }}</span>\n              </button>\n\n              <!-- separator item template -->\n              <div\n                *ngSwitchCase=\"itemTypes.separator\"\n                class=\"dropdown-divider\"\n                role=\"separator\"\n                aria-hidden=\"true\"\n              ></div>\n\n              <!-- nested menu item template -->\n              <ng-container *ngSwitchCase=\"itemTypes.menu\">\n                <clr-dropdown #nestedDropdown>\n                  <button clrDropdownTrigger>\n                    <span class=\"menu-item-icon\" [ngClass]=\"getIconClass(menuItem.iconClass, hasIcons)\"></span\n                    >{{ menuItem.text }}\n                  </button>\n                  <clr-dropdown-menu\n                    #nestedDropdownMenu\n                    appfxFocusableMenu\n                    [class.fullscreen]=\"currentZoomLevel === ZoomLevel.x4\"\n                  >\n                    <ng-template\n                      [ngTemplateOutlet]=\"menuTemplate\"\n                      [ngTemplateOutletContext]=\"{\n                        $implicit: menuItem.menuItems,\n                        hasIcons: menuHasIcons(menuItem.menuItems),\n                        parentMenu: nestedDropdownMenu,\n                        parentDropdown: nestedDropdown,\n                        parentText: menuItem.text,\n                      }\"\n                    >\n                    </ng-template>\n                  </clr-dropdown-menu>\n                </clr-dropdown>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n        </focusable-item-collector>\n      </div>\n    </ng-template>\n    <ng-container\n      [ngTemplateOutlet]=\"menuTemplate\"\n      [ngTemplateOutletContext]=\"{\n        $implicit: menuItems,\n        hasIcons: menuHasIcons(menuItems),\n        parentMenu: rootDropdownMenu,\n        parentDropdown: dropdown,\n        parentText: text,\n      }\"\n    >\n    </ng-container>\n  </clr-dropdown-menu>\n</clr-dropdown>\n", styles: ["clr-dropdown-menu div.scrollable-content{position:static;overflow:hidden auto}clr-dropdown-menu .dropdown-header{display:flex}clr-dropdown-menu .dropdown-header .title-text{overflow-wrap:break-word;white-space:normal;min-width:11rem;max-height:21rem}clr-dropdown-menu .dropdown-item.menu-item-action{height:auto}clr-dropdown-menu .dropdown-item.menu-item-action .dropdown-item-content{display:contents}clr-dropdown-menu .dropdown-divider{margin:5px var(--clr-base-horizontal-offset-l)}clr-dropdown{display:block;position:static}.appfx-menu-trigger{display:none}.menu-item-action{display:flex;align-items:center}.menu-item-text{flex:1 1 auto;white-space:pre-line;overflow-wrap:break-word;width:max-content}.menu-item-icon{margin-right:4px;margin-left:0;display:inline-block;flex:0 0 auto}.no-icon-item{width:18px}.menu-item-shortcut{flex:0 0 auto;padding-left:.5rem;opacity:.6}.app-menu .fullscreen{width:100vw;height:100vh}.app-menu.zoom4x clr-dropdown-menu{position:fixed!important;max-width:none;margin:0;border-width:0;border-radius:0;transform:none!important}.app-menu.zoom4x .submenu-header-text{vertical-align:middle}.app-menu.zoom4x .btn-close-submenu{cursor:pointer;margin-right:4px;margin-left:0;margin-top:1px;display:inline-block;border:0;background:transparent;padding:0}.app-menu.zoom4x .btn-close-submenu cds-icon{fill:var(--cds-alias-typography-color-400)}.app-menu.zoom4x .btn-close-menu{margin-top:2px;display:block}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.ZoomLevelService, decorators: [{
                    type: Optional
                }] }], propDecorators: { text: [{
                type: Input
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }], dropdown: [{
                type: ViewChild,
                args: [ClrDropdown]
            }], dropdownElRef: [{
                type: ViewChild,
                args: [ClrDropdown, { read: ElementRef }]
            }], menuItems: [{
                type: ContentChildren,
                args: [MenuItem]
            }], documentContextMenu: [{
                type: HostListener,
                args: ['document:contextmenu', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MenuActionComponent extends MenuItem {
    constructor() {
        super(...arguments);
        this.type = MenuItemType.action;
        this.enabled = true;
        this.handle = new EventEmitter(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuActionComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MenuActionComponent, isStandalone: false, selector: "appfx-menu-action", inputs: { iconClass: "iconClass", text: "text", shortcut: "shortcut", enabled: "enabled" }, outputs: { handle: "handle" }, providers: [
            {
                provide: MenuItem,
                useExisting: forwardRef(() => MenuActionComponent),
            },
        ], usesInheritance: true, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuActionComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-menu-action',
                    standalone: false,
                    template: '',
                    providers: [
                        {
                            provide: MenuItem,
                            useExisting: forwardRef(() => MenuActionComponent),
                        },
                    ],
                }]
        }], propDecorators: { iconClass: [{
                type: Input
            }], text: [{
                type: Input
            }], shortcut: [{
                type: Input
            }], enabled: [{
                type: Input
            }], handle: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MenuHeaderComponent extends MenuItem {
    constructor() {
        super(...arguments);
        this.type = MenuItemType.header;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuHeaderComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MenuHeaderComponent, isStandalone: false, selector: "appfx-menu-header", inputs: { iconClass: "iconClass", text: "text" }, providers: [
            {
                provide: MenuItem,
                useExisting: forwardRef(() => MenuHeaderComponent),
            },
        ], usesInheritance: true, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuHeaderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-menu-header',
                    standalone: false,
                    template: '',
                    providers: [
                        {
                            provide: MenuItem,
                            useExisting: forwardRef(() => MenuHeaderComponent),
                        },
                    ],
                }]
        }], propDecorators: { iconClass: [{
                type: Input
            }], text: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class MenuSeparatorComponent extends MenuItem {
    constructor() {
        super(...arguments);
        this.type = MenuItemType.separator;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuSeparatorComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: MenuSeparatorComponent, isStandalone: false, selector: "appfx-menu-separator", providers: [
            {
                provide: MenuItem,
                useExisting: forwardRef(() => MenuSeparatorComponent),
            },
        ], usesInheritance: true, ngImport: i0, template: '', isInline: true, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: MenuSeparatorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'appfx-menu-separator',
                    standalone: false,
                    template: '',
                    providers: [
                        {
                            provide: MenuItem,
                            useExisting: forwardRef(() => MenuSeparatorComponent),
                        },
                    ],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class AppfxMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxMenuModule, declarations: [FocusableDropdownItemDirective,
            FocusableItemCollectorComponent,
            FocusableMenuDirective,
            MenuActionComponent,
            MenuComponent,
            MenuHeaderComponent,
            MenuOutletComponent,
            MenuSeparatorComponent], imports: [ClrDropdownModule, CommonModule], exports: [MenuActionComponent, MenuComponent, MenuHeaderComponent, MenuOutletComponent, MenuSeparatorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMenuModule, providers: [
            // Enable 200% and 400% zoom support
            ZoomLevelService,
        ], imports: [ClrDropdownModule, CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrDropdownModule, CommonModule],
                    declarations: [
                        FocusableDropdownItemDirective,
                        FocusableItemCollectorComponent,
                        FocusableMenuDirective,
                        MenuActionComponent,
                        MenuComponent,
                        MenuHeaderComponent,
                        MenuOutletComponent,
                        MenuSeparatorComponent,
                    ],
                    providers: [
                        // Enable 200% and 400% zoom support
                        ZoomLevelService,
                    ],
                    exports: [MenuActionComponent, MenuComponent, MenuHeaderComponent, MenuOutletComponent, MenuSeparatorComponent],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxMenuModule, MenuActionComponent, MenuComponent, MenuHeaderComponent, MenuItem, MenuItemType, MenuOutletComponent, MenuOutletService, MenuSeparatorComponent, NestedMenu };
//# sourceMappingURL=clr-addons-menu.mjs.map
