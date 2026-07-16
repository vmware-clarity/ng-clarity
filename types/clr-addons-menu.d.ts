import * as i0 from '@angular/core';
import { AfterContentInit, QueryList, EventEmitter, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, ComponentRef, ViewContainerRef } from '@angular/core';
import * as i9 from '@clr/angular/popover/dropdown';
import { ClrDropdownItem, ClrDropdownMenu, ClrDropdown } from '@clr/angular/popover/dropdown';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { ClrPopoverPoint } from '@clr/angular/popover/common';
import { Observable } from 'rxjs';
import * as i10 from '@angular/common';

/**
 * Used as token for querying a list of heterogeneous implementations.
 */
declare abstract class FocusableItemProvider {
    abstract getFocusableItem(): any;
}

declare class FocusableDropdownItemDirective implements FocusableItemProvider {
    private menu;
    constructor(menu: ClrDropdownItem);
    getFocusableItem(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusableDropdownItemDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FocusableDropdownItemDirective, "[clrDropdownItem][appfxFocusableDropdownItem]", never, {}, {}, never, never, false, never>;
}

declare class FocusableItemCollectorComponent implements AfterContentInit {
    parentMenu: ClrDropdownMenu;
    items: QueryList<FocusableItemProvider>;
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusableItemCollectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FocusableItemCollectorComponent, "focusable-item-collector", never, { "parentMenu": { "alias": "parentMenu"; "required": false; }; }, {}, ["items"], ["*"], false, never>;
}

declare class FocusableMenuDirective implements FocusableItemProvider {
    private menu;
    getFocusableItem(): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<FocusableMenuDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FocusableMenuDirective, "clr-dropdown-menu[appfxFocusableMenu]", never, {}, {}, never, never, false, never>;
}

/**
 * Base class for all items that can be shown as children of a menu.
 * Used as type injection token used to query heterogeneous list of menu items.
 */
declare abstract class MenuItem {
    /**
     * Optional ID of the menu item.
     */
    id?: string;
    hidden: boolean;
    type: MenuItemType;
}
declare enum MenuItemType {
    action = 0,
    separator = 1,
    header = 2,
    menu = 3
}

declare class MenuActionComponent extends MenuItem {
    type: MenuItemType;
    iconClass?: string;
    text?: string;
    shortcut?: string;
    enabled?: boolean;
    handle: EventEmitter<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuActionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuActionComponent, "appfx-menu-action", never, { "iconClass": { "alias": "iconClass"; "required": false; }; "text": { "alias": "text"; "required": false; }; "shortcut": { "alias": "shortcut"; "required": false; }; "enabled": { "alias": "enabled"; "required": false; }; }, { "handle": "handle"; }, never, never, false, never>;
}

/**
 * A menu component that can be shown within a menu-outlet.
 */
interface Menu {
    /**
     * Emits once when the menu is opened.
     */
    opened: Observable<void>;
    /**
     * Emits once when the menu is closed.
     */
    closed: Observable<void>;
    /**
     * Shows the menu with left top corner at the specified coordinates.
     *
     * When closed the focus is moved back to the trigger.
     */
    show(e: Event, x: number, y: number, trigger?: HTMLElement): void;
}

/**
 * A MenuItem where multiple menuItems can be nested.
 */
declare class NestedMenu extends MenuItem {
    type: MenuItemType;
    text?: string;
    iconClass?: string;
    menuItems: Iterable<MenuItem>;
}

declare class MenuComponent extends NestedMenu implements Menu, OnInit, OnDestroy, AfterContentInit {
    private cdr;
    private zoomLevelService?;
    private trigger?;
    private openingEvent;
    itemTypes: typeof MenuItemType;
    anchorPoint: ClrPopoverPoint;
    /**
     * The text that will be displayed as label of a nested menu
     */
    text: string;
    opened: EventEmitter<void>;
    closed: EventEmitter<void>;
    dropdown: ClrDropdown;
    dropdownElRef: ElementRef<HTMLElement>;
    menuItems: QueryList<MenuItem>;
    currentZoomLevel: ZoomLevel;
    ZoomLevel: typeof ZoomLevel;
    private subscriptions;
    constructor(cdr: ChangeDetectorRef, zoomLevelService?: ZoomLevelService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    show(e: Event, x: number, y: number, trigger?: HTMLElement): void;
    ngAfterContentInit(): void;
    close(e: Event): void;
    handleAction(actionItem: MenuActionComponent): void;
    documentContextMenu(event: Event): void;
    protected menuHasIcons(menuItems: Iterable<MenuItem>): boolean;
    protected getIconClass(iconClass: string, menuHasIcons: boolean): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuComponent, [null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuComponent, "appfx-menu", never, { "text": { "alias": "text"; "required": false; }; }, { "opened": "opened"; "closed": "closed"; }, ["menuItems"], never, false, never>;
}

declare class MenuHeaderComponent extends MenuItem {
    type: MenuItemType;
    iconClass: string;
    text: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuHeaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuHeaderComponent, "appfx-menu-header", never, { "iconClass": { "alias": "iconClass"; "required": false; }; "text": { "alias": "text"; "required": false; }; }, {}, never, never, false, never>;
}

interface MenuOutlet {
    /**
     * Adds the menu component to the outlet.
     */
    attachMenu(menuComponentRef: ComponentRef<any>): void;
    /**
     * Removes to menu component from the outlet.
     */
    detachMenu(): void;
}

declare class MenuOutletService {
    menuOutlet: MenuOutlet;
    /**
     * Shows and attaches the menu component.
     */
    showMenu(menuComponentRef: ComponentRef<Menu>, e: Event, x: number, y: number, trigger?: HTMLElement): void;
    /**
     * Closes and detaches the menu component
     */
    closeMenu(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuOutletService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MenuOutletService>;
}

declare class MenuOutletComponent implements MenuOutlet, OnInit {
    private menuOutletService;
    vc: ViewContainerRef;
    constructor(menuOutletService: MenuOutletService);
    ngOnInit(): void;
    /**
     * Adds the menu component to the component's container.
     */
    attachMenu(menuComponentRef: ComponentRef<any>): void;
    /**
     * Removes to menu component from the component's container.
     */
    detachMenu(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuOutletComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuOutletComponent, "menu-outlet", never, {}, {}, never, never, false, never>;
}

declare class MenuSeparatorComponent extends MenuItem {
    type: MenuItemType;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuSeparatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuSeparatorComponent, "appfx-menu-separator", never, {}, {}, never, never, false, never>;
}

declare class AppfxMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxMenuModule, [typeof FocusableDropdownItemDirective, typeof FocusableItemCollectorComponent, typeof FocusableMenuDirective, typeof MenuActionComponent, typeof MenuComponent, typeof MenuHeaderComponent, typeof MenuOutletComponent, typeof MenuSeparatorComponent], [typeof i9.ClrDropdownModule, typeof i10.CommonModule], [typeof MenuActionComponent, typeof MenuComponent, typeof MenuHeaderComponent, typeof MenuOutletComponent, typeof MenuSeparatorComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxMenuModule>;
}

export { AppfxMenuModule, MenuActionComponent, MenuComponent, MenuHeaderComponent, MenuItem, MenuItemType, MenuOutletComponent, MenuOutletService, MenuSeparatorComponent, NestedMenu };
export type { Menu };
