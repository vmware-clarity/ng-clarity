import * as i0 from '@angular/core';
import { OnDestroy, OnInit, ElementRef, Renderer2, Injector, EnvironmentInjector, ApplicationRef, Type } from '@angular/core';
import * as i1 from '@clr/angular/utils';
import { ClrCommonStringsService, ClrStandaloneCdkTrapFocus } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import { RouterLinkActive } from '@angular/router';
import * as i4 from '@angular/common';
import * as i5 from '@clr/angular/icon';
import * as i6 from '@clr/angular/popover/dropdown';

declare class ResponsiveNavControlMessage {
    private _controlCode;
    private _navLevel;
    constructor(_controlCode: string, _navLevel: number);
    get controlCode(): string;
    get navLevel(): number;
}

declare class ResponsiveNavigationService {
    private readonly _responsiveNavList;
    private registerNavSubject;
    private controlNavSubject;
    constructor();
    get responsiveNavList(): number[];
    set responsiveNavList(value: number[]);
    get registeredNavs(): Observable<number[]>;
    get navControl(): Observable<ResponsiveNavControlMessage>;
    registerNav(navLevel: number): void;
    isNavRegistered(navLevel: number): boolean;
    unregisterNav(navLevel: number): void;
    sendControlMessage(controlCode: string, navLevel: number): void;
    closeAllNavs(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ResponsiveNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ResponsiveNavigationService>;
}

declare class ResponsiveNavCodes {
    static NAV_LEVEL_1: number;
    static NAV_LEVEL_2: number;
    static NAV_CLOSE_ALL: string;
    static NAV_OPEN: string;
    static NAV_CLOSE: string;
    static NAV_TOGGLE: string;
    static NAV_CLASS_HAMBURGER_MENU: string;
    static NAV_CLASS_OVERFLOW_MENU: string;
    static NAV_CLASS_TRIGGER_1: string;
    static NAV_CLASS_TRIGGER_2: string;
    static NAV_CLASS_LEVEL_1: string;
    static NAV_CLASS_LEVEL_2: string;
}

declare class ClrHeader implements OnDestroy {
    private responsiveNavService;
    commonStrings: ClrCommonStringsService;
    role: string;
    openNavLevel: number;
    responsiveNavCodes: typeof ResponsiveNavCodes;
    private _subscription;
    private readonly navTriggers;
    constructor(responsiveNavService: ResponsiveNavigationService, commonStrings: ClrCommonStringsService);
    get isNavLevel1OnPage(): boolean;
    set isNavLevel1OnPage(value: boolean);
    get isNavLevel2OnPage(): boolean;
    set isNavLevel2OnPage(value: boolean);
    get responsiveNavCommonString(): string;
    get responsiveOverflowCommonString(): string;
    resetNavTriggers(): void;
    initializeNavTriggers(navList: number[]): void;
    closeOpenNav(): void;
    /**
     * @deprecated Will be removed in with @clr/angular v15.0.0
     *
     * Use `openNav(navLevel)` instead to open the navigation and ResponsiveNavService to close it.
     */
    toggleNav(navLevel: number): void;
    openNav(navLevel: number): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrHeader, "clr-header", never, { "role": { "alias": "role"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare class ClrNavLevel implements OnInit {
    private cdkTrapFocus;
    private responsiveNavService;
    private elementRef;
    private renderer;
    private injector;
    private environmentInjector;
    private appRef;
    _level: number;
    closeButtonAriaLabel: string;
    private _isOpen;
    private _document;
    private _subscription;
    constructor(platformId: any, cdkTrapFocus: ClrStandaloneCdkTrapFocus, responsiveNavService: ResponsiveNavigationService, elementRef: ElementRef<HTMLElement>, renderer: Renderer2, injector: Injector, environmentInjector: EnvironmentInjector, appRef: ApplicationRef);
    get level(): number;
    get responsiveNavCodes(): ResponsiveNavCodes;
    get isOpen(): boolean;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onResize(event: Event): void;
    onMouseClick(target: any): void;
    addNavClass(level: number): void;
    open(): void;
    close(): void;
    protected hideNavigation(): void;
    protected showNavigation(): void;
    protected hideCloseButton(): void;
    protected showCloseButton(): void;
    private createCloseButton;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNavLevel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNavLevel, "[clr-nav-level]", never, { "_level": { "alias": "clr-nav-level"; "required": false; }; "closeButtonAriaLabel": { "alias": "closeAriaLabel"; "required": false; }; }, {}, never, never, false, [{ directive: typeof i1.ClrStandaloneCdkTrapFocus; inputs: {}; outputs: {}; }]>;
}

declare class ClrAriaCurrentLink implements OnInit, OnDestroy {
    private rla;
    ariaCurrent: string | undefined;
    private subscription;
    constructor(rla: RouterLinkActive);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAriaCurrentLink, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAriaCurrentLink, "[clrAriaCurrentLink]", never, {}, {}, never, never, false, never>;
}

declare const CLR_NAVIGATION_DIRECTIVES: Type<any>[];
declare class ClrNavigationModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNavigationModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNavigationModule, [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink], [typeof i4.CommonModule, typeof i5.ClrIcon, typeof i6.ClrDropdownModule], [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNavigationModule>;
}

export { CLR_NAVIGATION_DIRECTIVES, ClrAriaCurrentLink, ClrHeader, ClrNavLevel, ClrNavigationModule, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService };
