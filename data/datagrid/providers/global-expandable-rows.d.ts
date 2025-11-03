import { DetailService } from './detail.service';
export declare class ExpandableRowsCount {
    private detailService;
    private expandableCount;
    constructor(detailService: DetailService);
    /**
     * false means no rows with action
     * check if details are on, and disable rows entirely
     */
    get hasExpandableRow(): boolean;
    register(): void;
    unregister(): void;
}
