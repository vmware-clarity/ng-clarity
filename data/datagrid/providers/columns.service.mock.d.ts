import { TemplateRef } from '@angular/core';
import { ColumnsService } from './columns.service';
export declare class MockColumnsService extends ColumnsService {
    templateRef: TemplateRef<any>;
    mockColumns(columnNumber: number): void;
    mockHideableAt(index: number, hidden?: boolean): void;
    mockAllHideable(hidden?: boolean): void;
    mockPartialHideable(from: number, to: number, hidden?: boolean): void;
}
export declare const MOCK_COLUMN_SERVICE_PROVIDER: {
    provide: typeof ColumnsService;
    useClass: typeof MockColumnsService;
};
