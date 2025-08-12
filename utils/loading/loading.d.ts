import { OnDestroy } from '@angular/core';
import { LoadingListener } from './loading-listener';
import * as i0 from "@angular/core";
export declare enum ClrLoadingState {
    DEFAULT = 0,
    LOADING = 1,
    SUCCESS = 2,
    ERROR = 3
}
export declare class ClrLoading implements OnDestroy {
    private listener;
    static ngAcceptInputType_loadingState: boolean | ClrLoadingState | null | string;
    private _loadingState;
    constructor(listener: LoadingListener);
    get loadingState(): boolean | string | ClrLoadingState;
    set loadingState(value: boolean | string | ClrLoadingState);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoading, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLoading, "[clrLoading]", never, { "loadingState": "clrLoading"; }, {}, never, never, false, never>;
}
