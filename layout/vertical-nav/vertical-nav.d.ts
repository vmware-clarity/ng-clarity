import { OnDestroy } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';
import * as i0 from "@angular/core";
export declare class ClrVerticalNav implements OnDestroy {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrVerticalNav, "clr-vertical-nav", never, { "toggleLabel": "clrVerticalNavToggleLabel"; "collapsible": "clrVerticalNavCollapsible"; "collapsed": "clrVerticalNavCollapsed"; }, { "_collapsedChanged": "clrVerticalNavCollapsedChange"; }, never, ["*"], false, never>;
}
