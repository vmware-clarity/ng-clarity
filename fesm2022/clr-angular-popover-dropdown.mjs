import * as i0 from '@angular/core';
import { PLATFORM_ID, SkipSelf, Optional, Inject, Injectable, Input, Component, HostBinding, ContentChildren, HostListener, Directive, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective, ClrPopoverType, ClrPopoverPosition, DROPDOWN_POSITIONS, POPOVER_HOST_ANCHOR, ClrPopoverContent, ClrIfOpen } from '@clr/angular/popover/common';
import * as i2$1 from '@clr/angular/utils';
import { uniqueIdFactory, ArrowKeyDirection, Linkers, wrapObservable, customFocusableItemProvider, FOCUS_SERVICE_PROVIDER, FocusableItem, BASIC_FOCUSABLE_ITEM_PROVIDER } from '@clr/angular/utils';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ReplaySubject, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClrIcon } from '@clr/angular/icon';

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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler, deps: [{ token: i0.Renderer2 }, { token: DropdownFocusHandler, optional: true, skipSelf: true }, { token: i2.ClrPopoverService }, { token: i2$1.FocusService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DropdownFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: DropdownFocusHandler, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }, { type: i2.ClrPopoverService }, { type: i2$1.FocusService }, { type: undefined, decorators: [{
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
                    hostDirectives: [ClrPopoverHostDirective],
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
        popoverContent.contentType = ClrPopoverType.DROPDOWN;
        popoverContent.contentAt = nested ? ClrPopoverPosition.RIGHT_TOP : ClrPopoverPosition.BOTTOM_LEFT;
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
        const posIndex = DROPDOWN_POSITIONS.indexOf(position);
        if (posIndex === -1) {
            return;
        }
        // set the popover values based on menu position
        this.popoverContent.contentAt = DROPDOWN_POSITIONS[posIndex];
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownMenu, deps: [{ token: POPOVER_HOST_ANCHOR, optional: true }, { token: ClrDropdownMenu, optional: true, skipSelf: true }, { token: DropdownFocusHandler }, { token: i0.ElementRef }, { token: i2.ClrPopoverService }, { token: i2.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
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
                    hostDirectives: [ClrPopoverContent],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownItem, deps: [{ token: ClrDropdown }, { token: RootDropdownService }, { token: i2$1.FocusableItem }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive }); }
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
        }], ctorParameters: () => [{ type: ClrDropdown }, { type: RootDropdownService }, { type: i2$1.FocusableItem }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { disabled: [{
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
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, declarations: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem], imports: [CommonModule, ClrIcon, ClrIfOpen], exports: [ClrDropdown, ClrDropdownMenu, ClrDropdownTrigger, ClrDropdownItem, ClrIfOpen, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDropdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrIfOpen],
                    declarations: [CLR_DROPDOWN_DIRECTIVES],
                    exports: [CLR_DROPDOWN_DIRECTIVES, ClrIfOpen, ClrIcon],
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

export { CLR_DROPDOWN_DIRECTIVES, CLR_MENU_POSITIONS, ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, ClrDropdownTrigger };
//# sourceMappingURL=clr-angular-popover-dropdown.mjs.map
