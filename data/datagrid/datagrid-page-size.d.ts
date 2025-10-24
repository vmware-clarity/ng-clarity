import { ClrLabel } from '../../forms';
import { Page } from './providers/page';
import * as i0 from "@angular/core";
export declare class ClrDatagridPageSize {
    page: Page;
    pageSizeOptions: number[];
    pageSizeOptionsId: string;
    constructor(page: Page);
    set label(label: ClrLabel);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatagridPageSize, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatagridPageSize, "clr-dg-page-size", never, { "pageSizeOptions": "clrPageSizeOptions"; "pageSizeOptionsId": "clrPageSizeOptionsId"; }, {}, never, ["*"], false, never>;
}
