import * as i0 from "@angular/core";
import { NgModule } from "@angular/core";
import { ClrAlertModule } from "@clr/angular/emphasis/alert";
import { ClrBadge } from "@clr/angular/emphasis/badge";
import { ClrLabel } from "@clr/angular/emphasis/label";
export * from "@clr/angular/emphasis/alert";
export * from "@clr/angular/emphasis/badge";
export * from "@clr/angular/emphasis/label";
var ClrEmphasisModule = class ClrEmphasisModule {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrEmphasisModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrEmphasisModule,
			imports: [ClrBadge, ClrLabel],
			exports: [
				ClrAlertModule,
				ClrBadge,
				ClrLabel
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrEmphasisModule,
			imports: [
				ClrBadge,
				ClrLabel,
				ClrAlertModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrEmphasisModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [ClrBadge, ClrLabel],
			exports: [
				ClrAlertModule,
				ClrBadge,
				ClrLabel
			]
		}]
	}]
});
export { ClrEmphasisModule };

//# sourceMappingURL=clr-angular-emphasis.mjs.map