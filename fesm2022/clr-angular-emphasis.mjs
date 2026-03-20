import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
export * from '@clr/angular/emphasis/alert';
import { ClrBadge } from '@clr/angular/emphasis/badge';
export * from '@clr/angular/emphasis/badge';
import { ClrLabel } from '@clr/angular/emphasis/label';
export * from '@clr/angular/emphasis/label';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrEmphasisModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, imports: [ClrBadge, ClrLabel], exports: [ClrAlertModule, ClrBadge, ClrLabel] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, imports: [ClrBadge, ClrLabel, ClrAlertModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEmphasisModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ClrBadge, ClrLabel],
                    exports: [ClrAlertModule, ClrBadge, ClrLabel],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrEmphasisModule };
//# sourceMappingURL=clr-angular-emphasis.mjs.map
