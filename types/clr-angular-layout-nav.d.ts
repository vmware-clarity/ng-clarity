import * as i1 from '@clr/angular/utils';
import { WillyWonka, OompaLoompa, ClrCommonStringsService, ClrStandaloneCdkTrapFocus } from '@clr/angular/utils';
import * as i0 from '@angular/core';
import { ChangeDetectorRef, OnDestroy, OnInit, ElementRef, Renderer2, Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLinkActive } from '@angular/router';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';
import * as i8 from '@clr/angular/popover/dropdown';

declare class MainContainerWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<MainContainerWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MainContainerWillyWonka, "clr-main-container", never, {}, {}, never, never, false, never>;
}

declare class ResponsiveNavControlMessage {
    private _controlCode;
    private _navLevel;
    constructor(_controlCode: string, _navLevel: number);
    get controlCode(): string;
    get navLevel(): number;
}

declare class ResponsiveNavigationService {
    responsiveNavList: number[];
    private registerNavSubject;
    private controlNavSubject;
    constructor();
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

declare class NavDetectionOompaLoompa extends OompaLoompa {
    private responsiveNavService;
    constructor(cdr: ChangeDetectorRef, willyWonka: MainContainerWillyWonka, responsiveNavService: ResponsiveNavigationService);
    get flavor(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<NavDetectionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NavDetectionOompaLoompa, "clr-header", never, {}, {}, never, never, false, never>;
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
    isNavLevel1OnPage: boolean;
    isNavLevel2OnPage: boolean;
    openNavLevel: number;
    responsiveNavCodes: typeof ResponsiveNavCodes;
    private _subscription;
    constructor(responsiveNavService: ResponsiveNavigationService, commonStrings: ClrCommonStringsService);
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
    _level: number;
    closeButtonAriaLabel: string;
    private _isOpen;
    private _document;
    private _subscription;
    constructor(platformId: any, cdkTrapFocus: ClrStandaloneCdkTrapFocus, responsiveNavService: ResponsiveNavigationService, elementRef: ElementRef<HTMLElement>, renderer: Renderer2, injector: Injector);
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
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNavigationModule, [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrDropdownModule], [typeof ClrHeader, typeof ClrNavLevel, typeof ClrAriaCurrentLink, typeof NavDetectionOompaLoompa, typeof MainContainerWillyWonka]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNavigationModule>;
}

export { CLR_NAVIGATION_DIRECTIVES, ClrAriaCurrentLink, ClrHeader, ClrNavLevel, ClrNavigationModule, MainContainerWillyWonka, NavDetectionOompaLoompa, ResponsiveNavCodes, ResponsiveNavControlMessage, ResponsiveNavigationService };
