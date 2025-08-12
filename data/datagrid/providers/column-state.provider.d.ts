import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumnState } from '../interfaces/column-state.interface';
export declare const COLUMN_STATE: InjectionToken<ColumnState>;
export declare function columnStateFactory(): BehaviorSubject<ColumnState>;
export declare const COLUMN_STATE_PROVIDER: {
    provide: InjectionToken<ColumnState>;
    useFactory: typeof columnStateFactory;
};
