import * as i0 from '@angular/core';
import { AfterContentInit, OnDestroy, EventEmitter, ElementRef, ChangeDetectorRef, Type } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import * as i8 from '@clr/angular/utils';
import { ClrCommonStringsService, IfExpandService } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';

declare class ClrVerticalNavGroupChildren {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavGroupChildren, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavGroupChildren, "clr-vertical-nav-group-children", never, {}, {}, never, ["*"], false, never>;
}

declare class VerticalNavGroupRegistrationService {
    navGroupCount: number;
    registerNavGroup(): void;
    unregisterNavGroup(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupRegistrationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupRegistrationService>;
}

declare class VerticalNavGroupService {
    private _expandChange;
    get expandChange(): Observable<boolean>;
    expand(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavGroupService>;
}

declare class VerticalNavService {
    private _animateOnCollapsed;
    private _collapsedChanged;
    private _collapsed;
    private _collapsible;
    get animateOnCollapsed(): Observable<boolean>;
    get collapsedChanged(): Observable<boolean>;
    get collapsed(): boolean;
    set collapsed(value: boolean);
    get collapsible(): boolean;
    set collapsible(value: boolean);
    private updateCollapseBehavior;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavService>;
}

declare class ClrVerticalNavGroup implements AfterContentInit, OnDestroy {
    private _itemExpand;
    private _navGroupRegistrationService;
    private _navService;
    commonStrings: ClrCommonStringsService;
    expandedChange: EventEmitter<boolean>;
    private wasExpanded;
    private _subscriptions;
    private _expandAnimationState;
    constructor(_itemExpand: IfExpandService, _navGroupRegistrationService: VerticalNavGroupRegistrationService, navGroupService: VerticalNavGroupService, _navService: VerticalNavService, commonStrings: ClrCommonStringsService);
    get expanded(): boolean;
    set expanded(value: boolean);
    set userExpandedInput(value: boolean | string);
    get expandAnimationState(): string;
    set expandAnimationState(value: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    expandGroup(): void;
    collapseGroup(): void;
    expandAnimationDone($event: AnimationEvent): void;
    toggleExpand(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavGroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavGroup, "clr-vertical-nav-group", never, { "userExpandedInput": { "alias": "clrVerticalNavGroupExpanded"; "required": false; }; }, { "expandedChange": "clrVerticalNavGroupExpandedChange"; }, never, ["[clrVerticalNavLink]", "[clrVerticalNavIcon]", "*", "[clrIfExpanded], clr-vertical-nav-group-children"], false, never>;
}

declare class VerticalNavIconService {
    private _icons;
    get hasIcons(): boolean;
    registerIcon(): void;
    unregisterIcon(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerticalNavIconService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<VerticalNavIconService>;
}

declare class ClrVerticalNav implements OnDestroy {
    private _navService;
    private _navIconService;
    private _navGroupRegistrationService;
    commonStrings: ClrCommonStringsService;
    toggleLabel: string;
    contentId: string;
    private _collapsedChanged;
    private _sub;
    constructor(_navService: VerticalNavService, _navIconService: VerticalNavIconService, _navGroupRegistrationService: VerticalNavGroupRegistrationService, commonStrings: ClrCommonStringsService);
    get collapsible(): boolean | string;
    set collapsible(value: boolean | string);
    get collapsed(): boolean | string;
    set collapsed(value: boolean | string);
    get hasNavGroups(): boolean;
    get hasIcons(): boolean;
    get ariaExpanded(): string;
    ngOnDestroy(): void;
    toggleByButton(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNav, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNav, "clr-vertical-nav", never, { "toggleLabel": { "alias": "clrVerticalNavToggleLabel"; "required": false; }; "collapsible": { "alias": "clrVerticalNavCollapsible"; "required": false; }; "collapsed": { "alias": "clrVerticalNavCollapsed"; "required": false; }; }, { "_collapsedChanged": "clrVerticalNavCollapsedChange"; }, never, ["*"], false, never>;
}

declare class ClrVerticalNavLink implements OnDestroy {
    private destroy$;
    constructor(host: ElementRef<HTMLElement>, ref: ChangeDetectorRef, navGroupService: VerticalNavGroupService | null);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavLink, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNavLink, "[clrVerticalNavLink]", never, {}, {}, never, ["[clrVerticalNavIcon]", "*"], false, never>;
}

declare class ClrVerticalNavIcon implements OnDestroy {
    private _verticalNavIconService;
    constructor(_verticalNavIconService: VerticalNavIconService);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrVerticalNavIcon, "[clrVerticalNavIcon]", never, {}, {}, never, never, false, never>;
}

declare const CLR_VERTICAL_NAV_DIRECTIVES: Type<any>[];
declare class ClrVerticalNavModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrVerticalNavModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrVerticalNavModule, [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrConditionalModule, typeof i8.ClrFocusOnViewInitModule], [typeof ClrVerticalNav, typeof ClrVerticalNavLink, typeof ClrVerticalNavGroup, typeof ClrVerticalNavGroupChildren, typeof ClrVerticalNavIcon, typeof i8.ClrConditionalModule, typeof i7.ClrIcon, typeof i8.ClrFocusOnViewInitModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrVerticalNavModule>;
}

export { CLR_VERTICAL_NAV_DIRECTIVES, ClrVerticalNav, ClrVerticalNavGroup, ClrVerticalNavGroupChildren, ClrVerticalNavIcon, ClrVerticalNavLink, ClrVerticalNavModule };
