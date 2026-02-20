import * as i0 from '@angular/core';
import { PLATFORM_ID, SkipSelf, Optional, Inject, Injectable, Input, Component, HostBinding, ContentChildren, HostListener, Directive, NgModule, ElementRef, InjectionToken, EventEmitter, Output, DOCUMENT, ContentChild, ViewChild } from '@angular/core';
import * as i2 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective as ClrPopoverHostDirective$1, ClrPopoverType as ClrPopoverType$1, ClrPopoverPosition as ClrPopoverPosition$1, DROPDOWN_POSITIONS as DROPDOWN_POSITIONS$1, POPOVER_HOST_ANCHOR as POPOVER_HOST_ANCHOR$1, ClrPopoverContent as ClrPopoverContent$1, ClrIfOpen as ClrIfOpen$1, SIGNPOST_POSITIONS as SIGNPOST_POSITIONS$1, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext, TOOLTIP_POSITIONS as TOOLTIP_POSITIONS$1 } from '@clr/angular/popover/common';
import * as i1 from '@clr/angular/utils';
import { uniqueIdFactory, ArrowKeyDirection, Linkers, wrapObservable, customFocusableItemProvider, FOCUS_SERVICE_PROVIDER, FocusableItem, BASIC_FOCUSABLE_ITEM_PROVIDER, preventArrowKeyScroll, ClrPosition, normalizeKey, Keys, ClrFocusOnViewInitModule } from '@clr/angular/utils';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ReplaySubject, of, Subject, merge, fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as i3 from '@clr/angular/icon';
import { ClrIcon, ClarityIcons, windowCloseIcon, infoCircleIcon } from '@clr/angular/icon';
import { hasModifierKey } from '@angular/cdk/keycodes';
import * as i1$1 from '@angular/cdk/overlay';
import { OverlayConfig } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { ClrDropdownModule as ClrDropdownModule$1 } from '@clr/angular/popover/dropdown';
import { ClrSignpostModule as ClrSignpostModule$1 } from '@clr/angular/popover/signpost';
import { ClrTooltipModule as ClrTooltipModule$1 } from '@clr/angular/popover/tooltip';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DropdownFocusHandler {
    constructor(renderer, parent, popoverService, focusService, platformId) {
        this.renderer = renderer;
        this.parent = parent;
        this.popoverService = popoverService;
        this.focusService = focusService;
        this.platformId = platformId;
        this.id = uniqueIdFactory();
        this._unlistenFuncs = [];
        this.resetChildren();
        this.moveToFirstItemWhenOpen();
    }
    get trigger() {
        return this._trigger;
    }
    set trigger(el) {
        this._trigger = el;
        if (this.parent) {
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowright', event => this.popoverService.toggleWithEvent(event)));
        }
        else {
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowup', event => this.popoverService.toggleWithEvent(event)));
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.arrowdown', event => this.popoverService.toggleWithEvent(event)));
        }
    }
    get container() {
        return this._container;
    }
    set container(el) {
        this._container = el;
        // whether root container or not, tab key should always toggle (i.e. close) the container
        this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.tab', event => this.popoverService.toggleWithEvent(event)), this.renderer.listen(el, 'keydown.shift.tab', event => this.popoverService.toggleWithEvent(event)));
        // All containers are registered to the focus service.
        this.focusService.registerContainer(el);
        if (this.parent) {
            // if it's a nested container, pressing escape has the same effect as pressing left key, which closes the current
            // popup and moves up to its parent. Here, we stop propagation so that the parent container
            // doesn't receive the escape keydown
            this._unlistenFuncs.push(this.renderer.listen(el, 'keydown.escape', event => {
                this.focusService.move(ArrowKeyDirection.LEFT);
                event.stopPropagation();
            }));
        }
    }
    ngOnDestroy() {
        this._unlistenFuncs.forEach((unlisten) => unlisten());
        this.focusService.detachListeners(this.container);
    }
    /**
     * If the dropdown was opened by clicking on the trigger, we automatically move to the first item
     */
    moveToFirstItemWhenOpen() {
        const subscription = this.popoverService.openChange.subscribe(open => {
            if (open && this.popoverService.openEvent) {
                // Even if we properly waited for ngAfterViewInit, the container still wouldn't be attached to the DOM.
                // So setTimeout is the only way to wait for the container to be ready to move focus to first item.
                setTimeout(() => {
                    this.focusService.moveTo(this);
                    if (this.parent) {
                        this.focusService.move(ArrowKeyDirection.RIGHT);
                    }
                    else {
                        this.focusService.move(ArrowKeyDirection.DOWN);
                    }
                });
            }
        });
        this._unlistenFuncs.push(() => subscription.unsubscribe());
    }
    focus() {
        if (this.trigger && isPlatformBrowser(this.platformId)) {
            this.trigger.focus();
        }
    }
    blur() {
        if (this.trigger && isPlatformBrowser(this.platformId)) {
            this.trigger.blur();
        }
    }
    activate() {
        if (isPlatformBrowser(this.platformId)) {
            this.trigger.click();
        }
    }
    resetChildren() {
        this.children = new ReplaySubject(1);
        if (this.parent) {
            this.right = this.openAndGetChildren().pipe(map(all => all[0]));
        }
        else {
            this.down = this.openAndGetChildren().pipe(map(all => all[0]));
            this.up = this.openAndGetChildren().pipe(map(all => all[all.length - 1]));
        }
    }
    addChildren(children) {
        Linkers.linkVertical(children);
        if (this.parent) {
            Linkers.linkParent(children, this.closeAndGetThis(), ArrowKeyDirection.LEFT);
        }
        this.children.next(children);
    }
    openAndGetChildren() {
        return wrapObservable(this.children, () => (this.popoverService.open = true));
    }
    closeAndGetThis() {
        return wrapObservable(of(this), () => (this.popoverService.open = false));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler, deps: [{ token: i0.Renderer2 }, { token: DropdownFocusHandler, optional: true, skipSelf: true }, { token: i2.ClrPopoverService }, { token: i1.FocusService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: DropdownFocusHandler, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i2.ClrPopoverService }, { type: i1.FocusService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
const DROPDOWN_FOCUS_HANDLER_PROVIDER = customFocusableItemProvider(DropdownFocusHandler);

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class RootDropdownService {
    constructor() {
        this._changes = new Subject();
    }
    get changes() {
        return this._changes.asObservable();
    }
    closeMenus() {
        this._changes.next(false);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RootDropdownService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RootDropdownService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: RootDropdownService, decorators: [{
            type: Injectable
        }] });
function clrRootDropdownFactory(existing) {
    return existing || new RootDropdownService();
}
const ROOT_DROPDOWN_PROVIDER = {
    provide: RootDropdownService,
    useFactory: clrRootDropdownFactory,
    deps: [[new Optional(), new SkipSelf(), RootDropdownService]],
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDropdown {
    constructor(parent, popoverService, focusHandler, cdr, dropdownService) {
        this.parent = parent;
        this.popoverService = popoverService;
        this.focusHandler = focusHandler;
        this.isMenuClosable = true;
        this.subscriptions = [];
        this.subscriptions.push(dropdownService.changes.subscribe(value => (popoverService.open = value)));
        this.subscriptions.push(popoverService.openChange.subscribe(() => cdr.markForCheck()));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdown, deps: [{ token: ClrDropdown, optional: true, skipSelf: true }, { token: i2.ClrPopoverService }, { token: DropdownFocusHandler }, { token: i0.ChangeDetectorRef }, { token: RootDropdownService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrDropdown, isStandalone: false, selector: "clr-dropdown", inputs: { isMenuClosable: ["clrCloseMenuOnItemClick", "isMenuClosable"] }, host: { properties: { "class.dropdown": "true", "class.open": "popoverService.open" } }, providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdown, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dropdown',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.dropdown]': 'true',
                        '[class.open]': 'popoverService.open',
                    },
                    providers: [ROOT_DROPDOWN_PROVIDER, FOCUS_SERVICE_PROVIDER, DROPDOWN_FOCUS_HANDLER_PROVIDER],
                    hostDirectives: [ClrPopoverHostDirective$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrDropdown, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i2.ClrPopoverService }, { type: DropdownFocusHandler }, { type: i0.ChangeDetectorRef }, { type: RootDropdownService }], propDecorators: { isMenuClosable: [{
                type: Input,
                args: ['clrCloseMenuOnItemClick']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDropdownMenu {
    constructor(parentHost, nested, focusHandler, elementRef, popoverService, popoverContent) {
        this.focusHandler = focusHandler;
        this.elementRef = elementRef;
        this.popoverService = popoverService;
        this.popoverContent = popoverContent;
        if (!parentHost) {
            throw new Error('clr-dropdown-menu should only be used inside of a clr-dropdown');
        }
        popoverContent.scrollToClose = true;
        popoverContent.contentType = ClrPopoverType$1.DROPDOWN;
        popoverContent.contentAt = nested ? ClrPopoverPosition$1.RIGHT_TOP : ClrPopoverPosition$1.BOTTOM_LEFT;
        popoverService.panelClass.push('clr-dropdown-container');
    }
    /*
     * Fallback to hide when *clrIfOpen is not being used
     */
    get isOffScreen() {
        return !this.popoverService.open;
    }
    set position(position) {
        if (!position) {
            return;
        }
        const posIndex = DROPDOWN_POSITIONS$1.indexOf(position);
        if (posIndex === -1) {
            return;
        }
        // set the popover values based on menu position
        this.popoverContent.contentAt = DROPDOWN_POSITIONS$1[posIndex];
    }
    ngAfterContentInit() {
        this.focusHandler.container = this.elementRef.nativeElement;
        this.items.changes.subscribe(() => this.focusHandler.addChildren(this.items.toArray()));
        // I saw this on GitHub as a solution to avoid code duplication because of missed QueryList changes
        this.items.notifyOnChanges();
    }
    ngOnDestroy() {
        this.focusHandler.resetChildren();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownMenu, deps: [{ token: POPOVER_HOST_ANCHOR$1, optional: true }, { token: ClrDropdownMenu, optional: true, skipSelf: true }, { token: DropdownFocusHandler }, { token: i0.ElementRef }, { token: i2.ClrPopoverService }, { token: i2.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrDropdownMenu, isStandalone: false, selector: "clr-dropdown-menu", inputs: { position: ["clrPosition", "position"] }, host: { properties: { "class.dropdown-menu": "true", "attr.role": "\"menu\"", "class.is-off-screen": "this.isOffScreen" } }, queries: [{ propertyName: "items", predicate: FocusableItem }], hostDirectives: [{ directive: i2.ClrPopoverContent }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownMenu, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dropdown-menu',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.dropdown-menu]': 'true',
                        '[attr.role]': '"menu"',
                    },
                    standalone: false,
                    hostDirectives: [ClrPopoverContent$1],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR$1]
                }] }, { type: ClrDropdownMenu, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: DropdownFocusHandler }, { type: i0.ElementRef }, { type: i2.ClrPopoverService }, { type: i2.ClrPopoverContent }], propDecorators: { items: [{
                type: ContentChildren,
                args: [FocusableItem]
            }], isOffScreen: [{
                type: HostBinding,
                args: ['class.is-off-screen']
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDropdownTrigger {
    constructor(dropdown, popoverService, el, focusHandler) {
        this.popoverService = popoverService;
        this.isRootLevelToggle = true;
        // if the containing dropdown has a parent, then this is not the root level one
        if (dropdown.parent) {
            this.isRootLevelToggle = false;
        }
        focusHandler.trigger = el.nativeElement;
        popoverService.anchorElementRef = el;
    }
    get active() {
        return this.popoverService.open;
    }
    onDropdownTriggerClick(event) {
        this.popoverService.toggleWithEvent(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownTrigger, deps: [{ token: ClrDropdown }, { token: i2.ClrPopoverService }, { token: i0.ElementRef }, { token: DropdownFocusHandler }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrDropdownTrigger, isStandalone: false, selector: "[clrDropdownTrigger],[clrDropdownToggle]", host: { listeners: { "click": "onDropdownTriggerClick($event)" }, properties: { "class.dropdown-toggle": "isRootLevelToggle", "class.dropdown-item": "!isRootLevelToggle", "class.expandable": "!isRootLevelToggle", "class.active": "active", "attr.aria-haspopup": "\"menu\"", "attr.aria-expanded": "active" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownTrigger, decorators: [{
            type: Directive,
            args: [{
                    // We support both selectors for legacy reasons
                    selector: '[clrDropdownTrigger],[clrDropdownToggle]',
                    host: {
                        '[class.dropdown-toggle]': 'isRootLevelToggle',
                        '[class.dropdown-item]': '!isRootLevelToggle',
                        '[class.expandable]': '!isRootLevelToggle',
                        '[class.active]': 'active',
                        '[attr.aria-haspopup]': '"menu"',
                        '[attr.aria-expanded]': 'active',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrDropdown }, { type: i2.ClrPopoverService }, { type: i0.ElementRef }, { type: DropdownFocusHandler }], propDecorators: { onDropdownTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDropdownItem {
    constructor(dropdown, _dropdownService, focusableItem, el, renderer) {
        this.dropdown = dropdown;
        this._dropdownService = _dropdownService;
        this.focusableItem = focusableItem;
        this.el = el;
        this.renderer = renderer;
    }
    get disabled() {
        return this.focusableItem.disabled;
    }
    set disabled(value) {
        // Empty string attribute evaluates to false but should disable the item, so we need to add a special case for it.
        this.focusableItem.disabled = !!value || value === '';
    }
    /**
     * Let you overwrite the focusable auto increment id.
     */
    get dropdownItemId() {
        return this.focusableItem.id;
    }
    set dropdownItemId(value) {
        this.focusableItem.id = value;
    }
    onDropdownItemClick() {
        // Move focus back to the root dropdown trigger.
        // This is done BEFORE the dropdown is closed so that focus gets moved properly if a modal is opened.
        if (this.dropdown.isMenuClosable && !this.disabled && this.dropdown.popoverService.open) {
            const rootDropdown = this.findRootDropdown();
            rootDropdown.focusHandler.focus();
        }
        // Ensure that the dropdown is closed after custom dropdown item click event handlers have run.
        setTimeout(() => {
            if (this.dropdown.isMenuClosable && !this.disabled) {
                this._dropdownService.closeMenus();
            }
        });
    }
    onSpaceKeydown($event) {
        this.stopImmediatePropagationIfDisabled($event);
    }
    onEnterKeydown($event) {
        this.stopImmediatePropagationIfDisabled($event);
    }
    stopImmediatePropagationIfDisabled($event) {
        if (this.disabled) {
            $event.preventDefault(); // prevent click event
            $event.stopImmediatePropagation();
        }
    }
    findRootDropdown() {
        let rootDropdown = this.dropdown;
        while (rootDropdown.parent) {
            rootDropdown = rootDropdown.parent;
        }
        return rootDropdown;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownItem, deps: [{ token: ClrDropdown }, { token: RootDropdownService }, { token: i1.FocusableItem }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrDropdownItem, isStandalone: false, selector: "[clrDropdownItem]", inputs: { disabled: ["clrDisabled", "disabled"], dropdownItemId: ["id", "dropdownItemId"] }, host: { listeners: { "click": "onDropdownItemClick()", "keydown.space": "onSpaceKeydown($event)", "keydown.enter": "onEnterKeydown($event)" }, properties: { "class.disabled": "disabled", "class.dropdown-item": "true", "attr.role": "\"menuitem\"", "attr.aria-disabled": "disabled", "attr.id": "dropdownItemId" } }, providers: [BASIC_FOCUSABLE_ITEM_PROVIDER], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDropdownItem]',
                    host: {
                        '[class.disabled]': 'disabled',
                        '[class.dropdown-item]': 'true',
                        '[attr.role]': '"menuitem"',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.id]': 'dropdownItemId',
                    },
                    providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrDropdown }, { type: RootDropdownService }, { type: i1.FocusableItem }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { disabled: [{
                type: Input,
                args: ['clrDisabled']
            }], dropdownItemId: [{
                type: Input,
                args: ['id']
            }], onDropdownItemClick: [{
                type: HostListener,
                args: ['click']
            }], onSpaceKeydown: [{
                type: HostListener,
                args: ['keydown.space', ['$event']]
            }], onEnterKeydown: [{
                type: HostListener,
                args: ['keydown.enter', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_MENU_POSITIONS = [
    'bottom-left',
    'bottom-right',
    'left-bottom',
    'left-top',
    'right-bottom',
    'right-top',
    'top-left',
    'top-right',
];

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_DROPDOWN_DIRECTIVES = [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem];
class ClrDropdownModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, declarations: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem], imports: [CommonModule, ClrIcon, ClrIfOpen$1], exports: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem, ClrIfOpen$1, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrIfOpen$1],
                    declarations: [CLR_DROPDOWN_DIRECTIVES],
                    exports: [CLR_DROPDOWN_DIRECTIVES, ClrIfOpen$1, ClrIcon],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)
class ClrPopoverService {
    constructor() {
        this.panelClass = [];
        this._open = false;
        this._openChange = new Subject();
        this._openEventChange = new Subject();
        this._positionChange = new Subject();
        this._resetPositions = new Subject();
        this._updatePosition = new Subject();
        this._popoverVisible = new Subject();
    }
    get openChange() {
        return this._openChange.asObservable();
    }
    get popoverVisible() {
        return this._popoverVisible.asObservable();
    }
    get openEvent() {
        return this._openEvent;
    }
    set openEvent(event) {
        this._openEvent = event;
        this._openEventChange.next(event);
    }
    get open() {
        return this._open;
    }
    set open(value) {
        value = !!value;
        if (this._open !== value) {
            this._open = value;
            this._openChange.next(value);
        }
    }
    get resetPositionsChange() {
        return this._resetPositions.asObservable();
    }
    positionChange(position) {
        this._positionChange.next(position);
    }
    updatePositionChange() {
        return this._updatePosition.asObservable();
    }
    getPositionChange() {
        return this._positionChange.asObservable();
    }
    getEventChange() {
        return this._openEventChange.asObservable();
    }
    /**
     * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
     * This is for instance the case of components that open on a click, but close on a click outside.
     */
    toggleWithEvent(event) {
        preventArrowKeyScroll(event);
        this.openEvent = event;
        this.open = !this.open;
    }
    popoverVisibleEmit(visible) {
        this._popoverVisible.next(visible);
    }
    resetPositions() {
        this._resetPositions.next();
    }
    updatePosition() {
        this._updatePosition.next();
    }
    focusCloseButton() {
        this.closeButtonRef.nativeElement?.focus();
    }
    focusAnchor() {
        this.anchorElementRef?.nativeElement?.focus({ preventScroll: true });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrPopoverType;
(function (ClrPopoverType) {
    ClrPopoverType[ClrPopoverType["SIGNPOST"] = 0] = "SIGNPOST";
    ClrPopoverType[ClrPopoverType["TOOLTIP"] = 1] = "TOOLTIP";
    ClrPopoverType[ClrPopoverType["DROPDOWN"] = 2] = "DROPDOWN";
    ClrPopoverType[ClrPopoverType["DEFAULT"] = 3] = "DEFAULT";
})(ClrPopoverType || (ClrPopoverType = {}));
var ClrPopoverPosition;
(function (ClrPopoverPosition) {
    ClrPopoverPosition["TOP_RIGHT"] = "top-right";
    ClrPopoverPosition["TOP_MIDDLE"] = "top-middle";
    ClrPopoverPosition["TOP_LEFT"] = "top-left";
    ClrPopoverPosition["RIGHT"] = "right";
    ClrPopoverPosition["RIGHT_TOP"] = "right-top";
    ClrPopoverPosition["RIGHT_MIDDLE"] = "right-middle";
    ClrPopoverPosition["RIGHT_BOTTOM"] = "right-bottom";
    ClrPopoverPosition["LEFT"] = "left";
    ClrPopoverPosition["LEFT_TOP"] = "left-top";
    ClrPopoverPosition["LEFT_MIDDLE"] = "left-middle";
    ClrPopoverPosition["LEFT_BOTTOM"] = "left-bottom";
    ClrPopoverPosition["BOTTOM_RIGHT"] = "bottom-right";
    ClrPopoverPosition["BOTTOM_MIDDLE"] = "bottom-middle";
    ClrPopoverPosition["BOTTOM_LEFT"] = "bottom-left";
})(ClrPopoverPosition || (ClrPopoverPosition = {}));
const TOOLTIP_POSITIONS = [
    ClrPopoverPosition.RIGHT, // default. must be at index 0
    ClrPopoverPosition.LEFT,
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.BOTTOM_LEFT,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
];
const DROPDOWN_POSITIONS = [
    ClrPopoverPosition.BOTTOM_LEFT, // default. must be at index 0
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.RIGHT_TOP,
    ClrPopoverPosition.RIGHT_BOTTOM,
    ClrPopoverPosition.LEFT_TOP,
    ClrPopoverPosition.LEFT_BOTTOM,
];
const SIGNPOST_POSITIONS = [
    ClrPopoverPosition.RIGHT_MIDDLE, // default. must be at index 0
    ClrPopoverPosition.RIGHT_TOP,
    ClrPopoverPosition.RIGHT_BOTTOM,
    ClrPopoverPosition.TOP_RIGHT,
    ClrPopoverPosition.TOP_LEFT,
    ClrPopoverPosition.TOP_MIDDLE,
    ClrPopoverPosition.BOTTOM_RIGHT,
    ClrPopoverPosition.BOTTOM_MIDDLE,
    ClrPopoverPosition.BOTTOM_LEFT,
    ClrPopoverPosition.LEFT_BOTTOM,
    ClrPopoverPosition.LEFT_MIDDLE,
    ClrPopoverPosition.LEFT_TOP,
];
function getPositionsArray(type) {
    switch (type) {
        case ClrPopoverType.TOOLTIP:
            return TOOLTIP_POSITIONS;
        case ClrPopoverType.DROPDOWN:
            return DROPDOWN_POSITIONS;
        case ClrPopoverType.SIGNPOST:
        case ClrPopoverType.DEFAULT:
        default:
            return SIGNPOST_POSITIONS;
    }
}
function getConnectedPositions(type) {
    const result = [];
    getPositionsArray(type).forEach(position => {
        result.push(mapPopoverKeyToPosition(position, type));
    });
    return result;
}
const POPOVER_OFFSETS = {
    [ClrPopoverType.SIGNPOST]: 16,
    [ClrPopoverType.TOOLTIP]: 21,
    [ClrPopoverType.DROPDOWN]: 2,
    [ClrPopoverType.DEFAULT]: 0,
};
function getOffset(key, type) {
    const offset = POPOVER_OFFSETS[type] || 0;
    switch (key) {
        // TOP
        case ClrPopoverPosition.TOP_LEFT:
        case ClrPopoverPosition.TOP_MIDDLE:
        case ClrPopoverPosition.TOP_RIGHT:
            return {
                offsetY: -offset,
                offsetX: 0,
            };
        // LEFT
        case ClrPopoverPosition.LEFT_TOP:
        case ClrPopoverPosition.LEFT_MIDDLE:
        case ClrPopoverPosition.LEFT:
        case ClrPopoverPosition.LEFT_BOTTOM:
            return {
                offsetY: 0,
                offsetX: -offset,
            };
        // RIGHT
        case ClrPopoverPosition.RIGHT_TOP:
        case ClrPopoverPosition.RIGHT_MIDDLE:
        case ClrPopoverPosition.RIGHT:
        case ClrPopoverPosition.RIGHT_BOTTOM:
            return {
                offsetY: 0,
                offsetX: offset,
            };
        // BOTTOM and DEFAULT
        case ClrPopoverPosition.BOTTOM_RIGHT:
        case ClrPopoverPosition.BOTTOM_MIDDLE:
        case ClrPopoverPosition.BOTTOM_LEFT:
        default:
            return {
                offsetY: offset,
                offsetX: 0,
            };
    }
}
const STANDARD_ANCHORS = {
    // TOP
    [ClrPopoverPosition.TOP_RIGHT]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_LEFT },
    [ClrPopoverPosition.TOP_MIDDLE]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_CENTER },
    [ClrPopoverPosition.TOP_LEFT]: { anchor: ClrPosition.TOP_CENTER, content: ClrPosition.BOTTOM_RIGHT },
    // LEFT
    [ClrPopoverPosition.LEFT]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },
    [ClrPopoverPosition.LEFT_TOP]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_BOTTOM },
    [ClrPopoverPosition.LEFT_MIDDLE]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_CENTER },
    [ClrPopoverPosition.LEFT_BOTTOM]: { anchor: ClrPosition.LEFT_CENTER, content: ClrPosition.RIGHT_TOP },
    // RIGHT
    [ClrPopoverPosition.RIGHT]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },
    [ClrPopoverPosition.RIGHT_TOP]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_BOTTOM },
    [ClrPopoverPosition.RIGHT_MIDDLE]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_CENTER },
    [ClrPopoverPosition.RIGHT_BOTTOM]: { anchor: ClrPosition.RIGHT_CENTER, content: ClrPosition.LEFT_TOP },
    // BOTTOM
    [ClrPopoverPosition.BOTTOM_RIGHT]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_LEFT },
    [ClrPopoverPosition.BOTTOM_MIDDLE]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_CENTER },
    [ClrPopoverPosition.BOTTOM_LEFT]: { anchor: ClrPosition.BOTTOM_CENTER, content: ClrPosition.TOP_RIGHT },
};
const DROPDOWN_ANCHORS = {
    // TOP
    [ClrPopoverPosition.TOP_RIGHT]: { anchor: ClrPosition.TOP_RIGHT, content: ClrPosition.BOTTOM_RIGHT },
    [ClrPopoverPosition.TOP_LEFT]: { anchor: ClrPosition.TOP_LEFT, content: ClrPosition.BOTTOM_LEFT },
    // LEFT
    [ClrPopoverPosition.LEFT_TOP]: { anchor: ClrPosition.LEFT_TOP, content: ClrPosition.TOP_RIGHT },
    [ClrPopoverPosition.LEFT_BOTTOM]: { anchor: ClrPosition.LEFT_BOTTOM, content: ClrPosition.BOTTOM_RIGHT },
    // RIGHT
    [ClrPopoverPosition.RIGHT_TOP]: { anchor: ClrPosition.RIGHT_TOP, content: ClrPosition.LEFT_TOP },
    [ClrPopoverPosition.RIGHT_BOTTOM]: { anchor: ClrPosition.RIGHT_BOTTOM, content: ClrPosition.LEFT_BOTTOM },
    // BOTTOM
    [ClrPopoverPosition.BOTTOM_RIGHT]: { anchor: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_RIGHT },
    [ClrPopoverPosition.BOTTOM_LEFT]: { anchor: ClrPosition.BOTTOM_RIGHT, content: ClrPosition.TOP_LEFT },
};
function mapPopoverKeyToPosition(key, type) {
    let offset = getOffset(key, type);
    const defaultPosition = { anchor: ClrPosition.BOTTOM_LEFT, content: ClrPosition.TOP_LEFT };
    const { anchor, content } = (type === ClrPopoverType.DROPDOWN ? DROPDOWN_ANCHORS[key] : STANDARD_ANCHORS[key]) ?? defaultPosition;
    return {
        ...getAnchorPosition(anchor),
        ...getContentPosition(content),
        ...offset,
        panelClass: key,
    };
}
function getAnchorPosition(key) {
    switch (key) {
        // TOP Positions
        case ClrPosition.TOP_LEFT:
            return {
                originX: 'start',
                originY: 'top',
            };
        case ClrPosition.TOP_CENTER:
            return {
                originX: 'center',
                originY: 'top',
            };
        case ClrPosition.TOP_RIGHT:
            return {
                originX: 'end',
                originY: 'top',
            };
        // LEFT Positions
        case ClrPosition.LEFT_TOP:
            return {
                originX: 'start',
                originY: 'top',
            };
        case ClrPosition.LEFT_CENTER:
            return {
                originX: 'start',
                originY: 'center',
            };
        case ClrPosition.LEFT_BOTTOM:
            return {
                originX: 'start',
                originY: 'bottom',
            };
        // RIGHT Positions
        case ClrPosition.RIGHT_TOP:
            return {
                originX: 'end',
                originY: 'top',
            };
        case ClrPosition.RIGHT_CENTER:
            return {
                originX: 'end',
                originY: 'center',
            };
        case ClrPosition.RIGHT_BOTTOM:
            return {
                originX: 'end',
                originY: 'bottom',
            };
        // BOTTOM positions and default
        case ClrPosition.BOTTOM_LEFT:
            return {
                originX: 'end',
                originY: 'bottom',
            };
        case ClrPosition.BOTTOM_CENTER:
            return {
                originX: 'center',
                originY: 'bottom',
            };
        case ClrPosition.BOTTOM_RIGHT:
        default:
            return {
                originX: 'start',
                originY: 'bottom',
            };
    }
}
function getContentPosition(key) {
    switch (key) {
        // TOP Positions
        case ClrPosition.TOP_LEFT:
            return {
                overlayX: 'start',
                overlayY: 'top',
            };
        case ClrPosition.TOP_CENTER:
            return {
                overlayX: 'center',
                overlayY: 'top',
            };
        case ClrPosition.TOP_RIGHT:
            return {
                overlayX: 'end',
                overlayY: 'top',
            };
        // LEFT Positions
        case ClrPosition.LEFT_TOP:
            return {
                overlayX: 'start',
                overlayY: 'top',
            };
        case ClrPosition.LEFT_CENTER:
            return {
                overlayX: 'start',
                overlayY: 'center',
            };
        case ClrPosition.LEFT_BOTTOM:
            return {
                overlayX: 'start',
                overlayY: 'bottom',
            };
        // RIGHT Positions
        case ClrPosition.RIGHT_TOP:
            return {
                overlayX: 'end',
                overlayY: 'top',
            };
        case ClrPosition.RIGHT_CENTER:
            return {
                overlayX: 'end',
                overlayY: 'center',
            };
        case ClrPosition.RIGHT_BOTTOM:
            return {
                overlayX: 'end',
                overlayY: 'bottom',
            };
        // BOTTOM positions and default
        case ClrPosition.BOTTOM_LEFT:
            return {
                overlayX: 'start',
                overlayY: 'bottom',
            };
        case ClrPosition.BOTTOM_CENTER:
            return {
                overlayX: 'center',
                overlayY: 'bottom',
            };
        case ClrPosition.BOTTOM_RIGHT:
        default:
            return {
                overlayX: 'end',
                overlayY: 'bottom',
            };
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** @dynamic */
class ClrPopoverContent {
    constructor(element, container, template, overlayContainer, parent, overlay, popoverService, zone, platformId) {
        this.container = container;
        this.template = template;
        this.parent = parent;
        this.overlay = overlay;
        this.popoverService = popoverService;
        this.zone = zone;
        this.platformId = platformId;
        this._outsideClickClose = true;
        this._scrollToClose = false;
        this.popoverType = ClrPopoverType.DEFAULT;
        this._availablePositions = [];
        this._position = ClrPopoverPosition.BOTTOM_LEFT;
        this.scrollableParents = [];
        this.subscriptions = [];
        this.preferredPositionIsSet = false;
        this.availablePositionsAreSet = false;
        this._preferredPosition = {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top',
            panelClass: ClrPopoverPosition.LEFT_TOP,
        };
        popoverService.panelClass.push('clr-popover-content');
        overlayContainer.getContainerElement().classList.add('clr-overlay-container');
        if (!template) {
            this.elementRef = element;
        }
    }
    set open(value) {
        this.popoverService.open = !!value;
    }
    get contentAt() {
        return this.preferredPositionIsSet ? this._preferredPosition : this._position;
    }
    set contentAt(position) {
        if (typeof position === 'string') {
            if (!position || Object.values(ClrPopoverPosition).indexOf(position) === -1) {
                return;
            }
            // set the popover values based on menu position
            this._position = position;
            this.popoverService.positionChange(this._position);
        }
        else {
            this.preferredPositionIsSet = true;
            this._preferredPosition = position;
        }
    }
    set availablePositions(positions) {
        this.availablePositionsAreSet = true;
        this._availablePositions = positions;
    }
    set contentType(type) {
        this.popoverType = type;
        if (!this.availablePositionsAreSet) {
            this._availablePositions = getConnectedPositions(type);
        }
    }
    get outsideClickClose() {
        return this._outsideClickClose;
    }
    set outsideClickClose(clickToClose) {
        this._outsideClickClose = !!clickToClose;
    }
    get scrollToClose() {
        return this._scrollToClose;
    }
    set scrollToClose(scrollToClose) {
        this._scrollToClose = !!scrollToClose;
    }
    get positionStrategy() {
        return this.overlay
            .position()
            .flexibleConnectedTo(this.popoverService.anchorElementRef)
            .setOrigin(this.popoverService.anchorElementRef)
            .withPush(true)
            .withPositions([this.preferredPosition, ...this._availablePositions])
            .withFlexibleDimensions(true);
    }
    get preferredPosition() {
        if (this.preferredPositionIsSet) {
            return this._preferredPosition;
        }
        // Default position is "bottom-left"
        return mapPopoverKeyToPosition(this._position, this.popoverType);
    }
    ngAfterViewInit() {
        if (this.popoverService.open) {
            this.showOverlay();
        }
        this.openCloseSubscription = this.popoverService.openChange.subscribe(change => {
            if (change) {
                this.showOverlay();
            }
            else {
                this.closePopover();
            }
        });
    }
    ngOnDestroy() {
        this.removeOverlay();
        this.openCloseSubscription?.unsubscribe();
    }
    _createOverlayRef() {
        this.overlayRef = this.overlay.create(new OverlayConfig({
            // This is where we can pass externally facing inputs into the angular overlay API, and essentially proxy behaviors our users want directly to the CDK if they have them.
            positionStrategy: this.positionStrategy,
            // the scrolling behaviour is controlled by this popover content directive
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            panelClass: this.popoverService.panelClass,
            hasBackdrop: false,
        }));
        this.subscriptions.push(merge(this.popoverService.resetPositionsChange, this.popoverService.getPositionChange()).subscribe(() => {
            this.resetPosition();
        }), this.popoverService.updatePositionChange().subscribe(() => {
            this.overlayRef?.updatePosition();
        }), this.overlayRef.keydownEvents().subscribe(event => {
            if (event && event.key && normalizeKey(event.key) === Keys.Escape && !hasModifierKey(event)) {
                event.preventDefault();
                this.closePopover();
            }
        }), this.overlayRef.outsidePointerEvents().subscribe(event => {
            // web components (cds-icon) register as outside pointer events, so if the event target is inside the content panel return early
            if (this.elementRef && this.elementRef.nativeElement.contains(event.target)) {
                return;
            }
            // Check if the same element that opened the popover is the same element triggering the outside pointer events (toggle button)
            const isToggleButton = this.popoverService.openEvent &&
                (this.popoverService.openEvent.target.contains(event.target) ||
                    this.popoverService.openEvent.target.parentElement.contains(event.target) ||
                    this.popoverService.openEvent.target === event.target);
            if (isToggleButton) {
                event.stopPropagation();
            }
            if (this._outsideClickClose || isToggleButton) {
                this.closePopover();
            }
        }));
    }
    resetPosition() {
        if (this.overlayRef) {
            this.overlayRef.updatePositionStrategy(this.positionStrategy);
            this.overlayRef.updatePosition();
        }
    }
    closePopover() {
        if (!this.overlayRef) {
            return;
        }
        this.removeOverlay();
        this.popoverService.open = false;
        const shouldFocusTrigger = this.popoverType !== ClrPopoverType.TOOLTIP &&
            (document.activeElement === document.body ||
                document.activeElement === this.popoverService.anchorElementRef?.nativeElement);
        if (shouldFocusTrigger) {
            this.popoverService.focusAnchor();
        }
    }
    showOverlay() {
        if (!this.overlayRef) {
            this._createOverlayRef();
        }
        if (!this.view && this.template) {
            this.view = this.container.createEmbeddedView(this.template);
            if (!this.elementRef) {
                const [rootNode] = this.view.rootNodes;
                this.elementRef = new ElementRef(rootNode); // So we know where/what to set close focus on
            }
        }
        if (!this.domPortal) {
            this.domPortal = new DomPortal(this.elementRef);
            this.overlayRef.attach(this.domPortal);
        }
        this.popoverService?.anchorElementRef?.nativeElement.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
            inline: 'nearest',
        });
        this.setupIntersectionObserver();
        setTimeout(() => {
            // Get Scrollable Parents
            this.listenToMouseEvents();
            this.popoverService.popoverVisibleEmit(true);
            if (this.elementRef?.nativeElement?.focus) {
                this.elementRef.nativeElement.focus();
            }
        });
    }
    removeOverlay() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.subscriptions = [];
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
        }
        if (this.domPortal?.isAttached) {
            this.domPortal.detach();
        }
        if (this.view) {
            this.view.destroy();
        }
        this.overlayRef = null;
        this.domPortal = null;
        if (this.template) {
            this.elementRef = null;
        }
        this.view = null;
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = null;
        this.popoverService.popoverVisibleEmit(false);
    }
    getScrollableParents(node) {
        let parent = node;
        const overflowScrollKeys = ['auto', 'scroll', 'clip'];
        const scrollableParents = [window.document];
        while (parent && !(parent instanceof HTMLHtmlElement)) {
            if (parent instanceof ShadowRoot) {
                parent = parent.host;
            }
            const { overflowY, overflowX } = window.getComputedStyle(parent);
            if (overflowScrollKeys.includes(overflowY) || overflowScrollKeys.includes(overflowX)) {
                scrollableParents.push(parent);
            }
            parent = parent.parentNode;
        }
        return scrollableParents;
    }
    /**
     * Uses IntersectionObserver to detect when the anchor leaves the screen.
     * This handles the "Close on Scroll" logic much cheaper than getBoundingClientRect.
     */
    setupIntersectionObserver() {
        if (!this.popoverService.anchorElementRef || this.intersectionObserver) {
            return;
        }
        this.intersectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // If the anchor is no longer visible (scrolled out of view)
                if (!entry.isIntersecting && this.popoverService.open) {
                    this.zone.run(() => this.closePopover());
                }
            });
        }, { root: null, threshold: 0.8 });
        this.intersectionObserver.observe(this.popoverService.anchorElementRef.nativeElement);
    }
    //Align the popover on scrolling
    listenToMouseEvents() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const anchor = this.getRootPopover(this)?.popoverService?.anchorElementRef?.nativeElement;
        const scrollableParents = this.getScrollableParents(anchor);
        this.zone.runOutsideAngular(() => {
            this.subscriptions.push(merge(...scrollableParents.map(parent => fromEvent(parent, 'scroll', { passive: true }))).subscribe(() => {
                if (this._scrollToClose) {
                    this.zone.run(() => this.closePopover());
                    return;
                }
                this.overlayRef?.updatePosition();
            }));
        });
    }
    getRootPopover(popover) {
        if (popover && popover.parent) {
            return this.getRootPopover(popover.parent);
        }
        return popover;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverContent, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.TemplateRef, optional: true }, { token: i1$1.OverlayContainer }, { token: ClrPopoverContent, optional: true, skipSelf: true }, { token: i1$1.Overlay }, { token: ClrPopoverService }, { token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverContent, isStandalone: true, selector: "[clrPopoverContent]", inputs: { open: ["clrPopoverContent", "open"], contentAt: ["clrPopoverContentAt", "contentAt"], availablePositions: ["clrPopoverContentAvailablePositions", "availablePositions"], contentType: ["clrPopoverContentType", "contentType"], outsideClickClose: ["clrPopoverContentOutsideClickToClose", "outsideClickClose"], scrollToClose: ["clrPopoverContentScrollToClose", "scrollToClose"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverContent, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverContent]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.TemplateRef, decorators: [{
                    type: Optional
                }] }, { type: i1$1.OverlayContainer }, { type: ClrPopoverContent, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }, { type: i1$1.Overlay }, { type: ClrPopoverService, decorators: [{
                    type: Inject,
                    args: [ClrPopoverService]
                }] }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { open: [{
                type: Input,
                args: ['clrPopoverContent']
            }], contentAt: [{
                type: Input,
                args: ['clrPopoverContentAt']
            }], availablePositions: [{
                type: Input,
                args: ['clrPopoverContentAvailablePositions']
            }], contentType: [{
                type: Input,
                args: ['clrPopoverContentType']
            }], outsideClickClose: [{
                type: Input,
                args: ['clrPopoverContentOutsideClickToClose']
            }], scrollToClose: [{
                type: Input,
                args: ['clrPopoverContentScrollToClose']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverAnchor {
    constructor(popoverService, element) {
        popoverService.anchorElementRef = element;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverAnchor, deps: [{ token: ClrPopoverService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverAnchor, isStandalone: false, selector: "[clrPopoverAnchor]", host: { properties: { "class.clr-anchor": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverAnchor, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverAnchor]',
                    host: {
                        '[class.clr-anchor]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }, { type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const POPOVER_HOST_ANCHOR = new InjectionToken('POPOVER_HOST_ANCHOR');

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStopEscapePropagationDirective {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.lastOpenChange = null;
    }
    ngOnInit() {
        this.subscription = this.popoverService.openChange.subscribe(open => {
            this.lastOpenChange = open;
        });
    }
    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
    onEscapeKey(event) {
        if (this.lastOpenChange !== null) {
            if (this.lastOpenChange === false) {
                event.stopPropagation();
            }
            this.lastOpenChange = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStopEscapePropagationDirective, deps: [{ token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrStopEscapePropagationDirective, isStandalone: true, host: { listeners: { "keyup.escape": "onEscapeKey($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStopEscapePropagationDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }], propDecorators: { onEscapeKey: [{
                type: HostListener,
                args: ['keyup.escape', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverHostDirective {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverHostDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverHostDirective, isStandalone: true, providers: [ClrPopoverService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }], hostDirectives: [{ directive: ClrStopEscapePropagationDirective }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverHostDirective, decorators: [{
            type: Directive,
            args: [{
                    standalone: true,
                    providers: [ClrPopoverService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
                    hostDirectives: [ClrStopEscapePropagationDirective],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**********
 *
 * @class ClrIfOpen
 *
 * @description
 * A structural directive that controls whether or not the associated TemplateRef is instantiated or not.
 * It makes use of a Component instance level service: ClrPopoverService to maintain state between itself and the component
 * using it in the component template.
 *
 */
class ClrIfOpen {
    constructor(popoverService, template, container) {
        this.popoverService = popoverService;
        this.template = template;
        this.container = container;
        /**********
         * @property openChange
         *
         * @description
         * An event emitter that emits when the open property is set to allow for 2way binding when the directive is
         * used with de-structured / de-sugared syntax.
         */
        this.openChange = new EventEmitter(false);
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.subscribe(change => {
            // OPEN before overlay is built
            if (change) {
                container.createEmbeddedView(template);
                this.openChange.emit(change);
            }
        }), popoverService.popoverVisible.subscribe(change => {
            // CLOSE after overlay is destroyed
            if (!change) {
                container.clear();
                this.openChange.emit(change);
            }
        }));
    }
    /**
     * @description
     * A property that gets/sets ClrPopoverService.open with value.
     */
    get open() {
        return this.popoverService.open;
    }
    set open(value) {
        this.popoverService.open = value;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    /**
     * @description
     * Function that takes a boolean value and either created an embedded view for the associated ViewContainerRef or,
     * Clears all views from the ViewContainerRef
     *
     * @param value
     */
    updateView(value) {
        if (value) {
            this.container.createEmbeddedView(this.template);
        }
        else {
            this.container.clear();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfOpen, deps: [{ token: ClrPopoverService }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrIfOpen, isStandalone: true, selector: "[clrIfOpen]", inputs: { open: ["clrIfOpen", "open"] }, outputs: { openChange: "clrIfOpenChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrIfOpen, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfOpen]',
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }], propDecorators: { openChange: [{
                type: Output,
                args: ['clrIfOpenChange']
            }], open: [{
                type: Input,
                args: ['clrIfOpen']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverCloseButton {
    constructor(elementRef, popoverService) {
        this.elementRef = elementRef;
        this.popoverService = popoverService;
        this.closeChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.pipe(filter(value => !value)).subscribe(() => {
            this.closeChange.next();
        }));
    }
    handleClick(event) {
        this.popoverService.toggleWithEvent(event);
        this.popoverService.focusAnchor();
    }
    ngAfterViewInit() {
        this.popoverService.closeButtonRef = this.elementRef;
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverCloseButton, deps: [{ token: i0.ElementRef }, { token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverCloseButton, isStandalone: false, selector: "[clrPopoverCloseButton]", outputs: { closeChange: "clrPopoverOnCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-close-button": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverCloseButton]',
                    host: {
                        '[class.clr-smart-close-button]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ClrPopoverService }], propDecorators: { closeChange: [{
                type: Output,
                args: ['clrPopoverOnCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverOpenCloseButton {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.openCloseChange = new EventEmitter();
        this.subscriptions = [];
        this.subscriptions.push(popoverService.openChange.subscribe(change => {
            this.openCloseChange.next(change);
        }));
    }
    handleClick(event) {
        this.popoverService.toggleWithEvent(event);
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOpenCloseButton, deps: [{ token: ClrPopoverService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrPopoverOpenCloseButton, isStandalone: false, selector: "[clrPopoverOpenCloseButton]", outputs: { openCloseChange: "clrPopoverOpenCloseChange" }, host: { listeners: { "click": "handleClick($event)" }, properties: { "class.clr-smart-open-close": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverOpenCloseButton, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverOpenCloseButton]',
                    host: {
                        '[class.clr-smart-open-close]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrPopoverService }], propDecorators: { openCloseChange: [{
                type: Output,
                args: ['clrPopoverOpenCloseChange']
            }], handleClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverModuleNext {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, declarations: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton], imports: [ClrPopoverContent, ClrIfOpen], exports: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent, ClrIfOpen] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModuleNext, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrPopoverContent, ClrIfOpen],
                    declarations: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton],
                    exports: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent, ClrIfOpen],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, exports: [ClrDropdownModule$1, ClrSignpostModule$1, ClrTooltipModule$1] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, imports: [ClrDropdownModule$1, ClrSignpostModule$1, ClrTooltipModule$1] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrDropdownModule$1, ClrSignpostModule$1, ClrTooltipModule$1],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class SignpostFocusManager {
    set triggerEl(value) {
        this._triggerEl = value;
    }
    focusTrigger() {
        if (this._triggerEl) {
            this._triggerEl.focus();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostFocusManager, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class SignpostIdService {
    constructor() {
        this._id = new Subject();
    }
    get id() {
        return this._id.asObservable();
    }
    setId(id) {
        this._id.next(id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SignpostIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*********
 *
 * @description
 * A Directive added to the ClrSignpost Trigger button that will call the ClrSignpost.toggle() function to hide/show the
 * ClrSignpostContent.
 *
 */
class ClrSignpostTrigger {
    constructor(popoverService, el, signpostIdService, signpostFocusManager, document, platformId) {
        this.popoverService = popoverService;
        this.el = el;
        this.signpostIdService = signpostIdService;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.ariaExpanded = false;
        this.subscriptions = [];
        this.document = document;
    }
    ngOnInit() {
        this.popoverService.anchorElementRef = this.el;
        this.signpostFocusManager.triggerEl = this.el.nativeElement;
        this.subscriptions.push(this.popoverService.openChange.subscribe((isOpen) => {
            this.ariaExpanded = isOpen;
            const prevIsOpen = this.isOpen;
            this.isOpen = isOpen;
            // openChange fires false on initialization because signpost starts as closed by default
            // but we shouldn't focus on that initial false value
            // we should focus back only if it's closed after being opened
            if (!this.isOpen && prevIsOpen) {
                this.focusOnClose();
            }
        }), this.signpostIdService.id.subscribe(idChange => (this.ariaControl = idChange)));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    /**********
     *
     * @description
     * click handler for the ClrSignpost trigger button used to hide/show ClrSignpostContent.
     */
    onSignpostTriggerClick(event) {
        this.popoverService.toggleWithEvent(event);
    }
    focusOnClose() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // we have to set the focus back on the trigger only if the focus is reset back to the body element
        // if the focus is on another element, we are not allowed to move that focus back to this trigger again.
        if (!this.isOpen && this.document.activeElement === this.document.body) {
            this.signpostFocusManager.focusTrigger();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTrigger, deps: [{ token: i2.ClrPopoverService }, { token: i0.ElementRef }, { token: SignpostIdService }, { token: SignpostFocusManager }, { token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostTrigger, isStandalone: false, selector: "[clrSignpostTrigger]", host: { listeners: { "click": "onSignpostTriggerClick($event)" }, properties: { "attr.aria-expanded": "ariaExpanded", "attr.aria-controls": "ariaControl", "class.active": "isOpen" }, classAttribute: "signpost-trigger" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSignpostTrigger]',
                    host: {
                        class: 'signpost-trigger',
                        '[attr.aria-expanded]': 'ariaExpanded',
                        '[attr.aria-controls]': 'ariaControl',
                        '[class.active]': 'isOpen',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2.ClrPopoverService }, { type: i0.ElementRef }, { type: SignpostIdService }, { type: SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { onSignpostTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*********
 *
 * @class ClrSignpost
 *
 * @description
 * Class used to configure and control the state of a ClrSignpost and its associated ClrSignpostContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
class ClrSignpost {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        /**********
         * @property useCustomTrigger
         *
         * @description
         * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
         *
         */
        this.useCustomTrigger = false;
    }
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger) {
        this.useCustomTrigger = !!trigger;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpost, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrSignpost, isStandalone: false, selector: "clr-signpost", inputs: { signpostTriggerAriaLabel: ["clrSignpostTriggerAriaLabel", "signpostTriggerAriaLabel"] }, host: { properties: { "class.signpost": "true" } }, providers: [SignpostFocusManager, SignpostIdService], queries: [{ propertyName: "customTrigger", first: true, predicate: ClrSignpostTrigger, descendants: true }], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `
    @if (!useCustomTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: ClrSignpostTrigger, selector: "[clrSignpostTrigger]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpost, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost',
                    template: `
    @if (!useCustomTrigger) {
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    }

    <ng-content></ng-content>
  `,
                    host: { '[class.signpost]': 'true' },
                    providers: [SignpostFocusManager, SignpostIdService],
                    hostDirectives: [ClrPopoverHostDirective$1],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ClrCommonStringsService }], propDecorators: { signpostTriggerAriaLabel: [{
                type: Input,
                args: ['clrSignpostTriggerAriaLabel']
            }], customTrigger: [{
                type: ContentChild,
                args: [ClrSignpostTrigger]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSignpostContent {
    constructor(parentHost, element, commonStrings, signpostIdService, signpostFocusManager, platformId, document, popoverService, popoverContent) {
        this.element = element;
        this.commonStrings = commonStrings;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.document = document;
        this.popoverService = popoverService;
        this.popoverContent = popoverContent;
        this.signpostContentId = uniqueIdFactory();
        this._position = ClrPopoverPosition$1.RIGHT_MIDDLE;
        if (!parentHost) {
            throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
        }
        // Defaults
        signpostIdService.setId(this.signpostContentId);
        popoverService.panelClass.push('clr-signpost-container');
        popoverContent.contentType = ClrPopoverType$1.SIGNPOST;
    }
    /*********
     *
     * @description
     * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
     * - anchorPoint - where on the trigger to anchor the ClrSignpostContent
     * - popoverPoint - where on the ClrSignpostContent container to align with the anchorPoint
     * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
     * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
     * There are 12 possible positions to place a ClrSignpostContent container:
     * - top-left
     * - top-middle
     * - top-right
     * - right-top
     * - right-middle
     * - right-bottom
     * - bottom-right
     * - bottom-middle
     * - bottom-left
     * - left-bottom
     * - left-middle
     * - left-top
     *
     * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
     * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
     * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
     * linking the SignpostContent to the trigger points down at the horizontal center of the trigger icon.
     *
     * @param newPosition
     */
    get position() {
        return this._position;
    }
    set position(position) {
        const posIndex = SIGNPOST_POSITIONS$1.indexOf(position);
        this._position = position && posIndex > -1 ? SIGNPOST_POSITIONS$1[posIndex] : ClrPopoverPosition$1.RIGHT_MIDDLE;
        this.popoverContent.contentAt = this._position;
    }
    /*
     * Fallback to hide when *clrIfOpen is not being used
     */
    get isOffScreen() {
        return !this.popoverService.open;
    }
    /**********
     *
     * @description
     * Close function that uses the signpost instance to toggle the state of the content popover.
     *
     */
    close() {
        this.popoverService.open = false;
    }
    ngAfterViewInit() {
        this.popoverService.closeButtonRef = this.closeButton;
        this.closeButton.nativeElement.focus();
    }
    onKeyDown(event) {
        if (event.key === 'Tab') {
            const focusableElements = this.getFocusableElements(this.element.nativeElement);
            // take the first element when SHIFT+TAB or last when only TAB
            const focusableElementIndex = event.shiftKey ? 0 : focusableElements.length - 1;
            if (document.activeElement === focusableElements[focusableElementIndex]) {
                event.preventDefault();
                this.popoverService.open = false;
            }
        }
    }
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId) && this.element.nativeElement.contains(this.document.activeElement)) {
            this.signpostFocusManager.focusTrigger();
        }
    }
    getFocusableElements(element) {
        return Array.from(element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostContent, deps: [{ token: POPOVER_HOST_ANCHOR$1, optional: true }, { token: i0.ElementRef }, { token: i1.ClrCommonStringsService }, { token: SignpostIdService }, { token: SignpostFocusManager }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: i2.ClrPopoverService }, { token: i2.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostContent, isStandalone: false, selector: "clr-signpost-content", inputs: { signpostCloseAriaLabel: ["clrSignpostCloseAriaLabel", "signpostCloseAriaLabel"], position: ["clrPosition", "position"] }, host: { attributes: { "role": "dialog" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.signpost-content": "true", "id": "signpostContentId", "class.is-off-screen": "this.isOffScreen" } }, viewQueries: [{ propertyName: "closeButton", first: true, predicate: ["closeButton"], descendants: true, read: ElementRef }], hostDirectives: [{ directive: i2.ClrPopoverContent }], ngImport: i0, template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost-content',
                    template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          #closeButton
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
                    host: {
                        '[class.signpost-content]': 'true',
                        '[id]': 'signpostContentId',
                        role: 'dialog',
                    },
                    standalone: false,
                    hostDirectives: [ClrPopoverContent$1],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR$1]
                }] }, { type: i0.ElementRef }, { type: i1.ClrCommonStringsService }, { type: SignpostIdService }, { type: SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i2.ClrPopoverService }, { type: i2.ClrPopoverContent }], propDecorators: { signpostCloseAriaLabel: [{
                type: Input,
                args: ['clrSignpostCloseAriaLabel']
            }], closeButton: [{
                type: ViewChild,
                args: ['closeButton', { read: ElementRef }]
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }], isOffScreen: [{
                type: HostBinding,
                args: ['class.is-off-screen']
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrSignpostTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrSignpostTitle, isStandalone: false, selector: "clr-signpost-title", host: { properties: { "class.signpost-title": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.signpost-title]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_SIGNPOST_DIRECTIVES = [
    ClrSignpost,
    ClrSignpostContent,
    ClrSignpostTrigger,
    ClrSignpostTitle,
];
class ClrSignpostModule {
    constructor() {
        ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, declarations: [ClrSignpost,
            ClrSignpostContent,
            ClrSignpostTrigger,
            ClrSignpostTitle], imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, _lrClrPopoverModuleNext, ClrIfOpen$1], exports: [ClrSignpost,
            ClrSignpostContent,
            ClrSignpostTrigger,
            ClrSignpostTitle, ClrIfOpen$1] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, _lrClrPopoverModuleNext] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrSignpostModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, _lrClrPopoverModuleNext, ClrIfOpen$1],
                    declarations: [CLR_SIGNPOST_DIRECTIVES],
                    exports: [CLR_SIGNPOST_DIRECTIVES, ClrIfOpen$1],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TooltipIdService {
    constructor() {
        this._id = new Subject();
    }
    get id() {
        return this._id.asObservable();
    }
    updateId(id) {
        this._id.next(id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TooltipMouseService {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.mouseOutDelay = 100;
    }
    onMouseEnterTrigger() {
        this.mouseOverTrigger = true;
        this.popoverService.open = true;
    }
    onMouseLeaveTrigger() {
        this.mouseOverTrigger = false;
        this.hideIfMouseOut();
    }
    onMouseEnterContent() {
        this.mouseOverContent = true;
    }
    onMouseLeaveContent() {
        this.mouseOverContent = false;
        this.hideIfMouseOut();
    }
    hideIfMouseOut() {
        // A zero timeout is used so that the code has a chance to update
        // the `mouseOverContent` property after the user moves the mouse from the trigger to the content.
        setTimeout(() => {
            if (!this.mouseOverTrigger && !this.mouseOverContent) {
                this.popoverService.open = false;
            }
        }, this.mouseOutDelay);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipMouseService, deps: [{ token: i2.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipMouseService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: TooltipMouseService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i2.ClrPopoverService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTooltip {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltip, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrTooltip, isStandalone: false, selector: "clr-tooltip", host: { properties: { "class.clr-tooltip-container": "true" } }, providers: [TooltipIdService, TooltipMouseService], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltip, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-tooltip-container]': 'true',
                    },
                    providers: [TooltipIdService, TooltipMouseService],
                    hostDirectives: [ClrPopoverHostDirective$1],
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTooltipTrigger {
    constructor(popoverService, tooltipIdService, tooltipMouseService, element) {
        this.popoverService = popoverService;
        this.tooltipMouseService = tooltipMouseService;
        this.subs = [];
        // The aria-described by comes from the id of content. It
        this.subs.push(tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
        popoverService.anchorElementRef = element;
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    showTooltip() {
        this.popoverService.open = true;
    }
    hideTooltip() {
        this.popoverService.open = false;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterTrigger();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveTrigger();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipTrigger, deps: [{ token: i2.ClrPopoverService }, { token: TooltipIdService }, { token: TooltipMouseService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrTooltipTrigger, isStandalone: false, selector: "[clrTooltipTrigger]", host: { attributes: { "tabindex": "0" }, listeners: { "focus": "showTooltip()", "blur": "hideTooltip()", "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-trigger": "true", "attr.aria-describedby": "ariaDescribedBy", "attr.role": "\"button\"" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTooltipTrigger]',
                    host: {
                        tabindex: '0',
                        '[class.tooltip-trigger]': 'true',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                        '[attr.role]': '"button"',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2.ClrPopoverService }, { type: TooltipIdService }, { type: TooltipMouseService }, { type: i0.ElementRef }], propDecorators: { showTooltip: [{
                type: HostListener,
                args: ['focus']
            }], hideTooltip: [{
                type: HostListener,
                args: ['blur']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const SIZES = ['xs', 'sm', 'md', 'lg'];
const defaultPosition = ClrPopoverPosition$1.RIGHT;
const defaultSize = 'sm';
class ClrTooltipContent {
    constructor(parentHost, tooltipIdService, el, renderer, popoverService, tooltipMouseService, popoverContent) {
        this.tooltipIdService = tooltipIdService;
        this.el = el;
        this.renderer = renderer;
        this.tooltipMouseService = tooltipMouseService;
        this.popoverContent = popoverContent;
        popoverService.panelClass.push('clr-tooltip-container');
        popoverContent.contentType = ClrPopoverType$1.TOOLTIP;
        popoverContent.scrollToClose = true;
        if (!parentHost) {
            throw new Error('clr-tooltip-content should only be used inside of a clr-tooltip');
        }
        // Set the default id in case consumer does not supply a custom id.
        this.id = uniqueIdFactory();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        const id = value || '';
        this._id = id;
        this.tooltipIdService.updateId(id);
    }
    get position() {
        return this._position;
    }
    set position(value) {
        const posIndex = TOOLTIP_POSITIONS$1.indexOf(value);
        this._position = value && posIndex > -1 ? TOOLTIP_POSITIONS$1[posIndex] : defaultPosition;
        this.popoverContent.contentAt = this._position;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        const oldSize = this._size;
        const newSize = SIZES.includes(value) ? value : defaultSize;
        this._size = newSize;
        this.updateCssClass({ oldClass: `tooltip-${oldSize}`, newClass: `tooltip-${newSize}` });
    }
    ngOnInit() {
        this.size = this.size || defaultSize;
        this.position = this.position || defaultPosition;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterContent();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveContent();
    }
    updateCssClass({ oldClass, newClass }) {
        this.renderer.removeClass(this.el.nativeElement, oldClass);
        this.renderer.addClass(this.el.nativeElement, newClass);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipContent, deps: [{ token: POPOVER_HOST_ANCHOR$1, optional: true }, { token: TooltipIdService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i2.ClrPopoverService }, { token: TooltipMouseService }, { token: i2.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrTooltipContent, isStandalone: false, selector: "clr-tooltip-content", inputs: { id: "id", position: ["clrPosition", "position"], size: ["clrSize", "size"] }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-content": "true", "style.opacity": "1", "attr.role": "\"tooltip\"", "id": "id" } }, hostDirectives: [{ directive: i2.ClrPopoverContent }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip-content',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.tooltip-content]': 'true',
                        '[style.opacity]': '1',
                        '[attr.role]': '"tooltip"',
                        '[id]': 'id',
                    },
                    standalone: false,
                    hostDirectives: [ClrPopoverContent$1],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR$1]
                }] }, { type: TooltipIdService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i2.ClrPopoverService }, { type: TooltipMouseService }, { type: i2.ClrPopoverContent }], propDecorators: { id: [{
                type: Input
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }], size: [{
                type: Input,
                args: ['clrSize']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TOOLTIP_DIRECTIVES = [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent];
class ClrTooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipModule, declarations: [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent], imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext], exports: [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent, ClrIfOpen$1, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipModule, imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext],
                    declarations: [CLR_TOOLTIP_DIRECTIVES],
                    exports: [CLR_TOOLTIP_DIRECTIVES, ClrIfOpen$1, ClrIcon],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_DROPDOWN_DIRECTIVES, CLR_MENU_POSITIONS, CLR_SIGNPOST_DIRECTIVES, CLR_TOOLTIP_DIRECTIVES, ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, ClrDropdownTrigger, ClrIfOpen, ClrPopoverAnchor, ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModule, ClrPopoverPosition, ClrPopoverService, ClrPopoverType, ClrSignpost, ClrSignpostContent, ClrSignpostModule, ClrSignpostTitle, ClrSignpostTrigger, ClrStopEscapePropagationDirective, ClrTooltip, ClrTooltipContent, ClrTooltipModule, ClrTooltipTrigger, DROPDOWN_POSITIONS, POPOVER_HOST_ANCHOR, SIGNPOST_POSITIONS, TOOLTIP_POSITIONS, getAnchorPosition, getConnectedPositions, getContentPosition, getPositionsArray, mapPopoverKeyToPosition, ClrPopoverCloseButton as ÇlrClrPopoverCloseButton, ClrPopoverModuleNext as ÇlrClrPopoverModuleNext, ClrPopoverOpenCloseButton as ÇlrClrPopoverOpenCloseButton };
//# sourceMappingURL=clr-angular-popover.mjs.map
