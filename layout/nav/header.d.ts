import { OnDestroy } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';
import * as i0 from "@angular/core";
export declare class ClrHeader implements OnDestroy {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrHeader, "clr-header", never, { "role": "role"; }, {}, never, ["*"], false, never>;
}
