import { ClrControlLabel } from '../../forms';
import { Page } from './providers/page';
export declare class ClrDatagridPageSize {
    page: Page;
    pageSizeOptions: number[];
    pageSizeOptionsId: string;
    constructor(page: Page);
    set label(label: ClrControlLabel);
    ngOnInit(): void;
}
