import { Observable } from 'rxjs';
export declare class PageCollectionMock {
    _previousPageIsCompleted: boolean;
    private _pagesReset;
    private _stepItemIdWasCalled;
    get pagesReset(): Observable<boolean>;
    get stepItemIdWasCalled(): boolean;
    getStepItemIdForPage(): string;
    previousPageIsCompleted(_page?: any): boolean;
}
