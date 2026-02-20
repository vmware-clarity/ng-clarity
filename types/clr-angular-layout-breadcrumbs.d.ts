import * as i0 from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i5 from '@clr/angular/utils';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i3 from '@angular/common';
import * as i4 from '@clr/angular/icon';
import * as i6 from '@angular/router';

interface BreadcrumbItem {
    label: string;
    href?: string;
    routerLink?: string;
    queryParams?: {
        [key: string]: string;
    };
    target?: string;
}

declare class ClrBreadcrumbs {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBreadcrumbs, "clr-breadcrumbs", never, { "items": { "alias": "items"; "required": false; }; }, { "clrBreadcrumbItemClick": "clrBreadcrumbItemClick"; }, never, never, false, never>;
}

declare class ClrBreadcrumbItem {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBreadcrumbItem, "clr-breadcrumb-item", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrBreadcrumbsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBreadcrumbsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrBreadcrumbsModule, [typeof ClrBreadcrumbs, typeof ClrBreadcrumbItem], [typeof i3.CommonModule, typeof i4.ClrIcon, typeof i5.ClrHostWrappingModule, typeof i6.RouterModule], [typeof ClrBreadcrumbs, typeof i4.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrBreadcrumbsModule>;
}

export { ClrBreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule };
export type { BreadcrumbItem };
