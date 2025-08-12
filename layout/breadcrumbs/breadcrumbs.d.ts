import { EventEmitter } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { BreadcrumbItem } from './model/breadcrumbs.model';
import * as i0 from "@angular/core";
export declare class ClrBreadcrumbs {
    protected commonStrings: ClrCommonStringsService;
    isExpanded: boolean;
    items: BreadcrumbItem[];
    clrBreadcrumbItemClick: EventEmitter<BreadcrumbItem>;
    protected limit: number;
    protected max: number;
    constructor(commonStrings: ClrCommonStringsService);
    protected expand(): void;
    protected handleItemClick(breadcrumb: BreadcrumbItem): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbs, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBreadcrumbs, "clr-breadcrumbs", never, { "items": "items"; }, { "clrBreadcrumbItemClick": "clrBreadcrumbItemClick"; }, never, never, false, never>;
}
