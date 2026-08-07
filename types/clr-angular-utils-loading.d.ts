import * as i0 from '@angular/core';
import { OnDestroy, Type } from '@angular/core';
import * as i2 from '@angular/common';

/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
declare abstract class LoadingListener {
    abstract loadingStateChange(state: ClrLoadingState | string): void;
}

declare enum ClrLoadingState {
    DEFAULT = 0,
    LOADING = 1,
    SUCCESS = 2,
    ERROR = 3
}
declare class ClrLoading implements OnDestroy {
    private listener;
    static ngAcceptInputType_loadingState: boolean | ClrLoadingState | null | string;
    private _loadingState;
    constructor(listener: LoadingListener);
    get loadingState(): boolean | string | ClrLoadingState;
    set loadingState(value: boolean | string | ClrLoadingState);
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoading, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLoading, "[clrLoading]", never, { "loadingState": { "alias": "clrLoading"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_LOADING_DIRECTIVES: Type<any>[];
declare class ClrLoadingModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLoadingModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrLoadingModule, [typeof ClrLoading], [typeof i2.CommonModule], [typeof ClrLoading]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrLoadingModule>;
}

export { CLR_LOADING_DIRECTIVES, ClrLoading, ClrLoadingModule, ClrLoadingState, LoadingListener };
