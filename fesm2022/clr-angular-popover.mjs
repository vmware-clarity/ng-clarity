import { ClrDropdownModule } from "@clr/angular/popover/dropdown";
import * as i0 from "@angular/core";
import { NgModule } from "@angular/core";
import { ClrSignpostModule } from "@clr/angular/popover/signpost";
import { ClrTooltipModule } from "@clr/angular/popover/tooltip";
export * from "@clr/angular/popover/dropdown";
export * from "@clr/angular/popover/common";
export * from "@clr/angular/popover/signpost";
export * from "@clr/angular/popover/tooltip";
var ClrPopoverModule = class ClrPopoverModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrPopoverModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrPopoverModule,
			exports: [
				ClrDropdownModule,
				ClrSignpostModule,
				ClrTooltipModule
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrPopoverModule,
			imports: [
				ClrDropdownModule,
				ClrSignpostModule,
				ClrTooltipModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrPopoverModule,
	decorators: [{
		type: NgModule,
		args: [{ exports: [
			ClrDropdownModule,
			ClrSignpostModule,
			ClrTooltipModule
		] }]
	}]
});
export { ClrPopoverModule };

//# sourceMappingURL=clr-angular-popover.mjs.map