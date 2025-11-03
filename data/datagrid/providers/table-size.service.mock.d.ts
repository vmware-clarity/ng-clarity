import { TableSizeService } from './table-size.service';
export declare class MockTableSizeService {
    getColumnDragHeight(): string;
}
export declare const MOCK_TABLE_SIZE_PROVIDER: {
    provide: typeof TableSizeService;
    useClass: typeof MockTableSizeService;
};
