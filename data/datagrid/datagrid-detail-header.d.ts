import { AfterViewInit, ElementRef } from '@angular/core';
import { DetailService } from './providers/detail.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
export declare class ClrDatagridDetailHeader implements AfterViewInit {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    title: ElementRef<HTMLElement>;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get titleId(): string;
    ngAfterViewInit(): void;
}
