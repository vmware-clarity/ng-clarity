import * as i0 from '@angular/core';
import { NgModule } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular/data/datagrid';
export * from '@clr/angular/data/datagrid';
import { ClrStackViewModule } from '@clr/angular/data/stack-view';
export * from '@clr/angular/data/stack-view';
import { ClrTreeViewModule } from '@clr/angular/data/tree-view';
export * from '@clr/angular/data/tree-view';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDataModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDataModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrDataModule, exports: [ClrDatagridModule, ClrStackViewModule, ClrTreeViewModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDataModule, imports: [ClrDatagridModule, ClrStackViewModule, ClrTreeViewModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDataModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [ClrDatagridModule, ClrStackViewModule, ClrTreeViewModule],
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

export { ClrDataModule };
//# sourceMappingURL=clr-angular-data.mjs.map
