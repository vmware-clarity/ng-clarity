import * as i0 from "@angular/core";
import { Injectable } from "@angular/core";
var WorkflowStrings = class WorkflowStrings {
	constructor() {
		this.cancel = "Cancel";
		this.back = "Back";
		this.next = "Next";
		this.finish = "Finish";
		this.error = {
			title: "Error Loading Data",
			description: "An error occurred while trying to load data. This could be due to temporary outage. You can retry the operation by clicking retry button.",
			details: "Error Details",
			retry: "Retry"
		};
		this.loading = "Loading...";
		this.defaultOkButtonLabel = "OK";
		this.defaultCancelButtonLabel = "Cancel";
		this.step = {
			completed: "Completed",
			inProgress: "In Progress",
			error: "Error"
		};
		this.summary = {
			title: "Ready To Complete",
			description: "Review your selections before finishing the wizard"
		};
		this.defaultDialogSubmitError = "Dialog contains invalid data.";
		this.defaultWizardSubmitError = "Wizard contains invalid data.";
		this.openStepNavAriaLabel = "Show wizard steps";
		this.closeStepNavAriaLabel = "Close wizard steps";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowStrings,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowStrings
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WorkflowStrings,
	decorators: [{ type: Injectable }]
});
export { WorkflowStrings };

//# sourceMappingURL=clr-addons-workflow-strings.mjs.map