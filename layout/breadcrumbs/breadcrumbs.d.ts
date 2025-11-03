import { EventEmitter } from '@angular/core';
import { BreadcrumbItem } from './model/breadcrumbs.model';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
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
}
