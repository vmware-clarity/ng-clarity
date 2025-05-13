import { Observable, Observer } from 'rxjs';
export declare function wrapObservable<T>(observable: Observable<T>, onSubscribe?: (observer: Observer<T>) => void, onUnsubscribe?: (observer: Observer<T>) => void): Observable<T>;
