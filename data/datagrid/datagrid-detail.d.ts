import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DetailService } from './providers/detail.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
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
}
