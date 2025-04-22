import { BehaviorSubject } from 'rxjs';
import { ColumnState, ColumnStateDiff } from '../interfaces/column-state.interface';
import * as i0 from "@angular/core";
export declare class ColumnsService {
    columns: BehaviorSubject<ColumnState>[];
    columnsStateChange: BehaviorSubject<ColumnState>;
    private _cache;
    get columnStates(): ColumnState[];
    get hasHideableColumns(): boolean;
    get visibleColumns(): ColumnState[];
    cache(): void;
    hasCache(): boolean;
    resetToLastCache(): void;
    emitStateChangeAt(columnIndex: number, diff: ColumnStateDiff): void;
    emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnsService>;
}
