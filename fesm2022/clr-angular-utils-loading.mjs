import * as i0 from '@angular/core';
import { Input, Optional, Directive, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is an abstract class because we need it to still be a valid token for dependency injection after transpiling.
 * This does not mean you should extend it, simply implementing it is fine.
 */
class LoadingListener {
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrLoadingState;
(function (ClrLoadingState) {
    ClrLoadingState[ClrLoadingState["DEFAULT"] = 0] = "DEFAULT";
    ClrLoadingState[ClrLoadingState["LOADING"] = 1] = "LOADING";
    ClrLoadingState[ClrLoadingState["SUCCESS"] = 2] = "SUCCESS";
    ClrLoadingState[ClrLoadingState["ERROR"] = 3] = "ERROR";
})(ClrLoadingState || (ClrLoadingState = {}));
class ClrLoading {
    // We find the first parent that handles something loading
    constructor(listener) {
        this.listener = listener;
        this._loadingState = ClrLoadingState.DEFAULT;
    }
    get loadingState() {
        return this._loadingState;
    }
    set loadingState(value) {
        if (value === true) {
            value = ClrLoadingState.LOADING;
        }
        else if (!value) {
            value = ClrLoadingState.DEFAULT;
        }
        if (value === this._loadingState) {
            return;
        }
        this._loadingState = value;
        if (this.listener) {
            this.listener.loadingStateChange(value);
        }
    }
    ngOnDestroy() {
        this.loadingState = ClrLoadingState.DEFAULT;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoading, deps: [{ token: LoadingListener, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrLoading, isStandalone: false, selector: "[clrLoading]", inputs: { loadingState: ["clrLoading", "loadingState"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoading, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrLoading]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LoadingListener, decorators: [{
                    type: Optional
                }] }], propDecorators: { loadingState: [{
                type: Input,
                args: ['clrLoading']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_LOADING_DIRECTIVES = [ClrLoading];
class ClrLoadingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, declarations: [ClrLoading], imports: [CommonModule], exports: [ClrLoading] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrLoadingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_LOADING_DIRECTIVES],
                    exports: [CLR_LOADING_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_LOADING_DIRECTIVES, ClrLoading, ClrLoadingModule, ClrLoadingState, LoadingListener };
//# sourceMappingURL=clr-angular-utils-loading.mjs.map
