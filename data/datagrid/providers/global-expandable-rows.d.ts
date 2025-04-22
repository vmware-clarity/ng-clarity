import { DetailService } from './detail.service';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpandableRowsCount, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ExpandableRowsCount>;
}
