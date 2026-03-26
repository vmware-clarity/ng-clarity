import { ClrDropdownModule } from '@clr/angular/popover/dropdown';
export * from '@clr/angular/popover/dropdown';
export * from '@clr/angular/popover/common';
import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
export * from '@clr/angular/popover/signpost';
import { ClrTooltipModule } from '@clr/angular/popover/tooltip';
export * from '@clr/angular/popover/tooltip';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrPopoverModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, exports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, imports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrPopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrDropdownModule, ClrSignpostModule, ClrTooltipModule],
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

export { ClrPopoverModule };
//# sourceMappingURL=clr-angular-popover.mjs.map
