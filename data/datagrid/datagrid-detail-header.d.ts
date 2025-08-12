import { AfterViewInit, ElementRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DetailService } from './providers/detail.service';
import * as i0 from "@angular/core";
export declare class ClrDatagridDetailHeader implements AfterViewInit {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    title: ElementRef<HTMLElement>;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get titleId(): string;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetailHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetailHeader, "clr-dg-detail-header", never, {}, {}, never, ["*"], false, never>;
}
