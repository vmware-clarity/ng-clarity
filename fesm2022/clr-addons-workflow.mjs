import * as i0 from '@angular/core';
import { Optional, SkipSelf, NgModule } from '@angular/core';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { WorkflowConfigurationService, AppfxWorkflowCoreModule } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { WorkflowStrings } from '@clr/addons/workflow/strings';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function workflowConfigurationServiceFactory(existing) {
    return existing || new WorkflowConfigurationService();
}
function workflowStringsServiceFactory(existing) {
    return existing || new WorkflowStrings();
}
class AppfxWorkflowsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxWorkflowsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxWorkflowsModule, imports: [AppfxMultiPageDialogModule,
            AppfxStepperModule,
            AppfxTabsModule,
            AppfxWizardModule,
            AppfxWorkflowCoreModule], exports: [AppfxMultiPageDialogModule, AppfxStepperModule, AppfxTabsModule, AppfxWizardModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxWorkflowsModule, providers: [
            {
                // This pattern allows the importer of this module to specify its own WorkflowConfigurationService.
                provide: WorkflowConfigurationService,
                useFactory: workflowConfigurationServiceFactory,
                deps: [[new Optional(), new SkipSelf(), WorkflowConfigurationService]],
            },
            {
                // This pattern allows the importer of this module to specify its own WorkflowStrings.
                provide: WorkflowStrings,
                useFactory: workflowStringsServiceFactory,
                deps: [[new Optional(), new SkipSelf(), WorkflowStrings]],
            },
        ], imports: [AppfxMultiPageDialogModule,
            AppfxStepperModule,
            AppfxTabsModule,
            AppfxWizardModule,
            AppfxWorkflowCoreModule, AppfxMultiPageDialogModule, AppfxStepperModule, AppfxTabsModule, AppfxWizardModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxWorkflowsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        AppfxMultiPageDialogModule,
                        AppfxStepperModule,
                        AppfxTabsModule,
                        AppfxWizardModule,
                        AppfxWorkflowCoreModule,
                    ],
                    providers: [
                        {
                            // This pattern allows the importer of this module to specify its own WorkflowConfigurationService.
                            provide: WorkflowConfigurationService,
                            useFactory: workflowConfigurationServiceFactory,
                            deps: [[new Optional(), new SkipSelf(), WorkflowConfigurationService]],
                        },
                        {
                            // This pattern allows the importer of this module to specify its own WorkflowStrings.
                            provide: WorkflowStrings,
                            useFactory: workflowStringsServiceFactory,
                            deps: [[new Optional(), new SkipSelf(), WorkflowStrings]],
                        },
                    ],
                    exports: [AppfxMultiPageDialogModule, AppfxStepperModule, AppfxTabsModule, AppfxWizardModule],
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

export { AppfxWorkflowsModule };
//# sourceMappingURL=clr-addons-workflow.mjs.map
