import { OnDestroy } from '@angular/core';
import { VerticalNavGroupRegistrationService } from './providers/vertical-nav-group-registration.service';
import { VerticalNavIconService } from './providers/vertical-nav-icon.service';
import { VerticalNavService } from './providers/vertical-nav.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
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
}
