import * as i0 from "@angular/core";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { AppfxMultiPageDialogModule } from "@clr/addons/dialog";
import { AppfxStepperModule } from "@clr/addons/stepper";
import { AppfxTabsModule } from "@clr/addons/tabs";
import { AppfxWorkflowCoreModule, WorkflowConfigurationService } from "@clr/addons/var";
import { AppfxWizardModule } from "@clr/addons/wizard";
import { WorkflowStrings } from "@clr/addons/workflow/strings";
function workflowConfigurationServiceFactory(existing) {
	return existing || new WorkflowConfigurationService();
}
function workflowStringsServiceFactory(existing) {
	return existing || new WorkflowStrings();
}
var AppfxWorkflowsModule = class AppfxWorkflowsModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowsModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowsModule,
			imports: [
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule,
				AppfxWorkflowCoreModule
			],
			exports: [
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowsModule,
			providers: [{
				provide: WorkflowConfigurationService,
				useFactory: workflowConfigurationServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowConfigurationService
				]]
			}, {
				provide: WorkflowStrings,
				useFactory: workflowStringsServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowStrings
				]]
			}],
			imports: [
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule,
				AppfxWorkflowCoreModule,
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxWorkflowsModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule,
				AppfxWorkflowCoreModule
			],
			providers: [{
				provide: WorkflowConfigurationService,
				useFactory: workflowConfigurationServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowConfigurationService
				]]
			}, {
				provide: WorkflowStrings,
				useFactory: workflowStringsServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowStrings
				]]
			}],
			exports: [
				AppfxMultiPageDialogModule,
				AppfxStepperModule,
				AppfxTabsModule,
				AppfxWizardModule
			]
		}]
	}]
});
export { AppfxWorkflowsModule };

//# sourceMappingURL=clr-addons-workflow.mjs.map