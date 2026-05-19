import { Observable } from 'rxjs';
export interface ClrDatagridFilterInterface<T, S = any> {
    readonly state?: S;
    changes: Observable<any>;
    isActive(): boolean;
    accepts(item: T): boolean;
    equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}
