import { Observable } from 'rxjs';
export declare type AsyncArray<T> = T[] | null | undefined | Promise<T[] | null | undefined> | Observable<T[] | null | undefined>;
export declare function isPromise<T>(o: AsyncArray<T>): o is Promise<T[]>;
