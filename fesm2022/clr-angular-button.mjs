import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Input, ViewChild, Output, Optional, SkipSelf, Component, ContentChildren, NgModule } from '@angular/core';
import * as i6 from '@clr/angular/icon';
import { ClrIcon, ClarityIcons, ellipsisHorizontalIcon } from '@clr/angular/icon';
import * as i5 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i2 from '@clr/angular/popover/common';
import { ClrPopoverType, ClrPopoverPosition, DROPDOWN_POSITIONS, ClrPopoverHostDirective, ClrPopoverModuleNext } from '@clr/angular/popover/common';
import * as i3 from '@clr/angular/utils';
import { uniqueIdFactory, ClrLoadingState, LoadingListener, Linkers, ClrDestroyService, FOCUS_SERVICE_PROVIDER } from '@clr/angular/utils';
import * as i1 from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ButtonInGroupService {
    constructor() {
        this._changes = new Subject();
    }
    get changes() {
        return this._changes.asObservable();
    }
    updateButtonGroup(button) {
        this._changes.next(button);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonInGroupService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonInGroupService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonInGroupService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrButton {
    constructor(routerLinkActive, buttonInGroupService) {
        this.routerLinkActive = routerLinkActive;
        this.buttonInGroupService = buttonInGroupService;
        this._click = new EventEmitter(false);
        this._inMenu = false;
        this._enableService = false;
        this._classNames = 'btn';
        this._name = null;
        this._type = null;
        this._disabled = null;
        this._id = uniqueIdFactory();
    }
    get inMenu() {
        return this._inMenu;
    }
    set inMenu(value) {
        value = !!value;
        if (this._inMenu !== value) {
            this._inMenu = value;
            // We check if the service flag is enabled
            // and if the service exists because the service is optional
            if (this._enableService && this.buttonInGroupService) {
                this.buttonInGroupService.updateButtonGroup(this);
            }
        }
    }
    get classNames() {
        return this.routerLinkActive?.isActive ? `${this._classNames} ${this.routerLinkActiveClasses}` : this._classNames;
    }
    set classNames(value) {
        if (typeof value === 'string') {
            const classNames = value.split(' ');
            if (classNames.indexOf('btn') === -1) {
                classNames.push('btn');
            }
            this._classNames = classNames.join(' ');
        }
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (typeof value === 'string') {
            this._name = value;
        }
    }
    get type() {
        return this._type;
    }
    set type(value) {
        if (typeof value === 'string') {
            this._type = value;
        }
    }
    get id() {
        return this._id;
    }
    set id(value) {
        if (typeof value === 'string') {
            this._id = value;
        }
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value !== null && value !== false) {
            this._disabled = '';
        }
        else {
            this._disabled = null;
        }
    }
    get role() {
        return this.inMenu ? 'menuitem' : null;
    }
    ngAfterViewInit() {
        this._enableService = true;
    }
    loadingStateChange(state) {
        this.loading = state === ClrLoadingState.LOADING;
    }
    emitClick() {
        this._click.emit(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButton, deps: [{ token: i1.RouterLinkActive, optional: true }, { token: ButtonInGroupService, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrButton, isStandalone: false, selector: "clr-button", inputs: { routerLinkActiveClasses: ["routerLinkActive", "routerLinkActiveClasses"], inMenu: ["clrInMenu", "inMenu"], classNames: ["class", "classNames"], name: "name", type: "type", id: "id", disabled: "disabled" }, outputs: { _click: "click" }, providers: [{ provide: LoadingListener, useExisting: ClrButton }], viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["buttonProjectedRef"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #buttonProjectedRef>
      <button
        [class]="classNames"
        (click)="emitClick()"
        [attr.type]="type"
        [attr.name]="name"
        [attr.disabled]="disabled"
        [attr.role]="role"
        [attr.id]="id"
      >
        @if (loading) {
          <span class="spinner spinner-inline"></span>
        }
        <ng-content></ng-content>
      </button>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-button',
                    template: `
    <ng-template #buttonProjectedRef>
      <button
        [class]="classNames"
        (click)="emitClick()"
        [attr.type]="type"
        [attr.name]="name"
        [attr.disabled]="disabled"
        [attr.role]="role"
        [attr.id]="id"
      >
        @if (loading) {
          <span class="spinner spinner-inline"></span>
        }
        <ng-content></ng-content>
      </button>
    </ng-template>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrButton }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.RouterLinkActive, decorators: [{
                    type: Optional
                }] }, { type: ButtonInGroupService, decorators: [{
                    type: SkipSelf
                }, {
                    type: Optional
                }] }], propDecorators: { _click: [{
                type: Output,
                args: ['click']
            }], routerLinkActiveClasses: [{
                type: Input,
                args: ['routerLinkActive']
            }], templateRef: [{
                type: ViewChild,
                args: ['buttonProjectedRef', { static: true }]
            }], inMenu: [{
                type: Input,
                args: ['clrInMenu']
            }], classNames: [{
                type: Input,
                args: ['class']
            }], name: [{
                type: Input,
                args: ['name']
            }], type: [{
                type: Input,
                args: ['type']
            }], id: [{
                type: Input,
                args: ['id']
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var InitialFocus;
(function (InitialFocus) {
    InitialFocus["FIRST_ITEM"] = "first";
    InitialFocus["LAST_ITEM"] = "last";
})(InitialFocus || (InitialFocus = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ButtonGroupFocusHandler {
    constructor(focusService, popoverService, renderer) {
        this.focusService = focusService;
        this.popoverService = popoverService;
        this.renderer = renderer;
        this.initialFocus = InitialFocus.FIRST_ITEM;
        this._unlistenFuncs = [];
    }
    ngOnDestroy() {
        this._unlistenFuncs.forEach((unlisten) => unlisten());
        this.focusService.detachListeners(this.menu);
    }
    initialize({ menu, menuToggle }) {
        this.menu = menu;
        this.menuToggle = menuToggle;
        this.focusService.registerContainer(this.menu);
        this.listenToKeys();
        this.linkButtons();
        switch (this.initialFocus) {
            case InitialFocus.LAST_ITEM:
                this.focusLastItem();
                break;
            default:
                this.focusFirstItem();
                break;
        }
    }
    resetButtonsFocus() {
        this.buttons.forEach(button => {
            button.blur();
        });
    }
    listenToKeys() {
        this._unlistenFuncs.push(this.renderer.listen(this.menu, 'keydown.shift.tab', event => this.closeMenu(event, false)));
        this._unlistenFuncs.push(this.renderer.listen(this.menu, 'keydown.tab', event => this.closeMenu(event, true)));
    }
    closeMenu(event, focusBackOnToggle) {
        this.popoverService.toggleWithEvent(event);
        if (focusBackOnToggle) {
            this.menuToggle.focus();
        }
        this.resetButtonsFocus();
    }
    linkButtons() {
        const buttonElements = Array.from(this.menu.children);
        this.buttons = buttonElements.map(buttonElement => {
            this._unlistenFuncs.push(this.renderer.listen(buttonElement, 'click', event => this.closeMenu(event, true)));
            return {
                id: buttonElement.id,
                value: buttonElement,
                focus: () => {
                    buttonElement.setAttribute('tabindex', '0');
                    buttonElement.focus();
                },
                blur: () => {
                    buttonElement.setAttribute('tabindex', '-1');
                    buttonElement.blur();
                },
            };
        });
        this.resetButtonsFocus();
        Linkers.linkVertical(this.buttons);
    }
    focusFirstItem() {
        if (this.buttons.length) {
            this.focusService.moveTo(this.buttons[0]);
        }
        this.initialFocus = InitialFocus.FIRST_ITEM;
    }
    focusLastItem() {
        if (this.buttons.length) {
            this.focusService.moveTo(this.buttons[this.buttons.length - 1]);
        }
        this.initialFocus = InitialFocus.FIRST_ITEM;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonGroupFocusHandler, deps: [{ token: i3.FocusService }, { token: i2.ClrPopoverService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonGroupFocusHandler }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ButtonGroupFocusHandler, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i3.FocusService }, { type: i2.ClrPopoverService }, { type: i0.Renderer2 }] });
const BUTTON_GROUP_FOCUS_HANDLER_PROVIDER = {
    provide: ButtonGroupFocusHandler,
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrButtonGroup {
    constructor(buttonGroupNewService, popoverService, commonStrings, destroy$, focusHandler) {
        this.buttonGroupNewService = buttonGroupNewService;
        this.popoverService = popoverService;
        this.commonStrings = commonStrings;
        this.destroy$ = destroy$;
        this.focusHandler = focusHandler;
        this.clrToggleButtonAriaLabel = this.commonStrings.keys.rowActions;
        this.popoverId = uniqueIdFactory();
        this.InitialFocus = InitialFocus;
        this.inlineButtons = [];
        this.menuButtons = [];
        this.popoverType = ClrPopoverType.DROPDOWN;
        this._menuPosition = ClrPopoverPosition.BOTTOM_LEFT;
    }
    get menuPosition() {
        return this._menuPosition;
    }
    set menuPosition(pos) {
        if (!pos) {
            return;
        }
        const posIndex = DROPDOWN_POSITIONS.indexOf(pos);
        if (posIndex === -1) {
            return;
        }
        this._menuPosition = DROPDOWN_POSITIONS[posIndex];
    }
    get open() {
        return this.popoverService.open;
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
        if (!this.popoverService.open) {
            this.popoverService.toggleWithEvent(event);
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
        this.popoverService.popoverVisible.pipe(takeUntil(this.destroy$)).subscribe(visible => {
            if (visible) {
                this.focusHandler.initialize({
                    menu: this.menu.nativeElement,
                    menuToggle: this.menuToggle.nativeElement,
                });
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroup, deps: [{ token: ButtonInGroupService }, { token: i2.ClrPopoverService }, { token: i3.ClrCommonStringsService }, { token: i3.ClrDestroyService }, { token: ButtonGroupFocusHandler }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrButtonGroup, isStandalone: false, selector: "clr-button-group", inputs: { clrToggleButtonAriaLabel: "clrToggleButtonAriaLabel", menuPosition: ["clrMenuPosition", "menuPosition"] }, host: { properties: { "class.btn-group": "true" } }, providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER], queries: [{ propertyName: "buttons", predicate: ClrButton }], viewQueries: [{ propertyName: "menuToggle", first: true, predicate: ["menuToggle"], descendants: true }, { propertyName: "menu", first: true, predicate: ["menu"], descendants: true }], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@for (inlineButton of inlineButtons; track inlineButton) {\n<ng-template [ngTemplateOutlet]=\"inlineButton.templateRef\"></ng-template>\n} @if (menuButtons.length > 0) {\n<div class=\"btn-group-overflow open\" [ngClass]=\"menuPosition\">\n  <button\n    #menuToggle\n    class=\"btn dropdown-toggle\"\n    clrPopoverOrigin\n    clrPopoverOpenCloseButton\n    (keydown.arrowup)=\"openMenu($event, InitialFocus.LAST_ITEM)\"\n    (keydown.arrowdown)=\"openMenu($event, InitialFocus.FIRST_ITEM)\"\n    [attr.aria-controls]=\"popoverId\"\n    [attr.aria-expanded]=\"open\"\n    [attr.aria-label]=\"clrToggleButtonAriaLabel\"\n  >\n    <cds-icon shape=\"ellipsis-horizontal\" [attr.title]=\"commonStrings.keys.more\"></cds-icon>\n  </button>\n  <div\n    #menu\n    role=\"menu\"\n    class=\"dropdown-menu clr-button-group-menu\"\n    [id]=\"popoverId\"\n    [attr.id]=\"popoverId\"\n    [attr.aria-hidden]=\"!open\"\n    *clrPopoverContent=\"open; at menuPosition; type: popoverType; outsideClickToClose: true; scrollToClose: true\"\n  >\n    @for (menuButton of menuButtons; track menuButton) {\n    <ng-template [ngTemplateOutlet]=\"menuButton.templateRef\"></ng-template>\n    }\n  </div>\n</div>\n}\n", dependencies: [{ kind: "directive", type: i5.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i6.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i2.ClrPopoverOrigin, selector: "[clrPopoverOrigin]" }, { kind: "directive", type: i2.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i2.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose", "clrPopoverContentOrigin"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroup, decorators: [{
            type: Component,
            args: [{ selector: 'clr-button-group', providers: [ButtonInGroupService, ClrDestroyService, BUTTON_GROUP_FOCUS_HANDLER_PROVIDER, FOCUS_SERVICE_PROVIDER], hostDirectives: [ClrPopoverHostDirective], host: { '[class.btn-group]': 'true' }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@for (inlineButton of inlineButtons; track inlineButton) {\n<ng-template [ngTemplateOutlet]=\"inlineButton.templateRef\"></ng-template>\n} @if (menuButtons.length > 0) {\n<div class=\"btn-group-overflow open\" [ngClass]=\"menuPosition\">\n  <button\n    #menuToggle\n    class=\"btn dropdown-toggle\"\n    clrPopoverOrigin\n    clrPopoverOpenCloseButton\n    (keydown.arrowup)=\"openMenu($event, InitialFocus.LAST_ITEM)\"\n    (keydown.arrowdown)=\"openMenu($event, InitialFocus.FIRST_ITEM)\"\n    [attr.aria-controls]=\"popoverId\"\n    [attr.aria-expanded]=\"open\"\n    [attr.aria-label]=\"clrToggleButtonAriaLabel\"\n  >\n    <cds-icon shape=\"ellipsis-horizontal\" [attr.title]=\"commonStrings.keys.more\"></cds-icon>\n  </button>\n  <div\n    #menu\n    role=\"menu\"\n    class=\"dropdown-menu clr-button-group-menu\"\n    [id]=\"popoverId\"\n    [attr.id]=\"popoverId\"\n    [attr.aria-hidden]=\"!open\"\n    *clrPopoverContent=\"open; at menuPosition; type: popoverType; outsideClickToClose: true; scrollToClose: true\"\n  >\n    @for (menuButton of menuButtons; track menuButton) {\n    <ng-template [ngTemplateOutlet]=\"menuButton.templateRef\"></ng-template>\n    }\n  </div>\n</div>\n}\n" }]
        }], ctorParameters: () => [{ type: ButtonInGroupService }, { type: i2.ClrPopoverService }, { type: i3.ClrCommonStringsService }, { type: i3.ClrDestroyService }, { type: ButtonGroupFocusHandler }], propDecorators: { clrToggleButtonAriaLabel: [{
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_BUTTON_GROUP_DIRECTIVES = [ClrButton, ClrButtonGroup];
class ClrButtonGroupModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroupModule, declarations: [ClrButton, ClrButtonGroup], imports: [CommonModule, ClrIcon, ClrPopoverModuleNext], exports: [ClrButton, ClrButtonGroup] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroupModule, imports: [CommonModule, ClrIcon, ClrPopoverModuleNext] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrPopoverModuleNext],
                    declarations: [CLR_BUTTON_GROUP_DIRECTIVES],
                    exports: [CLR_BUTTON_GROUP_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// minimum width to fit loading spinner
const MIN_BUTTON_WIDTH = 42;
class ClrLoadingButton {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.clrLoadingChange = new EventEmitter(false);
        this.buttonState = ClrLoadingState;
        this.state = ClrLoadingState.DEFAULT;
    }
    loadingStateChange(state) {
        if (state === this.state) {
            return;
        }
        this.state = state;
        switch (state) {
            case ClrLoadingState.DEFAULT:
                this.renderer.removeStyle(this.el.nativeElement, 'width');
                this.renderer.removeStyle(this.el.nativeElement, 'transform'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
                if (!this.disabled) {
                    this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
                }
                break;
            case ClrLoadingState.LOADING:
                this.setExplicitButtonWidth();
                this.renderer.setStyle(this.el.nativeElement, 'transform', 'translatez(0)'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
                this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
                break;
            case ClrLoadingState.SUCCESS:
                this.setExplicitButtonWidth();
                break;
            case ClrLoadingState.ERROR:
                this.loadingStateChange(ClrLoadingState.DEFAULT);
                break;
            default:
                break;
        }
        this.clrLoadingChange.emit(state);
    }
    setExplicitButtonWidth() {
        if (this.el.nativeElement && this.el.nativeElement.getBoundingClientRect) {
            const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
            const width = Math.max(MIN_BUTTON_WIDTH, boundingClientRect.width);
            this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButton, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrLoadingButton, isStandalone: false, selector: "button[clrLoading]", inputs: { disabled: "disabled" }, outputs: { clrLoadingChange: "clrLoadingChange" }, host: { properties: { "attr.disabled": "disabled? '' : null" } }, providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }], ngImport: i0, template: `
    <span @parent>
      @switch (state) {
        @case (buttonState.LOADING) {
          <span @spinner class="spinner spinner-inline"></span>
        }
        @case (buttonState.SUCCESS) {
          <span
            @validated
            (@validated.done)="this.loadingStateChange(this.buttonState.DEFAULT)"
            class="spinner spinner-inline spinner-check"
          ></span>
        }
        @case (buttonState.DEFAULT) {
          <span @defaultButton class="clr-loading-btn-content">
            <ng-content></ng-content>
          </span>
        }
      }
    </span>
  `, isInline: true, animations: [
            trigger('parent', [
                // Skip :enter animation on first render.
                // The button text/content should only be faded when transitioning to or from a non-default state.
                transition(':enter', []),
            ]),
            trigger('defaultButton', [
                transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                // TODO: see if we can get leave animation to work before spinner's enter animation
                transition(':leave', [style({ opacity: 0 })]),
            ]),
            trigger('spinner', [
                transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
            ]),
            trigger('validated', [
                transition(':enter', [
                    animate('600ms', keyframes([
                        style({ transform: 'scale(0,0)', offset: 0 }),
                        style({ opacity: 1, offset: 0.2 }),
                        style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
                        style({ transform: 'scale(.9,.9)', offset: 0.6 }),
                        style({ transform: 'scale(1,1)', offset: 1 }),
                    ])),
                ]),
                transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
            ]),
        ] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'button[clrLoading]',
                    template: `
    <span @parent>
      @switch (state) {
        @case (buttonState.LOADING) {
          <span @spinner class="spinner spinner-inline"></span>
        }
        @case (buttonState.SUCCESS) {
          <span
            @validated
            (@validated.done)="this.loadingStateChange(this.buttonState.DEFAULT)"
            class="spinner spinner-inline spinner-check"
          ></span>
        }
        @case (buttonState.DEFAULT) {
          <span @defaultButton class="clr-loading-btn-content">
            <ng-content></ng-content>
          </span>
        }
      }
    </span>
  `,
                    providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }],
                    animations: [
                        trigger('parent', [
                            // Skip :enter animation on first render.
                            // The button text/content should only be faded when transitioning to or from a non-default state.
                            transition(':enter', []),
                        ]),
                        trigger('defaultButton', [
                            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                            // TODO: see if we can get leave animation to work before spinner's enter animation
                            transition(':leave', [style({ opacity: 0 })]),
                        ]),
                        trigger('spinner', [
                            transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
                            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
                        ]),
                        trigger('validated', [
                            transition(':enter', [
                                animate('600ms', keyframes([
                                    style({ transform: 'scale(0,0)', offset: 0 }),
                                    style({ opacity: 1, offset: 0.2 }),
                                    style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
                                    style({ transform: 'scale(.9,.9)', offset: 0.6 }),
                                    style({ transform: 'scale(1,1)', offset: 1 }),
                                ])),
                            ]),
                            transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
                        ]),
                    ],
                    host: { '[attr.disabled]': "disabled? '' : null" },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { disabled: [{
                type: Input,
                args: ['disabled']
            }], clrLoadingChange: [{
                type: Output,
                args: ['clrLoadingChange']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_LOADING_BUTTON_DIRECTIVES = [ClrLoadingButton];
class ClrLoadingButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButtonModule, declarations: [ClrLoadingButton], imports: [CommonModule], exports: [ClrLoadingButton] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButtonModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrLoadingButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_LOADING_BUTTON_DIRECTIVES],
                    exports: [CLR_LOADING_BUTTON_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrButtonModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisHorizontalIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonModule, exports: [ClrLoadingButtonModule, ClrButtonGroupModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonModule, imports: [ClrLoadingButtonModule, ClrButtonGroupModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrLoadingButtonModule, ClrButtonGroupModule],
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_BUTTON_GROUP_DIRECTIVES, CLR_LOADING_BUTTON_DIRECTIVES, ClrButton, ClrButtonGroup, ClrButtonGroupModule, ClrButtonModule, ClrLoadingButton, ClrLoadingButtonModule };
//# sourceMappingURL=clr-angular-button.mjs.map
