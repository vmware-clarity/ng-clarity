import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DetailService } from './providers/detail.service';
import * as i0 from "@angular/core";
export declare class ClrDatagridDetail {
    detailService: DetailService;
    commonStrings: ClrCommonStringsService;
    ariaLabelledBy: string;
    ariaLabel: string;
    header: ClrDatagridDetailHeader;
    constructor(detailService: DetailService, commonStrings: ClrCommonStringsService);
    get labelledBy(): string;
    get label(): string;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridDetail, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridDetail, "clr-dg-detail", never, { "ariaLabelledBy": "clrDetailAriaLabelledBy"; "ariaLabel": "clrDetailAriaLabel"; }, {}, ["header"], ["*"], false, never>;
}
